import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Users, Award, Shield, TrendingUp, Globe, BookOpen, Briefcase, PiggyBank } from 'lucide-react';

const features = [
  {
    icon: BookOpen,
    title: 'Upskilling Terstruktur',
    desc: 'Kurikulum berbasis kompetensi dengan asesmen praktik dan sertifikasi resmi (BNSP/Kemenaker).',
    highlight: '50+ Skill',
  },
  {
    icon: Briefcase,
    title: 'Job Matching AI',
    desc: 'Algoritma pencocokan berbasis skill, gaji, lokasi, bahasa, dan sertifikasi dengan skor transparan.',
    highlight: 'Match Score',
  },
  {
    icon: Award,
    title: 'Verifiable Credentials',
    desc: 'Sertifikat berbasis W3C VC + Ed25519, tamper-proof, verifiable instan oleh employer via QR code.',
    highlight: 'Blockchain-ready',
  },
  {
    icon: Globe,
    title: 'Migration Checklist',
    desc: 'Panduan lengkap migrasi kerja per negara: paspor, visa, medis, kontrak, asuransi, kontak darurat KBRI.',
    highlight: '10+ Negara',
  },
  {
    icon: PiggyBank,
    title: 'Financial Literacy',
    desc: 'Kalkulator remittance, simulasi investasi, target tabungan, edukasi asuransi & penipuan investasi.',
    highlight: 'Kalkulator',
  },
  {
    icon: Users,
    title: 'Komunitas & Dukungan',
    desc: 'Forum sesama TKI, workshop CV, legal aid, peer support, alumni network, event berkala.',
    highlight: 'Aktif',
  },
];

const stats = [
  { label: 'Pekerja Terdaftar', value: '12,450+', icon: Users },
  { label: 'Lowongan Aktif', value: '3,200+', icon: Briefcase },
  { label: 'Sertifikat Terbit', value: '8,900+', icon: Award },
  { label: 'Tingkat Penempatan', value: '78%', icon: TrendingUp },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center space-x-2" aria-label="SkillMatch Home">
            <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
            <span className="font-bold text-xl">SkillMatch</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Fitur
            </Link>
            <Link href="/lowongan" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Lowongan
            </Link>
            <Link href="/tentang" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tentang
            </Link>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                Masuk
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">Daftar Gratis</Button>
            </Link>
          </div>
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="hero-heading">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" className="mb-6 inline-flex items-center gap-2 px-3 py-1 text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Baru: Verifiable Credentials & Migration Checklist
              </Badge>
              <h1 id="hero-heading" className="mb-6 text-4xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
                Platform Terintegrasi untuk{' '}
                <span className="text-primary">TKI & Tenaga Kerja Informal</span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground text-balance max-w-2xl mx-auto">
                Upskilling berbasis kompetensi, pencocokan lowongan kerja cerdas, sertifikat blockchain yang diverifikasi instan,
                checklist migrasi per negara, dan literasi keuangan — semua dalam satu platform.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register?role=worker">
                  <Button size="xl" className="w-full sm:w-auto" aria-label="Daftar sebagai pekerja">
                    Mulai sebagai Pekerja
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </Link>
                <Link href="/auth/register?role=employer">
                  <Button size="xl" variant="outline" className="w-full sm:w-auto">
                    Rekrut Pekerja
                  </Button>
                </Link>
              </div>
              <p className="mt-6 text-sm text-muted-foreground">
                Gratis untuk pekerja • Tidak ada biaya tersembunyi • Data Anda aman & terenkripsi
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" aria-labelledby="stats-heading">
          <div className="container mx-auto px-4">
            <h2 id="stats-heading" className="sr-only">
              Statistik Platform
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="py-6">
                    <div className="mb-2 flex justify-center">
                      <stat.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                    </div>
                    <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" aria-labelledby="features-heading">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 id="features-heading" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Fitur Unggulan
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dirancang khusus untuk kebutuhan TKI dan tenaga kerja informal dengan standar internasional
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <Card key={i} className="h-full transition-shadow hover:shadow-lg">
                  <CardHeader>
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{feature.desc}</p>
                    <Badge variant="outline" className="text-xs">
                      {feature.highlight}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 bg-muted/30" aria-labelledby="how-heading">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 id="how-heading" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Cara Kerja
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                4 langkah sederhana menuju karier impian Anda di luar negeri
              </p>
            </div>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '01', title: 'Daftar & Profil', desc: 'Buat akun, isi profil, pilih negara tujuan & skill yang dikuasai' },
                { step: '02', title: 'Asesmen Skill', desc: 'Ikuti tes kompetensi 15-30 menit, dapatkan skor & rekomendasi pelatihan' },
                { step: '03', title: 'Dapat Sertifikat', desc: 'Lulus asesmen → terbit Verifiable Credential blockchain, bagikan ke employer' },
                { step: '04', title: 'Lamar & Bekerja', desc: 'Sistem match lowongan, lamar 1-klik, verifikasi instan, checklist migrasi lengkap' },
              ].map((item, i) => (
                <Card key={i} className="relative text-center">
                  <CardContent className="py-6">
                    <div className="mb-4 text-4xl font-bold text-primary/20">{item.step}</div>
                    <h3 className="mb-2 font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" aria-labelledby="cta-heading">
          <div className="container mx-auto px-4">
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="py-16 px-6 text-center">
                <h2 id="cta-heading" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                  Siap Memulai Perjalanan Karier Anda?
                </h2>
                <p className="mb-8 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                  Bergabung dengan ribuan TKI yang sudah menemukan pekerjaan impian mereka melalui SkillMatch. Gratis, aman, dan transparan.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/auth/register?role=worker">
                    <Button size="xl" variant="secondary" className="w-full sm:w-auto">
                      Daftar Sekarang Gratis
                      <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                    </Button>
                  </Link>
                  <Link href="/lowongan">
                    <Button size="xl" variant="outline" className="w-full sm:w-auto bg-transparent">
                      Lihat Lowongan
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <Link href="/" className="flex items-center space-x-2 mb-4" aria-label="SkillMatch Home">
                <Shield className="h-8 w-8 text-primary" aria-hidden="true" />
                <span className="font-bold text-xl">SkillMatch</span>
              </Link>
              <p className="text-sm text-muted-foreground max-w-xs">
                Memberdayakan TKI dan tenaga kerja informal melalui upskilling, pencocokan kerja cerdas, dan verifikasi kredensial blockchain.
              </p>
            </div>
            <nav aria-label="Produk">
              <h3 className="mb-4 font-semibold">Produk</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/upskilling" className="hover:text-foreground transition-colors">Upskilling & Asesmen</Link></li>
                <li><Link href="/lowongan" className="hover:text-foreground transition-colors">Marketplace Lowongan</Link></li>
                <li><Link href="/credentials" className="hover:text-foreground transition-colors">Verifiable Credentials</Link></li>
                <li><Link href="/migration" className="hover:text-foreground transition-colors">Migration Checklist</Link></li>
                <li><Link href="/finance" className="hover:text-foreground transition-colors">Financial Literacy</Link></li>
              </ul>
            </nav>
            <nav aria-label="Dukungan">
              <h3 className="mb-4 font-semibold">Dukungan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/bantuan" className="hover:text-foreground transition-colors">Pusat Bantuan</Link></li>
                <li><Link href="/faq" className="hover:text-foreground transition-colors">FAQ</Link></li>
                <li><Link href="/kontak" className="hover:text-foreground transition-colors">Kontak Kami</Link></li>
                <li><Link href="/legal-aid" className="hover:text-foreground transition-colors">Bantuan Hukum</Link></li>
              </ul>
            </nav>
            <nav aria-label="Perusahaan">
              <h3 className="mb-4 font-semibold">Perusahaan</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/tentang" className="hover:text-foreground transition-colors">Tentang Kami</Link></li>
                <li><Link href="/karir" className="hover:text-foreground transition-colors">Karir</Link></li>
                <li><Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="/mitra" className="hover:text-foreground transition-colors">Jadi Mitra</Link></li>
              </ul>
            </nav>
          </div>
          <div className="mt-8 border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © 2026 SkillMatch. Hak cipta dilindungi.
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privasi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="/syarat" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="/cookie" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kebijakan Cookie
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}