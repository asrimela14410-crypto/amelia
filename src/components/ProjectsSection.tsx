import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, CheckCircle2, Code2, Sparkles } from "lucide-react";
import { projects as fallbackProjects, ProjectItem } from "../../data";
import { supabase } from "@/lib/supabase";

export default async function ProjectsSection() {
  let activeProjects: ProjectItem[] = fallbackProjects;
  try {
    const { data: dbProjects } = await supabase
      .from("proyek")
      .select("*")
      .order("created_at", { ascending: false });

    if (dbProjects && dbProjects.length > 0) {
      activeProjects = dbProjects.map((item) => {
        const cat = (item.category || item.kategori || "web").toLowerCase();
        return {
          id: String(item.id),
          slug: item.slug || String(item.id),
          title: item.title || item.judul || "Proyek",
          category: (cat === "fullstack"
            ? "fullstack"
            : cat === "frontend"
            ? "frontend"
            : "web") as "web" | "fullstack" | "frontend",
          categoryLabel: item.category_label || item.categoryLabel || item.kategori || "Web",
          description: item.description || item.deskripsi || "",
          fullDescription: item.full_description || item.description || item.deskripsi || "",
          image: item.image || "/images/managemens.png",
          techStack: Array.isArray(item.tech_stack)
            ? item.tech_stack
            : typeof item.tech_stack === "string"
            ? item.tech_stack.split(",").map((t: string) => t.trim()).filter(Boolean)
            : typeof item.teknologi === "string"
            ? item.teknologi.split(",").map((t: string) => t.trim()).filter(Boolean)
            : [],
          features: Array.isArray(item.features)
            ? item.features
            : typeof item.features === "string"
            ? item.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
            : [
                "Desain antarmuka responsif dan modern",
                "Terintegrasi dengan database cloud Supabase",
                "Optimasi performa dengan Next.js Server Components",
              ],
          demoUrl: item.demo_url || item.link_deploy || item.link || "",
          githubUrl: item.github_url || item.link || "",
        };
      });
    }
  } catch {
    // fallback to static projects
  }

  const featuredProject = activeProjects[0] || fallbackProjects[0];
  const secondaryProjects = activeProjects.slice(1);

  return (
    <section id="projects" className="section-pad relative overflow-hidden">
      <div className="container-custom relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-8 h-[1px]" style={{ background: "var(--accent)" }} />
              <span
                className="text-[11px] tracking-[0.25em] uppercase font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Showcase Proyek
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
            >
              Karya &amp; <span style={{ color: "var(--accent)" }}>Eksplorasi Teknologi</span>
            </h2>
          </div>

          <Link
            href="/project"
            className="group inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-all hover:gap-3"
            style={{ color: "var(--accent)" }}
          >
            <span>Katalog Seluruh Proyek</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* 1. SPOTLIGHT FEATURED PROJECT (Asymmetric Hero Showcase) */}
        <div
          className="rounded-3xl border p-6 sm:p-8 lg:p-10 mb-8 transition-all duration-300 shadow-sm hover:shadow-lg"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            {/* Left: Browser Window Mockup Frame */}
            <div className="lg:col-span-7">
              <div
                className="rounded-2xl border overflow-hidden shadow-md bg-slate-950 group"
                style={{ borderColor: "var(--border)" }}
              >
                {/* Browser Top Bar */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-800/80 bg-slate-900/90">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                  <div className="flex-1 mx-3 px-3 py-1 rounded-md bg-slate-800/60 text-[11px] font-mono text-slate-400 truncate">
                    mela.dev/projects/{featuredProject.slug}
                  </div>
                </div>

                {/* Screenshot */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={featuredProject.image}
                    alt={featuredProject.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wider uppercase backdrop-blur-md border text-white"
                    style={{
                      background: "rgba(15, 23, 42, 0.75)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    ★ Featured Project
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Project Highlights & Narrative */}
            <div className="lg:col-span-5 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Proyek Unggulan 01</span>
              </div>

              <h3
                className="text-2xl sm:text-3xl font-medium leading-tight"
                style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
              >
                {featuredProject.title}
              </h3>

              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {featuredProject.fullDescription}
              </p>

              {/* Key Highlights */}
              <div className="space-y-2 pt-1">
                {featuredProject.features.slice(0, 2).map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs" style={{ color: "var(--text)" }}>
                    <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--accent)" }} />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              {/* Tech Stack Badges */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {featuredProject.techStack.map((tech, i) => (
                  <span
                    key={i}
                    className="text-xs px-3 py-1 rounded-lg border font-medium"
                    style={{
                      borderColor: "var(--border)",
                      background: "var(--bg-soft)",
                      color: "var(--text)",
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  href={`/project/${featuredProject.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "var(--accent)" }}
                >
                  <span>Studi Kasus &amp; Detail</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>

                <div
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium border"
                  style={{
                    borderColor: "var(--border)",
                    background: "var(--bg-soft)",
                    color: "var(--text-muted)",
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Proyek Internal (Belum Dideploy)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. SECONDARY PROJECTS (Dual Showcase Cards) */}
        <div className="grid md:grid-cols-2 gap-8">
          {secondaryProjects.map((project, idx) => (
            <div
              key={project.id}
              className="group rounded-3xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                {/* Mockup Frame */}
                <div
                  className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border mb-5 bg-slate-900"
                  style={{ borderColor: "var(--border)" }}
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase backdrop-blur-md border text-white"
                    style={{
                      background: "rgba(15, 23, 42, 0.75)",
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    Proyek 0{idx + 2} • {project.categoryLabel}
                  </span>
                </div>

                <h3
                  className="text-xl sm:text-2xl font-medium mb-2.5 transition-colors"
                  style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
                >
                  {project.title}
                </h3>

                <p
                  className="text-sm leading-relaxed mb-5 line-clamp-2"
                  style={{ color: "var(--text-muted)" }}
                >
                  {project.description}
                </p>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.techStack.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-0.5 rounded-md border font-medium"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--bg-soft)",
                        color: "var(--text)",
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="pt-4 border-t flex items-center justify-between"
                style={{ borderColor: "var(--border)" }}
              >
                <Link
                  href={`/project/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold transition-all hover:gap-2"
                  style={{ color: "var(--accent)" }}
                >
                  <span>Lihat Detail Studi Kasus</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <span
                  className="text-[11px] px-2 py-0.5 rounded-md border font-medium text-slate-500 dark:text-slate-400"
                  style={{ borderColor: "var(--border)", background: "var(--bg-soft)" }}
                >
                  Showcase Only
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
