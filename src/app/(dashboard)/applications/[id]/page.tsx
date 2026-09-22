'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, FileText, Clock, ArrowLeft, Eye, XCircle, CheckCircle, Download, MapPin, DollarSign, Calendar, Building2, UserCheck, AlertCircle, Info } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

interface Application {
  id: string;
  status: string;
  coverLetter: string;
  expectedSalary?: number;
  availabilityDate?: string;
  matchScore?: number;
  matchedSkills?: { items: any[] };
  gaps?: any[];
  appliedAt: string;
  reviewedAt?: string;
  notes?: string;
  job: {
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
    employer: { id: string; name: string; companyName?: string; companyWebsite?: string; companyDescription?: string };
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; icon: any }> = {
  APPLIED: { label: 'Dilamar', color: 'bg-blue-100 text-blue-700', icon: Clock },
  SCREENING: { label: 'Screening', color: 'bg-yellow-100 text-yellow-700', icon: FileText },
  INTERVIEW: { label: 'Wawancara', color: 'bg-orange-100 text-orange-700', icon: CheckCircle },
  OFFERED: { label: 'Diberi Penawaran', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  ACCEPTED: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle },
  REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700', icon: XCircle },
  WITHDRAWN: { label: 'Ditarik', color: 'bg-gray-100 text-gray-700', icon: XCircle },
};

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

const WORK_TYPE_LABELS: Record<string, string> = {
  ONSITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
};

const CONTRACT_LABELS: Record<string, string> = {
  FIXED_TERM: 'Kontrak Tetap',
  PERMANENT: 'Permanen',
  SEASONAL: 'Musiman',
  PROJECT_BASED: 'Berbasis Proyek',
  APPRENTICESHIP: 'Magang',
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplication();
    }
  }, [status, applicationId]);

  const fetchApplication = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`);
      if (res.ok) {
        const data = await res.json();
        setApplication(data.data);
      } else if (res.status === 404) {
        router.push('/dashboard/applications');
      }
    } catch (err) {
      toast.error('Gagal memuat lamaran');
      router.push('/dashboard/applications');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!confirm('Yakin ingin menarik lamaran ini? Tindakan ini tidak bisa dibatalkan.')) return;
    setWithdrawing(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Lamaran ditarik');
        router.push('/dashboard/applications');
      } else {
        toast.error('Gagal menarik lamaran');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setWithdrawing(false);
    }
  };

  if (loading || !application) {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  const country = COUNTRIES[application.job.country] || { name: application.job.country, flag: '🏳️' };
  const statusInfo = STATUS_LABELS[application.status] || { label: application.status, color: 'bg-gray-100 text-gray-700', icon: FileText };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Lamaran
      </Button>

      <Card className="border-primary">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold">{application.job.title}</h1>
              <p className="text-muted-foreground flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {application.job.employer.companyName || application.job.employer.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={`${statusInfo.color} text-lg px-4 py-2`}>
                <StatusIcon className="mr-2 h-4 w-4" />
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi</p>
                <p className="font-medium">{country.flag} {country.name}{application.job.province && `, ${application.job.province}`}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <DollarSign className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Gaji</p>
                <p className="font-medium">{formatCurrency(application.job.salaryMin, application.job.salaryCurrency)} - {formatCurrency(application.job.salaryMax, application.job.salaryCurrency)}/{application.job.salaryPeriod.toLowerCase()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Dilamar</p>
                <p className="font-medium">{formatDate(application.appliedAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <UserCheck className="h-5 w-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Tipe Kerja</p>
                <p className="font-medium">{WORK_TYPE_LABELS[application.job.workType] || application.job.workType}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Match Score */}
          {application.matchScore !== undefined && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-5 w-5" />
                  Analisis Kecocokan ({application.matchScore}%)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Overall Match</span>
                    <span className="font-bold text-primary">{application.matchScore}%</span>
                  </div>
                  <Progress value={application.matchScore} className="h-3" />
                </div>
                {application.matchedSkills?.items && (
                  <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {application.matchedSkills.items.map((ms: any, i: number) => (
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
                )}
                {application.gaps && application.gaps.length > 0 && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <h4 className="font-medium text-destructive flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Skill Gap
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {application.gaps.map((gap: any, i: number) => (
                        <Badge key={i} variant="destructive" className="text-xs">
                          {gap.skillName}: butuh {gap.requiredLevel} {gap.userLevel ? `(${gap.userLevel})` : '(belum ada)'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Cover Letter */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Surat Lamaran
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">{application.coverLetter}</div>
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detail Lowongan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{application.job.description}</p>
              </div>
              {application.job.requirements.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Persyaratan</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {application.job.requirements.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {application.job.responsibilities.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Tanggung Jawab</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {application.job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                  </ul>
                </div>
              )}
              {application.job.benefits.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-medium mb-2">Benefit</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {application.job.benefits.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Lamaran dikirim</p>
                    <p className="text-sm text-muted-foreground">{formatDate(application.appliedAt)}</p>
                  </div>
                </div>
                {application.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                      <FileText className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-medium">Ditinjau oleh employer</p>
                      <p className="text-sm text-muted-foreground">{formatDate(application.reviewedAt)}</p>
                    </div>
                  </div>
                )}
                {['INTERVIEW', 'OFFERED', 'ACCEPTED', 'REJECTED'].includes(application.status) && application.reviewedAt && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Status: {STATUS_LABELS[application.status]?.label || application.status}</p>
                      <p className="text-sm text-muted-foreground">{application.notes ? `Catatan: ${application.notes}` : 'Tidak ada catatan'}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Aksi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {['APPLIED', 'SCREENING'].includes(application.status) && (
                <Button variant="destructive" className="w-full" onClick={handleWithdraw} loading={withdrawing}>
                  <XCircle className="mr-2 h-4 w-4" />
                  {withdrawing ? 'Menarik...' : 'Tarik Lamaran'}
                </Button>
              )}
              {application.status === 'OFFERED' && (
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terima Penawaran
                </Button>
              )}
              <Link href={`/dashboard/jobs/${application.job.id}`}>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Lihat Lowongan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}