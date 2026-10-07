-- ==============================================================================
-- KEBIJAKAN KEAMANAN DATABASE (RLS) KHUSUS ADMIN (STRICT ADMIN ONLY)
-- Project: Portofolio Asri Mela Aldian Syah
-- Keterangan:
-- 1. Pengunjung website HANYA BISA MELIHAT (SELECT) proyek & gambar (Read-Only).
-- 2. HANYA ADMIN YANG LOGIN (Authenticated) yang memiliki izin untuk:
--    - Menambah proyek (INSERT)
--    - Mengedit proyek (UPDATE)
--    - Menghapus proyek (DELETE)
--    - Mengunggah / menghapus foto proyek di Supabase Storage
--
-- CARA PENGGUNAAN:
-- 1. Buka Supabase Dashboard: https://supabase.com/dashboard
-- 2. Pilih project Supabase Anda
-- 3. Di menu sebelah kiri, klik "SQL Editor"
-- 4. Klik tombol "New query" (+ di pojok atas)
-- 5. Salin (copy-paste) seluruh isi file ini, lalu klik tombol "Run"
-- 6. Selesai! Seluruh hak akses CRUD terkunci rapat HANYA untuk Admin.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. AMANKAN TABEL PROYEK (ROW LEVEL SECURITY)
-- ------------------------------------------------------------------------------
ALTER TABLE public.proyek ENABLE ROW LEVEL SECURITY;

-- Bersihkan SEMUA kemungkinan policy lama (baik public maupun authenticated)
DROP POLICY IF EXISTS "Allow public read all projects" ON public.proyek;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Public read" ON public.proyek;
DROP POLICY IF EXISTS "Enable insert access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Enable update access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Enable delete access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Enable all access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Allow public insert" ON public.proyek;
DROP POLICY IF EXISTS "Allow public update" ON public.proyek;
DROP POLICY IF EXISTS "Allow public delete" ON public.proyek;
DROP POLICY IF EXISTS "Public insert" ON public.proyek;
DROP POLICY IF EXISTS "Public update" ON public.proyek;
DROP POLICY IF EXISTS "Public delete" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin insert" ON public.proyek;
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin update" ON public.proyek;
DROP POLICY IF EXISTS "Allow authenticated update" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin delete" ON public.proyek;
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.proyek;

-- Kebijakan 1: Pengunjung publik HANYA bisa membaca proyek (SELECT Read-Only)
CREATE POLICY "Allow public read all projects"
ON public.proyek FOR SELECT
TO public
USING (true);

-- Kebijakan 2: HANYA ADMIN LOGIN (Authenticated) yang boleh MENAMBAH proyek
CREATE POLICY "Allow admin insert"
ON public.proyek FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Kebijakan 3: HANYA ADMIN LOGIN (Authenticated) yang boleh MENGEDIT proyek
CREATE POLICY "Allow admin update"
ON public.proyek FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Kebijakan 4: HANYA ADMIN LOGIN (Authenticated) yang boleh MENGHAPUS proyek
CREATE POLICY "Allow admin delete"
ON public.proyek FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 2. AMANKAN STORAGE BUCKET 'proyek-images'
-- ------------------------------------------------------------------------------
-- Publik hanya bisa melihat foto proyek
DROP POLICY IF EXISTS "Public Access to Proyek Images" ON storage.objects;
CREATE POLICY "Public Access to Proyek Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'proyek-images');

-- HANYA ADMIN LOGIN yang boleh upload foto proyek
DROP POLICY IF EXISTS "Allow Upload to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated insert proyek-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin upload to proyek images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload to proyek-images" ON storage.objects;
DROP POLICY IF EXISTS "Enable upload for all users" ON storage.objects;
CREATE POLICY "Allow admin upload to proyek images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');

-- HANYA ADMIN LOGIN yang boleh edit / replace foto proyek
DROP POLICY IF EXISTS "Allow Update to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin update to proyek images" ON storage.objects;
CREATE POLICY "Allow admin update to proyek images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');

-- HANYA ADMIN LOGIN yang boleh hapus foto proyek
DROP POLICY IF EXISTS "Allow Delete to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow admin delete to proyek images" ON storage.objects;
CREATE POLICY "Allow admin delete to proyek images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');
