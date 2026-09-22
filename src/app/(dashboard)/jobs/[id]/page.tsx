'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, MapPin, DollarSign, Clock, Calendar, UserCheck, CheckCircle, XCircle, ArrowLeft, AlertCircle, Info, FileText, Globe, Building2 } from 'lucide-react';
import { formatCurrency, formatDate, getSkillLevelLabel } from '@/lib/utils';
import toast from 'react-hot-toast';

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
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
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
  languageReq?: { language: string; level: string }[];
  passportRequired: boolean;
  visaProvided: boolean;
  medicalCheckRequired: boolean;
  employer: { id: string; name: string; companyName?: string; companyWebsite?: string; companyDescription?: string; companySize?: string };
  skills: JobSkill[];
  matchScore?: number;
  matchedSkills?: { items: MatchedSkill[] };
  gaps?: SkillGap[];
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

const RECOMMENDATION_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  STRONG_MATCH: { label: 'Sangat Cocok', color: 'bg-green-100 text-green-700 border-green-200', icon: CheckCircle },
  GOOD_MATCH: { label: 'Cocok', color: 'bg-blue-100 text-blue-700 border-blue-200', icon: CheckCircle },
  POTENTIAL_MATCH: { label: 'Potensial', color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: Info },
  LOW_MATCH: { label: 'Kurang Cocok', color: 'bg-gray-100 text-gray-700 border-gray-200', icon: AlertCircle },
};

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [availabilityDate, setAvailabilityDate] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJob();
    }
  }, [status, jobId]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data.data);
      } else if (res.status === 404) {
        router.push('/dashboard/jobs');
      }
    } catch (err) {
      toast.error('Gagal memuat lowongan');
      router.push('/dashboard/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!coverLetter.trim()) {
      toast.error('Surat lamaran wajib diisi');
      return;
    }
    setApplying(true);
    try {
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverLetter, expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined, availabilityDate: availabilityDate || undefined }),
      });
      if (res.ok) {
        toast.success('Lamaran berhasil dikirim!');
        setShowApplyModal(false);
        setCoverLetter('');
        setExpectedSalary('');
        setAvailabilityDate('');
        router.push('/dashboard/applications');
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal mengirim lamaran');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    } finally {
      setApplying(false);
    }
  };

  if (loading || !job) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const country = COUNTRIES[job.country] || { name: job.country, flag: '🏳️' };
  const hasMatch = job.matchScore !== undefined;
  const recommendation = hasMatch 
    ? (job.matchScore! >= 85 ? RECOMMENDATION_LABELS.STRONG_MATCH 
       : job.matchScore! >= 70 ? RECOMMENDATION_LABELS.GOOD_MATCH
       : job.matchScore! >= 50 ? RECOMMENDATION_LABELS.POTENTIAL_MATCH
       : RECOMMENDATION_LABELS.LOW_MATCH)
    : null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Lowongan
      </Button>

      {/* Header */}
      <Card className={recommendation ? 'border-primary' : ''}>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{WORK_TYPE_LABELS[job.workType] || job.workType}</Badge>
                <Badge variant="outline">{CONTRACT_LABELS[job.contractType] || job.contractType}</Badge>
              </div>
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {job.employer.companyName || job.employer.name}
              </p>
              {job.employer.companySize && (
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
                  <Building2 className="h-3 w-3" />
                  {job.employer.companySize} karyawan
                </p>
              )}
            </div>
            {recommendation && (
              <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${recommendation.color} text-sm font-medium whitespace-nowrap`}>
                <recommendation.icon className="h-4 w-4" />
                {recommendation.label}
                {hasMatch && <span className="text-2xl font-bold">{job.matchScore}%</span>}
              </div>
            )}
          </div>

          {/* Quick Info Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi</p>
                <p className="font-medium">{country.flag} {country.name}{job.province && `, ${job.province}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Gaji</p>
                <p className="font-medium">{formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}/{job.salaryPeriod.toLowerCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Durasi</p>
                <p className="font-medium">{job.contractDurationMonths ? `${job.contractDurationMonths} bulan` : 'Tidak ditentukan'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Dipublikasikan</p>
                <p className="font-medium">{formatDate(job.publishedAt)}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Deskripsi Pekerjaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{job.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Persyaratan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {job.requirements.map((req, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
              {job.minAge && (
                <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Usia minimal: {job.minAge} tahun
                  {job.maxAge && `, maksimal: ${job.maxAge} tahun`}
                </p>
              )}
              {job.gender && (
                <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  Jenis kelamin: {job.gender}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Tanggung Jawab
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Benefit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skill Match Detail */}
          {hasMatch && job.matchedSkills && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Analisis Kecocokan Skill ({job.matchScore}%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {job.matchedSkills.items.map((ms, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted border">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{ms.skillName}</span>
                        <Badge variant={ms.match >= 100 ? 'default' : ms.match >= 70 ? 'secondary' : 'outline'} className="text-xs">
                          {ms.match}%
                        </Badge>
                      </div>
                      <Progress value={ms.match} className="h-1.5" />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>Butuh: {ms.requiredLevel}</span>
                        <span>Anda: {ms.userLevel}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {job.gaps && job.gaps.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Skill Gap yang Perlu Ditingkatkan
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.gaps.map((gap, i) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {gap.skillName}: butuh {gap.requiredLevel} {gap.userLevel ? `(${gap.userLevel})` : '(belum ada)'}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Ikuti asesmen skill terkait untuk meningkatkan peluang Anda
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Informasi Tambahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Globe className="h-4 w-4" />
                <span>Paspor diperlukan: {job.passportRequired ? 'Ya' : 'Tidak'}</span>
              </div>
              {job.visaProvided && (
                <div className="flex items-center gap-3 text-sm text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span>Visa disediakan oleh employer</span>
                </div>
              )}
              {job.medicalCheckRequired && (
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Medical check-up diperlukan</span>
                </div>
              )}
              {job.languageReq && job.languageReq.length > 0 && (
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Globe className="h-4 w-4 mt-0.5" />
                  <div>
                    <p className="font-medium">Persyaratan Bahasa:</p>
                    <ul className="list-disc list-inside mt-1">
                      {job.languageReq.map((lr, i) => (
                        <li key={i}>{lr.language} (level: {lr.level})</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Apply Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Lamaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-2">Gaji Ditawarkan</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}
                  <span className="text-lg font-normal text-muted-foreground">/{job.salaryPeriod.toLowerCase()}</span>
                </p>
              </div>

              <Button className="w-full" size="lg" onClick={() => setShowApplyModal(true)}>
                <Briefcase className="mr-2 h-4 w-4" />
                Lamar Sekarang
              </Button>

              <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                <p>Dengan melamar, Anda menyetujui syarat & ketentuan.</p>
                <p>Profil dan sertifikat skill Anda akan dikirim ke employer.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Kirim Lamaran</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Surat Lamaran *</label>
                <textarea
                  value={coverLetter}
                  onChange={e => setCoverLetter(e.target.value)}
                  rows={6}
                  placeholder="Jelaskan mengapa Anda cocok untuk posisi ini, pengalaman relevan, dan motivasi Anda..."
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Gaji Diharapkan (opsional)</label>
                <input
                  type="number"
                  value={expectedSalary}
                  onChange={e => setExpectedSalary(e.target.value)}
                  placeholder={`Contoh: ${job.salaryMin}`}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Tanggal Tersedia (opsional)</label>
                <input
                  type="date"
                  value={availabilityDate}
                  onChange={e => setAvailabilityDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setShowApplyModal(false)}>
                  Batal
                </Button>
                <Button className="flex-1" onClick={handleApply} loading={applying}>
                  {applying ? 'Mengirim...' : 'Kirim Lamaran'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}