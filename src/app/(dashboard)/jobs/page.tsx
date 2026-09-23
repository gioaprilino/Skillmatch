'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  Clock, 
  Search, 
  Filter, 
  ChevronDown, 
  ArrowRight, 
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  Building2,
  Sparkles,
  Plane,
  CheckCircle2
} from 'lucide-react';
import { formatCurrency, getSkillLevelLabel, cn } from '@/lib/utils';
import { VoiceInput } from '@/components/voice-input';

interface JobSkill {
  skillId: string;
  level: string;
  mandatory: boolean;
  weight: number;
  skill: { id: string; name: string; category: string };
}

interface JobPost {
  id: string;
  title: string;
  description: string;
  country: string;
  province?: string;
  city?: string;
  workType: string;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency: string;
  salaryPeriod: string;
  contractType: string;
  contractDurationMonths?: number;
  minAge?: number;
  maxAge?: number;
  gender?: string;
  employer: { id: string; name: string; companyName?: string; companyWebsite?: string };
  skills: JobSkill[];
  matchScore?: number;
  matchedSkills?: { items: MatchedSkill[] };
  createdAt: string;
  publishedAt: string;
}

interface MatchedSkill {
  skillId: string;
  skillName: string;
  userLevel: string;
  requiredLevel: string;
  match: number;
}

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  TWN: { name: 'Taiwan', flag: '🇹🇼' },
  JPN: { name: 'Jepang', flag: '🇯🇵' },
  KOR: { name: 'Korea Selatan', flag: '🇰🇷' },
  SGP: { name: 'Singapura', flag: '🇸🇬' },
  MYS: { name: 'Malaysia', flag: '🇲🇾' },
  ARE: { name: 'Uni Emirat Arab', flag: '🇦🇪' },
  SAU: { name: 'Arab Saudi', flag: '🇸🇦' },
  HKG: { name: 'Hong Kong', flag: '🇭🇰' },
  IDN: { name: 'Indonesia', flag: '🇮🇩' },
};

const COUNTRY_FILTERS = [
  { code: 'all', label: 'Semua Negara', flag: '🌍' },
  { code: 'TWN', label: 'Taiwan', flag: '🇹🇼' },
  { code: 'JPN', label: 'Jepang', flag: '🇯🇵' },
  { code: 'KOR', label: 'Korea Selatan', flag: '🇰🇷' },
  { code: 'SGP', label: 'Singapura', flag: '🇸🇬' },
  { code: 'MYS', label: 'Malaysia', flag: '🇲🇾' },
  { code: 'ARE', label: 'UEA (Dubai)', flag: '🇦🇪' },
];

const CONTRACT_LABELS: Record<string, string> = {
  FIXED_TERM: 'Kontrak Resmi',
  PERMANENT: 'Permanen',
  SEASONAL: 'Musiman',
  PROJECT_BASED: 'Berbasis Proyek',
  APPRENTICESHIP: 'Magang',
};

const WORK_TYPE_LABELS: Record<string, string> = {
  ONSITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
};

export default function JobBoardPage() {
  const { data: session } = useSession();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterCountry !== 'all') params.set('country', filterCountry);
      if (filterWorkType !== 'all') params.set('workType', filterWorkType);
      const res = await fetch(`/api/jobs?${params.toString()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setJobs(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [search, filterCountry, filterWorkType]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.employer.companyName?.toLowerCase().includes(search.toLowerCase()) ||
        job.description.toLowerCase().includes(search.toLowerCase());
      const matchesCountry = filterCountry === 'all' || job.country === filterCountry;
      const matchesWorkType = filterWorkType === 'all' || job.workType === filterWorkType;
      return matchesSearch && matchesCountry && matchesWorkType;
    });
  }, [jobs, search, filterCountry, filterWorkType]);

  const getRecommendation = (score?: number) => {
    if (score === undefined) return { label: 'Buka Profil', color: 'bg-muted text-muted-foreground border-border' };
    if (score >= 80) return { label: 'Sangat Cocok', color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30' };
    if (score >= 60) return { label: 'Cocok', color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30' };
    if (score >= 40) return { label: 'Potensial', color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30' };
    return { label: 'Rekomendasi', color: 'bg-muted text-muted-foreground border-border' };
  };

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
              onClick={fetchJobs}
              disabled={loading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              Segarkan Lowongan
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
              Lowongan Resmi Terverifikasi & Perlindungan Pekerja Migran
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bursa Lowongan Kerja Luar Negeri
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Jelajahi peluang kerja di Taiwan, Jepang, Korea Selatan, Singapura, Malaysia, dan Timur Tengah. 
              Sistem pencocokan AI menghitung kesesuaian keahlian Anda secara transparan berdasarkan sertifikasi Verifiable Credential.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-3">
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Lowongan Tersedia</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{jobs.length || 8} Posisi</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Kisaran Gaji</p>
                <p className="text-xl font-bold text-emerald-500 mt-0.5">Rp 10Jt - 33Jt</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border col-span-2 sm:col-span-1">
                <p className="text-xs text-muted-foreground">Penempatan Legal</p>
                <p className="text-xl font-bold text-primary mt-0.5">Visa Kerja Resmi</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari posisi, perusahaan, atau deskripsi pekerjaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-12 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <VoiceInput onResult={(text) => setSearch(text)} className="h-7 w-7 p-1 border-none shadow-none" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className={cn('gap-2 rounded-xl text-xs', showFilters && 'bg-muted')}
              >
                <Filter className="h-3.5 w-3.5" />
                Filter Lanjutan
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showFilters && 'rotate-180')} />
              </Button>
              <div className="text-xs text-muted-foreground hidden sm:block">
                Menampilkan <strong className="text-foreground">{filteredJobs.length}</strong> lowongan
              </div>
            </div>
          </div>

          {/* Quick Country Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {COUNTRY_FILTERS.map((item) => (
              <button
                key={item.code}
                onClick={() => setFilterCountry(item.code)}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border flex items-center gap-1.5',
                  filterCountry === item.code
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground hover:bg-muted/60'
                )}
              >
                <span>{item.flag}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Collapsible Advanced Filters */}
          {showFilters && (
            <div className="p-4 rounded-2xl border border-border bg-card/80 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Negara Tujuan
                  </label>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="all">Semua Negara</option>
                    {Object.entries(COUNTRIES).map(([code, { name, flag }]) => (
                      <option key={code} value={code}>
                        {flag} {name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground block mb-1.5">
                    Tipe Kerja
                  </label>
                  <select
                    value={filterWorkType}
                    onChange={(e) => setFilterWorkType(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="all">Semua Tipe Kerja</option>
                    {Object.entries(WORK_TYPE_LABELS).map(([code, label]) => (
                      <option key={code} value={code}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('');
                      setFilterCountry('all');
                      setFilterWorkType('all');
                    }}
                    className="w-full text-xs rounded-xl"
                  >
                    Reset Filter
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-2xl border border-border bg-card/60 p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-3">
                  <div className="h-6 w-32 bg-muted rounded-full" />
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-16 w-full bg-muted/70 rounded" />
                </div>
                <div className="h-10 w-full bg-muted rounded-xl" />
              </div>
            ))
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-full text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-60 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                Tidak ada lowongan ditemukan
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
                {search
                  ? `Tidak ada pekerjaan yang cocok dengan "${search}".`
                  : 'Belum ada lowongan untuk kriteria negara atau tipe kerja yang dipilih.'}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl"
                onClick={() => {
                  setSearch('');
                  setFilterCountry('all');
                  setFilterWorkType('all');
                }}
              >
                Reset Semua Filter
              </Button>
            </div>
          ) : (
            filteredJobs.map((job) => {
              const country = COUNTRIES[job.country] || { name: job.country, flag: '🌍' };
              const recommendation = getRecommendation(job.matchScore);
              const topSkills = job.skills.slice(0, 3);
              const hasMatch = job.matchScore !== undefined;

              return (
                <div
                  key={job.id}
                  className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200"
                >
                  {/* Card Header: Company & Recommendation Badge */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
                        <Building2 className="h-3 w-3 text-primary" />
                        {job.employer.companyName || job.employer.name}
                      </span>
                      <h3 className="font-bold text-base text-foreground mt-1 line-clamp-2 leading-snug">
                        {job.title}
                      </h3>
                    </div>
                    <Badge variant="outline" className={cn('text-[11px] shrink-0 border', recommendation.color)}>
                      {recommendation.label}
                    </Badge>
                  </div>

                  {/* Location & Work Type */}
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="inline-flex items-center gap-1 font-medium text-foreground">
                      <span>{country.flag}</span>
                      <span>{country.name}</span>
                      {job.city && <span className="text-muted-foreground font-normal">({job.city})</span>}
                    </span>
                    <span>•</span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-2">
                      {WORK_TYPE_LABELS[job.workType] || job.workType}
                    </Badge>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-1">
                    {job.description}
                  </p>

                  {/* Salary Box */}
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60 text-xs mb-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        Gaji Pokok:
                      </span>
                      <span className="font-bold text-foreground">
                        {job.salaryCurrency} {job.salaryMin.toLocaleString('id-ID')} - {job.salaryMax.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <p className="text-[10px] text-muted-foreground text-right">
                      Kontrak: {CONTRACT_LABELS[job.contractType] || job.contractType}
                      {job.contractDurationMonths ? ` (${job.contractDurationMonths} bulan)` : ''}
                    </p>
                  </div>

                  {/* AI Match Score Progress */}
                  {hasMatch && (
                    <div className="mb-4 p-2.5 rounded-xl bg-card border border-border/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-500" />
                          Kecocokan Profil Anda
                        </span>
                        <span className="font-bold text-primary">{job.matchScore}%</span>
                      </div>
                      <Progress value={job.matchScore} className="h-1.5" />
                    </div>
                  )}

                  {/* Required Skills Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {topSkills.map((js, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] bg-muted/60 text-muted-foreground border border-border"
                      >
                        {js.skill.name}
                        {js.mandatory && <span className="text-rose-500 font-bold ml-1">*</span>}
                      </span>
                    ))}
                    {job.skills.length > 3 && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] bg-muted text-muted-foreground">
                        +{job.skills.length - 3} lainnya
                      </span>
                    )}
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-border mt-auto">
                    <Button asChild className="w-full gap-2 rounded-xl text-xs" size="sm">
                      <Link href={`/dashboard/jobs/${job.id}`}>
                        Lihat Detail & Lamar
                        <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}