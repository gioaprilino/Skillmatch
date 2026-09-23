'use client';

import { useEffect, useState } from 'react';
import { useSession } from '@/lib/auth-client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Plus, Edit, Trash2, Eye, Search, Filter, Loader2, ArrowLeft } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
import toast from 'react-hot-toast';

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
  status: string;
  viewCount: number;
  applicationCount: number;
  publishedAt?: string;
  createdAt: string;
  skills: { skill: { id: string; name: string } }[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  PUBLISHED: { label: 'Dipublikasikan', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Ditutup', color: 'bg-yellow-100 text-yellow-700' },
  FILLED: { label: 'Terisi', color: 'bg-blue-100 text-blue-700' },
};

const WORK_TYPE_LABELS: Record<string, string> = {
  ONSITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
};

export default function EmployerJobsPage() {
  const { data: session, status } = useSession();
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJobs();
    }
  }, [status]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/employer/jobs');
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

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus lowongan ini?')) return;
    try {
      const res = await fetch(`/api/employer/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Lowongan dihapus');
        fetchJobs();
      } else {
        toast.error('Gagal menghapus');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    }
  };

  if (status === 'loading') {
    return <div className="animate-pulse space-y-4"><div className="h-8 bg-muted rounded w-1/4" /><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><div className="h-64 bg-muted rounded border" /></div></div>;
  }

  if (status === 'unauthenticated') {
    return <div className="text-center py-12"><Briefcase className="mx-auto h-12 w-12 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">Silakan login</h2></div>;
  }

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = !search || job.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Lowongan Saya</h1>
          <p className="text-muted-foreground">Kelola lowongan pekerjaan perusahaan Anda</p>
        </div>
        <Link href="/dashboard/employer/jobs/new">
          <Button><Plus className="mr-2 h-4 w-4" /> Buat Lowongan Baru</Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input type="text" placeholder="Cari lowongan..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 border rounded-lg focus:ring-2 focus:ring-ring">
          <option value="all">Semua Status</option>
          <option value="DRAFT">Draft</option>
          <option value="PUBLISHED">Dipublikasikan</option>
          <option value="CLOSED">Ditutup</option>
          <option value="FILLED">Terisi</option>
        </select>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4"><div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"><div className="h-56 bg-muted rounded border" /></div></div>
      ) : filteredJobs.length === 0 ? (
        <Card><CardContent className="p-12 text-center"><Briefcase className="mx-auto h-12 w-12 text-muted-foreground mb-4" /><h3 className="text-lg font-semibold mb-2">Belum ada lowongan</h3><p className="text-muted-foreground mb-4">Buat lowongan pertama Anda</p><Link href="/dashboard/employer/jobs/new"><Button><Plus className="mr-2 h-4 w-4" /> Buat Lowongan</Button></Link></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map(job => {
            const statusInfo = STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-700' };
            return (
              <Card key={job.id} className="border-dashed">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1"><Briefcase className="h-3 w-3" />{WORK_TYPE_LABELS[job.workType] || job.workType}</span>
                        <span className="flex items-center gap-1"><span className="text-base">🏳️</span> {job.country}{job.province && `, ${job.province}`}</span>
                        <span className="flex items-center gap-1">{formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}/{job.salaryPeriod.toLowerCase()}</span>
                        <span className="flex items-center gap-1">👁 {job.viewCount} dilihat</span>
                        <span className="flex items-center gap-1">📝 {job.applicationCount} lamaran</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {job.skills.slice(0, 3).map((s, i) => <Badge key={i} variant="secondary" className="text-xs">{s.skill.name}</Badge>)}
                        {job.skills.length > 3 && <Badge variant="outline" className="text-xs">+{job.skills.length - 3}</Badge>}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/jobs/${job.id}`}><Button variant="outline" size="sm"><Eye className="mr-1 h-3 w-3" /> Lihat</Button></Link>
                      <Link href={`/dashboard/employer/jobs/${job.id}`}><Button variant="outline" size="sm"><Edit className="mr-1 h-3 w-3" /> Edit</Button></Link>
                      <Link href={`/dashboard/employer/jobs/${job.id}/applications`}><Button size="sm">Lamaran ({job.applicationCount})</Button></Link>
                      {job.status === 'DRAFT' && <Button variant="outline" size="sm" onClick={() => handleDelete(job.id)}><Trash2 className="mr-1 h-3 w-3" /> Hapus</Button>}
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