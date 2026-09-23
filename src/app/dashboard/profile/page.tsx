'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from '@/lib/auth-client';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Award,
  Globe,
  DollarSign,
  ShieldCheck,
  Save,
  CheckCircle2,
  Calendar,
  Briefcase,
  FileCheck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function WorkerProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: 'Budi Santoso',
    email: 'worker@skillmatch.id',
    phone: '081234567890',
    targetCountry: 'Jepang, Singapura',
    yearsExp: '3 tahun',
    expectedSalary: '15.000.000 - 25.000.000 IDR/bulan',
    passportStatus: 'Aktif (Berlaku s.d. 2029)',
    bio: 'Pekerja migran berkomitmen tinggi dengan sertifikasi kompetensi W3C Verifiable Credential di bidang Caregiving Lansia dan First Aid. Siap ditempatkan di Jepang atau Singapura.',
    languages: 'Bahasa Indonesia (Native), Bahasa Jepang (N4), Bahasa Inggris (B1)',
  });

  useEffect(() => {
    if (session?.user?.name) {
      setProfile(prev => ({
        ...prev,
        name: session.user?.name || prev.name,
        email: session.user?.email || prev.email,
      }));
    }
  }, [session]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Profil berhasil diperbarui!');
    }, 600);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl font-bold border-2 border-primary/30">
            {profile.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{profile.name}</h1>
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Terverifikasi
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Pekerja Migran Indonesia (PMI) • ID: <span className="font-mono text-xs text-primary font-semibold">did:web:skillmatch.id#pm-0824</span>
            </p>
          </div>
        </div>
        <Button variant="outline" asChild>
          <a href="/dashboard/certificates">
            <Award className="mr-2 h-4 w-4 text-primary" />
            Lihat Kredensial VC
          </a>
        </Button>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Informasi Pribadi & Kontak</CardTitle>
            <CardDescription>
              Data ini digunakan untuk pencocokan AI dengan lowongan kerja luar negeri
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap (sesuai Paspor)</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={e => setProfile({ ...profile, name: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={e => setProfile({ ...profile, email: e.target.value })}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon (WhatsApp)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={e => setProfile({ ...profile, phone: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="passport">Status Paspor</Label>
                <div className="relative">
                  <FileCheck className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="passport"
                    value={profile.passportStatus}
                    onChange={e => setProfile({ ...profile, passportStatus: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="bio">Tentang Saya / Ringkasan Profesional</Label>
              <Textarea
                id="bio"
                rows={3}
                value={profile.bio}
                onChange={e => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Deskripsikan keahlian dan pengalaman kerja Anda..."
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="countries">Negara Tujuan Minat</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="countries"
                    value={profile.targetCountry}
                    onChange={e => setProfile({ ...profile, targetCountry: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Ekspektasi Gaji Bersih</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="salary"
                    value={profile.expectedSalary}
                    onChange={e => setProfile({ ...profile, expectedSalary: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="languages">Kemampuan Bahasa Asing</Label>
              <Input
                id="languages"
                value={profile.languages}
                onChange={e => setProfile({ ...profile, languages: e.target.value })}
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={loading} className="gap-2">
                <Save className="h-4 w-4" />
                {loading ? 'Menyimpan...' : 'Simpan Profil'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                Kompetensi Terverifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Caregiving Lansia</span>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-xs">ADVANCED</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Skor Asesmen: 88% • VC Aktif</p>
              </div>

              <div className="p-3 rounded-lg border bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm">Bahasa Inggris (B1)</span>
                  <Badge variant="secondary" className="bg-blue-500/10 text-blue-600 text-xs">INTERMEDIATE</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Skor Asesmen: 75% • VC Aktif</p>
              </div>

              <Button variant="outline" size="sm" className="w-full text-xs" asChild>
                <a href="/dashboard/upskilling">
                  + Ikuti Asesmen Baru
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary/5 to-muted border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-1.5 text-primary">
                <ShieldCheck className="h-4 w-4" />
                Keamanan Data Pribadi
              </CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-muted-foreground space-y-2">
              <p>
                SkillMatch menerapkan standar enkripsi W3C Decentralized Identity. Data Anda hanya dibagikan kepada employer resmi yang telah terverifikasi legalitasnya.
              </p>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}
