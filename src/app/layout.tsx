import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import BackgroundVideo from "@/components/BackgroundVideo";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://asri-mela.my.id';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Asri Mela Aldian Syah — Website Profil & Portfolio',
    template: '%s | Asri Mela Aldian Syah',
  },
  description:
    'Portofolio siswa SMK Rekayasa Perangkat Lunak (RPL), dibangun dengan Next.js, Tailwind CSS, dan Supabase.',
  keywords: [
    'Asri Mela Aldian Syah',
    'Asri Mela',
    'Mela',
    'Portfolio Asri Mela',
    'Portofolio Siswa SMK',
    'Rekayasa Perangkat Lunak',
    'RPL SMK',
    'Web Developer',
    'Frontend Developer',
    'Fullstack Developer Junior',
    'Next.js 16 Portfolio',
    'React 19 Developer',
    'Tailwind CSS',
    'Supabase Database',
    'Junior Web Developer Indonesia',
    'Student Portfolio',
    'Autograph Portfolio',
  ],
  authors: [{ name: 'Asri Mela Aldian Syah', url: siteUrl }],
  creator: 'Asri Mela Aldian Syah',
  publisher: 'Asri Mela Aldian Syah',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'Asri Mela Aldian Syah — Website Profil & Portfolio',
    description:
      'Portofolio siswa SMK Rekayasa Perangkat Lunak, dibangun dengan Next.js dan Supabase.',
    url: siteUrl,
    siteName: 'Portfolio Asri Mela Aldian Syah',
    locale: 'id_ID',
    type: 'website',
    images: [
      {
        url: `${siteUrl}/images/autograph.jpg`,
        secureUrl: `${siteUrl}/images/autograph.jpg`,
        width: 1024,
        height: 764,
        type: 'image/jpeg',
        alt: 'Official Autograph Asri Mela — Crafted with love & quiet thoughts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Asri Mela Aldian Syah — Website Profil & Portfolio',
    description:
      'Portofolio siswa SMK Rekayasa Perangkat Lunak (RPL), dibangun dengan Next.js dan Supabase.',
    images: [`${siteUrl}/images/autograph.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const isDark = theme === 'dark';
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`${cormorant.variable} ${manrope.variable}`}>
        <BackgroundVideo />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Asri Mela Aldian Syah',
              alternateName: 'Asri Mela',
              url: siteUrl,
              jobTitle: 'Web Developer',
              description:
                'Siswa Rekayasa Perangkat Lunak (RPL) & Web Developer yang berfokus pada Next.js, React, dan Supabase.',
              knowsAbout: [
                'Next.js',
                'React',
                'TypeScript',
                'Tailwind CSS',
                'Supabase',
                'Web Development',
                'Software Engineering',
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
