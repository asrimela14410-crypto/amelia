'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  ExternalLink,
  Eye,
  Table as TableIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FolderGit2,
  ShieldCheck,
  LayoutGrid,
} from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SkillsSection from '@/components/SkillsSection';
import ContactSection from '@/components/ContactSection';
import {
  tambahProyekAction,
  editProyekAction,
  hapusProyekAction,
} from './actions';

export const PRESET_IMAGES = [
  { label: 'Management Siswa', path: '/images/managemens.png' },
  { label: 'Management Magang', path: '/images/managementm.png' },
  { label: 'My App', path: '/images/My app.png' },
  { label: 'Pinjam Akun', path: '/images/pinjam.png' },
];

export type DbProyekItem = {
  id: number | string;
  judul: string;
  deskripsi: string;
  teknologi: string;
  link?: string | null;
  link_deploy?: string | null;
  kategori?: string | null;
  image?: string | null;
  role?: string | null;
  full_description?: string | null;
  features?: string[] | string | null;
  created_at?: string;
};

interface AdminStudioClientProps {
  initialProyek: DbProyekItem[];
  userEmail?: string | null;
}

export default function AdminStudioClient({
  initialProyek,
  userEmail,
}: AdminStudioClientProps) {
  const [viewMode, setViewMode] = useState<'live' | 'table'>('live');
  const [proyekList, setProyekList] = useState<DbProyekItem[]>(initialProyek);

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingProyek, setEditingProyek] = useState<DbProyekItem | null>(null);
  const [deletingProyek, setDeletingProyek] = useState<DbProyekItem | null>(null);

  // Selected image states
  const [addImagePath, setAddImagePath] = useState('/images/managemens.png');
  const [editImagePath, setEditImagePath] = useState('/images/managemens.png');

  const openEditModal = (item: DbProyekItem) => {
    setEditingProyek(item);
    setEditImagePath(item.image || '/images/managemens.png');
  };

  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'error';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Form submit tambah proyek
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await tambahProyekAction(formData);
      if (res.success && res.data && res.data[0]) {
        const raw = res.data[0];
        const itemBaru: DbProyekItem = {
          ...raw,
          id: String(raw.id),
          judul: raw.judul || raw.title || 'Untitled',
          deskripsi: raw.deskripsi || raw.description || '',
          teknologi:
            raw.teknologi ||
            (Array.isArray(raw.tech_stack) ? raw.tech_stack.join(', ') : raw.tech_stack) ||
            '',
          kategori: raw.kategori || raw.category_label || raw.category || 'Web',
          link: raw.link || raw.github_url || null,
          link_deploy: raw.link_deploy || raw.demo_url || null,
          image: raw.image || addImagePath || '/images/managemens.png',
          full_description: raw.full_description || raw.deskripsi || '',
          features: raw.features || [],
          role: raw.role || 'Full Stack Developer',
        };
        setProyekList((prev) => [...prev, itemBaru]);
        setIsAddOpen(false);
        showToast('Proyek baru berhasil ditambahkan ke Supabase!');
      } else {
        showToast(res.error || 'Gagal menambah proyek', 'error');
      }
    });
  };

  // Form submit edit proyek
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await editProyekAction(formData);
      if (res.success && res.data && res.data[0]) {
        const raw = res.data[0];
        const updated: DbProyekItem = {
          ...raw,
          id: String(raw.id),
          judul: raw.judul || raw.title || 'Untitled',
          deskripsi: raw.deskripsi || raw.description || '',
          teknologi:
            raw.teknologi ||
            (Array.isArray(raw.tech_stack) ? raw.tech_stack.join(', ') : raw.tech_stack) ||
            '',
          kategori: raw.kategori || raw.category_label || raw.category || 'Web',
          link: raw.link || raw.github_url || null,
          link_deploy: raw.link_deploy || raw.demo_url || null,
          image: raw.image || editImagePath || '/images/managemens.png',
          full_description: raw.full_description || raw.deskripsi || '',
          features: raw.features || [],
          role: raw.role || 'Full Stack Developer',
        };
        setProyekList((prev) =>
          prev.map((item) => (String(item.id) === String(updated.id) ? updated : item))
        );
        setEditingProyek(null);
        showToast('Perubahan proyek berhasil disimpan ke Supabase!');
      } else {
        showToast(res.error || 'Gagal mengedit proyek', 'error');
      }
    });
  };

  // Submit hapus proyek
  const handleDeleteConfirm = async () => {
    if (!deletingProyek) return;
    const formData = new FormData();
    formData.append('id', String(deletingProyek.id));

    startTransition(async () => {
      const res = await hapusProyekAction(formData);
      if (res.success) {
        setProyekList((prev) =>
          prev.filter((item) => String(item.id) !== String(deletingProyek.id))
        );
        setDeletingProyek(null);
        showToast('Proyek berhasil dihapus dari database!');
      } else {
        showToast(res.error || 'Gagal menghapus proyek', 'error');
      }
    });
  };

  const featured = proyekList[0];
  const secondary = proyekList.slice(1);

  return (
    <div className="relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-800'
              : 'bg-red-950/90 text-red-200 border-red-800'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Floating Top Admin Studio Control Bar */}
      <div className="sticky top-[73px] z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white px-4 sm:px-8 py-3 transition-all">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Mode Admin Aktif
              </span>
              <p className="text-xs text-slate-300">
                Halo, <span className="font-semibold text-white">{userEmail || 'Admin'}</span> • ({proyekList.length} Proyek di Supabase)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher: Live Homepage vs Tabel Data */}
            <div className="inline-flex p-1 rounded-xl bg-slate-800 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('live')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'live'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Studio</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <TableIcon className="w-3.5 h-3.5" />
                <span>Tabel Data</span>
              </button>
            </div>

            {/* Tombol Tambah Proyek Cepat */}
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek</span>
            </button>
          </div>
        </div>
      </div>

      {/* TAMPILAN 1: LIVE STUDIO HOMEPAGE (Halaman biasa + CRUD terintegrasi) */}
      {viewMode === 'live' && (
        <div className="w-full">
          {/* Bagian Hero */}
          <HeroSection />

          {/* Bagian Tentang */}
          <AboutSection />

          {/* Bagian Keahlian */}
          <SkillsSection />

          {/* BAGIAN PROYEK DENGAN CRUD CONTROLS LANGSUNG DI SETIAP KARTU */}
          <section id="projects" className="section-pad relative overflow-hidden bg-slate-50/50 dark:bg-slate-900/30">
            <div className="container-custom relative">
              {/* Header Bagian Proyek */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-8 h-[1px]" style={{ background: 'var(--accent)' }} />
                    <span
                      className="text-[11px] tracking-[0.25em] uppercase font-semibold text-indigo-600 dark:text-indigo-400"
                    >
                      Admin Live Showcase
                    </span>
                  </div>
                  <h2
                    className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--text)' }}
                  >
                    Kelola Proyek &amp; <span style={{ color: 'var(--accent)' }}>Mutasi Realtime</span>
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Proyek Baru</span>
                  </button>
                </div>
              </div>

              {/* 1. SPOTLIGHT FEATURED PROJECT */}
              {featured && (
                <div
                  className="rounded-3xl border p-6 sm:p-8 lg:p-10 mb-8 transition-all duration-300 shadow-md relative group/card"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  {/* Badge Admin CRUD Toolbar di Sudut Proyek Utama */}
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                    <span className="bg-indigo-600 text-white font-mono text-xs px-2.5 py-1 rounded-lg font-bold shadow-xs">
                      #{featured.id} (Spotlight)
                    </span>
                    <button
                      type="button"
                      onClick={() => openEditModal(featured)}
                      className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingProyek(featured)}
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className="grid lg:grid-cols-12 gap-8 items-center pt-6 lg:pt-0">
                    <div className="lg:col-span-7">
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-slate-900">
                        <Image
                          src={featured.image || '/images/managemens.png'}
                          alt={featured.judul}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-white text-xs font-semibold">
                          {featured.kategori || 'Web'}
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 space-y-4">
                      <h3
                        className="text-2xl sm:text-3xl font-medium"
                        style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--text)' }}
                      >
                        {featured.judul}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {featured.deskripsi}
                      </p>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {featured.teknologi?.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg border font-medium"
                            style={{
                              borderColor: 'var(--border)',
                              background: 'var(--bg-soft)',
                              color: 'var(--text)',
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                      <div className="pt-4 flex items-center gap-3">
                        {featured.link && (
                          <a
                            href={featured.link}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            <span>Link Proyek</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. GRID PROYEK LAINNYA DENGAN TOMBOL CRUD */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {secondary.map((proyek) => (
                  <article
                    key={proyek.id}
                    className="rounded-3xl border p-6 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 relative group"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {/* Floating Actions on Top Right of Each Card */}
                    <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="bg-slate-900/80 backdrop-blur-md text-white font-mono text-[11px] px-2 py-0.5 rounded-md font-bold">
                        #{proyek.id}
                      </span>
                      <button
                        type="button"
                        onClick={() => setEditingProyek(proyek)}
                        className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer"
                        title="Edit Proyek"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingProyek(proyek)}
                        className="p-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white shadow-sm transition-colors cursor-pointer"
                        title="Hapus Proyek"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Image Thumbnail */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border bg-slate-900">
                        <Image
                          src={proyek.image || '/images/managemens.png'}
                          alt={proyek.judul}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-[11px] font-semibold">
                          {proyek.kategori || 'Web'}
                        </div>
                      </div>

                      {/* Content */}
                      <div>
                        <h4
                          className="text-xl font-medium"
                          style={{ fontFamily: 'var(--font-cormorant)', color: 'var(--text)' }}
                        >
                          {proyek.judul}
                        </h4>
                        <p
                          className="mt-2 text-sm line-clamp-2 leading-relaxed"
                          style={{ color: 'var(--text-muted)' }}
                        >
                          {proyek.deskripsi}
                        </p>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proyek.teknologi?.split(',').map((tech, i) => (
                          <span
                            key={i}
                            className="text-[11px] px-2.5 py-0.5 rounded-lg border font-medium"
                            style={{
                              borderColor: 'var(--border)',
                              background: 'var(--bg-soft)',
                              color: 'var(--text)',
                            }}
                          >
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom Links */}
                    <div
                      className="mt-6 pt-4 border-t flex items-center justify-between"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <Link
                        href={`/project/${proyek.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                      >
                        <span>Preview Studi Kasus</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(proyek)}
                          className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <button
                          type="button"
                          onClick={() => setDeletingProyek(proyek)}
                          className="text-xs text-red-600 dark:text-red-400 font-semibold hover:underline cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                ))}

                {/* Card Tambah Proyek Tambahan */}
                <button
                  type="button"
                  onClick={() => setIsAddOpen(true)}
                  className="rounded-3xl border-2 border-dashed border-indigo-300 dark:border-indigo-800 p-8 flex flex-col items-center justify-center gap-3 text-center hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-all cursor-pointer group min-h-[320px]"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                    <Plus className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-800 dark:text-slate-200">
                      Tambah Proyek Baru
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
                      Masukkan data karya atau aplikasi terbaru langsung ke Supabase
                    </p>
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* Bagian Kontak */}
          <ContactSection />
        </div>
      )}

      {/* TAMPILAN 2: TABEL DATA ADMINISTRATIF KLASIK (MODUL PERTEMUAN 04) */}
      {viewMode === 'table' && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
                Tabel Manajemen Proyek
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Data proyek portofolio tersimpan di tabel <code className="text-indigo-600 dark:text-indigo-400 font-mono font-semibold">public.proyek</code> Supabase.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Proyek Baru</span>
            </button>
          </div>

          {/* Tabel Proyek */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="text-left px-5 py-3.5 font-semibold">ID</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Judul</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Kategori</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Teknologi</th>
                    <th className="text-left px-5 py-3.5 font-semibold">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {proyekList.map((proyek) => (
                    <tr
                      key={proyek.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-xs text-slate-500">
                        #{proyek.id}
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">
                        {proyek.judul}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                          {proyek.kategori || 'Web'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 text-xs">
                        {proyek.teknologi}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(proyek)}
                            className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingProyek(proyek)}
                            className="text-xs bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-colors font-semibold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {proyekList.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center text-slate-400">
                        Belum ada proyek di database Supabase.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: TAMBAH PROYEK BARU                                              */}
      {/* ========================================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Tambah Proyek Baru
                  </h3>
                  <p className="text-xs text-slate-500">Mutasi langsung ke tabel Supabase (semua kolom tersinkron)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Judul Proyek *
                </label>
                <input
                  name="judul"
                  required
                  placeholder="Contoh: Aplikasi Smart POS Sekolah"
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    defaultValue="Web"
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="Web">Web Application</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend UI</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="IoT">IoT / Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Teknologi (pisah koma)
                  </label>
                  <input
                    name="teknologi"
                    placeholder="Next.js, Supabase, Tailwind CSS"
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Input Gambar Proyek */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Gambar Proyek (URL atau Preset) *
                </label>
                <input
                  name="image"
                  value={addImagePath}
                  onChange={(e) => setAddImagePath(e.target.value)}
                  required
                  placeholder="/images/managemens.png"
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Preset:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setAddImagePath(preset.path)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        addImagePath === preset.path
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Deskripsi Ringkas *
                </label>
                <textarea
                  name="deskripsi"
                  required
                  rows={2}
                  placeholder="Jelaskan fitur utama dan tujuan proyek ini dibangun..."
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Deskripsi Lengkap / Detail (opsional)
                </label>
                <textarea
                  name="full_description"
                  rows={2}
                  placeholder="Penjelasan mendalam tentang arsitektur, tantangan teknis, dll..."
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Fitur-Fitur Utama (1 baris per fitur, opsional)
                </label>
                <textarea
                  name="features"
                  rows={2}
                  placeholder="Role-based authentication & permissions&#10;Kalkulasi penilaian otomatis&#10;Pencatatan presensi siswa real-time"
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Link Repository / GitHub (opsional)
                  </label>
                  <input
                    name="link"
                    type="url"
                    placeholder="https://github.com/..."
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Link Demo / Live Deploy (opsional)
                  </label>
                  <input
                    name="link_deploy"
                    type="url"
                    placeholder="https://..."
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Peran Pengembang (Role)
                </label>
                <input
                  name="role"
                  defaultValue="Full Stack Developer"
                  placeholder="Contoh: Frontend Engineer, Full Stack Developer"
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Proyek'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT PROYEK                                                     */}
      {/* ========================================================================= */}
      {editingProyek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b pb-4 border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                  <Pencil className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Edit Proyek #{editingProyek.id}
                  </h3>
                  <p className="text-xs text-slate-500">Perbarui informasi di database Supabase</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProyek(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <input type="hidden" name="id" value={editingProyek.id} />

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Judul Proyek *
                </label>
                <input
                  name="judul"
                  defaultValue={editingProyek.judul}
                  required
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Kategori
                  </label>
                  <select
                    name="kategori"
                    defaultValue={editingProyek.kategori || 'Web'}
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Web">Web Application</option>
                    <option value="Fullstack">Fullstack</option>
                    <option value="Frontend">Frontend UI</option>
                    <option value="Mobile">Mobile Apps</option>
                    <option value="IoT">IoT / Hardware</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Teknologi (pisah koma)
                  </label>
                  <input
                    name="teknologi"
                    defaultValue={editingProyek.teknologi}
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Edit Gambar Proyek */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Gambar Proyek (URL atau Preset) *
                </label>
                <input
                  name="image"
                  value={editImagePath}
                  onChange={(e) => setEditImagePath(e.target.value)}
                  required
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <span className="text-[11px] text-slate-400 self-center mr-1">Preset:</span>
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.path}
                      type="button"
                      onClick={() => setEditImagePath(preset.path)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                        editImagePath === preset.path
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Deskripsi Ringkas *
                </label>
                <textarea
                  name="deskripsi"
                  defaultValue={editingProyek.deskripsi}
                  required
                  rows={2}
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Deskripsi Lengkap / Detail (opsional)
                </label>
                <textarea
                  name="full_description"
                  defaultValue={editingProyek.full_description || editingProyek.deskripsi || ''}
                  rows={2}
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Fitur-Fitur Utama (1 baris per fitur, opsional)
                </label>
                <textarea
                  name="features"
                  defaultValue={
                    Array.isArray(editingProyek.features)
                      ? editingProyek.features.join('\n')
                      : (editingProyek.features || '')
                  }
                  rows={2}
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Link Repository / GitHub (opsional)
                  </label>
                  <input
                    name="link"
                    type="url"
                    defaultValue={editingProyek.link || ''}
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                    Link Demo / Live Deploy (opsional)
                  </label>
                  <input
                    name="link_deploy"
                    type="url"
                    defaultValue={editingProyek.link_deploy || ''}
                    className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Peran Pengembang (Role)
                </label>
                <input
                  name="role"
                  defaultValue={editingProyek.role || 'Full Stack Developer'}
                  className="w-full border border-slate-300 dark:border-slate-700 dark:bg-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-3 sticky bottom-0 bg-white dark:bg-slate-900 pb-1">
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProyek(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KONFIRMASI HAPUS                                                 */}
      {/* ========================================================================= */}
      {deletingProyek && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900/60 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Konfirmasi Hapus
                </h3>
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  Tindakan ini tidak dapat dibatalkan
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Apakah Anda yakin ingin menghapus proyek berikut dari database Supabase?
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
              <p className="font-bold text-slate-900 dark:text-white text-base">
                {deletingProyek.judul}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                Kategori: {deletingProyek.kategori || 'Web'} • ID: #{deletingProyek.id}
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="flex-1 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus Permanen'}
              </button>
              <button
                type="button"
                onClick={() => setDeletingProyek(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
