// app/admin/proyek/page.tsx
import { createSupabaseServerClient } from '@/lib/supabase-server';
import AdminStudioClient, { DbProyekItem } from './AdminStudioClient';

export default async function AdminProyekPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawProyek } = await supabase
    .from('proyek')
    .select('*')
    .order('id', { ascending: true });

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
  }));

  return (
    <div className="w-full">
      <AdminStudioClient
        initialProyek={daftarProyek}
        userEmail={user?.email}
      />
    </div>
  );
}
