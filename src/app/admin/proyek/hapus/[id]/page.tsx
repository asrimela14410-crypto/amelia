// app/admin/proyek/hapus/[id]/page.tsx
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createSupabaseServerClient } from '@/lib/supabase-server';

async function hapusProyekAction(formData: FormData) {
  'use server';

  const id = formData.get('id') as string;
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase
    .from('proyek')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Gagal menghapus proyek:', error.message);
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/proyek');
  revalidatePath('/project');
  redirect('/admin/proyek');
}

export default async function HapusProyekPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: proyek } = await supabase
    .from('proyek')
    .select('*')
    .eq('id', id)
    .single();

  if (!proyek) redirect('/admin/proyek');

  return (
    <div className="max-w-md">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Konfirmasi Hapus</h1>
      <div className="bg-white rounded-2xl border border-red-200 p-6 shadow-sm">
        <p className="text-slate-700 mb-2">Apakah kamu yakin ingin menghapus proyek berikut?</p>
        <p className="font-semibold text-slate-900 mb-6 text-lg">{proyek.judul || proyek.title || 'Proyek'}</p>
        <p className="text-sm text-red-600 mb-6">Tindakan ini tidak dapat dibatalkan.</p>
        <form action={hapusProyekAction} className="flex gap-3">
          <input type="hidden" name="id" value={proyek.id} />
          <button
            type="submit"
            className="bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors cursor-pointer"
          >
            Ya, Hapus
          </button>
          <a
            href="/admin/proyek"
            className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-5 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Batal
          </a>
        </form>
      </div>
    </div>
  );
}
