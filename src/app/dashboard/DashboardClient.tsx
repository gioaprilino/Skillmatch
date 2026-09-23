'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  LayoutDashboard,
  BookOpen,
  Briefcase,
  Award,
  Globe,
  PiggyBank,
  Users,
  TrendingUp,
  Target,
  Clock,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DynamicStat {
  label: string;
  value: string;
  key: string;
}

interface DynamicActivity {
  type: string;
  title: string;
  desc: string;
  time: string;
}

export interface SkillProgressItem {
  skill: string;
  level: number;
  target: number;
  levelName?: string;
  verified?: boolean;
}

export interface RecommendationItem {
  title: string;
  match: number;
  type: string;
  href: string;
}

interface DashboardClientProps {
  session: {
    user: {
      name?: string | null;
      role: 'WORKER' | 'EMPLOYER' | 'ADMIN' | 'VERIFIER';
    };
  };
  dynamicStats?: DynamicStat[] | null;
  dynamicActivities?: DynamicActivity[] | null;
  dynamicSkills?: SkillProgressItem[] | null;
  dynamicRecommendations?: RecommendationItem[] | null;
}

const workerStats = [
  { label: 'Skill Terverifikasi', value: '3', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { label: 'Lamaran Terkirim', value: '5', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
  { label: 'Asesmen Lulus', value: '2', icon: BookOpen, color: 'text-green-500', bg: 'bg-green-100' },
  { label: 'Sertifikat Digital (VC)', value: '2', icon: Globe, color: 'text-purple-500', bg: 'bg-purple-100' },
];

const employerStats = [
  { label: 'Lowongan Aktif', value: '3', icon: Briefcase, color: 'text-blue-500', bg: 'bg-blue-100' },
  { label: 'Lamaran Masuk', value: '12', icon: Users, color: 'text-green-500', bg: 'bg-green-100' },
  { label: 'Tahap Seleksi', value: '8', icon: Award, color: 'text-yellow-500', bg: 'bg-yellow-100' },
  { label: 'Kandidat Diterima', value: '4', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-100' },
];

const workerActions = [
  { title: 'Ikuti Asesmen Skill', desc: 'Tes kompetensi & dapat sertifikat', icon: BookOpen, href: '/dashboard/upskilling', color: 'bg-blue-500' },
  { title: 'Cari Lowongan', desc: 'Temukan pekerjaan cocok skill Anda', icon: Briefcase, href: '/dashboard/jobs', color: 'bg-green-500' },
  { title: 'Lengkapi Migrasi', desc: 'Checklist dokumen per negara tujuan', icon: Globe, href: '/dashboard/migration', color: 'bg-purple-500' },
  { title: 'Kelola Keuangan', desc: 'Kalkulator remittance & investasi', icon: PiggyBank, href: '/dashboard/finance', color: 'bg-orange-500' },
];

const employerActions = [
  { title: 'Buat Lowongan Baru', desc: 'Posting pekerjaan dengan skill matching', icon: Briefcase, href: '/dashboard/employer/jobs/new', color: 'bg-blue-500' },
  { title: 'Kelola Kandidat', desc: 'Review lamaran & jadwalkan wawancara', icon: Users, href: '/dashboard/employer/candidates', color: 'bg-green-500' },
  { title: 'Verifikasi VC', desc: 'Scan QR & verifikasi kredensial instan', icon: Award, href: '/dashboard/employer/verify', color: 'bg-purple-500' },
  { title: 'Profil Perusahaan', desc: 'Kelola brand employer & review', icon: LayoutDashboard, href: '/dashboard/employer/profile', color: 'bg-orange-500' },
];

const defaultRecentActivity = [
  { type: 'assessment', title: 'Asesmen Caregiving Level 3', desc: 'Skor: 85% - LULUS', time: '2 jam lalu', icon: CheckCircle2, color: 'text-green-500' },
  { type: 'job', title: 'Lamaran: Perawat Lansia - Singapura', desc: 'Status: Screening', time: '1 hari lalu', icon: Briefcase, color: 'text-blue-500' },
  { type: 'certificate', title: 'Sertifikat Bahasa Inggris B1', desc: 'Verifiable Credential diterbitkan', time: '3 hari lalu', icon: Award, color: 'text-yellow-500' },
  { type: 'migration', title: 'Checklist Singapura: 75% selesai', desc: 'Visa & medis pending', time: '1 minggu lalu', icon: Globe, color: 'text-purple-500' },
];

export default function DashboardClient({
  session,
  dynamicStats,
  dynamicActivities,
  dynamicSkills,
  dynamicRecommendations,
}: DashboardClientProps) {
  const isEmployer = session.user.role === 'EMPLOYER';
  
  const baseStats = isEmployer ? employerStats : workerStats;
  const stats = dynamicStats && dynamicStats.length === 4
    ? dynamicStats.map((ds, idx) => ({
        ...baseStats[idx],
        label: ds.label,
        value: ds.value,
      }))
    : baseStats;

  const actions = isEmployer ? employerActions : workerActions;
  
  const activities = (dynamicActivities && dynamicActivities.length > 0)
    ? dynamicActivities.map((da) => ({
        type: da.type,
        title: da.title,
        desc: da.desc,
        time: da.time,
        icon: da.type === 'assessment' ? CheckCircle2 : Briefcase,
        color: da.type === 'assessment' ? 'text-green-500' : 'text-blue-500',
      }))
    : defaultRecentActivity;

  const defaultSkills: SkillProgressItem[] = [
    { skill: 'Caregiving & Perawatan Lansia', level: 85, target: 90, levelName: 'ADVANCED', verified: true },
    { skill: 'Bahasa Komunikasi Kerja (Mandarin/Inggris)', level: 70, target: 80, levelName: 'INTERMEDIATE', verified: true },
    { skill: 'Keselamatan & Kesehatan Kerja (K3)', level: 65, target: 75, levelName: 'INTERMEDIATE', verified: false },
    { skill: 'First Aid & CPR Darurat', level: 90, target: 90, levelName: 'ADVANCED', verified: true },
    { skill: 'Literasi Keuangan & Tabungan Mandiri', level: 50, target: 70, levelName: 'BEGINNER', verified: false },
  ];

  const skillsList = dynamicSkills && dynamicSkills.length > 0 ? dynamicSkills : defaultSkills;

  const defaultRecommendations: RecommendationItem[] = [
    { title: 'Asesmen: Caregiver Lansia & Pasien Demensia', match: 94, type: 'Sertifikasi', href: '/dashboard/upskilling' },
    { title: 'Lowongan: Staf Housekeeping & Sanitasi Hotel - Singapura', match: 89, type: 'Lowongan', href: '/dashboard/jobs' },
    { title: 'Checklist: Persyaratan Kerja & Dokumen Resmi Taiwan', match: 86, type: 'Migrasi', href: '/dashboard/migration' },
    { title: 'Simulasi: Alokasi Gaji 40/35/25 & Kalkulator Remittance', match: 82, type: 'Keuangan', href: '/dashboard/finance' },
  ];

  const recommendationsList = dynamicRecommendations && dynamicRecommendations.length > 0
    ? dynamicRecommendations
    : defaultRecommendations;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Selamat datang kembali, {session.user.name?.split(' ')[0] || 'Pengguna'}!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={isEmployer ? '/dashboard/employer/jobs/new' : '/dashboard/upskilling'}>
              <span className="hidden sm:inline">Mulai Baru</span>
              <span className="sm:hidden">+</span>
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={cn('p-3 rounded-xl', stat.bg)}>
                  <stat.icon className={cn('h-6 w-6', stat.color)} aria-hidden="true" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {actions.map((action, i) => (
                <Link key={i} href={action.href}>
                  <Button
                    variant="outline"
                    className={cn(
                      'h-24 w-full flex-col items-start justify-center gap-3 text-left hover:border-primary/50 hover:bg-primary/5 transition-all',
                      'group'
                    )}
                  >
                    <div className={cn('p-3 rounded-xl', action.color)}>
                      <action.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    <div className="w-full">
                      <p className="font-medium group-hover:text-primary transition-colors">{action.title}</p>
                      <p className="text-xs text-muted-foreground">{action.desc}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Button>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                  <div className={cn('p-2 rounded-lg bg-muted', activity.color)}>
                    <activity.icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.desc}</p>
                  </div>
                  <div className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Progres Skill & Kompetensi</CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">Pemetaan keahlian berbasis uji kompetensi BNSP & W3C VC</p>
            </div>
            <Button variant="ghost" size="sm" asChild className="text-xs">
              <Link href="/dashboard/upskilling">
                Ikuti Asesmen <ArrowRight className="ml-1 h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillsList.map((item, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.skill}</span>
                    {item.verified && (
                      <Badge variant="outline" className="text-[10px] text-emerald-500 border-emerald-500/30 py-0 h-4">
                        ✓ Terverifikasi VC
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground text-xs font-medium">{item.level}% / {item.target}%</span>
                </div>
                <Progress value={item.level} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rekomendasi untuk Anda</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">Peluang kerja & peningkatan kompetensi terkurasi</p>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendationsList.map((rec, i) => (
              <Link key={i} href={rec.href} className="block group">
                <div className="p-3 rounded-lg border border-border/80 hover:border-primary/60 hover:bg-accent/40 transition-all">
                  <div className="flex items-center justify-between mb-1.5">
                    <Badge variant="outline" className="text-[11px] group-hover:bg-primary/10 transition-colors">
                      {rec.type}
                    </Badge>
                    <span className="text-xs font-semibold text-primary">{rec.match}% Match</span>
                  </div>
                  <p className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">{rec.title}</p>
                  <Progress value={rec.match} className="h-1.5 mt-2.5" />
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}