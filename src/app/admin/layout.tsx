// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revokeDoorpassAction } from '@/lib/doorpass/actions';
import { cookies } from 'next/headers';
import Link from 'next/link';

async function logoutAction() {
  'use server';

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  for (const c of cookieStore.getAll()) {
    if (c.name.startsWith('sb-') || c.name.includes('auth-token')) {
      cookieStore.delete(c.name);
    }
  }

  // Kunci kembali pintu admin dengan menghapus cookie doorpass
  await revokeDoorpassAction();

  // Redirect ke beranda publik
  redirect('/');
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-6">
          <Link href="/admin/proyek" className="font-bold text-slate-800 dark:text-white text-lg hover:text-blue-600 transition-colors">
            Admin Studio Panel
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              href="/admin/proyek"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors"
            >
              Manajemen Proyek
            </Link>
            <Link
              href="/project"
              target="_blank"
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-blue-600 transition-colors border border-slate-200 dark:border-slate-700 rounded-lg px-2.5 py-1 bg-slate-50 dark:bg-slate-800"
            >
              Lihat Web Publik ↗
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
            {user?.email}
          </span>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-xs sm:text-sm bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer font-medium border border-slate-200 dark:border-slate-700"
            >
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="w-full">{children}</main>
    </div>
  );
}
