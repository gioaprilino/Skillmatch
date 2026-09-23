import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { PWARegistration } from '@/components/pwa-registration';
import { NavigationProgressBar } from '@/components/navigation-progress';
import { auth } from '@/lib/auth';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await auth();
  } catch {
    // Session fallback for static/offline render
  }

  return (
    <html lang="id" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
        <style dangerouslySetInnerHTML={{ __html: `:root{--font-inter:'Inter',system-ui,sans-serif;--font-jetbrains-mono:'JetBrains Mono',monospace;}` }} />
      </head>
      <body className="font-sans antialiased">
        <a href="#main-content" className="skip-link">
          Lewati ke konten utama
        </a>
        <Providers session={session}>
          <NavigationProgressBar />
          {children}
          <PWARegistration />
        </Providers>
      </body>
    </html>
  );
}