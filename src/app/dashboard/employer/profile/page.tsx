'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Building2,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Mail,
  Phone,
  FileCheck,
  Save,
  Award,
  Users,
  MapPin
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function EmployerProfilePage() {
  const [loading, setLoading] = useState(false);
  const [company, setCompany] = useState({
    name: 'PT Global Manpower Agency',
    sip3mi: 'SIP3MI-KEMNAKER-2024-0891',
    nib: '9120003481294',
    email: 'employer@skillmatch.id',
    phone: '+62 21 5567 8900',
    address: 'Menara Palma Lt. 15, Jl. H.R. Rasuna Said, Jakarta Selatan',
    website: 'https://globalmanpower.co.id',
    destinations: 'Singapura, Jepang, Hong Kong, Taiwan, Korea Selatan, Arab Saudi',
    description: 'Perusahaan penempatan pekerja migran Indonesia resmi berizin Kemenaker RI dan terdaftar di SISKOP2MI. Berkomitmen menempatkan tenaga kerja terampil dengan gaji layak, perlindungan asuransi, dan verifikasi kompetensi digital.',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Profil perusahaan berhasil diperbarui!');
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-700 via-primary to-indigo-800 text-white p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{company.name}</h1>
              <Badge className="bg-emerald-500 text-white text-xs flex items-center gap-1 border-0">
                <CheckCircle2 className="h-3.5 w-3.5" /> Resmi Terdaftar
              </Badge>
            </div>
            <p className="text-white/80 text-sm mt-0.5">
              Akreditasi Kemenaker RI & BP2MI • DID: <span className="font-mono text-xs text-white underline">did:web:skillmatch.id#emp-091</span>
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Data Perusahaan & Izin Operasional</CardTitle>
            <CardDescription>
              Legalitas terverifikasi membangun rasa percaya calon pekerja migran
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-name">Nama Badan Usaha / Agensi</Label>
                <Input
                  id="c-name"
                  value={company.name}
                  onChange={e => setCompany({ ...company, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sip3mi">Nomor Izin SIP3MI</Label>
                <Input
                  id="sip3mi"
                  value={company.sip3mi}
                  onChange={e => setCompany({ ...company, sip3mi: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nib">Nomor Induk Berusaha (NIB)</Label>
                <Input
                  id="nib"
                  value={company.nib}
                  onChange={e => setCompany({ ...company, nib: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-email">Email Resmi Perusahaan</Label>
                <Input
                  id="c-email"
                  type="email"
                  value={company.email}
                  onChange={e => setCompany({ ...company, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="c-phone">Nomor Telepon Kantor</Label>
                <Input
                  id="c-phone"
                  value={company.phone}
                  onChange={e => setCompany({ ...company, phone: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website Resmi</Label>
                <Input
                  id="website"
                  value={company.website}
                  onChange={e => setCompany({ ...company, website: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Kantor Pusat</Label>
              <Input
                id="address"
                value={company.address}
                onChange={e => setCompany({ ...company, address: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dest">Negara Tujuan Penempatan</Label>
              <Input
                id="dest"
                value={company.destinations}
                onChange={e => setCompany({ ...company, destinations: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="desc">Profil & Standar Penempatan</Label>
              <Textarea
                id="desc"
                rows={4}
                value={company.description}
                onChange={e => setCompany({ ...company, description: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Menyimpan...' : 'Perbarui Profil Perusahaan'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Statistik Penempatan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">Total Penempatan Sukses</p>
                <p className="text-2xl font-bold text-primary mt-1">240+ Pekerja</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">Tingkat Retensi Kontrak</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">98.4%</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30">
                <p className="text-xs text-muted-foreground">Verifikasi Kredensial Instan</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">100% W3C VC</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                Jaminan Zero Exploitation
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                Agensi ini telah menandatangani pakta integritas penempatan tanpa biaya overcharging, transparansi kontrak, dan perlindungan asuransi bagi seluruh PMI.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
