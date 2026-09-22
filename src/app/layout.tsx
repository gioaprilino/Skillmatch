import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { PWARegistration } from '@/components/pwa-registration';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'SkillMatch - Platform Upskilling & Lowongan Kerja untuk TKI',
    template: '%s | SkillMatch',
  },
  description: 'Platform terintegrasi untuk upskilling, pencocokan lowongan kerja, verifikasi kredensial berbasis blockchain, dan literasi keuangan bagi TKI dan tenaga kerja informal.',
  keywords: ['TKI', 'PMI', 'lowongan kerja', 'upskilling', 'sertifikasi', 'verifiable credentials', 'migrasi kerja'],
  authors: [{ name: 'SkillMatch Team' }],
  creator: 'SkillMatch',
  publisher: 'SkillMatch',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://skillmatch.id',
    siteName: 'SkillMatch',
    title: 'SkillMatch - Platform Upskilling & Lowongan Kerja untuk TKI',
    description: 'Platform terintegrasi untuk upskilling, pencocokan lowongan kerja, verifikasi kredensial berbasis blockchain, dan literasi keuangan bagi TKI.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'SkillMatch Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SkillMatch - Platform Upskilling & Lowongan Kerja untuk TKI',
    description: 'Platform terintegrasi untuk upskilling, pencocokan lowongan kerja, verifikasi kredensial berbasis blockchain, dan literasi keuangan bagi TKI.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <Providers>
          {children}
          <PWARegistration />
        </Providers>
      </body>
    </html>
  );
}