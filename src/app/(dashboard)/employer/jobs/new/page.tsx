'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

interface Skill {
  id: string;
  code: string;
  name: string;
  category: string;
}

const SKILL_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'];
const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: 'Pemula',
  INTERMEDIATE: 'Menengah',
  ADVANCED: 'Mahir',
  EXPERT: 'Ahli',
};

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

interface JobSkillForm {
  skillId: string;
  level: string;
  mandatory: boolean;
  weight: number;
}

export default function NewJobPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [jobSkills, setJobSkills] = useState<JobSkillForm[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requirements: [] as string[],
    responsibilities: [] as string[],
    benefits: [] as string[],
    country: 'IDN',
    province: '',
    city: '',
    workType: 'ONSITE',
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'IDR',
    salaryPeriod: 'MONTHLY',
    contractType: 'FIXED_TERM',
    contractDurationMonths: '',
    minAge: '',
    maxAge: '',
    gender: '',
    languageReq: [] as { language: string; level: string }[],
    passportRequired: true,
    visaProvided: false,
    medicalCheckRequired: true,
    status: 'DRAFT',
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newResponsibility, setNewResponsibility] = useState('');
  const [newBenefit, setNewBenefit] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newLanguageLevel, setNewLanguageLevel] = useState('');

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSkills();
    }
  }, [status]);

  const fetchSkills = async () => {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch skills:', err);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: keyof typeof formData, value: string | object) => {
    if (typeof value === 'string' && !value.trim()) return;
    setFormData(prev => ({ ...prev, [field]: [...(prev[field] as any[]), value] }));
  };

  const handleArrayRemove = (field: keyof typeof formData, index: number) => {
    setFormData(prev => ({ ...prev, [field]: (prev[field] as any[]).filter((_, i) => i !== index) }));
  };

  const addJobSkill = () => {
    setJobSkills(prev => [...prev, { skillId: '', level: 'BEGINNER', mandatory: true, weight: 100 }]);
  };

  const updateJobSkill = (index: number, field: keyof JobSkillForm, value: any) => {
    setJobSkills(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
  };

  const removeJobSkill = (index: number) => {
    setJobSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (statusValue: 'DRAFT' | 'PUBLISHED') => {
    if (!formData.title.trim()) {
      toast.error('Judul lowongan wajib diisi');
      return;
    }
    if (!formData.description.trim()) {
      toast.error('Deskripsi wajib diisi');
      return;
    }
    if (jobSkills.length === 0) {
      toast.error('Minimal 1 skill wajib ditambahkan');
      return;
    }
    if (!formData.salaryMin || !formData.salaryMax) {
      toast.error('Range gaji wajib diisi');
      return;
    }
    if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
      toast.error('Gaji minimum tidak boleh lebih besar dari maksimum');
      return;
    }
    if (jobSkills.some(s => !s.skillId)) {
      toast.error('Semua skill wajib dipilih');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/employer/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          salaryMin: parseInt(formData.salaryMin),
          salaryMax: parseInt(formData.salaryMax),
          contractDurationMonths: formData.contractDurationMonths ? parseInt(formData.contractDurationMonths) : null,
          minAge: formData.minAge ? parseInt(formData.minAge) : null,
          maxAge: formData.maxAge ? parseInt(formData.maxAge) : null,
          skills: jobSkills,
          status: statusValue,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success(statusValue === 'PUBLISHED' ? 'Lowongan dipublikasikan!' : 'Lowongan disimpan sebagai draft');
        router.push(`/dashboard/employer/jobs/${data.data.id}`);
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal membuat lowongan');
      }
    } catch (err) {
      toast.error('Terjadi kesalahan');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Silakan login</h2>
        <Button asChild className="mt-4"><a href="/auth/login?callbackUrl=/dashboard/employer/jobs/new">Login</a></Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Briefcase className="h-6 w-6" />
            Buat Lowongan Baru
          </h1>
          <p className="text-muted-foreground">Isi formulir untuk membuat lowongan pekerjaan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informasi Umum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Judul Posisi *</Label>
            <Input id="title" value={formData.title} onChange={e => handleInputChange('title', e.target.value)} placeholder="Contoh: Senior Caregiver" />
          </div>
          <div>
            <Label htmlFor="description">Deskripsi Pekerjaan *</Label>
            <Textarea id="description" value={formData.description} onChange={e => handleInputChange('description', e.target.value)} placeholder="Deskripsi lengkap posisi ini..." rows={4} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="country">Negara *</Label>
              <Select value={formData.country} onValueChange={v => handleInputChange('country', v)}>
                <SelectTrigger><SelectValue placeholder="Pilih negara" /></SelectTrigger>
                <SelectContent>
                  {COUNTRIES.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="province">Provinsi</Label>
              <Input id="province" value={formData.province} onChange={e => handleInputChange('province', e.target.value)} placeholder="Contoh: DKI Jakarta" />
            </div>
            <div>
              <Label htmlFor="city">Kota/Kabupaten</Label>
              <Input id="city" value={formData.city} onChange={e => handleInputChange('city', e.target.value)} placeholder="Contoh: Jakarta Selatan" />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gaji & Kontrak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="salaryMin">Gaji Minimum *</Label>
              <Input id="salaryMin" type="number" value={formData.salaryMin} onChange={e => handleInputChange('salaryMin', e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="salaryMax">Gaji Maksimum *</Label>
              <Input id="salaryMax" type="number" value={formData.salaryMax} onChange={e => handleInputChange('salaryMax', e.target.value)} placeholder="0" />
            </div>
            <div>
              <Label htmlFor="salaryCurrency">Mata Uang</Label>
              <Select value={formData.salaryCurrency} onValueChange={v => handleInputChange('salaryCurrency', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SALARY_CURRENCIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="salaryPeriod">Periode</Label>
              <Select value={formData.salaryPeriod} onValueChange={v => handleInputChange('salaryPeriod', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SALARY_PERIODS.map(p => <SelectItem key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="contractType">Tipe Kontrak *</Label>
              <Select value={formData.contractType} onValueChange={v => handleInputChange('contractType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CONTRACT_TYPES.map(t => <SelectItem key={t} value={t}>{CONTRACT_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="contractDurationMonths">Durasi (bulan)</Label>
              <Input id="contractDurationMonths" type="number" value={formData.contractDurationMonths} onChange={e => handleInputChange('contractDurationMonths', e.target.value)} placeholder="Contoh: 24" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="workType">Tipe Kerja *</Label>
              <Select value={formData.workType} onValueChange={v => handleInputChange('workType', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {WORK_TYPES.map(t => <SelectItem key={t} value={t}>{WORK_TYPE_LABELS[t]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Persyaratan & Tanggung Jawab</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Requirements */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Persyaratan *</Label>
              <Button variant="outline" size="sm" onClick={() => handleArrayAdd('requirements', newRequirement)} disabled={!newRequirement.trim()}>
                <Plus className="mr-1 h-4 w-4" /> Tambah
              </Button>
            </div>
            <div className="flex gap-2 mb-2">
              <Input value={newRequirement} onChange={e => setNewRequirement(e.target.value)} placeholder="Contoh: Minimal 2 tahun pengalaman" className="flex-1" onKeyDown={e => e.key === 'Enter' && handleArrayAdd('requirements', newRequirement)} />
            </div>
            <div className="space-y-1">
              {formData.requirements.map((req, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{req}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleArrayRemove('requirements', i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Responsibilities */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Tanggung Jawab</Label>
              <Button variant="outline" size="sm" onClick={() => handleArrayAdd('responsibilities', newResponsibility)} disabled={!newResponsibility.trim()}>
                <Plus className="mr-1 h-4 w-4" /> Tambah
              </Button>
            </div>
            <div className="flex gap-2 mb-2">
              <Input value={newResponsibility} onChange={e => setNewResponsibility(e.target.value)} placeholder="Contoh: Merawat lansia harian" className="flex-1" onKeyDown={e => e.key === 'Enter' && handleArrayAdd('responsibilities', newResponsibility)} />
            </div>
            <div className="space-y-1">
              {formData.responsibilities.map((resp, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{resp}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleArrayRemove('responsibilities', i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Benefit</Label>
              <Button variant="outline" size="sm" onClick={() => handleArrayAdd('benefits', newBenefit)} disabled={!newBenefit.trim()}>
                <Plus className="mr-1 h-4 w-4" /> Tambah
              </Button>
            </div>
            <div className="flex gap-2 mb-2">
              <Input value={newBenefit} onChange={e => setNewBenefit(e.target.value)} placeholder="Contoh: Asuransi kesehatan, tunjangan transport" className="flex-1" onKeyDown={e => e.key === 'Enter' && handleArrayAdd('benefits', newBenefit)} />
            </div>
            <div className="space-y-1">
              {formData.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{benefit}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleArrayRemove('benefits', i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Language Requirements */}
          <div>
            <Label>Persyaratan Bahasa</Label>
            <div className="flex gap-2 mb-2">
              <Input value={newLanguage} onChange={e => setNewLanguage(e.target.value)} placeholder="Bahasa (contoh: English)" className="w-32" />
              <Select value={newLanguageLevel} onValueChange={v => setNewLanguageLevel(v)}>
                <SelectTrigger className="w-32"><SelectValue placeholder="Level" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="A1">A1 (Beginner)</SelectItem>
                  <SelectItem value="A2">A2 (Elementary)</SelectItem>
                  <SelectItem value="B1">B1 (Intermediate)</SelectItem>
                  <SelectItem value="B2">B2 (Upper Intermediate)</SelectItem>
                  <SelectItem value="C1">C1 (Advanced)</SelectItem>
                  <SelectItem value="C2">C2 (Proficient)</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => {
                if (newLanguage && newLanguageLevel) {
                  handleArrayAdd('languageReq', { language: newLanguage, level: newLanguageLevel });
                  setNewLanguage('');
                  setNewLanguageLevel('');
                }
              }} disabled={!newLanguage || !newLanguageLevel}>
                <Plus className="mr-1 h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {formData.languageReq.map((lr, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted rounded">
                  <span className="flex-1 text-sm">{lr.language} - {lr.level}</span>
                  <Button variant="ghost" size="icon" onClick={() => handleArrayRemove('languageReq', i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill yang Dibutuhkan *</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">Minimal 1 skill. Bobot total akan dinormalisasi otomatis.</p>
          <div className="space-y-3">
            {jobSkills.map((js, i) => (
              <div key={i} className="flex flex-col sm:flex-row gap-3 p-3 bg-muted rounded-lg">
                <div className="flex-1">
                  <Label className="text-sm">Skill</Label>
                  <Select value={js.skillId} onValueChange={v => updateJobSkill(i, 'skillId', v)}>
                    <SelectTrigger><SelectValue placeholder="Pilih skill" /></SelectTrigger>
                    <SelectContent>
                      {skills.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.category})</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-36">
                  <Label className="text-sm">Level</Label>
                  <Select value={js.level} onValueChange={v => updateJobSkill(i, 'level', v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {SKILL_LEVELS.map(l => <SelectItem key={l} value={l}>{LEVEL_LABELS[l]}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24">
                  <Label className="text-sm">Bobot</Label>
                  <Input type="number" value={js.weight} onChange={e => updateJobSkill(i, 'weight', parseInt(e.target.value) || 100)} min="1" max="100" />
                </div>
                <div className="flex items-end gap-2">
                  <Label className="flex items-center gap-1 text-sm cursor-pointer">
                    <input type="checkbox" checked={js.mandatory} onChange={e => updateJobSkill(i, 'mandatory', e.target.checked)} className="rounded" />
                    Wajib
                  </Label>
                  <Button variant="ghost" size="icon" onClick={() => removeJobSkill(i)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={addJobSkill}>
            <Plus className="mr-2 h-4 w-4" /> Tambah Skill
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Tambahan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="minAge">Usia Minimum</Label>
              <Input id="minAge" type="number" value={formData.minAge} onChange={e => handleInputChange('minAge', e.target.value)} placeholder="Contoh: 21" />
            </div>
            <div>
              <Label htmlFor="maxAge">Usia Maksimum</Label>
              <Input id="maxAge" type="number" value={formData.maxAge} onChange={e => handleInputChange('maxAge', e.target.value)} placeholder="Contoh: 45" />
            </div>
            <div>
              <Label htmlFor="gender">Jenis Kelamin</Label>
              <Select value={formData.gender} onValueChange={v => handleInputChange('gender', v)}>
                <SelectTrigger><SelectValue placeholder="Semua" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                  <SelectItem value="Perempuan">Perempuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <Label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.passportRequired} onChange={e => handleInputChange('passportRequired', e.target.checked)} className="rounded" />
              Paspor wajib
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.visaProvided} onChange={e => handleInputChange('visaProvided', e.target.checked)} className="rounded" />
              Visa disediakan
            </Label>
            <Label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.medicalCheckRequired} onChange={e => handleInputChange('medicalCheckRequired', e.target.checked)} className="rounded" />
              Medical check-up wajib
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4 border-t pt-4">
        <Button variant="outline" onClick={() => handleSubmit('DRAFT')} disabled={submitting} loading={submitting}>
          Simpan Draft
        </Button>
        <Button onClick={() => handleSubmit('PUBLISHED')} disabled={submitting} loading={submitting}>
          Publikasikan
        </Button>
      </div>
    </div>
  );
}