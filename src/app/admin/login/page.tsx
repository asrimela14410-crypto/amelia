// app/admin/login/page.tsx
import { redirect, notFound } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { getDoorpassSecret } from '@/lib/doorpass/core';
import { setDoorpassUnlockedAction, revokeDoorpassAction } from '@/lib/doorpass/actions';

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
    const errorMsg = authError?.message || 'Email atau password salah';
    redirect(
      `/admin/login?doorpass=${encodeURIComponent(secretDoorpass)}&error=${encodeURIComponent(errorMsg)}`
    );
  }

  // Verifikasi role admin dari tabel 'profiles'
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', authData.user.id)
    .single();

  if (profileError || !profile || profile.role !== 'admin') {
    await supabase.auth.signOut();
    await revokeDoorpassAction();
    redirect(
      `/admin/login?doorpass=${encodeURIComponent(
        secretDoorpass
      )}&error=Akses+ditolak:+Akun+ini+belum+terdaftar+sebagai+admin+di+tabel+profiles`
    );
  }

  // Berhasil! Aktifkan sesi doorpass terenkripsi SHA-256
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
          Masukkan kredensial akun admin yang terdaftar di Supabase Auth &amp; tabel Profiles.
        </p>

        {params?.error && (
          <p className="text-red-600 dark:text-red-400 text-xs mb-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 p-3 rounded-xl leading-relaxed">
            {params.error}
          </p>
        )}

        <form action={loginAction} className="space-y-4">
          <input type="hidden" name="doorpass" value={params.doorpass || ''} />

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Email Admin
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@gmail.com"
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl font-medium transition-colors cursor-pointer shadow-sm"
          >
            Masuk ke Panel Admin
          </button>
        </form>
      </div>
    </main>
  );
}
