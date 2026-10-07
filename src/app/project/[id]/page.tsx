import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Code2,
  FolderGit2,
  Layers,
  MessageSquare,
  Sparkles,
  Terminal,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { projects, ProjectItem } from "../../../../data";
import { supabase } from "@/lib/supabase";

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ProjectDetailProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const decodedId = decodeURIComponent(rawId);

  let title = "Detail Proyek";
  let description = "Studi kasus komprehensif, arsitektur sistem, dan teknologi terapan oleh Asri Mela Aldian Syah.";
  let image = "/images/managemens.png";

  try {
    const { data: dbItem } = await supabase
      .from("proyek")
      .select("judul, title, deskripsi, description, image")
      .or(`id.eq.${rawId},slug.eq.${rawId},id.eq.${decodedId},slug.eq.${decodedId}`)
      .maybeSingle();

    if (dbItem) {
      title = dbItem.judul || dbItem.title || title;
      description = dbItem.deskripsi || dbItem.description || description;
      image = dbItem.image || image;
    } else {
      const local = projects.find(
        (p) => p.id === rawId || p.slug === rawId || p.id === decodedId || p.slug === decodedId
      );
      if (local) {
        title = local.title;
        description = local.description;
        image = local.image;
      }
    }
  } catch {
    const local = projects.find(
      (p) => p.id === rawId || p.slug === rawId || p.id === decodedId || p.slug === decodedId
    );
    if (local) {
      title = local.title;
      description = local.description;
      image = local.image;
    }
  }

  return {
    title: `${title} | Studi Kasus Proyek`,
    description,
    openGraph: {
      title: `${title} — Portfolio Asri Mela Aldian Syah`,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `Tangkapan layar demo proyek ${title}`,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Portfolio Asri Mela`,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const rawId = resolvedParams.id;
  const decodedId = decodeURIComponent(rawId);

  // Coba ambil dari Supabase terlebih dahulu
  let project: ProjectItem | undefined;
  try {
    let dbItem = null;

    // 1. Coba cari dengan eq id (aman untuk integer maupun text)
    const resId = await supabase
      .from("proyek")
      .select("*")
      .eq("id", rawId)
      .maybeSingle();

    if (resId.data) {
      dbItem = resId.data;
    } else if (decodedId !== rawId) {
      const resDecodedId = await supabase
        .from("proyek")
        .select("*")
        .eq("id", decodedId)
        .maybeSingle();
      if (resDecodedId.data) {
        dbItem = resDecodedId.data;
      }
    }

    // 2. Jika tidak ditemukan berdasarkan ID, coba cari berdasarkan slug
    if (!dbItem) {
      try {
        const resSlug = await supabase
          .from("proyek")
          .select("*")
          .eq("slug", rawId)
          .maybeSingle();

        if (resSlug.data) {
          dbItem = resSlug.data;
        } else if (decodedId !== rawId) {
          const resDecodedSlug = await supabase
            .from("proyek")
            .select("*")
            .eq("slug", decodedId)
            .maybeSingle();
          if (resDecodedSlug.data) {
            dbItem = resDecodedSlug.data;
          }
        }
      } catch {
        // Kolom slug mungkin belum ada di beberapa database
      }
    }

    if (dbItem) {
      const cat = (dbItem.category || dbItem.kategori || "web").toLowerCase();
      project = {
        id: String(dbItem.id),
        slug: dbItem.slug || String(dbItem.id),
        title: dbItem.title || dbItem.judul || "Proyek",
        category: (cat === "fullstack"
          ? "fullstack"
          : cat === "frontend"
          ? "frontend"
          : "web") as "web" | "fullstack" | "frontend",
        categoryLabel: dbItem.category_label || dbItem.categoryLabel || dbItem.kategori || "Web",
        description: dbItem.description || dbItem.deskripsi || "",
        fullDescription: dbItem.full_description || dbItem.description || dbItem.deskripsi || "",
        image: dbItem.image || "/images/managemens.png",
        techStack: Array.isArray(dbItem.tech_stack)
          ? dbItem.tech_stack
          : typeof dbItem.tech_stack === "string"
          ? dbItem.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean)
          : typeof dbItem.teknologi === "string"
          ? dbItem.teknologi.split(",").map((t: string) => t.trim()).filter(Boolean)
          : [],
        features: Array.isArray(dbItem.features)
          ? dbItem.features
          : typeof dbItem.features === "string"
          ? dbItem.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
          : [
              "Desain antarmuka responsif dan modern",
              "Terintegrasi dengan database cloud Supabase",
              "Optimasi performa dengan Next.js Server Components",
            ],
        demoUrl: dbItem.demo_url || dbItem.link_deploy || dbItem.link || "",
        githubUrl: dbItem.github_url || dbItem.link || "",
      };
    }
  } catch (err) {
    console.error("Error fetching project detail:", err);
  }

  // Fallback ke data statis
  if (!project) {
    project = projects.find(
      (p) =>
        p.id === rawId ||
        p.id === decodedId ||
        p.slug === rawId ||
        p.slug === decodedId
    );
  }

  if (!project) {
    notFound();
  }

  // Other projects for seamless switching (bisa dari Supabase atau fallback)
  let allList: ProjectItem[] = projects;
  try {
    const { data: dbList } = await supabase
      .from("proyek")
      .select("*")
      .order("id", { ascending: true });
    if (dbList && dbList.length > 0) {
      allList = dbList.map((item) => ({
        id: String(item.id),
        slug: item.slug || String(item.id),
        title: item.title || item.judul || "Proyek",
        category: (item.category || item.kategori || "web").toLowerCase() as "web" | "fullstack" | "frontend",
        categoryLabel: item.category_label || item.kategori || "Web",
        description: item.description || item.deskripsi || "",
        fullDescription: item.full_description || item.description || item.deskripsi || "",
        image: item.image || "/images/managemens.png",
        techStack: [],
        features: [],
        demoUrl: item.demo_url || item.link_deploy || item.link || "",
        githubUrl: item.github_url || item.link || "",
      }));
    }
  } catch {}
  const otherProjects = allList.filter((p) => p.id !== project?.id && p.slug !== project?.slug);

  return (
    <>
      <Navbar />

      <main className="min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl space-y-8">
          
          {/* Top Breadcrumbs & Navigation Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
              <Link href="/" className="hover:underline">
                Beranda
              </Link>
              <span>/</span>
              <Link href="/project" className="hover:underline">
                Katalog Proyek
              </Link>
              <span>/</span>
              <span className="font-semibold truncate max-w-[200px]" style={{ color: "var(--accent)" }}>
                {project.title}
              </span>
            </div>

            <Link
              href="/project"
              className="inline-flex items-center gap-1.5 font-medium hover:underline"
              style={{ color: "var(--accent)" }}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Kembali ke Katalog
            </Link>
          </div>

          {/* Project Title & Meta Banner */}
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border" style={{ borderColor: "var(--border)", background: "var(--bg-soft)", color: "var(--accent)" }}>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Studi Kasus • Proyek #{project.id}</span>
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight leading-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
            >
              {project.title}
            </h1>

            <p className="text-sm sm:text-base leading-relaxed max-w-3xl" style={{ color: "var(--text-muted)" }}>
              {project.description}
            </p>

            {/* Quick Specification Grid */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 sm:p-5 rounded-2xl border"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Kategori
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>
                  {project.categoryLabel}
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Peran
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>
                  Siswi RPL / Developer
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Tahun
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5" style={{ color: "var(--text)" }}>
                  2025
                </p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Status
                </p>
                <p className="text-xs sm:text-sm font-semibold mt-0.5 text-emerald-600 dark:text-emerald-400">
                  Completed / Ready
                </p>
              </div>
            </div>
          </div>

          {/* Browser Mockup Showcase Frame */}
          <div
            className="rounded-2xl sm:rounded-3xl border overflow-hidden shadow-xl bg-slate-950"
            style={{ borderColor: "var(--border)" }}
          >
            {/* Window Titlebar */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800 bg-slate-900">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-slate-800/80 text-center text-xs font-mono text-slate-400 truncate">
                mela-portfolio.local/showcase/{project.slug}
              </div>
            </div>

            {/* High-Resolution Screenshot */}
            <div className="relative aspect-[16/9] w-full overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 900px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Detailed Narrative Section */}
          <div className="grid md:grid-cols-3 gap-8 pt-4">
            {/* Left 2 Cols: Story & Features */}
            <div className="md:col-span-2 space-y-8">
              {/* Latar Belakang & Solusi */}
              <div
                className="rounded-3xl border p-6 sm:p-8 space-y-3"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h2
                  className="text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "var(--accent)" }}
                >
                  <Code2 className="w-4 h-4" />
                  Latar Belakang &amp; Solusi
                </h2>
                <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {project.fullDescription}
                </p>
              </div>

              {/* Fitur Unggulan (Feature Grid) */}
              <div
                className="rounded-3xl border p-6 sm:p-8 space-y-4"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h2
                  className="text-lg font-bold uppercase tracking-wider flex items-center gap-2"
                  style={{ color: "var(--text)" }}
                >
                  <Layers className="w-4 h-4" style={{ color: "var(--accent)" }} />
                  Fitur Unggulan Sistem
                </h2>

                <div className="grid sm:grid-cols-2 gap-3 pt-1">
                  {project.features.map((feat, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm leading-relaxed"
                      style={{
                        background: "var(--bg-soft)",
                        borderColor: "var(--border)",
                        color: "var(--text)",
                      }}
                    >
                      <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 1 Col: Tech Stack & Actions */}
            <div className="space-y-6">
              {/* Tech Stack Box */}
              <div
                className="rounded-3xl border p-6 space-y-4"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                  Teknologi Terapan
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1.5 rounded-xl border font-medium flex items-center gap-1.5"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--bg-soft)",
                        color: "var(--text)",
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links Box */}
              <div
                className="rounded-3xl border p-6 space-y-4"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text)" }}>
                    Status Proyek
                  </h3>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Proyek ini saat ini berstatus <strong>arsip internal / offline showcase</strong> dan belum dideploy ke domain publik.
                </p>

                <div className="pt-2 space-y-2">
                  <Link
                    href="/#contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
                    style={{ background: "var(--accent)" }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Tanyakan Proyek Ini
                  </Link>

                  <Link
                    href="/project"
                    className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-center border transition-all hover:bg-slate-50 dark:hover:bg-slate-800"
                    style={{
                      borderColor: "var(--border)",
                      color: "var(--text)",
                    }}
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Lihat Proyek Lainnya
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Switcher to other projects */}
          <div className="pt-8 border-t" style={{ borderColor: "var(--border)" }}>
            <h3 className="text-xs uppercase font-bold tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
              Eksplorasi Karya Lainnya:
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              {otherProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/project/${item.id}`}
                  className="group rounded-2xl border p-4 flex items-center gap-4 transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  <div className="relative w-16 h-14 rounded-xl overflow-hidden shrink-0 border" style={{ borderColor: "var(--border)" }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase font-semibold" style={{ color: "var(--accent)" }}>
                      Proyek #{item.id} • {item.categoryLabel}
                    </p>
                    <h4 className="text-sm font-bold truncate mt-0.5" style={{ color: "var(--text)" }}>
                      {item.title}
                    </h4>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 shrink-0" style={{ color: "var(--accent)" }} />
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
