// app/admin/login/page.tsx
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  getDoorpassSecret,
  ADMIN_AUTH_COOKIE,
  computeAdminAuthToken,
  verifyAdminAuthToken,
} from '@/lib/doorpass/core';
import { setDoorpassUnlockedAction, revokeDoorpassAction } from '@/lib/doorpass/actions';
import LoginFormClient from './LoginFormClient';

async function loginAction(formData: FormData) {
  'use server';

  const email = (formData.get('email') as string || '').trim();
  const password = formData.get('password') as string;
  const doorpass = ((formData.get('doorpass') as string) || '').trim();

  const secretDoorpass = getDoorpassSecret();

  // Jika doorpass dari form tidak cocok dengan env -> tolak ke 404!
  if (!doorpass || !secretDoorpass || doorpass !== secretDoorpass) {
    await revokeDoorpassAction();
    redirect('/not-found');
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError || !authData?.user) {
    const rawMsg = authError?.message || 'Email atau password salah';
    let errorMsg = rawMsg;
    if (rawMsg.toLowerCase().includes('invalid login credentials')) {
      errorMsg = 'Email atau password salah. Pastikan akun sudah dibuat di Supabase Auth (Authentication > Users).';
    } else if (rawMsg.toLowerCase().includes('email not confirmed')) {
      errorMsg = 'Email belum dikonfirmasi di Supabase. Aktifkan opsi "Auto Confirm User" di Supabase Auth.';
    }
    redirect(
      `/admin/login?doorpass=${encodeURIComponent(secretDoorpass)}&error=${encodeURIComponent(errorMsg)}`
    );
  }

  // Verifikasi atau pastikan role admin dari tabel 'profiles'
  let roleAccessDenied = false;
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .maybeSingle();

    if (!profile) {
      // Jika akun baru belum ada di profiles, otomatis daftarkan sebagai admin
      await supabase.from('profiles').upsert(
        {
          id: authData.user.id,
          email: authData.user.email || email,
          role: 'admin',
        },
        { onConflict: 'id' }
      );
    } else {
      const currentRole = (profile.role || '').trim().toLowerCase();
      // Izinkan jika role adalah 'admin' atau kosong; tolak jika role secara eksplisit bukan admin
      if (currentRole && currentRole !== 'admin') {
        roleAccessDenied = true;
      }
    }
  } catch (profErr) {
    console.warn('Profile sync note:', profErr);
  }

  if (roleAccessDenied) {
    await supabase.auth.signOut();
    await revokeDoorpassAction();
    redirect(
      `/admin/login?doorpass=${encodeURIComponent(
        secretDoorpass
      )}&error=Akses+ditolak:+Akun+ini+belum+terdaftar+sebagai+admin`
    );
  }

  // Berhasil! Simpan sesi autentikasi admin yang valid dan aman selama 7 hari
  const adminToken = await computeAdminAuthToken(email, secretDoorpass);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 hari agar tidak ter-logout tiba-tiba
  });

  await setDoorpassUnlockedAction(secretDoorpass);

  redirect('/admin/proyek');
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ doorpass?: string; error?: string }>;
}) {
  const params = await searchParams;
  const secretDoorpass = getDoorpassSecret();

  const isDoorpassValid = Boolean(
    secretDoorpass &&
    params.doorpass &&
    params.doorpass.trim() === secretDoorpass
  );

  // Jika membuka login tanpa ?doorpass=... yang valid -> Langsung arahkan ke 404!
  if (!isDoorpassValid) {
    notFound();
  }

  // Jika user SUDAH login di Supabase atau memiliki sesi admin aktif -> langsung ke /admin/proyek
  const cookieStore = await cookies();
  const adminAuthToken = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  const adminAuthSession = await verifyAdminAuthToken(adminAuthToken, secretDoorpass);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user || adminAuthSession.valid) {
    redirect('/admin/proyek');
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl w-full max-w-sm border border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-600 dark:text-emerald-400">
            Doorpass Terverifikasi
          </span>
        </div>

        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Admin Login</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
          Masukkan email dan password akun admin Supabase Anda untuk mengelola portofolio.
        </p>

        {params?.error && (
          <p className="text-red-600 dark:text-red-400 text-xs mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-3 rounded-xl leading-relaxed">
            {params.error}
          </p>
        )}

        <LoginFormClient
          doorpass={params.doorpass || ''}
          loginAction={loginAction}
        />
      </div>
    </main>
  );
}
