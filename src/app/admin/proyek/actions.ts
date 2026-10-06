'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';

export async function tambahProyekAction(formData: FormData) {
  const judul = ((formData.get('judul') as string) || '').trim();
  const deskripsi = ((formData.get('deskripsi') as string) || '').trim();
  const teknologi = ((formData.get('teknologi') as string) || '').trim();
  const kategori = ((formData.get('kategori') as string) || 'Web').trim();
  const link = ((formData.get('link') as string) || '').trim() || null;
  const link_deploy = ((formData.get('link_deploy') as string) || '').trim() || null;
  const image = ((formData.get('image') as string) || '').trim() || null;

  if (!judul || !deskripsi) {
    return { success: false, error: 'Judul dan deskripsi wajib diisi' };
  }

  const supabase = await createSupabaseServerClient();
  const techStackArray = teknologi
    ? teknologi.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const fullPayload = {
    judul,
    title: judul,
    slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    deskripsi,
    description: deskripsi,
    teknologi,
    tech_stack: techStackArray,
    kategori,
    category: kategori.toLowerCase(),
    category_label: kategori,
    link,
    github_url: link,
    link_deploy,
    demo_url: link_deploy,
    image,
  };

  let { data, error } = await supabase.from('proyek').insert(fullPayload).select();

  // Jika kolom modern belum ada, coba fallback ke kolom standar
  if (error && (error.message.includes('column') || error.code === '42703')) {
    const fallbackRes = await supabase
      .from('proyek')
      .insert({
        judul,
        deskripsi,
        teknologi,
        kategori,
        link,
        link_deploy,
        image,
      })
      .select();
    data = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error) {
    console.error('Gagal menambah proyek:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/admin');
  revalidatePath('/proyek');
  revalidatePath('/project');
  revalidatePath('/');

  return { success: true, data };
}

export async function editProyekAction(formData: FormData) {
  const id = formData.get('id') as string;
  const judul = ((formData.get('judul') as string) || '').trim();
  const deskripsi = ((formData.get('deskripsi') as string) || '').trim();
  const teknologi = ((formData.get('teknologi') as string) || '').trim();
  const kategori = ((formData.get('kategori') as string) || 'Web').trim();
  const link = ((formData.get('link') as string) || '').trim() || null;
  const link_deploy = ((formData.get('link_deploy') as string) || '').trim() || null;
  const image = ((formData.get('image') as string) || '').trim() || null;

  if (!id || !judul) {
    return { success: false, error: 'ID dan Judul wajib diisi' };
  }

  const supabase = await createSupabaseServerClient();
  const editTechStackArray = teknologi
    ? teknologi.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

  const fullUpdatePayload = {
    judul,
    title: judul,
    slug: judul.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
    deskripsi,
    description: deskripsi,
    teknologi,
    tech_stack: editTechStackArray,
    kategori,
    category: kategori.toLowerCase(),
    category_label: kategori,
    link,
    github_url: link,
    link_deploy,
    demo_url: link_deploy,
    image,
  };

  let { data, error } = await supabase
    .from('proyek')
    .update(fullUpdatePayload)
    .eq('id', id)
    .select();

  // Jika kolom modern belum ada, coba update dengan kolom standar
  if (error && (error.message.includes('column') || error.code === '42703')) {
    const fallbackRes = await supabase
      .from('proyek')
      .update({
        judul,
        deskripsi,
        teknologi,
        kategori,
        link,
        link_deploy,
        image,
      })
      .eq('id', id)
      .select();
    data = fallbackRes.data;
    error = fallbackRes.error;
  }

  if (error) {
    console.error('Gagal mengedit proyek:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/admin');
  revalidatePath('/proyek');
  revalidatePath('/project');
  revalidatePath('/');

  return { success: true, data };
}

export async function hapusProyekAction(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) {
    return { success: false, error: 'ID proyek tidak ditemukan' };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from('proyek').delete().eq('id', id);

  if (error) {
    console.error('Gagal menghapus proyek:', error.message);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/admin');
  revalidatePath('/proyek');
  revalidatePath('/project');
  revalidatePath('/');

  return { success: true };
}
