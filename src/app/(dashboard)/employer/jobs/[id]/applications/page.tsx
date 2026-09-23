'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Briefcase, User, Mail, FileText, Clock, ArrowLeft, CheckCircle, XCircle, Eye, Download, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
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
  appliedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    skills: { skill: { id: string; name: string; category: string }; level: string }[];
    certifications: { skill: { id: string; name: string }; level: string; credentialId: string }[];
  };
}

const STATUS_LABELS: Record<string, { label: string; color: string; next?: string[] }> = {
  APPLIED: { label: 'Dilamar', color: 'bg-blue-100 text-blue-700', next: ['SCREENING', 'REJECTED'] },
  SCREENING: { label: 'Screening', color: 'bg-yellow-100 text-yellow-700', next: ['INTERVIEW', 'REJECTED'] },
  INTERVIEW: { label: 'Wawancara', color: 'bg-orange-100 text-orange-700', next: ['OFFERED', 'REJECTED'] },
  OFFERED: { label: 'Diberi Penawaran', color: 'bg-green-100 text-green-700', next: ['ACCEPTED', 'REJECTED'] },
  ACCEPTED: { label: 'Diterima', color: 'bg-emerald-100 text-emerald-700' },
  REJECTED: { label: 'Ditolak', color: 'bg-red-100 text-red-700' },
  WITHDRAWN: { label: 'Ditarik', color: 'bg-gray-100 text-gray-700' },
};

export default function EmployerApplicationsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const jobId = params.id as string;

  const [job, setJob] = useState<{ id: string; title: string } | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchData = async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [jobRes, appsRes] = await Promise.all([
        fetch(`/api/employer/jobs/${jobId}`, { cache: 'no-store' }),
        fetch(`/api/employer/jobs/${jobId}/applications`, { cache: 'no-store' }),
      ]);
      if (jobRes.ok) {
        const data = await jobRes.json();
        setJob(data.data);
      }
      if (appsRes.ok) {
        const data = await appsRes.json();
        setApplications(data.data);
      }
    } catch (err) {
      if (isInitial) toast.error('Gagal memuat data');
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData(true);

      const interval = setInterval(() => {
        fetchData(false);
      }, 6000);

      const handleFocus = () => fetchData(false);
      window.addEventListener('focus', handleFocus);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') fetchData(false);
      });

      return () => {
        clearInterval(interval);
        window.removeEventListener('focus', handleFocus);
      };
    }
  }, [status, jobId]);

  const handleStatusChange = async (appId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/employer/applications/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status diubah ke ${STATUS_LABELS[newStatus]?.label || newStatus}`);
        fetchData();
      } else {
        toast.error('Gagal mengubah status');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-[60vh]"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" /></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12"><Briefcase className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">Silakan login</h2></div>;
  }

  const filteredApps = applications.filter(app => filterStatus === 'all' || app.status === filterStatus);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <h1 className="text-2xl font-bold mt-2">{job?.title || 'Lowongan'}</h1>
          <p className="text-muted-foreground">{applications.length} lamaran total</p>
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg">
          <option value="all">Semua Status</option>
          {Object.entries(STATUS_LABELS).map(([key, val]) => <option key={key} value={key}>{val.label}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted rounded border" />)}
        </div>
      ) : filteredApps.length === 0 ? (
        <Card><CardContent className="p-12 text-center"><FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Tidak ada lamaran</h3><p className="text-muted-foreground">Belum ada pelamar untuk lowongan ini</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filteredApps.map(app => {
            const statusInfo = STATUS_LABELS[app.status] || { label: app.status, color: 'bg-gray-100 text-gray-700' };
            const isExpanded = expandedIds.has(app.id);

            return (
              <Card key={app.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                          {app.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-semibold">{app.user.name}</h3>
                          <p className="text-sm text-muted-foreground">{app.user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                        {app.matchScore !== undefined && (
                          <div className="hidden sm:flex items-center gap-2">
                            <span className="text-sm">Match: <span className="font-bold">{app.matchScore}%</span></span>
                            <Progress value={app.matchScore} className="w-24 h-1.5" />
                          </div>
                        )}
                        <Button variant="ghost" size="icon" onClick={() => toggleExpand(app.id)}>
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="p-4 space-y-4 border-t bg-muted/30">
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Telepon</p>
                          <p>{app.user.phone || '-'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Dilamar</p>
                          <p>{formatDate(app.appliedAt)}</p>
                        </div>
                        {app.expectedSalary && (
                          <div>
                            <p className="text-xs text-muted-foreground">Gaji Diharapkan</p>
                            <p>{formatCurrency(app.expectedSalary)}</p>
                          </div>
                        )}
                        {app.availabilityDate && (
                          <div>
                            <p className="text-xs text-muted-foreground">Tersedia</p>
                            <p>{formatDate(app.availabilityDate)}</p>
                          </div>
                        )}
                      </div>

                      {app.matchScore !== undefined && (
                        <div className="p-3 rounded-lg bg-white border">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">Kecocokan Skill</span>
                            <span className="font-bold text-primary">{app.matchScore}%</span>
                          </div>
                          <Progress value={app.matchScore} className="h-2 mb-2" />
                          {app.matchedSkills?.items && (
                            <div className="flex flex-wrap gap-1">
                              {app.matchedSkills.items.slice(0, 5).map((ms, i) => (
                                <Badge key={i} variant={ms.match >= 100 ? 'default' : ms.match >= 70 ? 'secondary' : 'outline'} className="text-xs">
                                  {ms.skillName}: {ms.match}%
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div>
                        <p className="font-medium mb-2">Surat Lamaran</p>
                        <div className="p-3 bg-white rounded border whitespace-pre-wrap text-sm">{app.coverLetter}</div>
                      </div>

                      {app.user.skills.length > 0 && (
                        <div>
                          <p className="font-medium mb-2">Skill Pelamar</p>
                          <div className="flex flex-wrap gap-2">
                            {app.user.skills.map((s, i) => (
                              <Badge key={i} variant="outline">{s.skill.name} ({s.level})</Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {app.user.certifications.length > 0 && (
                        <div>
                          <p className="font-medium mb-2">Sertifikat (VC)</p>
                          <div className="flex flex-wrap gap-2">
                            {app.user.certifications.map((c, i) => (
                              <Badge key={i} variant="default" className="bg-green-100 text-green-700">
                                {c.skill.name} - {c.level}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-2 pt-4 border-t">
                        {statusInfo.next?.map(nextStatus => (
                          <Button key={nextStatus} size="sm" variant={nextStatus === 'REJECTED' ? 'destructive' : 'default'} onClick={() => handleStatusChange(app.id, nextStatus)}>
                            {STATUS_LABELS[nextStatus]?.label}
                          </Button>
                        ))}
                        <Button variant="outline" size="sm" asChild>
                          <a href={`/dashboard/applications/${app.id}`} target="_blank"><Eye className="mr-1 h-3 w-3" /> Detail</a>
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}