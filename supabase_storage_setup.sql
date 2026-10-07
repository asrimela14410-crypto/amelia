-- ==============================================================================
-- DUMP SQL KHUSUS: SETUP SUPABASE STORAGE UNTUK FOTO PROYEK
-- Project: Portofolio Asri Mela Aldian Syah
-- Bucket Name: 'proyek-images' (Public Bucket)
--
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di sidebar kiri
-- 3. Klik "New query", salin (copy-paste) seluruh isi file ini, lalu klik "Run"
-- 4. Selesai! Bucket penyimpanan foto proyek siap menerima upload file dari Admin Studio.
-- ==============================================================================

-- 1. BUAT STORAGE BUCKET 'proyek-images' JIKA BELUM ADA
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proyek-images',
  'proyek-images',
  true,
  5242880, -- Maksimal 5 MB per file
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- 2. HAPUS POLICY LAMA AGAR TIDAK TERJADI DUPLIKASI ATAU KONFLIK
DROP POLICY IF EXISTS "Public Access to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Update to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Delete to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert proyek-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated update proyek-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated delete proyek-images" ON storage.objects;

-- 3. POLICY 1 (READ): Pengunjung Website / Publik Dapat Melihat Foto Proyek
CREATE POLICY "Public Access to Proyek Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'proyek-images');

-- 4. POLICY 2 (INSERT): Mengizinkan Upload Foto ke Bucket 'proyek-images'
-- Mengizinkan user terautentikasi (admin) maupun proses Server Action mengunggah gambar
CREATE POLICY "Allow Upload to Proyek Images"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'proyek-images');

-- 5. POLICY 3 (UPDATE): Mengizinkan Update/Overwrite Foto di Bucket
CREATE POLICY "Allow Update to Proyek Images"
ON storage.objects FOR UPDATE
TO public
USING (bucket_id = 'proyek-images');

-- 6. POLICY 4 (DELETE): Mengizinkan Hapus Foto di Bucket
CREATE POLICY "Allow Delete to Proyek Images"
ON storage.objects FOR DELETE
TO public
USING (bucket_id = 'proyek-images');

-- ==============================================================================
-- CATATAN:
-- Setelah query ini dijalankan, file gambar yang diunggah dari Admin Studio
-- akan otomatis tersimpan di bucket 'proyek-images' dan dapat diakses publik melalui URL:
-- https://<project-id>.supabase.co/storage/v1/object/public/proyek-images/<nama-file>
-- ==============================================================================
