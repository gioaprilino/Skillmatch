'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  ArrowRight,
  Users,
  Award,
  Shield,
  TrendingUp,
  Globe,
  BookOpen,
  Briefcase,
  PiggyBank,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Menu,
  X,
  Sparkles,
  MapPin,
  DollarSign,
  Clock,
  HelpCircle,
  FileCheck2,
  Lock,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: BookOpen,
    title: 'Upskilling Terstruktur',
    desc: 'Kurikulum berbasis standar internasional (SKKNI & BNSP) dengan modul SOP interaktif dan asesmen kompetensi bersertifikat.',
    highlight: '50+ Skill & SOP',
    href: '/upskilling/assessments',
    actionText: 'Pelajari Materi & Asesmen',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    icon: Briefcase,
    title: 'Job Matching AI',
    desc: 'Algoritma cerdas yang mencocokkan profil Anda dengan 3,200+ lowongan kerja resmi luar negeri berdasarkan skill, gaji, dan bahasa.',
    highlight: 'Match Score Transparan',
    href: '/jobs',
    actionText: 'Jelajahi Lowongan Kerja',
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    icon: Award,
    title: 'Verifiable Credentials (VC)',
    desc: 'Sertifikat digital terenkripsi standar W3C + Ed25519 kriptografis. Bebas risiko pemalsuan dan dapat diverifikasi instan via QR code.',
    highlight: 'W3C Standar Global',
    href: '/verify',
    actionText: 'Cek & Verifikasi Sertifikat',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    icon: Globe,
    title: 'Migration Checklist',
    desc: 'Panduan lengkap legalitas migrasi kerja untuk 10+ negara: visa, paspor, tes medis FOMEMA, asuransi WICA/SOCSO, dan hotline KBRI.',
    highlight: '10+ Negara Penempatan',
    href: '/dashboard/migration',
    actionText: 'Buka Panduan Checklist',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
  {
    icon: PiggyBank,
    title: 'Financial Literacy & Remittance',
    desc: 'Kalkulator pengiriman uang berizin Bank Indonesia, alokasi tabungan modal usaha 40/35/25, dan edukasi anti-investasi bodong.',
    highlight: 'Kalkulator Kurs Cerdas',
    href: '/dashboard/finance',
    actionText: 'Buka Kalkulator Finansial',
    color: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
  },
  {
    icon: Users,
    title: 'Komunitas & Bantuan Hukum',
    desc: 'Forum sesama PMI, advokasi ketenagakerjaan, peer support alumni, workshop CV, dan pendampingan resmi perwakilan KBRI.',
    highlight: 'Komunitas Solid',
    href: '/dashboard/community',
    actionText: 'Gabung Forum Komunitas',
    color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
  },
];

const stats = [
  { label: 'Pekerja Terdaftar', value: '12,450+', icon: Users },
  { label: 'Lowongan Aktif', value: '3,200+', icon: Briefcase },
  { label: 'Sertifikat Terbit', value: '8,900+', icon: Award },
  { label: 'Tingkat Penempatan', value: '78%', icon: TrendingUp },
];

const previewJobs = [
  {
    id: 'job-1',
    title: 'Caregiver Lansia Terampil (Nursing Home)',
    country: 'Singapura',
    flag: '🇸🇬',
    company: 'SilverCare SG Healthcare Ltd.',
    salary: 'SGD 1,800 - 2,400 / bln',
    salaryIdr: '~Rp 21.5 - 28.5 Jt',
    skills: ['Caregiving Lansia', 'Tanda Vital', 'Bahasa Inggris'],
    workType: 'Full-time • Kontrak 2 Tahun',
  },
  {
    id: 'job-2',
    title: 'Teknisi Operator Mesin CNC & Bubut',
    country: 'Jepang (Aichi)',
    flag: '🇯🇵',
    company: 'Tanaka Precision Works KK',
    salary: 'JPY 210,000 - 260,000 / bln',
    salaryIdr: '~Rp 22.0 - 27.2 Jt',
    skills: ['Operator Mesin CNC', 'Budaya 5S', 'Bahasa Jepang N4'],
    workType: 'Tokutei Ginou (SSW) • Onsite',
  },
  {
    id: 'job-3',
    title: 'Supervisor Housekeeping Hotel Bintang 5',
    country: 'Malaysia (Kuala Lumpur)',
    flag: '🇲🇾',
    company: 'Grand Meridian Hotels Bhd',
    salary: 'MYR 3,200 - 4,000 / bln',
    salaryIdr: '~Rp 11.2 - 14.0 Jt',
    skills: ['Bed Making', 'Housekeeping', 'Chemical Safety'],
    workType: 'Full-time • Akomodasi Disediakan',
  },
  {
    id: 'job-4',
    title: 'Perawat Lansia Rumahan (Home Caregiver)',
    country: 'Taiwan (Taipei)',
    flag: '🇹🇼',
    company: 'Formosa Eldercare Agency',
    salary: 'TWD 22,000 - 26,000 / bln',
    salaryIdr: '~Rp 11.0 - 13.0 Jt',
    skills: ['Caregiving Lansia', 'Nutrisi Lansia', 'Mandarin Dasar'],
    workType: 'Full-time • Tempat Tinggal + Asuransi NHI',
  },
];

const faqs = [
  {
    q: 'Apakah pendaftaran dan ujian kompetensi untuk calon PMI dipungut biaya?',
    a: 'Sama sekali TIDAK (100% Gratis). SkillMatch berkomitmen memberdayakan pekerja migran Indonesia tanpa pungutan liar atau potongan gaji tersembunyi. Akses materi belajar, tes asesmen, sertifikat digital, dan lamaran lowongan kerja dapat diakses gratis oleh seluruh calon pekerja.',
  },
  {
    q: 'Apa itu Sertifikat Verifiable Credential (VC) berbasis blockchain di SkillMatch?',
    a: 'Verifiable Credential (VC) adalah standar sertifikasi digital global dari World Wide Web Consortium (W3C) yang ditandatangani secara kriptografis menggunakan algoritma Ed25519. Sertifikat ini kebal pemalsuan dan dapat diverifikasi keasliannya secara instan dalam 1 detik oleh employer atau agensi di luar negeri cukup dengan scan QR code di menu Verifikasi.',
  },
  {
    q: 'Bagaimana sistem AI mencocokkan profil saya dengan lowongan luar negeri?',
    a: 'Algoritma Job Matching AI kami menghitung Match Score transparan (0-100%) dengan membandingkan riwayat asesmen kompetensi yang telah Anda selesaikan, sertifikasi terbit, kemampuan bahasa, preferensi negara penempatan, dan ekspektasi gaji Anda.',
  },
  {
    q: 'Negara tujuan mana saja yang tersedia panduannya di Migration Checklist?',
    a: 'Platform kami menyediakan panduan langkah demi langkah resmi untuk lebih dari 10 negara penempatan utama, termasuk Singapura, Malaysia, Taiwan, Hong Kong, Jepang, Korea Selatan, dan Arab Saudi lengkap dengan syarat paspor, visa kerja, tes medis FOMEMA, asuransi kecelakaan kerja resmi (WICA/SOCSO), serta nomor kontak darurat KBRI/KJRI setempat.',
  },
  {
    q: 'Bagaimana majikan atau agensi luar negeri memverifikasi keabsahan sertifikat pekerja?',
    a: 'Pemberi kerja cukup mengakses halaman publik di /verify dan memindai QR code pada sertifikat digital pekerja atau memasukkan Credential ID. Sistem akan langsung memvalidasi tanda tangan kriptografis dan menampilkan rincian kompetensi tanpa perlu konfirmasi manual yang berlarut-larut.',
  },
];

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [legalModal, setLegalModal] = useState<'privacy' | 'terms' | 'about' | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 350);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    targetId: string
  ) => {
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const headerOffset = 76;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${targetId}`);
    }
    setMobileMenuOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Header / Navbar */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
          <Link href="/" className="flex items-center space-x-2.5" aria-label="SkillMatch Home">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Shield className="h-6 w-6" aria-hidden="true" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              SkillMatch
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-7">
            <a
              href="#fitur"
              onClick={(e) => handleSmoothScroll(e, 'fitur')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Fitur Platform
            </a>
            <Link
              href="/jobs"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            >
              Lowongan Kerja
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-primary/15 text-primary">
                3,200+
              </span>
            </Link>
            <Link
              href="/upskilling/assessments"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pelatihan & Tes
            </Link>
            <a
              href="#cara-kerja"
              onClick={(e) => handleSmoothScroll(e, 'cara-kerja')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              Cara Kerja
            </a>
            <Link
              href="/verify"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Verifikasi VC
            </Link>
            <a
              href="#faq"
              onClick={(e) => handleSmoothScroll(e, 'faq')}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              FAQ
            </a>
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm" className="font-semibold text-xs sm:text-sm">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm" className="font-semibold text-xs sm:text-sm rounded-xl">
                Daftar Gratis
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Link href="/auth/login" className="sm:hidden">
              <Button variant="ghost" size="sm" className="text-xs">
                Masuk
              </Button>
            </Link>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card/95 backdrop-blur-md px-4 py-5 space-y-4 animate-in slide-in-from-top duration-200">
            <nav className="flex flex-col space-y-3">
              <a
                href="#fitur"
                onClick={(e) => handleSmoothScroll(e, 'fitur')}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Fitur Platform
              </a>
              <Link
                href="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg flex items-center justify-between"
              >
                <span>Lowongan Kerja</span>
                <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-primary/15 text-primary">
                  3,200+
                </span>
              </Link>
              <Link
                href="/upskilling/assessments"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Pelatihan & Asesmen
              </Link>
              <a
                href="#cara-kerja"
                onClick={(e) => handleSmoothScroll(e, 'cara-kerja')}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Cara Kerja
              </a>
              <Link
                href="/verify"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Verifikasi Sertifikat VC
              </Link>
              <a
                href="#faq"
                onClick={(e) => handleSmoothScroll(e, 'faq')}
                className="p-2 text-sm font-medium text-foreground hover:bg-muted rounded-lg"
              >
                Tanya Jawab (FAQ)
              </a>
            </nav>

            <div className="pt-3 border-t border-border flex flex-col gap-2">
              <Link href="/auth/register?role=WORKER" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full text-xs font-semibold rounded-xl">
                  Daftar Sebagai Pekerja (TKI)
                </Button>
              </Link>
              <Link href="/auth/register?role=EMPLOYER" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full text-xs font-semibold rounded-xl">
                  Daftar Sebagai Employer / Agen
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1 page-transition">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-16 md:py-28" aria-labelledby="hero-heading">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/15 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Link href="/verify">
                <Badge
                  variant="secondary"
                  className="mb-6 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium hover:bg-secondary/80 transition-colors cursor-pointer rounded-full border border-primary/20"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Baru: Verifiable Credentials W3C & Migration Checklist
                  <ArrowRight className="h-3.5 w-3.5 text-primary" />
                </Badge>
              </Link>

              <h1
                id="hero-heading"
                className="mb-6 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl md:text-6xl"
              >
                Platform Terintegrasi untuk{' '}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  TKI & Tenaga Kerja Informal
                </span>
              </h1>

              <p className="mb-8 text-base sm:text-lg text-muted-foreground text-balance max-w-2xl mx-auto leading-relaxed">
                Upskilling berbasis kompetensi standar industri, pencocokan lowongan kerja cerdas dengan skor AI,
                sertifikat blockchain yang dapat diverifikasi instan, checklist migrasi per negara resmi, dan literasi
                keuangan — semua dalam satu platform gratis.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Link href="/auth/register?role=WORKER" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto font-bold rounded-xl gap-2 shadow-lg shadow-primary/20">
                    Mulai sebagai Pekerja
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=EMPLOYER" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto font-bold rounded-xl">
                    Rekrut Pekerja
                  </Button>
                </Link>
                <Link href="/jobs" className="w-full sm:w-auto">
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto font-semibold rounded-xl gap-1.5">
                    <Briefcase className="h-4 w-4 text-primary" />
                    Cari Lowongan
                  </Button>
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center flex-wrap gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Gratis 100% untuk pekerja
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Tanpa potongan gaji tersembunyi
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Data aman & terenkripsi resmi
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 bg-muted/40 border-y border-border/60" aria-labelledby="stats-heading">
          <div className="container mx-auto px-4">
            <h2 id="stats-heading" className="sr-only">
              Statistik Platform
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="text-center border-border/80 bg-card/60 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-colors">
                  <CardContent className="py-5 px-4">
                    <div className="mb-2 flex justify-center">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <stat.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-extrabold text-foreground">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Fitur Unggulan Section */}
        <section id="fitur" className="py-20 scroll-mt-24" aria-labelledby="features-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-14 text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="mb-3 text-xs border-primary/30 text-primary">
                Ekosistem Terintegrasi
              </Badge>
              <h2 id="features-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Fitur Unggulan SkillMatch
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Dirancang khusus untuk memenuhi standar kompetensi global, transparansi rekrutmen, dan perlindungan
                hukum bagi tenaga kerja Indonesia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card
                  key={i}
                  className="rounded-2xl border-border bg-card hover:border-primary/50 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl border', feature.color)}>
                        <feature.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <Badge variant="outline" className="text-[11px] font-semibold">
                        {feature.highlight}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                    <div className="pt-2">
                      <Link href={feature.href} className="w-full">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-between rounded-xl text-xs font-semibold group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors"
                        >
                          <span>{feature.actionText}</span>
                          <ArrowRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Preview Lowongan Kerja Section */}
        <section className="py-20 bg-muted/30 border-y border-border/60" aria-labelledby="jobs-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <Badge variant="outline" className="mb-2 text-xs border-primary/30 text-primary">
                  Marketplace Lowongan Terverifikasi
                </Badge>
                <h2 id="jobs-heading" className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Lowongan Populer Luar Negeri
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Pemberi kerja terdaftar resmi dengan kontrak kerja transparan dan jaminan asuransi
                </p>
              </div>
              <Link href="/jobs">
                <Button className="rounded-xl text-xs font-bold gap-1.5 shrink-0">
                  Lihat Semua 3,200+ Lowongan
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {previewJobs.map((job) => (
                <Card
                  key={job.id}
                  className="rounded-2xl border-border bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl" role="img" aria-label={job.country}>
                        {job.flag}
                      </span>
                      <Badge variant="secondary" className="text-[10px] font-semibold">
                        {job.country}
                      </Badge>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-foreground line-clamp-2 leading-snug">
                        {job.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {job.company}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-1">
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {job.salary}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {job.salaryIdr}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {job.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-secondary text-[10px] font-medium text-secondary-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-4">
                    <Link href="/jobs" className="w-full">
                      <Button variant="outline" size="sm" className="w-full text-xs rounded-xl font-semibold">
                        Lihat & Lamar
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Cara Kerja Section */}
        <section id="cara-kerja" className="py-20 scroll-mt-24" aria-labelledby="how-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-14 text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="mb-3 text-xs border-primary/30 text-primary">
                Langkah Mudah
              </Badge>
              <h2 id="how-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Cara Kerja SkillMatch
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                4 langkah sederhana menuju karier impian Anda di luar negeri secara aman, legal, dan transparan
              </p>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: '01',
                  title: 'Daftar Akun Gratis',
                  desc: 'Buat akun dalam 1 menit, isi profil keahlian Anda, dan tentukan negara penempatan yang Anda minati.',
                  cta: 'Daftar Sekarang',
                  href: '/auth/register?role=WORKER',
                },
                {
                  step: '02',
                  title: 'Asesmen & Sertifikasi',
                  desc: 'Ikuti tes kompetensi interaktif 15-30 menit, pelajari materi SOP industri, dan dapatkan skor keahlian.',
                  cta: 'Mulai Tes Skill',
                  href: '/upskilling/assessments',
                },
                {
                  step: '03',
                  title: 'Terbit Verifiable Credential',
                  desc: 'Sertifikat digital kriptografis terbit otomatis dengan QR code standar W3C untuk verifikasi instan majikan.',
                  cta: 'Verifikasi VC',
                  href: '/verify',
                },
                {
                  step: '04',
                  title: 'Lamar & Checklist Migrasi',
                  desc: 'AI mencocokkan lowongan resmi, lamar 1-klik, dan pantau seluruh syarat paspor, visa, serta medis negara tujuan.',
                  cta: 'Cari Lowongan',
                  href: '/jobs',
                },
              ].map((item, i) => (
                <Card
                  key={i}
                  className="rounded-2xl border-border bg-card p-6 relative flex flex-col justify-between text-left hover:border-primary/40 transition-colors"
                >
                  <div>
                    <div className="text-4xl font-extrabold text-primary/20 mb-3 font-mono">{item.step}</div>
                    <h3 className="font-bold text-base mb-2 text-foreground">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-border">
                    <Link href={item.href}>
                      <span className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1">
                        {item.cta} <ArrowRight className="h-3 w-3" />
                      </span>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Tentang SkillMatch Section */}
        <section id="tentang" className="py-20 bg-muted/20 border-y border-border/60 scroll-mt-24">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 via-card to-background p-8 sm:p-12 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Misi & Standar Ketenagakerjaan
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-4">
                Tentang Platform SkillMatch
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-6">
                SkillMatch hadir untuk memutus rantai percaloan ilegal, pungutan biaya liar, dan pemalsuan sertifikat
                pada penempatan Pekerja Migran Indonesia (PMI). Dengan memanfaatkan teknologi <strong>Verifiable Credentials (W3C)</strong>,
                SkillMatch menghubungkan calon pekerja terlatih secara langsung dengan perusahaan pemberi kerja resmi
                di luar negeri.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-card border border-border/80">
                  <p className="text-xs font-semibold text-muted-foreground">Kepatuhan Hukum</p>
                  <p className="text-sm font-bold text-foreground mt-1">UU No. 18 / 2017 (Perlindungan PMI)</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/80">
                  <p className="text-xs font-semibold text-muted-foreground">Standar Kompetensi</p>
                  <p className="text-sm font-bold text-foreground mt-1">SKKNI & BNSP Terverifikasi</p>
                </div>
                <div className="p-4 rounded-2xl bg-card border border-border/80">
                  <p className="text-xs font-semibold text-muted-foreground">Keamanan Data</p>
                  <p className="text-sm font-bold text-foreground mt-1">UU PDP & Kriptografi Ed25519</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 scroll-mt-24" aria-labelledby="faq-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-14 text-center max-w-2xl mx-auto">
              <Badge variant="outline" className="mb-3 text-xs border-primary/30 text-primary">
                Tanya Jawab
              </Badge>
              <h2 id="faq-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground">
                Informasi penting seputar pendaftaran, legalitas, ujian kompetensi, dan perlindungan kerja
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3.5">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full text-left p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                      aria-expanded={isOpen}
                    >
                      <span className="font-semibold text-sm sm:text-base text-foreground flex items-center gap-2.5">
                        <HelpCircle className="h-4 w-4 text-primary shrink-0" />
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200',
                          isOpen && 'rotate-180 text-primary'
                        )}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-16 md:py-20" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4 sm:px-6">
            <Card className="rounded-3xl border-primary/30 bg-gradient-to-r from-primary via-primary/90 to-blue-600 text-primary-foreground shadow-2xl overflow-hidden relative">
              <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <CardContent className="py-14 px-6 sm:px-12 text-center max-w-3xl mx-auto relative z-10">
                <h2 id="cta-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  Siap Memulai Perjalanan Karier Luar Negeri Anda?
                </h2>
                <p className="mt-4 mb-8 text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto leading-relaxed">
                  Bergabunglah dengan ribuan pekerja migran yang telah berhasil memperoleh sertifikasi resmi dan bekerja
                  di perusahaan terpercaya. Gratis, aman, dan berizin.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5">
                  <Link href="/auth/register?role=WORKER" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="secondary"
                      className="w-full sm:w-auto font-bold rounded-xl gap-2 shadow-lg"
                    >
                      Daftar Sekarang Gratis
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/jobs" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      variant="outline"
                      className="w-full sm:w-auto font-bold rounded-xl bg-transparent border-white/40 text-white hover:bg-white/10 hover:text-white"
                    >
                      Jelajahi Lowongan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/40 py-14" role="contentinfo">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1 space-y-3.5">
              <Link href="/" className="flex items-center space-x-2.5" aria-label="SkillMatch Home">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Shield className="h-5 w-5" aria-hidden="true" />
                </div>
                <span className="font-extrabold text-xl tracking-tight">SkillMatch</span>
              </Link>
              <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
                Platform terpadu upskilling, pencocokan lowongan kerja cerdas, dan verifikasi sertifikat W3C Verifiable
                Credentials bagi pekerja migran Indonesia.
              </p>
              <div className="pt-1 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="h-4 w-4" /> Kepatuhan Standar W3C & UU PDP
              </div>
            </div>

            <div>
              <h3 className="mb-3.5 font-bold text-xs uppercase tracking-wider text-foreground">Produk & Fitur</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/upskilling/assessments" className="hover:text-foreground transition-colors">
                    Upskilling & Asesmen
                  </Link>
                </li>
                <li>
                  <Link href="/jobs" className="hover:text-foreground transition-colors">
                    Marketplace Lowongan
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-foreground transition-colors">
                    Verifiable Credentials (VC)
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/migration" className="hover:text-foreground transition-colors">
                    Migration Checklist
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/finance" className="hover:text-foreground transition-colors">
                    Kalkulator Finansial PMI
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3.5 font-bold text-xs uppercase tracking-wider text-foreground">Dukungan & Komunitas</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <a
                    href="#faq"
                    onClick={(e) => handleSmoothScroll(e, 'faq')}
                    className="hover:text-foreground transition-colors cursor-pointer"
                  >
                    Pusat Bantuan & FAQ
                  </a>
                </li>
                <li>
                  <Link href="/dashboard/community" className="hover:text-foreground transition-colors">
                    Forum & Bantuan Hukum PMI
                  </Link>
                </li>
                <li>
                  <a href="mailto:support@skillmatch.id" className="hover:text-foreground transition-colors">
                    Hubungi Dukungan (Email)
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setLegalModal('about')}
                    className="hover:text-foreground transition-colors text-left"
                  >
                    Tentang Kami & Misi
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-3.5 font-bold text-xs uppercase tracking-wider text-foreground">Pemberi Kerja / Agen</h3>
              <ul className="space-y-2.5 text-xs text-muted-foreground">
                <li>
                  <Link href="/auth/register?role=EMPLOYER" className="hover:text-foreground transition-colors">
                    Daftar Sebagai Employer
                  </Link>
                </li>
                <li>
                  <Link href="/verify" className="hover:text-foreground transition-colors">
                    Verifikasi Sertifikat Pelamar
                  </Link>
                </li>
                <li>
                  <Link href="/auth/login" className="hover:text-foreground transition-colors">
                    Masuk ke Portal Agency
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">
              © 2026 SkillMatch Indonesia. Hak cipta dilindungi undang-undang.
            </p>
            <div className="flex items-center space-x-6">
              <button
                type="button"
                onClick={() => setLegalModal('privacy')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Kebijakan Privasi
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('terms')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Syarat & Ketentuan
              </button>
              <button
                type="button"
                onClick={() => setLegalModal('about')}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Standar Regulasi
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Legal & About Modals */}
      <Dialog open={legalModal !== null} onOpenChange={(open) => !open && setLegalModal(null)}>
        <DialogContent className="max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {legalModal === 'privacy' && 'Kebijakan Privasi SkillMatch'}
              {legalModal === 'terms' && 'Syarat & Ketentuan Penggunaan'}
              {legalModal === 'about' && 'Tentang SkillMatch & Standar Regulasi'}
            </DialogTitle>
            <DialogDescription className="text-xs">
              Terakhir diperbarui: 2026 • Komitmen perlindungan data dan hak PMI
            </DialogDescription>
          </DialogHeader>

          <div className="text-xs text-muted-foreground space-y-3 leading-relaxed py-2">
            {legalModal === 'privacy' && (
              <>
                <p>
                  SkillMatch memprioritaskan privasi dan keamanan data pribadi calon pekerja migran (PMI) dan mitra
                  pemberi kerja sesuai dengan Undang-Undang Perlindungan Data Pribadi (UU PDP No. 27/2022).
                </p>
                <h4 className="font-bold text-foreground">1. Pengumpulan Data</h4>
                <p>
                  Kami hanya mengumpulkan data yang relevan untuk proses pencocokan kerja dan sertifikasi: nama lengkap,
                  email, nomor kontak, hasil asesmen kompetensi, dan dokumen penempatan resmi.
                </p>
                <h4 className="font-bold text-foreground">2. Kriptografi & Keamanan</h4>
                <p>
                  Sertifikat kompetensi diterbitkan menggunakan enkripsi standar W3C Verifiable Credentials (Ed25519)
                  yang tamper-proof dan disimpan aman. Kata sandi akun dienkripsi menggunakan algoritma hash satu arah.
                </p>
                <h4 className="font-bold text-foreground">3. Tidak Ada Penjualan Data</h4>
                <p>
                  Data pribadi Anda tidak akan pernah dijual atau dialihkan kepada pihak ketiga di luar kepentingan proses
                  rekrutmen resmi dan legalitas ketenagakerjaan.
                </p>
              </>
            )}

            {legalModal === 'terms' && (
              <>
                <p>
                  Dengan menggunakan platform SkillMatch, Anda menyetujui ketentuan layanan yang berlandaskan hukum
                  Republik Indonesia dan peraturan ketenagakerjaan negara penempatan.
                </p>
                <h4 className="font-bold text-foreground">1. Layanan Bebas Biaya untuk Pekerja</h4>
                <p>
                  Pendaftaran akun, modul upskilling, tes kompetensi, dan pengajuan lamaran pekerjaan di platform ini
                  bersifat 100% gratis tanpa potongan sepihak.
                </p>
                <h4 className="font-bold text-foreground">2. Integritas Data & Larangan Pemalsuan</h4>
                <p>
                  Pengguna dilarang mengunggah dokumen palsu, memanipulasi identitas, atau menyalahgunakan hak akses orang
                  lain. Pelanggaran akan dilaporkan ke pihak berwenang sesuai UU ITE.
                </p>
                <h4 className="font-bold text-foreground">3. Tanggung Jawab Employer & Agen</h4>
                <p>
                  Pemberi kerja wajib mematuhi ketentuan upah minimum, jam kerja, asuransi kecelakaan kerja, dan hak paspor
                  pekerja sesuai standar ketenagakerjaan resmi.
                </p>
              </>
            )}

            {legalModal === 'about' && (
              <>
                <p>
                  SkillMatch adalah platform terintegrasi yang dirancang untuk mendukung peningkatan taraf hidup pekerja
                  migran Indonesia dan pekerja informal melalui teknologi modern.
                </p>
                <h4 className="font-bold text-foreground">Standar & Landasan Operasional</h4>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Undang-Undang No. 18 Tahun 2017 tentang Perlindungan Pekerja Migran Indonesia.</li>
                  <li>Standar Kompetensi Kerja Nasional Indonesia (SKKNI) & Badan Nasional Sertifikasi Profesi (BNSP).</li>
                  <li>Standar World Wide Web Consortium (W3C) untuk Verifiable Credentials & Decentralized Identifiers (DID).</li>
                </ul>
                <p className="pt-1">
                  Untuk pertanyaan, kemitraan, atau pelaporan kendala, hubungi tim kami di{' '}
                  <strong className="text-foreground">support@skillmatch.id</strong>.
                </p>
              </>
            )}
          </div>

          <DialogFooter>
            <Button size="sm" onClick={() => setLegalModal(null)} className="rounded-xl text-xs">
              Saya Mengerti & Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Floating Smooth Scroll to Top Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 hover:scale-110 active:scale-95 transition-all duration-200 border border-primary/20 flex items-center justify-center animate-in fade-in zoom-in-75 group"
          aria-label="Kembali ke atas"
          title="Kembali ke atas"
        >
          <ChevronUp className="h-5 w-5 transition-transform group-hover:-translate-y-0.5" />
        </button>
      )}
    </div>
  );
}