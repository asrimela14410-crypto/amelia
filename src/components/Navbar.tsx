"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, Sun, X } from "lucide-react";

const NAV_ITEMS = [
  { label: "Beranda", targetId: "home" },
  { label: "Tentang", targetId: "about" },
  { label: "Keahlian", targetId: "skills" },
  { label: "Proyek", targetId: "projects" },
  { label: "Kontak", targetId: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Initial theme check
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      if (!isHomePage) return;

      // Spy scroll for active navigation item on homepage
      const sections = NAV_ITEMS.map((item) => item.targetId);
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Smooth scroll saat user pindah dari halaman sub (detail proyek) ke homepage dengan hash (#about, #contact, dll)
  useEffect(() => {
    if (isHomePage && typeof window !== "undefined" && window.location.hash) {
      const hashId = window.location.hash.substring(1);
      const target = document.getElementById(hashId);
      if (target) {
        const timer = setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth" });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
  }, [isHomePage, pathname]);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const getNavHref = (targetId: string) => {
    return isHomePage ? `#${targetId}` : `/#${targetId}`;
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled
          ? "backdrop-blur-xl shadow-sm"
          : "border-transparent"
      }`}
      style={{
        background: isScrolled ? "var(--nav-bg)" : "transparent",
        borderColor: isScrolled ? "var(--border)" : "transparent",
      }}
    >
      <nav className="container-custom flex items-center justify-between h-16 md:h-20">
        {isHomePage ? (
          <a
            href="#home"
            className="text-xl md:text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
          >
            Mela<span style={{ color: "var(--accent)" }}>.</span>
          </a>
        ) : (
          <Link
            href="/"
            className="text-xl md:text-2xl font-semibold tracking-tight"
            style={{ fontFamily: "var(--font-cormorant)", color: "var(--text)" }}
          >
            Mela<span style={{ color: "var(--accent)" }}>.</span>
          </Link>
        )}

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive = isHomePage
              ? activeSection === item.targetId
              : item.targetId === "projects" &&
                (pathname.startsWith("/project") || pathname.startsWith("/proyek"));
            const targetHref = getNavHref(item.targetId);

            return (
              <li key={item.targetId}>
                {isHomePage ? (
                  <a
                    href={targetHref}
                    className={`text-sm transition-all relative py-2 font-medium ${
                      isActive
                        ? "opacity-100"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 h-px"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </a>
                ) : (
                  <Link
                    href={targetHref}
                    className={`text-sm transition-all relative py-2 font-medium ${
                      isActive
                        ? "opacity-100"
                        : "opacity-70 hover:opacity-100"
                    }`}
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        className="absolute -bottom-0.5 left-0 right-0 h-px"
                        style={{ background: "var(--accent)" }}
                      />
                    )}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          >
            {isDark ? (
              <Sun className="w-4 h-4 transition-transform rotate-0 scale-100" />
            ) : (
              <Moon className="w-4 h-4 transition-transform rotate-0 scale-100" />
            )}
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
            className="md:hidden w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 cursor-pointer"
            style={{
              borderColor: "var(--border)",
              background: "var(--surface)",
              color: "var(--text)",
            }}
          >
            {mobileMenuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 border-t ${
          mobileMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <ul className="container-custom py-4 flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = isHomePage
              ? activeSection === item.targetId
              : item.targetId === "projects" &&
                (pathname.startsWith("/project") || pathname.startsWith("/proyek"));
            const targetHref = getNavHref(item.targetId);

            return (
              <li key={item.targetId}>
                {isHomePage ? (
                  <a
                    href={targetHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    href={targetHref}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
}
