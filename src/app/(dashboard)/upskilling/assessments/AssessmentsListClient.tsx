'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Search, 
  Award, 
  ArrowLeft,
  ShieldCheck,
  FileCheck2,
  AlertCircle,
  PlayCircle,
  FileText,
  Layers,
  X,
  Sparkles,
  CheckSquare
} from 'lucide-react';
import { cn, getSkillCategoryLabel } from '@/lib/utils';

export interface AssessmentItem {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  skill: { 
    id: string; 
    code: string; 
    name: string; 
    category: string; 
    icon?: string | null;
  };
  userAttempt: { 
    score: number; 
    passed: boolean; 
    completedAt: string;
  } | null;
}

export interface LearningModule {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  duration: string;
  lessonsCount: number;
  description: string;
  skills: string[];
  syllabus: { title: string; type: 'video' | 'reading' | 'quiz'; duration: string }[];
  targetAssessmentTitle: string;
}

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'mod-1',
    title: 'SOP Caregiving Terampil & Penanganan Lansia Demensia',
    category: 'DOMESTIC_CARE',
    categoryLabel: 'Perawatan Domestik',
    duration: '6 Jam Pembelajaran',
    lessonsCount: 12,
    description: 'Panduan standar internasional merawat lansia tirah baring, teknik transfer kursi roda ergonomis, penanganan demensia tanpa kekerasan, dan pencatatan tanda vital harian.',
    skills: ['Tanda Vital', 'Mobility Assistance', 'Nutrisi Lansia', 'First Aid'],
    syllabus: [
      { title: 'SOP Pengukuran Tanda Vital & Deteksi Dini Hipotensi', type: 'video', duration: '15 mnt' },
      { title: 'Teknik Ergonomis Memindahkan Pasien ke Kursi Roda', type: 'video', duration: '20 mnt' },
      { title: 'Pemberian Makanan Lewat NGT & Diet Rendah Garam', type: 'reading', duration: '25 mnt' },
      { title: 'Komunikasi Efektif dengan Pasien Penurunan Daya Ingat (Demensia)', type: 'reading', duration: '30 mnt' },
      { title: 'Simulasi Tanggap Darurat Tersedak (Heimlich Maneuver)', type: 'quiz', duration: '15 mnt' },
    ],
    targetAssessmentTitle: 'Perawatan Lansia & Caregiving Terampil (Taiwan/Singapura)',
  },
  {
    id: 'mod-2',
    title: 'Standar Sanitasi & Housekeeping Hotel Bintang 5',
    category: 'HOSPITALITY',
    categoryLabel: 'Hospitality',
    duration: '4 Jam Pembelajaran',
    lessonsCount: 8,
    description: 'Kurikulum standar perhotelan internasional di Singapura & Malaysia: sanitasi kamar, penataan bed making berstandar 15 menit, dan penanganan bahan kimia pembersih (MSDS).',
    skills: ['Bed Making', 'Sanitasi Kamar Mandi', 'Chemical Safety', 'Etika Tamu'],
    syllabus: [
      { title: 'Prosedur Room Makeup & Penataan Sprei Standar Bintang 5', type: 'video', duration: '15 mnt' },
      { title: 'Kode Warna Kain Lap Mikrofiber & Pencegahan Kontaminasi Silang', type: 'reading', duration: '20 mnt' },
      { title: 'Penggunaan Bahan Kimia Pembersih Sesuai Lembar MSDS', type: 'reading', duration: '25 mnt' },
      { title: 'Etika Privasi Tamu & Pelaporan Barang Tertinggal (Lost & Found)', type: 'quiz', duration: '15 mnt' },
    ],
    targetAssessmentTitle: 'Housekeeping & Sanitasi Hotel Bintang 5 (Singapura/Malaysia)',
  },
  {
    id: 'mod-3',
    title: 'K3 Manufaktur Industri & Budaya Kerja Pabrik (5S)',
    category: 'MANUFACTURING',
    categoryLabel: 'Manufaktur & Pabrik',
    duration: '5 Jam Pembelajaran',
    lessonsCount: 10,
    description: 'Persiapan kerja manufaktur di Jepang (SSW) dan Korea Selatan: budaya 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke), APD industri, dan prosedur darurat LOTO.',
    skills: ['Budaya 5S', 'Alat Pelindung Diri (APD)', 'Lockout/Tagout (LOTO)', 'K3 Industri'],
    syllabus: [
      { title: 'Penerapan Konsep 5S di Jalur Perakitan Industri Modern', type: 'video', duration: '20 mnt' },
      { title: 'Standar Kelayakan Alat Pelindung Diri (APD) di Area Bising & Debu', type: 'reading', duration: '20 mnt' },
      { title: 'Prosedur Lockout/Tagout (LOTO) Saat Mesin Diperbaiki', type: 'video', duration: '25 mnt' },
      { title: 'Evakuasi Kebakaran & Jalur Aman di Fasilitas Manufaktur', type: 'quiz', duration: '15 mnt' },
    ],
    targetAssessmentTitle: 'Keselamatan Kerja & Manufaktur Industri (SSW Jepang/Korea)',
  },
  {
    id: 'mod-4',
    title: 'Bahasa Komunikasi Kerja Luar Negeri (Mandarin & Jepang)',
    category: 'LANGUAGE',
    categoryLabel: 'Bahasa Asing',
    duration: '8 Jam Pembelajaran',
    lessonsCount: 16,
    description: 'Kosakata wajib sehari-hari dengan majikan dan pengawas kerja: istilah medis, perintah kerja, meminta bantuan darurat, dan percakapan sopan di tempat kerja.',
    skills: ['Mandarin Kerja', 'Jepang Tokutei Ginou', 'Frasa Medis', 'Percakapan Sopan'],
    syllabus: [
      { title: '50 Frasa Mandarin Esensial untuk Pekerja Caregiver Taiwan', type: 'video', duration: '30 mnt' },
      { title: 'Kosakata Perintah Kerja & Nama Peralatan Rumah Tangga / Pabrik', type: 'reading', duration: '25 mnt' },
      { title: 'Frasa Darurat Meminta Tolong, Polisi, dan Ambulans', type: 'video', duration: '20 mnt' },
      { title: 'Simulasi Wawancara Kerja dengan User / Agensi Asing', type: 'quiz', duration: '25 mnt' },
    ],
    targetAssessmentTitle: 'Bahasa Komunikasi Kerja Mandarin (Taiwan/Tiongkok)',
  },
  {
    id: 'mod-5',
    title: 'Literasi Keuangan, Remittance Legal, & Hukum PMI',
    category: 'FINANCIAL_LITERACY',
    categoryLabel: 'Literasi Finansial',
    duration: '3 Jam Pembelajaran',
    lessonsCount: 6,
    description: 'Kunci sukses finansial purna-migrasi: rumus alokasi gaji 40/35/25, menghindari calo kiriman uang ilegal, memahami hak paspor dan perjanjian kerja resmi BP2MI.',
    skills: ['Remittance Legal', 'Rumus 40/35/25', 'Hak Perjanjian Kerja', 'Anti-Investasi Bodong'],
    syllabus: [
      { title: 'Menghitung Selisih Kurs & Biaya Kirim Uang (Fintech vs Bank)', type: 'video', duration: '15 mnt' },
      { title: 'Disiplin Menabung 25% untuk Modal Usaha Purna PMI', type: 'reading', duration: '20 mnt' },
      { title: 'Hak Hukum atas Paspor Pribadi & Saluran Pengaduan KBRI', type: 'reading', duration: '25 mnt' },
      { title: 'Mengenali Modus Penipuan Investasi & Pinjol Ilegal', type: 'quiz', duration: '15 mnt' },
    ],
    targetAssessmentTitle: 'Literasi Keuangan & Perencanaan Anggaran PMI Purna',
  },
];

const CATEGORIES = [
  { key: 'all', label: 'Semua Bidang' },
  { key: 'DOMESTIC_CARE', label: 'Perawatan Domestik' },
  { key: 'CONSTRUCTION', label: 'Konstruksi & Pengelasan' },
  { key: 'MANUFACTURING', label: 'Manufaktur & Mesin' },
  { key: 'HOSPITALITY', label: 'Hospitality & Hotel' },
  { key: 'MARITIME', label: 'Maritim & Pelaut' },
  { key: 'LANGUAGE', label: 'Bahasa Asing' },
  { key: 'DIGITAL_BASIC', label: 'Digital & Komputer' },
  { key: 'FINANCIAL_LITERACY', label: 'Literasi Keuangan' },
];

export default function AssessmentsListClient({
  initialAssessments,
}: {
  initialAssessments: AssessmentItem[];
}) {
  const [assessments, setAssessments] = useState<AssessmentItem[]>(initialAssessments);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'assessments' | 'modules'>('assessments');
  const [selectedModule, setSelectedModule] = useState<LearningModule | null>(null);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.set('category', filterCategory);
      const res = await fetch(`/api/assessments?${params.toString()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Gagal memuat daftar asesmen');
      const data = await res.json();
      if (Array.isArray(data.data)) {
        setAssessments(data.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat data asesmen');
    } finally {
      setLoading(false);
    }
  };

  const filteredAssessments = useMemo(() => {
    let result = assessments;
    if (filterCategory !== 'all') {
      result = result.filter((a) => a.skill.category === filterCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.description.toLowerCase().includes(q) ||
          a.skill.name.toLowerCase().includes(q)
      );
    }
    return result;
  }, [assessments, filterCategory, searchQuery]);

  const completedCount = useMemo(() => {
    return assessments.filter((a) => a.userAttempt?.passed).length;
  }, [assessments]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar Navigation */}
      <div className="border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 px-4 py-3 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Dashboard Utama
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchAssessments}
              disabled={loading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              Segarkan Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 sm:p-8">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              Sertifikasi Verifiable Credential W3C Terstandarisasi
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pusat Asesmen Kompetensi & Upskilling
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Ikuti tes kompetensi standar industri untuk calon pekerja migran (PMI) dan tenaga kerja informal. 
              Hasil kelulusan akan langsung diterbitkan sebagai <strong>Sertifikat Digital Kriptografis (Verifiable Credential)</strong> yang dapat diverifikasi oleh agensi dan employer luar negeri.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Total Asesmen Tersedia</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{assessments.length} Modul</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Sertifikat Anda</p>
                <p className="text-xl font-bold text-primary mt-0.5">{completedCount} Terbit</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border col-span-2 sm:col-span-1">
                <p className="text-xs text-muted-foreground">Standar Verifikasi</p>
                <p className="text-xl font-bold text-emerald-500 mt-0.5">W3C & DID</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border gap-2">
          <button
            onClick={() => setActiveTab('assessments')}
            className={cn(
              'flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-all',
              activeTab === 'assessments'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <ShieldCheck className="h-4 w-4" />
            Ujian Sertifikasi BNSP & W3C VC ({assessments.length})
          </button>
          <button
            onClick={() => setActiveTab('modules')}
            className={cn(
              'flex items-center gap-2 pb-3.5 px-4 text-sm font-semibold border-b-2 transition-all',
              activeTab === 'modules'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            <BookOpen className="h-4 w-4" />
            Kurikulum & Modul Belajar (Micro-Learning)
            <Badge variant="outline" className="ml-1 text-[10px] bg-primary/10 text-primary border-primary/20">
              5 Sektor
            </Badge>
          </button>
        </div>

        {activeTab === 'assessments' ? (
          <>
            {/* Filter & Search Bar */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Cari keahlian (contoh: Las, Caregiving, Bahasa, CNC)..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card border-border"
                  />
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 self-end sm:self-center">
                  Menampilkan <span className="font-semibold text-foreground">{filteredAssessments.length}</span> dari {assessments.length} asesmen
                </div>
              </div>

              {/* Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.key}
                    onClick={() => setFilterCategory(cat.key)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                      filterCategory === cat.key
                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                        : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm font-medium">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={fetchAssessments}>
                  Coba Lagi
                </Button>
              </div>
            )}

            {/* Assessments Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAssessments.length === 0 ? (
                <div className="col-span-full text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
                  <BookOpen className="mx-auto h-12 w-12 text-muted-foreground opacity-60" />
                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    Tidak ada asesmen yang sesuai kriteria
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                    {searchQuery
                      ? `Tidak ditemukan asesmen dengan kata kunci "${searchQuery}".`
                      : 'Belum ada asesmen untuk kategori ini.'}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setFilterCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    Reset Semua Filter
                  </Button>
                </div>
              ) : (
                filteredAssessments.map((assessment) => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))
              )}
            </div>
          </>
        ) : (
          /* Learning Modules (Micro-Learning) View */
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Kurikulum Pembelajaran Vokasi Berbasis Standar Industri Luar Negeri
                </h3>
                <p className="text-xs text-muted-foreground">
                  Pelajari panduan SOP dan materi micro-learning terlebih dahulu sebelum mengambil tes sertifikasi BNSP & Verifiable Credential.
                </p>
              </div>
              <Badge variant="outline" className="border-primary/30 text-primary shrink-0 text-xs">
                Gratis untuk PMI
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {LEARNING_MODULES.map((module) => (
                <div
                  key={module.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="outline" className="text-xs bg-muted/60">
                        {module.categoryLabel}
                      </Badge>
                      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {module.duration}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base text-foreground leading-snug">
                        {module.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-3 leading-relaxed">
                        {module.description}
                      </p>
                    </div>

                    {/* Skill tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {module.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md bg-secondary text-[11px] font-medium text-secondary-foreground"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    {/* Syllabus snippet */}
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/60 space-y-2">
                      <p className="text-[11px] font-semibold text-muted-foreground flex items-center justify-between">
                        <span>Silabus Ringkas:</span>
                        <span>{module.lessonsCount} Pelajaran</span>
                      </p>
                      <ul className="space-y-1.5 text-xs">
                        {module.syllabus.slice(0, 3).map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-muted-foreground">
                            {item.type === 'video' ? (
                              <PlayCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                            ) : item.type === 'reading' ? (
                              <FileText className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <CheckSquare className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                            )}
                            <span className="truncate flex-1 text-[11px]">{item.title}</span>
                            <span className="text-[10px] shrink-0">{item.duration}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border mt-5 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full text-xs gap-1.5 rounded-xl"
                      onClick={() => setSelectedModule(module)}
                    >
                      <Layers className="h-3.5 w-3.5" />
                      Buka Panduan Materi SOP
                    </Button>
                    <Button
                      className="w-full text-xs gap-1.5 rounded-xl"
                      onClick={() => {
                        setActiveTab('assessments');
                        setSearchQuery(module.skills[0]);
                      }}
                    >
                      <ShieldCheck className="h-3.5 w-3.5" />
                      Ambil Ujian Sertifikasi Terkait
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Learning Module Detail Modal */}
        {selectedModule && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
              <div className="p-6 border-b border-border flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                      {selectedModule.categoryLabel}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {selectedModule.duration} • {selectedModule.lessonsCount} Pelajaran
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {selectedModule.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full shrink-0"
                  onClick={() => setSelectedModule(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto space-y-6">
                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Ringkasan Kompetensi
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    {selectedModule.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Struktur Pelajaran & SOP Standar Industri
                  </h4>
                  <div className="space-y-2.5">
                    {selectedModule.syllabus.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl border border-border/80 bg-background/60 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                            {idx + 1}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {item.title}
                            </p>
                            <p className="text-[11px] text-muted-foreground capitalize">
                              Tipe: {item.type === 'video' ? 'Video Demonstrasi SOP' : item.type === 'reading' ? 'Dokumen Prosedur & Cheklist' : 'Kuis Latihan Pemahaman'}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-medium shrink-0">
                          {item.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                  <p className="text-xs font-medium">
                    ✓ Modul ini disesuaikan dengan Standar Kompetensi Kerja Nasional Indonesia (SKKNI) dan standar kerja resmi Kementerian Ketenagakerjaan negara penempatan.
                  </p>
                </div>
              </div>

              <div className="p-4 border-t border-border flex flex-col sm:flex-row gap-2 justify-end bg-muted/20">
                <Button
                  variant="outline"
                  onClick={() => setSelectedModule(null)}
                  className="rounded-xl text-xs"
                >
                  Tutup
                </Button>
                <Button
                  className="rounded-xl text-xs gap-1.5"
                  onClick={() => {
                    const targetSkill = selectedModule.skills[0];
                    setSelectedModule(null);
                    setActiveTab('assessments');
                    setSearchQuery(targetSkill);
                  }}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Mulai Ujian Sertifikasi Terkait
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: AssessmentItem }) {
  const { userAttempt, skill, passingScore, durationMin, title, description } = assessment;
  const isCompleted = !!userAttempt;
  const isPassed = userAttempt?.passed;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200">
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 text-2xl">
            {skill.icon ? (
              <span role="img" aria-label={skill.name}>{skill.icon}</span>
            ) : (
              <FileCheck2 className="h-6 w-6 text-primary" />
            )}
          </div>
          <div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-muted text-muted-foreground border border-border">
              {getSkillCategoryLabel(skill.category)}
            </span>
            <h3 className="mt-1 text-base font-bold text-foreground line-clamp-2 leading-snug">
              {title}
            </h3>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
        {description}
      </p>

      {/* Meta Specs */}
      <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground mb-4">
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-primary" />
          <span>Durasi: <strong className="text-foreground">{durationMin} Menit</strong></span>
        </div>
        <div className="flex items-center gap-1.5 justify-end">
          <Award className="h-3.5 w-3.5 text-amber-500" />
          <span>Passing: <strong className="text-foreground">{passingScore}%</strong></span>
        </div>
      </div>

      {/* User Attempt Status Banner if taken */}
      {isCompleted && (
        <div className="mb-4 p-3 rounded-xl bg-card border border-border/80 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Status Pengerjaan</span>
            <span
              className={cn(
                'inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-semibold text-[11px]',
                isPassed
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30'
              )}
            >
              {isPassed ? (
                <>
                  <CheckCircle2 className="h-3 w-3" /> Lulus ({userAttempt?.score}%)
                </>
              ) : (
                <>Belum Lulus ({userAttempt?.score}%)</>
              )}
            </span>
          </div>
          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isPassed ? 'bg-emerald-500' : 'bg-rose-500'
              )}
              style={{ width: `${Math.min(100, Math.max(5, userAttempt?.score || 0))}%` }}
            />
          </div>
          <p className="text-[10px] text-muted-foreground text-right">
            Diselesaikan: {new Date(userAttempt!.completedAt).toLocaleDateString('id-ID')}
          </p>
        </div>
      )}

      {/* Action Button */}
      <div className="pt-2 border-t border-border mt-auto">
        <Button asChild className="w-full gap-2 rounded-xl" variant={isCompleted && isPassed ? 'default' : 'default'}>
          <Link
            href={
              isCompleted
                ? `/dashboard/upskilling/assessments/${assessment.id}/result`
                : `/dashboard/upskilling/assessments/${assessment.id}/take`
            }
          >
            {isCompleted ? (
              <>
                <Award className="h-4 w-4" />
                Lihat Hasil & Sertifikat VC
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                Mulai Asesmen
                <ArrowRight className="h-4 w-4 ml-auto" />
              </>
            )}
          </Link>
        </Button>
      </div>
    </div>
  );
}
