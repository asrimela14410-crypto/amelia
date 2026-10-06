# 🌸 Portofolio Asri Mela Aldian Syah

Portofolio web pribadi yang modern, interaktif, dan berestetika editorial milik **Asri Mela Aldian Syah**, seorang siswi jurusan Rekayasa Perangkat Lunak (RPL) dan calon Web Developer asal Indonesia. 

Website ini dibangun menggunakan arsitektur **Next.js 16 (App Router)**, **React 19**, **TypeScript**, dan **Tailwind CSS v4**, dilengkapi dengan animasi mikro interaktif, mode gelap/terang, katalog proyek berbasis kategori, serta halaman studi kasus mendalam.

---

## 📑 Daftar Isi
- [Ikhtisar & Profil](#-ikhtisar--profil)
- [Fitur Utama Website](#-fitur-utama-website)
- [Teknologi & Dependensi](#-teknologi--dependensi)
- [Struktur Proyek](#-struktur-proyek)
- [Riwayat Pembaruan & Changelog](#-riwayat-pembaruan--changelog)
- [Panduan Instalasi & Menjalankan](#-panduan-instalasi--menjalankan)
- [Kontak Pengembang](#-kontak-pengembang)

---

## 🌟 Ikhtisar & Profil

- **Pemilik**: Asri Mela Aldian Syah (Mela)
- **Status / Peran**: Siswi Rekayasa Perangkat Lunak (RPL) & Aspiring Web Developer
- **Fokus Utama**: Pengembangan Website (Frontend & Eksplorasi Fullstack)
- **Semboyan**: *"Small steps, consistent learning, and thoughtful work create meaningful results."*

---

## 🚀 Fitur Utama Website

### 1. 💫 Layar Pembuka (Intro Preloader)
- **Indikator Progres Dinamis**: Tampilan pemuatan awal beranimasi dengan kalkulasi persentase (0–100%) dan bar progres halus.
- **Identitas Visual**: Tipografi serif elegan *Cormorant Garamond*, penanda badge `Portfolio`, dan aksen *ambient blur glow*.
- **Transisi Mulus**: Efek *fade-out* otomatis begitu seluruh aset halaman utama selesai dimuat.

### 2. 🧭 Navigasi Mengambang & Pengalih Tema (Navbar)
- **Efek Glassmorphism**: Bar navigasi transparan di bagian atas yang bertransisi dinamis menjadi *blurred backdrop* (`backdrop-blur-xl`) saat pengguna menggulir halaman.
- **Scroll-Spy Section Indicator**: Tautan menu (*Beranda, Tentang, Keahlian, Proyek, Kontak*) secara otomatis mendeteksi posisi gulir pengguna dan menyorot menu aktif.
- **Dark Mode & Light Mode Toggler**: Tombol pengalih tema instan dengan ikon matahari/bulan beranimasi, didukung penyimpanan preferensi ke `localStorage` serta script pencegah *flicker* (*flash of unstyled content*).
- **Mobile Menu Drawer Responsif**: Menu navigasi layar penuh yang ramah perangkat seluler dan tablet dengan animasi buka/tutup halus.

### 3. ✈️ Hero Section Interaktif & Animasi Bespoke
- **Animated Typing Roles**: Teks peran dinamis yang mengetik dan menghapus otomatis bergantian (*RPL Student, Frontend Developer, Web Developer, UI/UX Enthusiast*).
- **Animasi Origami Pesawat Kertas (`floatPlane`)**: Hiasan pesawat kertas origami beranimasi melayang bebas lengkap dengan jejak lintasan titik-titik (*dashed trail*).
- **Animasi Kupu-Kupu Berkibar (`flutterButterfly` & `wingFlap`)**: Kupu-kupu dengan animasi kepakan sayap realistis di sudut bingkai foto.
- **Bingkai Foto Profil Bergaya Editorial**: Dilengkapi sudut *tech brackets*, *diamond glow pins*, garis aksen warna gradasi, dan efek pembesaran (*smooth scale*) saat disentuh kursor.
- **Live Availability Badge**: Indikator denyut (*pulsing badge*) bertuliskan *"Available for work"*.
- **Tombol Call-to-Action (CTA)**: Akses cepat untuk melihat galeri karya (*Lihat Karya*) dan menghubungi langsung (*Kontak Saya*).

### 4. 📖 Bagian Tentang Saya (About Section)
- **Narasi Dua Kolom Editorial**: Menceritakan latar belakang, ketertarikan pada arsitektur web, dan fokus belajar di bidang kejuruan RPL.
- **Metadata Profil**: Informasi ringkas mengenai Fokus (*Web Development*), Status (*Pelajar RPL*), Domisili (*Indonesia*), dan Bahasa (*Indonesia & English*).
- **Kartu Bidang yang Sedang Ditekuni**:
  - *Frontend Development* (HTML, CSS, JavaScript, React, Next.js, Tailwind CSS)
  - *UI/UX Design* (Perancangan visual antarmuka modern, rapi, dan estetis)
  - *Software Engineering & Testing* (Clean code, pencegahan bug, dan dasar backend)
  - Setiap kartu dilengkapi efek *radial flare* dan garis aksen bawah yang melebar saat kursor melayang di atasnya.

### 5. 🛠️ Showcase Keahlian Teknis (Skills & Tools)
- **Kategori Terstruktur**:
  - **Frontend**: React, Next.js, TypeScript, Tailwind CSS, JavaScript, HTML & CSS.
  - **Backend**: Node.js, Express.js, REST API, Supabase, MySQL.
  - **Tools & Others**: Git, GitHub, Figma, VS Code.
- **Visualisasi Interaktif**: Ikon teknologi dari *Lucide* dan *React Icons* berpadu dengan kontainer bergradasi warna, efek bayangan dinamis, serta efek *hover scale & rotate*.

### 6. 💻 Showcase Proyek Pilihan (Projects Section)
- **Spotlight Featured Project**:
  - Sorotan khusus untuk proyek utama (*Student Management System*).
  - Tampilan *mockup window browser* lengkap dengan tombol kontrol (*traffic lights*), bar alamat URL kustom, badge featured, deskripsi mendalam, poin fitur utama, serta lencana teknologi.
- **Secondary Project Grid**:
  - Tampilan kartu berdampingan untuk *Internship Management System* dan *Developer Workspace & Playground*.
- **Indikator Status Transparan**: Penanda status bahwa proyek merupakan arsip internal (*offline showcase*) yang belum dideploy ke publik.
- **Akses Cepat Studi Kasus**: Tombol langsung menuju analisis lengkap masing-masing proyek.

### 7. 🗂️ Halaman Katalog Proyek Lengkap (`/project`)
- **Arsip Karya Terdedikasi**: Menampilkan seluruh koleksi proyek tanpa batasan jumlah.
- **Filter Kategori Interaktif**:
  - Pilihan kategori: *Semua*, *Web*, *Fullstack*, *Frontend*.
  - Dilengkapi penghitung jumlah item (*counter badge*) di tiap tombol kategori.
  - Menggunakan URL search parameter yang bersih (`/project?category=fullstack`).
- **Empty State**: Penanganan tampilan ramah pengguna jika tidak ada proyek pada filter yang dipilih.

### 8. 🔍 Halaman Detail Studi Kasus Dinamis (`/project/[id]`)
- **Static Site Generation (SSG)**: Menggunakan `generateStaticParams` untuk pra-render halaman berdasarkan `id` maupun `slug` proyek.
- **Breadcrumb Navigation**: Mempermudah navigasi hierarki (*Beranda / Katalog Proyek / Nama Proyek*).
- **Panel Spesifikasi Cepat**: Menampilkan Kategori, Peran pengembang, Tahun pengerjaan (2025), dan Status kesiapan.
- **Mockup Browser Resolusi Tinggi**: Tampilan tangkapan layar antarmuka sistem dalam frame browser modern.
- **Bedah Studi Kasus Mendalam**:
  - Penjelasan komprehensif mengenai *Latar Belakang & Solusi*.
  - Grid *Fitur Unggulan Sistem* dengan penanda ikon centang modern.
  - Kartu *Teknologi Terapan*.
- **Tombol Aksi Konsultasi**: Tombol *"Tanyakan Proyek Ini"* yang mengarahkan pengunjung langsung ke formulir kontak untuk mendiskusikan sistem terkait.
- **Interactive Project Switcher**: Memungkinkan pengunjung langsung berpindah dan membaca studi kasus proyek lainnya di bagian bawah halaman.

### 9. ✉️ Bagian Kontak & Formulir Pesan (Contact Section)
- **One-Click Copy Email**: Tombol salin instan untuk alamat surel (`asrimela14410@gmail.com`) dengan umpan balik visual animasi (*"Salin"* ➔ *"Tersalin!"*).
- **Status Ketersediaan Magang (Live Ping Indicator)**: Indikator hijau berdenyut yang menandakan kesiapan menerima tawaran magang (PKL), kerja sama tim, atau eksplorasi teknologi baru.
- **Info Respon Cepat**: Informasi zona waktu Indonesia (WIB / UTC+7) dengan jaminan balasan dalam 1x24 jam kerja.
- **Formulir Kontak Terintegrasi**: Input formulir (*Nama, Email, Subjek, Pesan*) yang secara otomatis memformat teks dan membukanya di aplikasi surel pengunjung melalui protokol `mailto:`.

### 10. 🚫 Halaman Error 404 Kustom (`/not-found`)
- **Desain Khusus & Artistik**: Dilengkapi hiasan pesawat origami mengambang, animasi kepakan kupu-kupu mini, dan pencahayaan latar *radial glow*.
- **Tipografi Eksklusif**: Tampilan angka `404` berukuran besar menggunakan font *Cormorant Garamond*.
- **Aksi Pemulihan Navigasi**: Tombol kembali ke Beranda atau beralih ke Katalog Proyek jika pengguna tersesat atau salah memasukkan URL.

### 11. 🎨 Estetika & Desain Global
- **Tipografi Harmonik**:
  - Headings & Display: *Cormorant Garamond* (Google Fonts) untuk kesan editorial dan elegan.
  - Teks Isi (Body): *Manrope* (Google Fonts) untuk keterbacaan tinggi di berbagai resolusi layar.
- **Background Grid Animasi**: Latar belakang garis grid ganda yang bergeser perlahan secara berlawanan arah (`gridShift` dan `gridShiftReverse`) dengan efek *radial mask*.
- **Aksesibilitas Terjaga**: Mendukung kueri media `prefers-reduced-motion` untuk mematikan animasi bagi pengguna yang sensitif terhadap gerakan.

---

## 🛠️ Teknologi & Dependensi

| Kategori | Teknologi / Pustaka | Keterangan |
| :--- | :--- | :--- |
| **Framework Utama** | [Next.js 16 (App Router)](https://nextjs.org/) | Framework React modern untuk arsitektur web berperforma tinggi |
| **Pustaka UI** | [React 19](https://react.dev/) | Library antarmuka berbasis komponen |
| **Bahasa Pemrograman** | [TypeScript 5](https://www.typescriptlang.org/) | Menjamin keamanan tipe data dan kerapian struktur kode |
| **Styling & CSS** | [Tailwind CSS v4](https://tailwindcss.com/) | Framework utility-first CSS generasi terbaru dengan `@import "tailwindcss"` |
| **Ikonografi** | [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/) | Set ikon modern dan ikon merek teknologi terpercaya |
| **Font & Tipografi** | `next/font/google` | Memuat *Cormorant Garamond* dan *Manrope* dengan zero layout shift |
| **Manajemen Tema** | CSS Variables + LocalStorage | Mode terang dan gelap terintegrasi tanpa flicker |

---

## 📁 Struktur Proyek

```text
portofolio/
├── public/                     # Aset publik statis (gambar proyek, foto profil, favicon)
│   ├── images/
│   │   ├── managemens.png      # Screenshot Student Management System
│   │   ├── managementm.png     # Screenshot Internship Management System
│   │   ├── My app.png          # Screenshot Developer Workspace
│   │   └── mela 1.jpeg         # Foto profil Asri Mela
│   └── favicon.ico
├── src/
│   ├── app/
│   │   ├── globals.css         # Variabel tema, animasi custom, dan token styling
│   │   ├── layout.tsx          # Layout utama, konfigurasi font, & script tema
│   │   ├── page.tsx            # Halaman utama (Landing Page satu halaman)
│   │   ├── not-found.tsx       # Tampilan halaman kustom 404 Not Found
│   │   ├── project/
│   │   │   ├── page.tsx        # Halaman katalog proyek lengkap dengan filter
│   │   │   └── [id]/
│   │   │       └── page.tsx    # Halaman dinamis studi kasus detail proyek
│   │   └── projects/
│   │       └── page.tsx        # Rute pengalihan (/projects -> /project)
│   └── components/
│       ├── Preloader.tsx       # Layar pemuatan awal dengan animasi progres
│       ├── Navbar.tsx          # Bar navigasi mengambang + dark mode toggler
│       ├── HeroSection.tsx     # Hero section (origami, kupu-kupu, typing role)
│       ├── AboutSection.tsx    # Cerita profil, fokus belajar, & keahlian
│       ├── SkillsSection.tsx   # Daftar keahlian teknis (Frontend, Backend, Tools)
│       ├── ProjectsSection.tsx # Showcase proyek spotlight & kartu sekunder
│       ├── ContactSection.tsx  # Informasi kontak, copy email, & form pesan
│       └── Footer.tsx          # Footer elegan & hak cipta
├── data.ts                     # Data terpusat (proyek, keahlian, profil, kontak)
├── package.json                # Daftar dependensi dan scripts npm
├── tsconfig.json               # Konfigurasi TypeScript
└── README.md                   # Dokumentasi lengkap proyek
```

---

## 🕒 Riwayat Pembaruan & Changelog

Berikut adalah rangkuman perjalanan rilis dan pembaruan pada website portofolio ini:

### 📌 Versi 2.2.0 (Terbaru)
- **Penyempurnaan Status Proyek Internal**: Mengganti tautan luar placeholder dengan indikator status resmi bahwa proyek berstatus *Offline Showcase / Proyek Internal*.
- **Integrasi Tombol Konsultasi**: Menambahkan tombol *"Tanyakan Proyek Ini"* pada halaman studi kasus yang menghubungkan pengguna langsung ke bagian kontak.
- **Halaman Error 404 Kustom yang Ditingkatkan**: Menambahkan ornamen origami paper airplane, kepakan sayap kupu-kupu mini, dan tombol pemulihan rute.
- **Optimasi Navigasi Katalog**: Penataan kembali breadcrumbs dan switcher proyek di bagian bawah halaman studi kasus.

### 📌 Versi 2.1.0
- **Penyempurnaan Form Kontak & Interaktivitas Surel**:
  - Menghadirkan tombol *One-Click Copy Clipboard* untuk email dengan status konfirmasi ("Salin" ➔ "Tersalin!").
  - Menambahkan *Live Ping Status Ketersediaan* untuk kesempatan magang (PKL) dan kolaborasi.
  - Kartu informasi waktu respon resmi 1x24 jam kerja.
- **Redesain Footer Minimalis**: Menata ulang footer agar selaras dengan estetika editorial dan menyediakan tautan direct mailto yang bersih.

### 📌 Versi 2.0.0 (Pembaruan Skala Besar / Major Redesign)
- **Transformasi Estetika Editorial Bespoke**:
  - Mengadopsi paduan tipografi *Cormorant Garamond* (display serif) dan *Manrope* (sans-serif modern).
  - Implementasi animasi khusus: origami pesawat kertas melayang (`animate-float-plane`) dan kupu-kupu beranimasi (`animate-flutter-butterfly` & `animate-wing`).
  - Desain bingkai foto profil bergradasi dengan corner brackets dan diamond glow pins.
- **Pembangunan Sistem Studi Kasus Dinamis**:
  - Pembuatan rute baru `/project` untuk katalog proyek dengan penyaring kategori interaktif.
  - Pembuatan rute dinamis `/project/[id]` dengan SSG untuk menampilkan studi kasus komprehensif dalam frame jendela browser.
- **Komponen Intro Preloader**: Animasi pemuatan awal dengan bar progres visual sebelum masuk ke beranda.
- **Pembersihan Arsitektur & Dependensi**: Menghapus komponen antarmuka yang tidak terpakai untuk mempercepat kecepatan muat halaman.

### 📌 Versi 1.2.0
- **Eksplorasi Layout Editorial Pastel**: Penerapan skema warna yang lebih lembut dan penataan ulang bagian utama halaman.
- **Penyesuaian Responsivitas**: Penyesuaian jarak elemen pada perangkat seluler.

### 📌 Versi 1.1.0
- **Peningkatan Tombol Kontak**: Pengoptimalan formulir interaksi pengunjung dan perbaikan tombol submit.

### 📌 Versi 1.0.0
- **Inisialisasi Portofolio Awal**: Setup proyek awal menggunakan Next.js, pembuatan struktur navigasi dasar, serta penyusunan data awal siswa RPL.

---

## 💻 Panduan Instalasi & Menjalankan

Ikuti langkah-langkah berikut untuk menjalankan proyek ini di komputer lokal Anda:

### 1. Prasyarat
Pastikan Anda telah menginstal:
- [Node.js](https://nodejs.org/) (versi 18.18.0 atau lebih baru)
- npm, pnpm, atau yarn

### 2. Kloning Repositori
```bash
git clone https://github.com/goldierajaborn-dev/portofolio.git
cd portofolio
```

### 3. Instalasi Dependensi
```bash
npm install
# atau
pnpm install
# atau
yarn install
```

### 4. Menjalankan Mode Pengembangan (Dev Server)
```bash
npm run dev
```
Buka peramban (browser) dan akses alamat:
```
http://localhost:3000
```

### 5. Membangun untuk Lingkungan Produksi (Build)
```bash
npm run build
npm run start
```

---

## 📬 Kontak Pengembang

Jika Anda memiliki pertanyaan, tawaran magang (PKL), proyek kerja sama, atau sekadar ingin berdiskusi seputar pengembangan web, silakan hubungi:

- **Nama**: Asri Mela Aldian Syah
- **Email**: [asrimela14410@gmail.com](mailto:asrimela14410@gmail.com)
- **Lokasi**: Indonesia (WIB / UTC+7)
- **Status**: Terbuka untuk kesempatan magang (PKL) & proyek pengembangan web

---

<div align="center">
  <p>© 2026 <strong>Asri Mela Aldian Syah</strong>. Dibuat dengan dedikasi dan semangat belajar.</p>
</div>
