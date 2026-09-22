'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Briefcase, Edit, Save, X, Loader2, ArrowLeft, Eye, Users, FileText, Calendar, DollarSign, MapPin, BriefcaseBusiness, Plus } from 'lucide-react';
import { formatDate, formatCurrency } from '@/lib/utils';
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
  status: string;
  viewCount: number;
  applicationCount: number;
  publishedAt?: string;
  createdAt: string;
  skills: JobSkill[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  PUBLISHED: { label: 'Dipublikasikan', color: 'bg-green-100 text-green-700' },
  CLOSED: { label: 'Ditutup', color: 'bg-yellow-100 text-yellow-700' },
  FILLED: { label: 'Terisi', color: 'bg-blue-100 text-blue-700' },
};

const WORK_TYPES = ['ONSITE', 'HYBRID', 'REMOTE'];
const WORK_TYPE_LABELS: Record<string, string> = {
  ONSITE: 'On-site',
  HYBRID: 'Hybrid',
  REMOTE: 'Remote',
};

const CONTRACT_TYPES = ['FIXED_TERM', 'PERMANENT', 'SEASONAL', 'PROJECT_BASED', 'APPRENTICESHIP'];
const CONTRACT_LABELS: Record<string, string> = {
  FIXED_TERM: 'Kontrak Tetap',
  PERMANENT: 'Permanen',
  SEASONAL: 'Musiman',
  PROJECT_BASED: 'Berbasis Proyek',
  APPRENTICESHIP: 'Magang',
};

const SALARY_PERIODS = ['MONTHLY', 'YEARLY', 'WEEKLY', 'DAILY', 'HOURLY'];
const SALARY_CURRENCIES = ['IDR', 'USD', 'SGD', 'MYR', 'HKD', 'TWD', 'KRW', 'JPY', 'SAR', 'AED', 'QAR', 'KWD', 'OMR', 'BHD'];

const COUNTRIES = [
  { code: 'IDN', name: 'Indonesia' },
  { code: 'SGP', name: 'Singapura' },
  { code: 'MYS', name: 'Malaysia' },
  { code: 'HKG', name: 'Hong Kong' },
  { code: 'TWN', name: 'Taiwan' },
  { code: 'KOR', name: 'Korea Selatan' },
  { code: 'JPN', name: 'Jepang' },
  { code: 'SAU', name: 'Arab Saudi' },
  { code: 'ARE', name: 'Uni Emirat Arab' },
  { code: 'QAT', name: 'Qatar' },
  { code: 'KWT', name: 'Kuwait' },
  { code: 'OMN', name: 'Oman' },
  { code: 'BHR', name: 'Bahrain' },
];

export default function EmployerJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<JobPost>>({});

  useEffect(() => {
    if (status === 'authenticated') {
      fetchJob();
    }
  }, [status, jobId]);

  const fetchJob = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data.data);
        setFormData(data.data);
      } else {
        router.push('/dashboard/employer/jobs');
      }
    } catch (err) {
      toast.error('Gagal memuat lowongan');
      router.push('/dashboard/employer/jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const arr = [...(formData[field as keyof typeof formData] as string[] || [])];
    arr[index] = value;
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  const handleArrayAdd = (field: string) => {
    const arr = [...(formData[field as keyof typeof formData] as string[] || []), ''];
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  const handleArrayRemove = (field: string, index: number) => {
    const arr = [...(formData[field as keyof typeof formData] as string[] || [])];
    arr.splice(index, 1);
    setFormData(prev => ({ ...prev, [field]: arr }));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description) {
      toast.error('Judul dan deskripsi wajib diisi');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success('Perubahan disimpan');
        setEditing(false);
        fetchJob();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal menyimpan');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/employer/jobs/${jobId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: newStatus }),
      });
      if (res.ok) {
        toast.success(`Status diubah ke ${STATUS_LABELS[newStatus]?.label || newStatus}`);
        fetchJob();
      } else {
        toast.error('Gagal mengubah status');
      }
    } catch {
      toast.error('Terjadi kesalahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !job) {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  const statusInfo = STATUS_LABELS[job.status] || { label: job.status, color: 'bg-gray-100 text-gray-700' };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
        </Button>
        <div className="flex items-center gap-2">
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          {job.status === 'DRAFT' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('PUBLISHED')} disabled={saving}>
              Publikasikan
            </Button>
          )}
          {job.status === 'PUBLISHED' && (
            <Button variant="outline" size="sm" onClick={() => handleStatusChange('CLOSED')} disabled={saving}>
              Tutup Lowongan
            </Button>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Edit Lowongan</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setEditing(false); setFormData(job); }}>
                  <X className="mr-2 h-4 w-4" /> Batal
                </Button>
                <Button onClick={handleSave} loading={saving}><Save className="mr-2 h-4 w-4" /> Simpan</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label>Judul *</Label>
                  <Input value={formData.title} onChange={e => handleInputChange('title', e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Deskripsi *</Label>
                  <Textarea value={formData.description} onChange={e => handleInputChange('description', e.target.value)} rows={4} />
                </div>
                <div>
                  <Label>Negara</Label>
                  <Select value={formData.country} onValueChange={v => handleInputChange('country', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Provinsi</Label>
                  <Input value={formData.province} onChange={e => handleInputChange('province', e.target.value)} />
                </div>
                <div>
                  <Label>Kota</Label>
                  <Input value={formData.city} onChange={e => handleInputChange('city', e.target.value)} />
                </div>
                <div>
                  <Label>Tipe Kerja</Label>
                  <Select value={formData.workType} onValueChange={v => handleInputChange('workType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{WORK_TYPES.map(t => <SelectItem key={t} value={t}>{WORK_TYPE_LABELS[t]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Gaji Min</Label>
                  <Input type="number" value={formData.salaryMin} onChange={e => handleInputChange('salaryMin', parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Gaji Max</Label>
                  <Input type="number" value={formData.salaryMax} onChange={e => handleInputChange('salaryMax', parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <Label>Mata Uang</Label>
                  <Select value={formData.salaryCurrency} onValueChange={v => handleInputChange('salaryCurrency', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{SALARY_CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Periode</Label>
                  <Select value={formData.salaryPeriod} onValueChange={v => handleInputChange('salaryPeriod', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{SALARY_PERIODS.map(p => <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Tipe Kontrak</Label>
                  <Select value={formData.contractType} onValueChange={v => handleInputChange('contractType', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CONTRACT_TYPES.map(t => <SelectItem key={t} value={t}>{CONTRACT_LABELS[t]}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Durasi (bulan)</Label>
                  <Input type="number" value={formData.contractDurationMonths} onChange={e => handleInputChange('contractDurationMonths', e.target.value ? parseInt(e.target.value) : '')} />
                </div>
              </div>

              {/* Requirements, Responsibilities, Benefits */}
              {(['requirements', 'responsibilities', 'benefits'] as const).map(field => (
                <div key={field} className="space-y-2">
                  <div className="flex justify-between">
                    <Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                    <Button variant="outline" size="sm" onClick={() => handleArrayAdd(field)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <div className="space-y-1">
                    {(formData[field] as string[] || []).map((item, i) => (
                      <div key={i} className="flex gap-2">
                        <Input value={item} onChange={e => handleArrayChange(field, i, e.target.value)} className="flex-1" />
                        <Button variant="ghost" size="icon" onClick={() => handleArrayRemove(field, i)}><X className="h-4 w-4 text-destructive" /></Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Skills */}
              <div>
                <Label>Skill (read-only di edit - hapus & buat baru untuk ubah skill)</Label>
                <div className="space-y-2">
                  {job.skills.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Badge variant="secondary">{s.skill.name}</Badge>
                      <Badge variant="outline">Level: {s.level}</Badge>
                      <Badge variant={s.mandatory ? 'default' : 'outline'}>Bobot: {s.weight}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{job.title}</h1>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
                <p className="text-muted-foreground">Dibuat: {formatDate(job.createdAt)} {job.publishedAt && `• Dipublikasikan: ${formatDate(job.publishedAt)}`}</p>
              </div>
              <Button variant="outline" onClick={() => setEditing(true)}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </Button>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Tipe Kerja</p>
                  <p className="font-medium">{WORK_TYPE_LABELS[job.workType] || job.workType}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Gaji</p>
                  <p className="font-medium">{formatCurrency(job.salaryMin, job.salaryCurrency)} - {formatCurrency(job.salaryMax, job.salaryCurrency)}/{job.salaryPeriod.toLowerCase()}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Lamaran</p>
                  <p className="font-medium">{job.applicationCount}</p>
                </div>
              </div>

              <div className="prose prose-sm max-w-none text-muted-foreground border-t pt-6">
                <h3 className="font-semibold mb-2">Deskripsi</h3>
                <p>{job.description}</p>
              </div>

              {job.requirements.length > 0 && (
                <div className="prose prose-sm max-w-none text-muted-foreground border-t pt-6">
                  <h3 className="font-semibold mb-2">Persyaratan</h3>
                  <ul className="list-disc list-inside space-y-1">{job.requirements.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}

              {job.responsibilities.length > 0 && (
                <div className="prose prose-sm max-w-none text-muted-foreground border-t pt-6">
                  <h3 className="font-semibold mb-2">Tanggung Jawab</h3>
                  <ul className="list-disc list-inside space-y-1">{job.responsibilities.map((r, i) => <li key={i}>{r}</li>)}</ul>
                </div>
              )}

              {job.benefits.length > 0 && (
                <div className="prose prose-sm max-w-none text-muted-foreground border-t pt-6">
                  <h3 className="font-semibold mb-2">Benefit</h3>
                  <ul className="list-disc list-inside space-y-1">{job.benefits.map((b, i) => <li key={i}>{b}</li>)}</ul>
                </div>
              )}

              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Skill yang Dibutuhkan</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((s, i) => (
                    <Badge key={i} variant="secondary" className="text-sm">
                      {s.skill.name} ({s.level}) {s.mandatory && '✓'} Bobot: {s.weight}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lamaran Masuk ({job.applicationCount})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button className="w-full" asChild>
                <Link href={`/dashboard/employer/jobs/${jobId}/applications`}>
                  Kelola Lamaran →
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}