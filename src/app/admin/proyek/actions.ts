'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseServerClient } from '@/lib/supabase-server';
import { createClient } from '@supabase/supabase-js';

/**
 * Helper untuk mendapatkan Supabase client.
 * Jika SUPABASE_SERVICE_ROLE_KEY disetel di server, gunakan client admin (bypass RLS).
 * Jika tidak, gunakan createSupabaseServerClient() berbasis cookie sesi admin.
 */
async function getSupabaseClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (serviceRoleKey && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return await createSupabaseServerClient();
}

/**
 * Helper untuk mengunggah file gambar ke Supabase Storage (bucket 'proyek-images')
 */
async function uploadImageToSupabase(file: File, supabase: any): Promise<string | null> {
  if (!file || file.size === 0 || !file.name) {
    return null;
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'png';
    const cleanFileName = `proyek-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = cleanFileName;

    const { data, error } = await supabase.storage
      .from('proyek-images')
      .upload(filePath, buffer, {
        contentType: file.type || 'image/png',
        upsert: true,
      });

    if (error) {
      console.warn('Supabase storage upload notice (pastikan bucket proyek-images sudah dibuat):', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('proyek-images')
      .getPublicUrl(filePath);

    return publicUrlData?.publicUrl || null;
  } catch (err) {
    console.error('Gagal upload gambar ke Supabase storage:', err);
    return null;
  }
}

export async function tambahProyekAction(formData: FormData) {
  const judul = ((formData.get('judul') as string) || '').trim();
  const deskripsi = ((formData.get('deskripsi') as string) || '').trim();
  const teknologi = ((formData.get('teknologi') as string) || '').trim();
  const kategori = ((formData.get('kategori') as string) || 'Web').trim();
  const link = ((formData.get('link') as string) || '').trim() || null;
  const link_deploy = ((formData.get('link_deploy') as string) || '').trim() || null;
  const role = ((formData.get('role') as string) || '').trim() || 'Full Stack Developer';
  const full_description =
    ((formData.get('full_description') as string) || '').trim() || deskripsi;
  const rawFeatures = ((formData.get('features') as string) || '').trim();

  let image = ((formData.get('image') as string) || '').trim();
  const imageFile = formData.get('image_file') as File | null;

  if (!judul || !deskripsi) {
    return { success: false, error: 'Judul dan deskripsi wajib diisi' };
  }

  const supabase = await getSupabaseClient();

  // Proses upload file jika pengguna memilih file dari komputer
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      image = uploadedUrl;
    }
  }

  // Jika tetap kosong, gunakan gambar default
  if (!image) {
    image = '/images/managemens.png';
  }

  const techStackArray = teknologi
    ? teknologi.split(',').map((t) => t.trim()).filter(Boolean)
    : ['Next.js', 'Tailwind CSS'];

  const featuresArray = rawFeatures
    ? rawFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
    : [
        'Antarmuka responsif & interaktif',
        'Terintegrasi database Supabase',
        'Desain modern UI/UX',
      ];

  const newId = crypto.randomUUID();
  const cleanSlug =
    judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `proyek-${Date.now()}`;

  // Payload lengkap mencakup semua kolom (NOT NULL maupun opsional) sesuai skema Supabase
  const fullPayload = {
    id: newId,
    judul,
    title: judul,
    slug: cleanSlug,
    deskripsi,
    description: deskripsi,
    full_description,
    teknologi: techStackArray.join(', '),
    tech_stack: techStackArray,
    kategori,
    category: kategori.toLowerCase(),
    category_label: kategori,
    link,
    github_url: link,
    link_deploy,
    demo_url: link_deploy,
    image,
    features: featuresArray,
    role,
    created_at: new Date().toISOString(),
  };

  let { data, error } = await supabase.from('proyek').insert(fullPayload).select();

  // Jika ada kolom yang belum ada di tabel lama (misal 42703 undefined column), coba fallback ke skema dasar
  if (error && (error.message.includes('column') || error.code === '42703')) {
    console.warn('Mencoba fallback insert dengan skema standar...');
    const fallbackRes = await supabase
      .from('proyek')
      .insert({
        id: newId,
        judul,
        title: judul,
        deskripsi,
        description: deskripsi,
        teknologi: techStackArray.join(', '),
        tech_stack: techStackArray,
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
    console.error('Gagal menambah proyek:', error);
    let userFriendlyError = error.message;

    if (error.code === '42501') {
      userFriendlyError =
        'Akses ditolak oleh database (Row-Level Security / RLS). Pastikan Anda telah login sebagai Admin di /admin/login atau tambahkan SUPABASE_SERVICE_ROLE_KEY di file .env.local.';
    } else if (error.code === '23502') {
      userFriendlyError = `Gagal menyimpan: Kolom wajib di database belum terpenuhi (${error.message}).`;
    } else if (error.code === '23505') {
      userFriendlyError = 'Gagal menyimpan: Judul atau ID proyek sudah ada di database (duplikasi).';
    }

    return { success: false, error: userFriendlyError };
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/admin');
  revalidatePath('/proyek');
  revalidatePath('/project');
  revalidatePath('/');

  return { success: true, data };
}

export async function editProyekAction(formData: FormData) {
  const id = (formData.get('id') as string) || '';
  const judul = ((formData.get('judul') as string) || '').trim();
  const deskripsi = ((formData.get('deskripsi') as string) || '').trim();
  const teknologi = ((formData.get('teknologi') as string) || '').trim();
  const kategori = ((formData.get('kategori') as string) || 'Web').trim();
  const link = ((formData.get('link') as string) || '').trim() || null;
  const link_deploy = ((formData.get('link_deploy') as string) || '').trim() || null;
  const role = ((formData.get('role') as string) || '').trim() || 'Full Stack Developer';
  const full_description =
    ((formData.get('full_description') as string) || '').trim() || deskripsi;
  const rawFeatures = ((formData.get('features') as string) || '').trim();

  let image = ((formData.get('image') as string) || '').trim();
  const imageFile = formData.get('image_file') as File | null;

  if (!id || !judul) {
    return { success: false, error: 'ID dan Judul wajib diisi' };
  }

  const supabase = await getSupabaseClient();

  // Proses upload file baru jika pengguna memilih file
  if (imageFile && imageFile.size > 0 && imageFile.name) {
    const uploadedUrl = await uploadImageToSupabase(imageFile, supabase);
    if (uploadedUrl) {
      image = uploadedUrl;
    }
  }

  if (!image) {
    image = '/images/managemens.png';
  }

  const editTechStackArray = teknologi
    ? teknologi.split(',').map((t) => t.trim()).filter(Boolean)
    : ['Next.js'];

  const editFeaturesArray = rawFeatures
    ? rawFeatures
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean)
    : ['Antarmuka responsif & interaktif', 'Terintegrasi database Supabase'];

  const cleanSlug =
    judul
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `proyek-${id}`;

  const fullUpdatePayload = {
    judul,
    title: judul,
    slug: cleanSlug,
    deskripsi,
    description: deskripsi,
    full_description,
    teknologi: editTechStackArray.join(', '),
    tech_stack: editTechStackArray,
    features: editFeaturesArray,
    kategori,
    category: kategori.toLowerCase(),
    category_label: kategori,
    link,
    github_url: link,
    link_deploy,
    demo_url: link_deploy,
    image,
    role,
  };

  let { data, error } = await supabase
    .from('proyek')
    .update(fullUpdatePayload)
    .eq('id', id)
    .select();

  // Jika kolom modern belum ada, coba update dengan kolom standar
  if (error && (error.message.includes('column') || error.code === '42703')) {
    console.warn('Mencoba fallback update dengan skema standar...');
    const fallbackRes = await supabase
      .from('proyek')
      .update({
        judul,
        title: judul,
        deskripsi,
        description: deskripsi,
        teknologi: editTechStackArray.join(', '),
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
    console.error('Gagal mengedit proyek:', error);
    let userFriendlyError = error.message;

    if (error.code === '42501') {
      userFriendlyError =
        'Akses ditolak oleh database (Row-Level Security / RLS). Pastikan Anda telah login sebagai Admin.';
    }

    return { success: false, error: userFriendlyError };
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

  const supabase = await getSupabaseClient();
  const { error } = await supabase.from('proyek').delete().eq('id', id);

  if (error) {
    console.error('Gagal menghapus proyek:', error);
    let userFriendlyError = error.message;

    if (error.code === '42501') {
      userFriendlyError =
        'Akses ditolak oleh database (Row-Level Security / RLS). Pastikan Anda telah login sebagai Admin.';
    }

    return { success: false, error: userFriendlyError };
  }

  revalidatePath('/admin/proyek');
  revalidatePath('/admin');
  revalidatePath('/proyek');
  revalidatePath('/project');
  revalidatePath('/');

  return { success: true };
}
