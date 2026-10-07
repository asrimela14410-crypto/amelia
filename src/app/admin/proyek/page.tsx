import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import {
  getDoorpassSecret,
  ADMIN_AUTH_COOKIE,
  verifyAdminAuthToken,
} from '@/lib/doorpass/core';
import AdminStudioClient, { DbProyekItem } from './AdminStudioClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AdminProyekPage() {
  const secretDoorpass = getDoorpassSecret() || '';
  const cookieStore = await cookies();
  const adminAuthToken = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;
  const adminAuth = await verifyAdminAuthToken(adminAuthToken, secretDoorpass);

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !adminAuth.valid) {
    redirect(`/admin/login?doorpass=${encodeURIComponent(secretDoorpass)}`);
  }

  const effectiveEmail = user?.email || adminAuth.email || 'Admin';

  const { data: rawProyek } = await supabase
    .from('proyek')
    .select('*')
    .order('created_at', { ascending: false });

  const daftarProyek: DbProyekItem[] = (rawProyek || []).map((item) => ({
    ...item,
    id: String(item.id),
    judul: item.judul || item.title || 'Untitled',
    deskripsi: item.deskripsi || item.description || '',
    teknologi:
      item.teknologi ||
      (Array.isArray(item.tech_stack) ? item.tech_stack.join(', ') : item.tech_stack) ||
      '',
    kategori: item.kategori || item.category_label || item.category || 'Web',
    link: item.link || item.github_url || null,
    link_deploy: item.link_deploy || item.demo_url || null,
    image: item.image || '/images/managemens.png',
    full_description: item.full_description || item.description || item.deskripsi || '',
    features: item.features || [],
    role: item.role || 'Full Stack Developer',
  }));

  return (
    <div className="w-full">
      <AdminStudioClient
        initialProyek={daftarProyek}
        userEmail={effectiveEmail}
      />
    </div>
  );
}
