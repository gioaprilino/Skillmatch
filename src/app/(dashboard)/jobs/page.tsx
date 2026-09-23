'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, MapPin, DollarSign, Clock, Search, Filter, ChevronDown, ArrowRight } from 'lucide-react';
import { formatCurrency, getSkillLevelLabel } from '@/lib/utils';
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

interface JobMatchResult {
  jobId: string;
  overallScore: number;
  breakdown: {
    skillMatch: number;
    salaryMatch: number;
    locationMatch: number;
    languageMatch: number;
    certificationBonus: number;
    availabilityMatch: number;
  };
  matchedSkills: MatchedSkill[];
  gaps: SkillGap[];
  recommendation: string;
}

interface SkillGap {
  skillId: string;
  skillName: string;
  requiredLevel: string;
  userLevel: string | null;
}

const COUNTRIES: Record<string, { name: string; flag: string }> = {
  IDN: { name: 'Indonesia', flag: '🇮🇩' },
  SGP: { name: 'Singapura', flag: '🇸🇬' },
  MYS: { name: 'Malaysia', flag: '🇲🇾' },
  HKG: { name: 'Hong Kong', flag: '🇭🇰' },
  TWN: { name: 'Taiwan', flag: '🇹🇼' },
  KOR: { name: 'Korea Selatan', flag: '🇰🇷' },
  JPN: { name: 'Jepang', flag: '🇯🇵' },
  SAU: { name: 'Arab Saudi', flag: '🇸🇦' },
  ARE: { name: 'Uni Emirat Arab', flag: '🇦🇪' },
  QAT: { name: 'Qatar', flag: '🇶🇦' },
  KWT: { name: 'Kuwait', flag: '🇰🇼' },
  OMN: { name: 'Oman', flag: '🇴🇲' },
  BHR: { name: 'Bahrain', flag: '🇧🇭' },
};

const CONTRACT_LABELS: Record<string, string> = {
  FIXED_TERM: 'Kontrak Tetap',
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

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string }> = {
  STRONG_MATCH: { label: 'Sangat Cocok', color: 'bg-green-100 text-green-700' },
  GOOD_MATCH: { label: 'Cocok', color: 'bg-blue-100 text-blue-700' },
  POTENTIAL_MATCH: { label: 'Potensial', color: 'bg-yellow-100 text-yellow-700' },
  LOW_MATCH: { label: 'Kurang Cocok', color: 'bg-gray-100 text-gray-700' },
};

export default function JobBoardPage() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCountry, setFilterCountry] = useState('all');
  const [filterWorkType, setFilterWorkType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, [search, filterCountry, filterWorkType]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (filterCountry !== 'all') params.set('country', filterCountry);
      if (filterWorkType !== 'all') params.set('workType', filterWorkType);
      const res = await fetch(`/api/jobs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setJobs(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted rounded border" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Silakan login untuk melihat lowongan</h2>
        <Button asChild className="mt-4">
          <Link href="/auth/login?callbackUrl=/dashboard/jobs">Login</Link>
        </Button>
      </div>
    );
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !search || 
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.employer.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      job.description.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = filterCountry === 'all' || job.country === filterCountry;
    const matchesWorkType = filterWorkType === 'all' || job.workType === filterWorkType;
    return matchesSearch && matchesCountry && matchesWorkType;
  });

  const getRecommendation = (score?: number) => {
    if (score === undefined) return { label: 'Belum dihitung', color: 'bg-gray-100 text-gray-700' };
    if (score >= 85) return RECOMMENDATION_LABELS.STRONG_MATCH;
    if (score >= 70) return RECOMMENDATION_LABELS.GOOD_MATCH;
    if (score >= 50) return RECOMMENDATION_LABELS.POTENTIAL_MATCH;
    return RECOMMENDATION_LABELS.LOW_MATCH;
  };

  return (
    <div className="space-y-6">
      {/* Header & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lowongan Pekerjaan</h1>
          <p className="text-muted-foreground">Temukan pekerjaan yang cocok dengan skill Anda</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari posisi, perusahaan, deskripsi..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
            />
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2">
              <VoiceInput onResult={(text) => setSearch(text)} className="h-7 w-7 p-1 border-none shadow-none" />
            </div>
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="gap-2 shrink-0">
            <Filter className="h-4 w-4" />
            Filter
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <Card className="border-dashed">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Negara</label>
                <select
                  value={filterCountry}
                  onChange={e => setFilterCountry(e.target.value)}
                  className="w-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Semua Negara</option>
                  {Object.entries(COUNTRIES).map(([code, { name }]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground block mb-1">Tipe Kerja</label>
                <select
                  value={filterWorkType}
                  onChange={e => setFilterWorkType(e.target.value)}
                  className="w-48 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
                >
                  <option value="all">Semua Tipe</option>
                  {Object.entries(WORK_TYPE_LABELS).map(([code, label]) => (
                    <option key={code} value={code}>{label}</option>
                  ))}
                </select>
              </div>
              <Button variant="outline" size="sm" onClick={() => { setSearch(''); setFilterCountry('all'); setFilterWorkType('all'); }} className="mt-6">
                Reset Filter
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Job Grid */}
      {loading ? (
        <div className="animate-pulse space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-muted rounded border" />
            ))}
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada lowongan ditemukan</h3>
            <p className="text-muted-foreground">Coba ubah filter atau kata kunci pencarian</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map(job => {
            const country = COUNTRIES[job.country] || { name: job.country, flag: '🏳️' };
            const recommendation = getRecommendation(job.matchScore);
            const topSkills = job.skills.slice(0, 3);
            const hasMatch = job.matchScore !== undefined;

            return (
              <Link key={job.id} href={`/dashboard/jobs/${job.id}`} className="block">
                <Card className="h-full hover:shadow-md transition-shadow border-primary/20">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-1">{job.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {job.employer.companyName || job.employer.name}
                        </p>
                      </div>
                      <Badge variant="outline" className={recommendation.color}>
                        {recommendation.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {/* Location & Work Type */}
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {country.flag} {country.name}
                        {job.province && <span className="text-muted-foreground">, {job.province}</span>}
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {WORK_TYPE_LABELS[job.workType] || job.workType}
                      </Badge>
                    </div>

                    {/* Salary */}
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}
                        <span className="text-muted-foreground font-normal">/{job.salaryPeriod.toLowerCase()}</span>
                      </span>
                    </div>

                    {/* Match Score Progress */}
                    {hasMatch && (
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>Kecocokan Skill</span>
                          <span className="font-semibold">{job.matchScore}%</span>
                        </div>
                        <Progress value={job.matchScore} className="h-2" />
                      </div>
                    )}

                    {/* Top Required Skills */}
                    <div className="flex flex-wrap gap-1">
                      {topSkills.map((js, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {js.skill.name} ({getSkillLevelLabel(js.level)})
                          {js.mandatory && <span className="ml-1 text-red-500">*</span>}
                        </Badge>
                      ))}
                      {job.skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{job.skills.length - 3} skill lagi
                        </Badge>
                      )}
                    </div>

                    {/* Contract Type */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <span>{CONTRACT_LABELS[job.contractType] || job.contractType}</span>
                      {job.contractDurationMonths && (
                        <>
                          <span>•</span>
                          <span>{job.contractDurationMonths} bulan</span>
                        </>
                      )}
                    </div>

                    {/* Action */}
                    <div className="pt-2">
                      <Button className="w-full" size="sm">
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Detail & Lamar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}