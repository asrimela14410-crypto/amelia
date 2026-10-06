import {
  Briefcase,
  Coffee,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Terminal,
} from "lucide-react"


import {
  Code2,
  Database,
  Globe,
  Layout,
  Palette,
  Server,
  Smartphone,
} from "lucide-react"
import type { IconType } from "react-icons"

type SocialLink = {
  icon: IconType
  label: string
  value?: string
  href: string
}


export const stats = [
  { label: "Years Experience", value: "1+" },
  { label: "Projects Completed", value: "4+" },
  { label: "Happy Clients", value: "2+" },
  { label: "Students Taught", value: "0" },
]

export const highlights = [
  { icon: MapPin, text: "Based in Indonesia" },
  { icon: Briefcase, text: "Open for freelance work" },
  { icon: GraduationCap, text: "RPL Student" },
  {
    icon: Coffee,
    text: "Finding details that others sometimes overlook",
  },
]

export const skillCategories = [
  {
    title: "Frontend",
    skills: [
      { name: "React", icon: Code2 },
      { name: "Next.js", icon: Globe },
      { name: "TypeScript", icon: Terminal },
      { name: "Tailwind CSS", icon: Palette },
      { name: "React Native", icon: Smartphone },
      { name: "Vue.js", icon: Layout },
    ],
  },

  {
    title: "Backend",
    skills: [
      { name: "Node.js", icon: Server },
      { name: "Express.js", icon: Server },
      { name: "REST API", icon: Globe },
      { name: "MySQL", icon: Database },
      { name: "MongoDB", icon: Database },
    ],
  },

  {
    title: "Others",
    skills: [
      { name: "Git", icon: Code2 },
      { name: "GitHub", icon: Globe },
      { name: "Figma", icon: Palette },
      { name: "VS Code", icon: Terminal },
    ],
  },
]

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  category: "web" | "fullstack" | "frontend";
  categoryLabel: string;
  description: string;
  fullDescription: string;
  image: string;
  techStack: string[];
  features: string[];
  demoUrl: string;
  githubUrl: string;
};

export const projects: ProjectItem[] = [
  {
    id: "1",
    slug: "management-siswa",
    title: "Student Management System",
    category: "fullstack",
    categoryLabel: "Fullstack Web",
    description:
      "Sistem management sekolah komprehensif untuk menilai, mencatat, dan mengelola data seluruh murid secara terstruktur.",
    fullDescription:
      "Dirancang untuk mengatasi hambatan administratif di lingkungan sekolah kejuruan, sistem ini mengotomatiskan pencatatan data siswa, siklus penilaian akademik, dan pemantauan presensi harian. Dibangun dengan Next.js App Router dan Supabase PostgreSQL dengan perlindungan hak akses data berbasis peran (Role-Based Access).",
    image: "/images/managemens.png",
    techStack: ["Next.js", "Tailwind CSS", "Shadcn UI", "Supabase", "TypeScript"],
    features: [
      "Role-based authentication & permissions untuk guru dan staf tata usaha",
      "Kalkulasi penilaian akademik otomatis dan arsip riwayat nilai siswa",
      "Pencatatan presensi siswa real-time dan ekspor laporan berkala",
      "Database PostgreSQL performa tinggi yang diamankan dengan Row Level Security",
    ],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "2",
    slug: "management-magang",
    title: "Internship Management System",
    category: "web",
    categoryLabel: "Web Platform",
    description:
      "Platform koordinasi terpadu untuk monitoring magang siswa SMK bersama guru pembimbing dan mitra industri (DUDI).",
    fullDescription:
      "Platform koordinasi terpadu yang menjembatani siswa magang SMK, guru pembimbing, dan mitra dunia usaha/dunia industri (DUDI). Memudahkan pengisian jurnal logbook harian, verifikasi presensi kerja lapangan, serta evaluasi performa magang secara terpusat dan transparan.",
    image: "/images/managementm.png",
    techStack: ["Next.js", "Tailwind CSS", "Shadcn UI", "Supabase", "TypeScript"],
    features: [
      "Jurnal logbook harian siswa dengan status approval pembimbing industri",
      "Monitoring kehadiran magang berbasis jadwal kerja mitra DUDI",
      "Evaluasi & penilaian kompetensi kerja industri langsung oleh mentor perusahaan",
      "Dashboard analitik kemajuan magang untuk guru pembimbing sekolah",
    ],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "3",
    slug: "my-app",
    title: "Developer Workspace & Playground",
    category: "frontend",
    categoryLabel: "Frontend App",
    description:
      "Ruang eksperimen frontend interaktif untuk menguji coba arsitektur React terkini, custom hooks, dan komponen dinamis.",
    fullDescription:
      "Ruang eksperimen frontend interaktif yang dibangun untuk mengeksplorasi fitur-fitur mutakhir Next.js, custom hooks, dynamic routing, micro-interactions, serta perancangan komponen UI modern yang siap pakai dan reusable sebelum diimplementasikan ke proyek berskala besar.",
    image: "/images/My app.png",
    techStack: ["Next.js", "Tailwind CSS", "Shadcn UI", "TypeScript", "Lucide Icons"],
    features: [
      "Eksperimen custom hooks untuk manajemen interaksi dinamis",
      "Integrasi micro-interactions dan animasi antarmuka responsif",
      "Struktur modular clean architecture dan reusable component pattern",
      "Optimasi bundle Next.js dan pengujian performa render React",
    ],
    demoUrl: "#",
    githubUrl: "#",
  },
  {
    id: "4",
    slug: "Internet Afting",
    title: "Pelajar / Game Rental Platform",
    category: "fullstack",
    categoryLabel: "Fullstack Web",
    description:
      "A feature-rich web portal for secure, automated game account rentals with an intuitive user interface and real-time management.",
    fullDescription:
      "Platform portal persewaan akun game digital yang aman dan otomatis dengan antarmuka pengguna yang intuitif, integrasi database Supabase, dan manajemen akun secara real-time.",
    image: "/images/pinjam.png",
    techStack: ["Next.js", "Tailwind CSS", "Shadcn UI", "Supabase", "TypeScript"],
    features: [
      "Sistem peminjaman dan persewaan akun terverifikasi",
      "Manajemen status akun dan riwayat transaksi pengguna",
      "Integrasi database real-time dengan perlindungan Row Level Security",
      "Antarmuka responsif dan ramah pengguna",
    ],
    demoUrl: "#",
    githubUrl: "#",
  },
];

export const userReviewData = [
  {
    id: 1,
    name: "a***l",
    profession: "Client",
    userImage: "/images/ADEL JKT48.jpg",
    review:
      "Membantu menyelesaikan kebutuhan project dengan baik dan sesuai dengan yang dibutuhkan.",
  },
  {
    id: 2,
    name: "Er**e",
    profession: "Client",
    userImage: "/images/Erine.jpg",
    review:
      "Pengerjaan project berjalan dengan baik dan hasilnya sesuai dengan kebutuhan.",
  },
  {
    id: 3,
    name: "Ol**e",
    profession: "Client",
    userImage: "/images/Oline Trainee JKT48.jpg",
    review:
      "Hasil project cukup rapi dan membantu menyelesaikan kebutuhan yang diperlukan.",
  },
  {
    id: 4,
    name: "k***y",
    profession: "Client",
    userImage: "/images/Kimmy JKT48.jpg",
    review:
      "Hasil project sesuai yang di minta dengan harga yang worth it",
  },
]

export const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "asrimela14410@gmail.com",
    href: "mailto:asrimela14410@gmail.com",
  },
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 881-7047-793",
    href: "https://wa.me/628817047793",
  },
]

export const education = [
  {
    school: "Software Engineering School",
    major: "Rekayasa Perangkat Lunak (RPL)",
    startYear: "2025",
    endYear: "Present",
  },
]

export const aboutMe = {
  name: "Asri Mela Aldian Syah",
  nickname: "Mela",
  role: "RPL Student & Aspiring Web Developer",
  location: "Indonesia",
  quote:
    "Small steps, consistent learning, and thoughtful work create meaningful results.",
  description:
    "Saya adalah Asri Mela Aldian Syah, seorang siswi Rekayasa Perangkat Lunak yang tertarik mempelajari dunia teknologi dan pengembangan website. Saya senang mengeksplorasi hal-hal baru, belajar membuat tampilan yang menarik, serta mengembangkan kemampuan secara bertahap melalui berbagai project.",
}

export const socialLinks: SocialLink[] = []
export const footerSocialLinks: SocialLink[] = []
export const experiences = [
  {
    type: "work",
    title: "Web Developer",
    company: "Personal Projects",
    period: "2025 - Present",
    description:
      "Membangun berbagai project website untuk mengembangkan kemampuan dalam frontend dan backend development.",
    technologies: [
      "Next.js",
      "React",
      "Tailwind CSS",
      "TypeScript",
    ],
  },

  {
    type: "project",
    title: "Management Siswa",
    company: "Personal Project",
    period: "2025",
    description:
      "Mengembangkan sistem management sekolah untuk membantu mengelola dan menilai data seluruh siswa.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Shadcn UI",
      "Supabase",
    ],
  },

  {
    type: "project",
    title: "Management Magang",
    company: "Personal Project",
    period: "2025",
    description:
      "Membangun sistem management magang untuk membantu pengelolaan siswa SMK, guru, dan DUDI.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Shadcn UI",
      "Supabase",
    ],
  },

  {
    type: "project",
    title: "Game Account Rental Platform",
    company: "Personal Project",
    period: "2025",
    description:
      "Mengembangkan website untuk melakukan peminjaman akun game dengan tampilan modern dan sistem yang mudah digunakan.",
    technologies: [
      "Next.js",
      "Tailwind CSS",
      "Shadcn UI",
      "Supabase",
    ],
  },

  {
    type: "education",
    title: "Software Engineering Student",
    company: "Software Engineering School",
    period: "2025 - Present",
    description:
      "Mempelajari pengembangan perangkat lunak, website development, database, dan berbagai teknologi modern untuk membangun aplikasi.",
    technologies: [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "Next.js",
    ],
  },
]
