import { Code2, Palette, ShieldCheck } from "lucide-react";

export default function AboutSection() {
  const learningItems = [
    {
      icon: Code2,
      title: "Frontend Development",
      description: "HTML, CSS, JavaScript, React, Next.js, dan Tailwind CSS.",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Belajar membuat tampilan yang rapi, modern, estetis, dan nyaman digunakan.",
    },
    {
      icon: ShieldCheck,
      title: "Software Engineering & Testing",
      description: "Mengeksplorasi penulisan kode yang bersih, pencegahan bug, dan dasar backend.",
    },
  ];

  return (
    <section id="about" className="section-pad relative overflow-hidden">
      <div className="container-custom relative">
        {/* Section Header Indicator */}
        <div className="flex items-center gap-3 mb-12">
          <span className="w-8 h-[1px]" style={{ background: "var(--accent)" }} />
          <span
            className="text-[11px] tracking-[0.3em] uppercase font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            About Me
          </span>
        </div>

        {/* Top 2-Column Story */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Title */}
          <div className="lg:col-span-5">
            <h2
              className="text-4xl sm:text-5xl lg:text-[3.2rem] leading-[1.1] font-medium"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
            >
              Still learning,<br />
              <span className="italic" style={{ color: "var(--accent)" }}>
                always building.
              </span>
            </h2>
            <div className="mt-8 flex items-center gap-2">
              <span className="w-12 h-[2px]" style={{ background: "var(--accent)" }} />
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent)", opacity: 0.5 }}
              />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:col-span-7 space-y-5 lg:pt-2">
            <p className="text-base sm:text-lg leading-relaxed" style={{ color: "var(--text)" }}>
              Saya adalah siswi jurusan Rekayasa Perangkat Lunak (RPL). Sehari-hari saya belajar
              mengembangkan website — mulai dari merancang antarmuka yang ramah pengguna hingga menulis
              kode frontend dan eksplorasi backend.
            </p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Saya sangat menyukai proses ketika sebuah rancangan ide bertransformasi menjadi halaman web
              yang interaktif dan bermanfaat bagi banyak orang. Walaupun masih terus belajar, saya senang
              mencoba teknologi-teknologi modern.
            </p>
            <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--text-muted)" }}>
              Selain ngoding, saya senang memperhatikan detail-detail kecil visual yang kerap terlewatkan
              untuk memastikan website tidak hanya berjalan optimal, tetapi juga menghadirkan pengalaman
              yang berkesan.
            </p>

            {/* 4 Metadata Stats */}
            <div
              className="grid grid-cols-2 gap-x-6 gap-y-4 pt-6 mt-6 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                  Fokus
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Web Development
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                  Sekarang
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Pelajar RPL
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                  Tinggal di
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Indonesia
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] uppercase mb-1" style={{ color: "var(--text-muted)" }}>
                  Bahasa
                </p>
                <p className="text-sm font-medium" style={{ color: "var(--text)" }}>
                  Indonesia &amp; English
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-Cards: Sedang Dipelajari */}
        <div className="mt-20 lg:mt-28">
          <div className="mb-10">
            <p
              className="text-[11px] tracking-[0.3em] uppercase mb-2 font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Sedang Dipelajari
            </p>
            <h3
              className="text-3xl sm:text-4xl font-medium"
              style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
            >
              Hal-hal yang lagi saya tekuni
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {learningItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="group relative p-6 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: "var(--surface)",
                    borderColor: "var(--border)",
                  }}
                >
                  {/* Hover Radial Flare */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: "radial-gradient(circle at top right, var(--accent-soft), transparent 70%)",
                    }}
                  />

                  <div className="relative">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-all duration-500 group-hover:rotate-[-6deg] group-hover:scale-110"
                      style={{
                        background: "var(--accent-soft)",
                        color: "var(--accent)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4
                      className="text-lg font-medium mb-2"
                      style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
                    >
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Expanding bottom accent line */}
                  <span
                    className="absolute bottom-0 left-0 right-0 h-[2px] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"
                    style={{ background: "var(--accent)" }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
