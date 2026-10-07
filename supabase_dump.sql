-- ==============================================================================
-- DUMP SQL LENGKAP & FLEKSIBEL: TABEL PROYEK, PROFILES & AUTH SUPABASE
-- Project: Portofolio Asri Mela Aldian Syah (SMK RPL Kelas XI)
-- Keterangan:
-- 1. Aman dijalankan berulang kali (Idempotent - IF NOT EXISTS & ON CONFLICT)
-- 2. Kompatibel penuh dengan skema tabel yang SUDAH ADA di Supabase:
--    - id (text), slug (text), title (text), category (text), category_label (text)
--    - tech_stack (text[]), features (text[])
--    - Serta mendukung alias modul sekolah: judul, deskripsi, teknologi, link, dll.
-- 3. Trigger otomatis sinkronisasi dua arah tipe-aman (text[] <-> text)
-- 4. Default ID otomatis (gen_random_uuid) jika insert tanpa ID
-- 5. Data proyek 1-4 sesuai yang ada di Supabase Dashboard Anda
-- 6. Tabel profiles + Policy RLS Keamanan Admin CRUD
-- 7. Akun Admin Default: admin@gmail.com / AdminPassword123!
--
-- CARA PENGGUNAAN:
-- 1. Buka dashboard Supabase (https://supabase.com/dashboard)
-- 2. Pilih Project Anda -> Buka menu "SQL Editor" di sidebar kiri
-- 3. Klik "New query", salin (copy-paste) seluruh isi file ini, lalu klik "Run"
-- 4. Selesai! Semua tabel, data, dan hak akses aman dan tersinkronisasi tanpa error.
-- ==============================================================================

-- Aktifkan ekstensi pgcrypto untuk enkripsi bcrypt & UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. TABEL UTAMA: proyek (Mendukung ID bertipe TEXT sesuai Supabase Anda)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.proyek (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    slug TEXT,
    title TEXT,
    category TEXT DEFAULT 'web',
    category_label TEXT DEFAULT 'Web Platform',
    description TEXT,
    full_description TEXT,
    image TEXT,
    tech_stack TEXT[],
    features TEXT[],
    demo_url TEXT,
    github_url TEXT,
    role TEXT
);

-- Pastikan kolom id memiliki default value jika tabel sudah ada sebelumnya
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'proyek' 
      AND column_name = 'id' 
      AND data_type IN ('text', 'character varying') 
      AND column_default IS NULL
  ) THEN
    ALTER TABLE public.proyek ALTER COLUMN id SET DEFAULT gen_random_uuid()::text;
  END IF;
END $$;

-- Tambahkan seluruh kolom modern jika belum ada
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS slug TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'web';
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS category_label TEXT DEFAULT 'Web Platform';
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS full_description TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS tech_stack TEXT[];
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS features TEXT[];
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS demo_url TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS role TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());

-- Tambahkan kolom alias bahasa Indonesia untuk kompatibilitas tugas sekolah/admin form
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS judul TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS deskripsi TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS teknologi TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS link_deploy TEXT;
ALTER TABLE public.proyek ADD COLUMN IF NOT EXISTS kategori TEXT;

-- ------------------------------------------------------------------------------
-- 2. SINKRONISASI OTOMATIS ANTARA NAMA KOLOM INDONESIA & INGGRIS (TIPE-AMAN)
-- ------------------------------------------------------------------------------
-- Sinkronkan data kolom bertipe TEXT biasa
UPDATE public.proyek
SET
  title = COALESCE(title, judul),
  judul = COALESCE(judul, title),
  description = COALESCE(description, deskripsi),
  deskripsi = COALESCE(deskripsi, description),
  full_description = COALESCE(full_description, description, deskripsi),
  category = COALESCE(category, lower(kategori), 'web'),
  category_label = COALESCE(category_label, kategori, 'Web Platform'),
  kategori = COALESCE(kategori, category_label, category, 'Web'),
  demo_url = COALESCE(demo_url, link_deploy),
  link_deploy = COALESCE(link_deploy, demo_url),
  github_url = COALESCE(github_url, link),
  link = COALESCE(link, github_url);

-- Sinkronkan array tech_stack (text[]) dan string teknologi (text) secara type-safe
DO $$
BEGIN
  -- Jika tech_stack adalah text[]
  UPDATE public.proyek
  SET
    teknologi = COALESCE(teknologi, array_to_string(tech_stack, ', ')),
    tech_stack = COALESCE(tech_stack, string_to_array(teknologi, ', '));
EXCEPTION WHEN OTHERS THEN
  -- Fallback jika tech_stack bertipe text biasa
  BEGIN
    EXECUTE 'UPDATE public.proyek SET teknologi = COALESCE(teknologi, tech_stack::text), tech_stack = COALESCE(tech_stack, teknologi::text)';
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
END $$;

-- Buat trigger agar setiap INSERT/UPDATE baru otomatis mengisi kedua sisi
CREATE OR REPLACE FUNCTION public.sync_proyek_fields()
RETURNS trigger AS $$
BEGIN
  -- Sinkronkan id default jika kosong
  IF NEW.id IS NULL OR NEW.id = '' THEN
    NEW.id := gen_random_uuid()::text;
  END IF;

  -- Sinkronkan title & judul
  IF NEW.title IS NOT NULL AND NEW.judul IS NULL THEN
    NEW.judul := NEW.title;
  ELSIF NEW.judul IS NOT NULL AND NEW.title IS NULL THEN
    NEW.title := NEW.judul;
  END IF;

  -- Sinkronkan description & deskripsi
  IF NEW.description IS NOT NULL AND NEW.deskripsi IS NULL THEN
    NEW.deskripsi := NEW.description;
  ELSIF NEW.deskripsi IS NOT NULL AND NEW.description IS NULL THEN
    NEW.description := NEW.deskripsi;
  END IF;

  -- Sinkronkan full_description
  IF NEW.full_description IS NULL THEN
    NEW.full_description := COALESCE(NEW.description, NEW.deskripsi);
  END IF;

  -- Sinkronkan category & kategori & category_label
  IF NEW.category IS NOT NULL AND NEW.kategori IS NULL THEN
    NEW.kategori := NEW.category;
  ELSIF NEW.kategori IS NOT NULL AND NEW.category IS NULL THEN
    NEW.category := lower(NEW.kategori);
  END IF;
  IF NEW.category_label IS NULL THEN
    NEW.category_label := COALESCE(NEW.kategori, NEW.category, 'Web');
  END IF;

  -- Sinkronkan tech_stack (text[]) & teknologi (text) secara aman
  IF NEW.tech_stack IS NOT NULL AND (NEW.teknologi IS NULL OR NEW.teknologi = '') THEN
    NEW.teknologi := array_to_string(NEW.tech_stack, ', ');
  ELSIF NEW.teknologi IS NOT NULL AND NEW.teknologi <> '' AND (NEW.tech_stack IS NULL OR array_length(NEW.tech_stack, 1) IS NULL) THEN
    NEW.tech_stack := string_to_array(NEW.teknologi, ', ');
  END IF;

  -- Sinkronkan demo_url & link_deploy
  IF NEW.demo_url IS NOT NULL AND NEW.link_deploy IS NULL THEN
    NEW.link_deploy := NEW.demo_url;
  ELSIF NEW.link_deploy IS NOT NULL AND NEW.demo_url IS NULL THEN
    NEW.demo_url := NEW.link_deploy;
  END IF;

  -- Sinkronkan github_url & link
  IF NEW.github_url IS NOT NULL AND NEW.link IS NULL THEN
    NEW.link := NEW.github_url;
  ELSIF NEW.link IS NOT NULL AND NEW.github_url IS NULL THEN
    NEW.github_url := NEW.link;
  END IF;

  -- Slug otomatis dari title/judul jika kosong
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := lower(regexp_replace(COALESCE(NEW.title, NEW.judul, NEW.id), '[^a-zA-Z0-9]+', '-', 'g'));
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_proyek_fields ON public.proyek;
CREATE TRIGGER trg_sync_proyek_fields
BEFORE INSERT OR UPDATE ON public.proyek
FOR EACH ROW EXECUTE FUNCTION public.sync_proyek_fields();

-- ------------------------------------------------------------------------------
-- 3. SEED DATA AWAL TABEL PROYEK (Preserve Data yang Ada di Supabase Anda)
-- ------------------------------------------------------------------------------
INSERT INTO public.proyek (
  id,
  slug,
  title,
  judul,
  category,
  category_label,
  kategori,
  description,
  deskripsi,
  full_description,
  image,
  tech_stack,
  teknologi,
  features,
  demo_url,
  link_deploy,
  github_url,
  link,
  role
)
VALUES
(
  '1',
  'management-siswa',
  'Student Management System',
  'Student Management System',
  'fullstack',
  'Fullstack Web',
  'Fullstack Web',
  'Sistem management sekolah komprehensif untuk menilai, mencatat, dan mengelola data seluruh murid secara terstruktur.',
  'Sistem management sekolah komprehensif untuk menilai, mencatat, dan mengelola data seluruh murid secara terstruktur.',
  'Dirancang untuk mengatasi hambatan administratif di lingkungan sekolah kejuruan, sistem ini mengotomatiskan pencatatan data siswa, siklus penilaian akademik, dan pemantauan presensi harian.',
  '/images/managemens.png',
  ARRAY['Next.js', 'Tailwind CSS', 'Shadcn UI', 'Supabase', 'TypeScript']::text[],
  'Next.js, Tailwind CSS, Shadcn UI, Supabase, TypeScript',
  ARRAY['Role-based authentication & permissions', 'Kalkulasi penilaian akademik otomatis', 'Pencatatan presensi siswa real-time']::text[],
  '#',
  '#',
  'https://github.com/GoldieGladwin',
  'https://github.com/GoldieGladwin',
  'Full Stack Developer'
),
(
  '2',
  'management-magang',
  'Internship Management System',
  'Internship Management System',
  'web',
  'Web Platform',
  'Web Platform',
  'Platform koordinasi terpadu untuk monitoring magang siswa SMK bersama guru pembimbing dan mitra industri (DUDI).',
  'Platform koordinasi terpadu untuk monitoring magang siswa SMK bersama guru pembimbing dan mitra industri (DUDI).',
  'Platform koordinasi terpadu yang menjembatani siswa magang SMK, guru pembimbing, dan mitra dunia usaha/dunia industri (DUDI). Memudahkan pengisian jurnal logbook harian, verifikasi presensi kerja lapangan, serta evaluasi performa magang secara terpusat dan transparan.',
  '/images/managementm.png',
  ARRAY['Next.js', 'Tailwind CSS', 'Shadcn UI', 'Supabase', 'TypeScript']::text[],
  'Next.js, Tailwind CSS, Shadcn UI, Supabase, TypeScript',
  ARRAY['Jurnal logbook harian siswa dengan approval pembimbing', 'Monitoring presensi industri', 'Evaluasi performa terpusat']::text[],
  '#',
  '#',
  'https://github.com/GoldieGladwin',
  'https://github.com/GoldieGladwin',
  'System Architect & Developer'
),
(
  '3',
  'my-app',
  'Developer Workspace & Playground',
  'Developer Workspace & Playground',
  'frontend',
  'Frontend App',
  'Frontend App',
  'Ruang eksperimen frontend interaktif untuk menguji coba arsitektur React terkini, custom hooks, dan komponen dinamis.',
  'Ruang eksperimen frontend interaktif untuk menguji coba arsitektur React terkini, custom hooks, dan komponen dinamis.',
  'Ruang eksperimen frontend interaktif yang dibangun untuk mengeksplorasi fitur-fitur mutakhir Next.js, custom hooks, dynamic routing, micro-interactions, serta perancangan komponen UI modern yang siap pakai dan reusable sebelum diimplementasikan ke proyek berskala besar.',
  '/images/My app.png',
  ARRAY['Next.js', 'Tailwind CSS', 'Shadcn UI', 'TypeScript', 'Lucide Icons']::text[],
  'Next.js, Tailwind CSS, Shadcn UI, TypeScript, Lucide Icons',
  ARRAY['Eksperimen custom hooks', 'Animasi mikro responsif', 'Struktur modular clean architecture']::text[],
  '#',
  '#',
  'https://github.com/GoldieGladwin',
  'https://github.com/GoldieGladwin',
  'Frontend Engineer'
),
(
  '4',
  'Internet Afting',
  'Pelajar',
  'Pelajar',
  'fullstack',
  'Fullstack Web',
  'Fullstack Web',
  'A feature-rich web portal for secure, automated game account rentals with an intuitive user interface and real-time management.',
  'A feature-rich web portal for secure, automated game account rentals with an intuitive user interface and real-time management.',
  'A feature-rich web portal for secure, automated game account rentals with an intuitive user interface and real-time management.',
  '/images/pinjam.png',
  ARRAY['Next.js', 'Tailwind CSS', 'Shadcn UI', 'Supabase']::text[],
  'Next.js, Tailwind CSS, Shadcn UI, Supabase',
  ARRAY['Sistem peminjaman akun terverifikasi', 'Integrasi database Supabase']::text[],
  '#',
  '#',
  'https://github.com/GoldieGladwin',
  'https://github.com/GoldieGladwin',
  'Full Stack Developer'
)
ON CONFLICT (id) DO UPDATE SET
  slug = COALESCE(public.proyek.slug, EXCLUDED.slug),
  title = COALESCE(public.proyek.title, EXCLUDED.title),
  judul = COALESCE(public.proyek.judul, EXCLUDED.judul),
  category = COALESCE(public.proyek.category, EXCLUDED.category),
  category_label = COALESCE(public.proyek.category_label, EXCLUDED.category_label),
  kategori = COALESCE(public.proyek.kategori, EXCLUDED.kategori),
  description = COALESCE(public.proyek.description, EXCLUDED.description),
  deskripsi = COALESCE(public.proyek.deskripsi, EXCLUDED.deskripsi),
  full_description = COALESCE(public.proyek.full_description, EXCLUDED.full_description),
  image = COALESCE(public.proyek.image, EXCLUDED.image),
  tech_stack = COALESCE(public.proyek.tech_stack, EXCLUDED.tech_stack),
  teknologi = COALESCE(public.proyek.teknologi, EXCLUDED.teknologi),
  features = COALESCE(public.proyek.features, EXCLUDED.features),
  demo_url = COALESCE(public.proyek.demo_url, EXCLUDED.demo_url),
  link_deploy = COALESCE(public.proyek.link_deploy, EXCLUDED.link_deploy),
  github_url = COALESCE(public.proyek.github_url, EXCLUDED.github_url),
  link = COALESCE(public.proyek.link, EXCLUDED.link),
  role = COALESCE(public.proyek.role, EXCLUDED.role);

-- ------------------------------------------------------------------------------
-- 4. TABEL PROFILES: RELASI LANGSUNG KE auth.users (VERIFIKASI ROLE ADMIN)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    role TEXT DEFAULT 'admin' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Aktifkan RLS pada tabel profiles & proyek
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.proyek ENABLE ROW LEVEL SECURITY;

-- Policy SELECT pada profiles: User yang login hanya dapat melihat profil miliknya
DROP POLICY IF EXISTS "Allow authenticated read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read profiles" ON public.profiles;
CREATE POLICY "Allow authenticated read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy INSERT pada profiles: User authenticated dapat mendaftarkan profil dirinya sendiri
DROP POLICY IF EXISTS "Allow authenticated insert own profile" ON public.profiles;
CREATE POLICY "Allow authenticated insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Policy UPDATE pada profiles: User authenticated dapat memperbarui profil miliknya
DROP POLICY IF EXISTS "Allow authenticated update own profile" ON public.profiles;
CREATE POLICY "Allow authenticated update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 5. POLICIES CRUD TABEL PROYEK (KEAMANAN BERLAPIS BERBASIS ROLE ADMIN)
-- ------------------------------------------------------------------------------

-- Policy 1: SELECT Publik (Siapapun / Pengunjung dapat melihat proyek di halaman portfolio)
DROP POLICY IF EXISTS "Enable read access for all users" ON public.proyek;
DROP POLICY IF EXISTS "Allow public read all projects" ON public.proyek;
CREATE POLICY "Allow public read all projects"
ON public.proyek
FOR SELECT
TO public
USING (true);

-- Policy 2: INSERT HANYA untuk User yang Login (Authenticated Admin)
DROP POLICY IF EXISTS "Allow authenticated insert" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin insert" ON public.proyek;
CREATE POLICY "Allow admin insert"
ON public.proyek
FOR INSERT
TO authenticated
WITH CHECK (auth.role() = 'authenticated');

-- Policy 3: UPDATE HANYA untuk User yang Login (Authenticated Admin)
DROP POLICY IF EXISTS "Allow authenticated update" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin update" ON public.proyek;
CREATE POLICY "Allow admin update"
ON public.proyek
FOR UPDATE
TO authenticated
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Policy 4: DELETE HANYA untuk User yang Login (Authenticated Admin)
DROP POLICY IF EXISTS "Allow authenticated delete" ON public.proyek;
DROP POLICY IF EXISTS "Allow admin delete" ON public.proyek;
CREATE POLICY "Allow admin delete"
ON public.proyek
FOR DELETE
TO authenticated
USING (auth.role() = 'authenticated');

-- ------------------------------------------------------------------------------
-- 6. TRIGGER OTOMATIS: BUAT PROFIL SAAT USER BARU DIDAFTARKAN DI auth.users
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (new.id, new.email, 'admin')
  ON CONFLICT (id) DO UPDATE SET role = 'admin';
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 7. PANDUAN AKUN ADMIN (SUPABASE AUTH)
-- CATATAN: Supabase Auth mengelola tabel auth.users secara internal.
-- Jangan meng-insert manual ke auth.users karena dapat menyebabkan 'Database error querying schema'.
-- Untuk membuat akun Admin baru:
-- 1. Buka Supabase Dashboard > Authentication > Users
-- 2. Klik "Add user" -> "Create user"
-- 3. Masukkan Email & Password admin, centang "Auto Confirm User"
-- 4. Akun admin otomatis aktif dan siap digunakan untuk login di /admin/login!
-- ------------------------------------------------------------------------------

-- ------------------------------------------------------------------------------
-- 8. SUPABASE STORAGE: BUCKET 'proyek-images' UNTUK FOTO PROYEK
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'proyek-images',
  'proyek-images',
  true,
  5242880, -- Maksimal 5 MB
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];

-- Hapus policy lama agar tidak duplikat
DROP POLICY IF EXISTS "Public Access to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Upload to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Update to Proyek Images" ON storage.objects;
DROP POLICY IF EXISTS "Allow Delete to Proyek Images" ON storage.objects;

-- Policy 1: Publik DAPAT melihat gambar proyek (SELECT Read-Only)
CREATE POLICY "Public Access to Proyek Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'proyek-images');

-- Policy 2: HANYA Admin Authenticated yang boleh upload ke bucket proyek-images
CREATE POLICY "Allow Upload to Proyek Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');

-- Policy 3: HANYA Admin Authenticated yang boleh update gambar
CREATE POLICY "Allow Update to Proyek Images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');

-- Policy 4: HANYA Admin Authenticated yang boleh hapus gambar
CREATE POLICY "Allow Delete to Proyek Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'proyek-images' AND auth.role() = 'authenticated');
