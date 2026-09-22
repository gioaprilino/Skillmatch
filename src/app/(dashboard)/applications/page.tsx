'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, FileText, Clock, ArrowLeft, Eye, XCircle, CheckCircle, Download, Loader2 } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';

interface Application {
  id: string;
  status: string;
  coverLetter: string;
  expectedSalary?: number;
  availabilityDate?: string;
  matchScore?: number;
  matchedSkills?: { items: any[] };
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

export default function ApplicationsPage() {
  const { data: session, status } = useSession();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchApplications();
    }
  }, [status]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/applications');
      if (res.ok) {
        const data = await res.json();
        setApplications(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (id: string) => {
    if (!confirm('Yakin ingin menarik lamaran ini?')) return;
    try {
      const res = await fetch(`/api/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchApplications();
      }
    } catch {
      // Ignore
    }
  };

  if (status === 'loading') {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/4" /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><div className="h-56 bg-muted rounded border" /></div></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12"><Briefcase className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">Silakan login</h2></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lamaran Saya</h1>
          <p className="text-muted-foreground">Kelola dan pantau status lamaran pekerjaan</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded border" />)}
        </div>
      ) : applications.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum ada lamaran</h3>
            <p className="text-muted-foreground mb-4">Mulai lamar pekerjaan yang cocok dengan skill Anda</p>
            <Link href="/dashboard/jobs">
              <Button><Briefcase className="mr-2 h-4 w-4" /> Cari Lowongan</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const country = COUNTRIES[app.job.country] || { name: app.job.country, flag: '🏳️' };
            const statusInfo = STATUS_LABELS[app.status] || { label: app.status, color: 'bg-gray-100 text-gray-700', icon: FileText };
            const StatusIcon = statusInfo.icon;

            return (
              <Card key={app.id} className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{app.job.title}</h3>
                        <Badge className={statusInfo.color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Briefcase className="h-3 w-3" />
                          {app.job.employer.companyName || app.job.employer.name}
                        </span>
                        <span className="flex items-center gap-1">
                          {country.flag} {country.name}
                        </span>
                        <span className="flex items-center gap-1">
                          {formatCurrency(app.job.salaryMin, app.job.salaryCurrency)} - {formatCurrency(app.job.salaryMax, app.job.salaryCurrency)}/{app.job.salaryPeriod.toLowerCase()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(app.appliedAt)}
                        </span>
                      </div>
                      {app.matchScore !== undefined && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">Kecocokan:</span>
                          <span className="font-bold text-primary">{app.matchScore}%</span>
                          <Progress value={app.matchScore} className="w-32 h-1.5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/jobs/${app.job.id}`}>
                        <Button variant="outline" size="sm"><Eye className="mr-1 h-3 w-3" /> Detail Lowongan</Button>
                      </Link>
                      <Link href={`/dashboard/applications/${app.id}`}>
                        <Button variant="outline" size="sm"><FileText className="mr-1 h-3 w-3" /> Detail Lamaran</Button>
                      </Link>
                      {['APPLIED', 'SCREENING'].includes(app.status) && (
                        <Button variant="destructive" size="sm" onClick={() => handleWithdraw(app.id)}>
                          <XCircle className="mr-1 h-3 w-3" /> Tarik Lamaran
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}