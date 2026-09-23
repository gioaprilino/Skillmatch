'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Briefcase, 
  Clock, 
  ArrowLeft, 
  Eye, 
  XCircle, 
  CheckCircle2, 
  RefreshCw,
  Search,
  Building2,
  Calendar,
  Sparkles,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { formatDate, formatCurrency, cn } from '@/lib/utils';

interface Application {
  id: string;
  status: string;
  coverLetter?: string;
  expectedSalary?: number;
  availabilityDate?: string;
  matchScore?: number;
  notes?: string;
  appliedAt: string;
  reviewedAt?: string;
  job: {
    id: string;
    title: string;
    country: string;
    salaryMin: number;
    salaryMax: number;
    salaryCurrency: string;
    salaryPeriod: string;
    employer: { id: string; name: string; companyName?: string };
  };
}

const STATUS_CONFIG: Record<
  string, 
  { label: string; badgeClass: string; stepIndex: number; desc: string }
> = {
  APPLIED: { 
    label: 'Terkirim', 
    badgeClass: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30', 
    stepIndex: 1,
    desc: 'Lamaran & kredensial berhasil dikirimkan ke agensi/perusahaan.'
  },
  SCREENING: { 
    label: 'Screening Berkas', 
    badgeClass: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30', 
    stepIndex: 2,
    desc: 'Verifikasi sertifikat digital VC dan kelengkapan dokumen kerja.'
  },
  INTERVIEW: { 
    label: 'Tahap Wawancara', 
    badgeClass: 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30', 
    stepIndex: 3,
    desc: 'Wawancara kompetensi kerja secara daring dengan perwakilan employer.'
  },
  OFFERED: { 
    label: 'Penawaran Kontrak', 
    badgeClass: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30', 
    stepIndex: 4,
    desc: 'Draft kontrak kerja standar (MOH/MOL) siap ditinjau dan ditandatangani.'
  },
  ACCEPTED: { 
    label: 'Diterima & Pengurusan Visa', 
    badgeClass: 'bg-emerald-600/20 text-emerald-600 dark:text-emerald-300 border-emerald-500/40', 
    stepIndex: 5,
    desc: 'Selamat! Anda diterima dan masuk tahap proses visa kerja & tiket penerbangan.'
  },
  REJECTED: { 
    label: 'Belum Sesuai', 
    badgeClass: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30', 
    stepIndex: 0,
    desc: 'Kualifikasi belum sesuai kriteria. Anda dapat mencoba melamar lowongan lain.'
  },
  WITHDRAWN: { 
    label: 'Lamaran Ditarik', 
    badgeClass: 'bg-muted text-muted-foreground border-border', 
    stepIndex: 0,
    desc: 'Lamaran telah ditarik secara sukarela oleh pelamar.'
  },
};

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

const STAGES = [
  'Kirim Lamaran',
  'Screening & VC',
  'Wawancara',
  'Penawaran Kontrak',
  'Visa & Berangkat',
];

export default function ApplicationsPage() {
  const { data: session } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<'all' | 'in_progress' | 'interview' | 'accepted'>('all');
  const [search, setSearch] = useState('');

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.data)) {
          setApplications(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleWithdraw = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menarik lamaran ini?')) return;
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchApplications();
      }
    } catch {
      // Ignore
    }
  };

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        !search ||
        app.job.title.toLowerCase().includes(search.toLowerCase()) ||
        app.job.employer.companyName?.toLowerCase().includes(search.toLowerCase());

      if (!matchesSearch) return false;

      if (filterTab === 'in_progress') {
        return ['APPLIED', 'SCREENING', 'INTERVIEW'].includes(app.status);
      }
      if (filterTab === 'interview') {
        return app.status === 'INTERVIEW';
      }
      if (filterTab === 'accepted') {
        return ['OFFERED', 'ACCEPTED'].includes(app.status);
      }
      return true;
    });
  }, [applications, search, filterTab]);

  const metrics = useMemo(() => {
    const total = applications.length;
    const screening = applications.filter((a) => a.status === 'SCREENING').length;
    const interview = applications.filter((a) => a.status === 'INTERVIEW').length;
    const accepted = applications.filter((a) => ['OFFERED', 'ACCEPTED'].includes(a.status)).length;
    return { total, screening, interview, accepted };
  }, [applications]);

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
              onClick={fetchApplications}
              disabled={loading}
              className="gap-2 text-xs"
            >
              <RefreshCw className={cn('h-3.5 w-3.5', loading && 'animate-spin')} />
              Segarkan Status
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        {/* Header Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-secondary/30 p-6 sm:p-8">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
              <FileCheck2 className="h-3.5 w-3.5" />
              Pelacakan Status Lamaran Real-Time
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Manajemen & Status Lamaran Saya
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Pantau seluruh progres lamaran kerja Anda ke agensi dan employer luar negeri secara transparan. 
              Setiap tahapan seleksi, hasil verifikasi kredensial W3C, dan jadwal wawancara diupdate secara berkala.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3">
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Total Lamaran</p>
                <p className="text-xl font-bold text-foreground mt-0.5">{metrics.total} Posisi</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Screening Berkas</p>
                <p className="text-xl font-bold text-amber-500 mt-0.5">{metrics.screening}</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Wawancara</p>
                <p className="text-xl font-bold text-indigo-500 mt-0.5">{metrics.interview}</p>
              </div>
              <div className="p-3 rounded-xl bg-card/80 border border-border">
                <p className="text-xs text-muted-foreground">Diterima / Kontrak</p>
                <p className="text-xl font-bold text-emerald-500 mt-0.5">{metrics.accepted}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari posisi atau nama perusahaan..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setFilterTab('all')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                  filterTab === 'all'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                )}
              >
                Semua ({applications.length})
              </button>
              <button
                onClick={() => setFilterTab('in_progress')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                  filterTab === 'in_progress'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                )}
              >
                Dalam Proses ({metrics.screening + metrics.interview})
              </button>
              <button
                onClick={() => setFilterTab('interview')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                  filterTab === 'interview'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                )}
              >
                Wawancara ({metrics.interview})
              </button>
              <button
                onClick={() => setFilterTab('accepted')}
                className={cn(
                  'px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
                  filterTab === 'accepted'
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                    : 'bg-card text-muted-foreground border-border hover:text-foreground'
                )}
              >
                Diterima ({metrics.accepted})
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-2xl border border-border bg-card/60 p-6 flex flex-col justify-between animate-pulse"
              >
                <div className="space-y-2">
                  <div className="h-5 w-48 bg-muted rounded" />
                  <div className="h-4 w-72 bg-muted/70 rounded" />
                </div>
                <div className="h-8 w-full bg-muted/50 rounded-xl" />
              </div>
            ))
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border bg-card/40">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground opacity-60 mb-3" />
              <h3 className="text-base font-semibold text-foreground">
                Belum ada lamaran pekerjaan
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto mb-4">
                {search
                  ? `Tidak ada lamaran yang cocok dengan "${search}".`
                  : 'Anda belum melamar pekerjaan. Temukan lowongan kerja luar negeri yang cocok dengan keahlian Anda sekarang.'}
              </p>
              <Button asChild className="rounded-xl gap-2">
                <Link href="/dashboard/jobs">
                  <Briefcase className="h-4 w-4" />
                  Jelajahi Lowongan Kerja
                </Link>
              </Button>
            </div>
          ) : (
            filteredApplications.map((app) => {
              const country = COUNTRIES[app.job.country] || { name: app.job.country, flag: '🌍' };
              const statusCfg = STATUS_CONFIG[app.status] || {
                label: app.status,
                badgeClass: 'bg-muted text-muted-foreground',
                stepIndex: 1,
                desc: 'Lamaran dalam peninjauan.',
              };
              const isTerminal = ['REJECTED', 'WITHDRAWN'].includes(app.status);

              return (
                <div
                  key={app.id}
                  className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:border-primary/40 hover:shadow-md transition-all duration-200 space-y-5"
                >
                  {/* Top Bar: Title, Employer, Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{country.flag}</span>
                        <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                          <Link href={`/dashboard/jobs/${app.job.id}`}>{app.job.title}</Link>
                        </h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1 font-medium text-foreground">
                          <Building2 className="h-3.5 w-3.5 text-primary" />
                          {app.job.employer.companyName || app.job.employer.name}
                        </span>
                        <span>•</span>
                        <span>{country.name}</span>
                        <span>•</span>
                        <span>
                          Gaji:{' '}
                          <strong className="text-foreground">
                            {app.job.salaryCurrency} {app.job.salaryMin.toLocaleString('id-ID')} - {app.job.salaryMax.toLocaleString('id-ID')}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <Badge variant="outline" className={cn('text-xs px-3 py-1 font-semibold border', statusCfg.badgeClass)}>
                        {statusCfg.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Recruitment Pipeline Progress Bar (for active statuses) */}
                  {!isTerminal && (
                    <div className="pt-2 pb-1">
                      <div className="grid grid-cols-5 gap-2 text-center mb-2">
                        {STAGES.map((stg, idx) => {
                          const isDone = idx + 1 < statusCfg.stepIndex;
                          const isCurrent = idx + 1 === statusCfg.stepIndex;
                          return (
                            <div key={idx} className="space-y-1">
                              <div
                                className={cn(
                                  'h-1.5 rounded-full transition-all duration-300',
                                  isDone
                                    ? 'bg-primary'
                                    : isCurrent
                                    ? 'bg-primary animate-pulse'
                                    : 'bg-muted'
                                )}
                              />
                              <p
                                className={cn(
                                  'text-[10px] sm:text-[11px] truncate font-medium',
                                  isCurrent
                                    ? 'text-primary font-bold'
                                    : isDone
                                    ? 'text-foreground'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {stg}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Note / Feedback from Employer */}
                  {app.notes && (
                    <div className="p-3 rounded-xl bg-muted/40 border border-border/80 flex items-start gap-2.5 text-xs">
                      <AlertCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">Catatan Agensi/Employer: </span>
                        <span className="text-muted-foreground">{app.notes}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer Meta & Action Buttons */}
                  <div className="pt-3 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        Diajukan: {formatDate(app.appliedAt)}
                      </span>
                      {app.matchScore !== undefined && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-semibold text-[11px] border border-primary/20">
                          <Sparkles className="h-3 w-3" />
                          Kecocokan AI: {app.matchScore}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button asChild variant="outline" size="sm" className="rounded-xl text-xs">
                        <Link href={`/dashboard/jobs/${app.job.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1.5" />
                          Rincian Pekerjaan
                        </Link>
                      </Button>

                      {['APPLIED', 'SCREENING'].includes(app.status) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleWithdraw(app.id)}
                          className="rounded-xl text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10"
                        >
                          <XCircle className="h-3.5 w-3.5 mr-1" />
                          Tarik Lamaran
                        </Button>
                      )}
                    </div>
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