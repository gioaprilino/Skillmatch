'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Users,
  Search,
  Award,
  Globe,
  MapPin,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Filter,
  Eye,
  Mail,
  Phone,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

interface Candidate {
  id: string;
  name: string;
  avatar: string;
  mainSkill: string;
  skillLevel: 'ADVANCED' | 'EXPERT' | 'INTERMEDIATE';
  verifiedVC: boolean;
  score: number;
  experience: string;
  preferredCountry: string;
  languages: string[];
  status: 'Tersedia' | 'Dalam Proses' | 'Terikat Kontrak';
  credentialId: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: 'cand-1',
    name: 'Budi Santoso',
    avatar: 'B',
    mainSkill: 'Perawatan Lansia (Elderly Care)',
    skillLevel: 'ADVANCED',
    verifiedVC: true,
    score: 88,
    experience: '3 tahun di Surabaya',
    preferredCountry: 'Jepang, Singapura',
    languages: ['Indonesia (Native)', 'Inggris (B1)', 'Jepang (N4)'],
    status: 'Tersedia',
    credentialId: 'urn:uuid:e7b39a44-2451-4fae-b2d9-f41857946a01',
  },
  {
    id: 'cand-2',
    name: 'Siti Aminah',
    avatar: 'S',
    mainSkill: 'Hotel Housekeeping & Hospitality',
    skillLevel: 'EXPERT',
    verifiedVC: true,
    score: 94,
    experience: '4 tahun di Hotel Bintang 4 Bali',
    preferredCountry: 'Hong Kong, Singapura',
    languages: ['Indonesia (Native)', 'Inggris (B2)', 'Mandarin (Dasar)'],
    status: 'Tersedia',
    credentialId: 'urn:uuid:89a12c44-7711-4f11-92ab-123456789abc',
  },
  {
    id: 'cand-3',
    name: 'Agus Setiawan',
    avatar: 'A',
    mainSkill: 'Las MIG/TIG & Konstruksi Logam',
    skillLevel: 'ADVANCED',
    verifiedVC: true,
    score: 82,
    experience: '5 tahun fabrikasi baja Cikarang',
    preferredCountry: 'Korea Selatan, Jepang',
    languages: ['Indonesia (Native)', 'Korea (TOPIK II)'],
    status: 'Dalam Proses',
    credentialId: 'urn:uuid:44b11122-9900-4822-a123-abcdef012345',
  },
  {
    id: 'cand-4',
    name: 'Nurul Hidayah',
    avatar: 'N',
    mainSkill: 'Perawatan Anak & Balita (Childcare)',
    skillLevel: 'INTERMEDIATE',
    verifiedVC: true,
    score: 78,
    experience: '2 tahun daycare Jakarta',
    preferredCountry: 'Taiwan, Singapura',
    languages: ['Indonesia (Native)', 'Mandarin (HSK 3)'],
    status: 'Tersedia',
    credentialId: 'urn:uuid:11223344-5566-7788-99aa-bbccddeeff00',
  },
  {
    id: 'cand-5',
    name: 'Rudi Hartono',
    avatar: 'R',
    mainSkill: 'Operator Mesin CNC & Presisi',
    skillLevel: 'EXPERT',
    verifiedVC: true,
    score: 91,
    experience: '4 tahun industri otomotif Karawang',
    preferredCountry: 'Jepang, Jerman',
    languages: ['Indonesia (Native)', 'Jepang (N3)'],
    status: 'Tersedia',
    credentialId: 'urn:uuid:aabbccdd-eeff-0011-2233-445566778899',
  },
];

export default function CandidatesPage() {
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('Semua');

  const filtered = CANDIDATES.filter(c => {
    const matchSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.mainSkill.toLowerCase().includes(search.toLowerCase());
    const matchCountry =
      selectedCountry === 'Semua' || c.preferredCountry.includes(selectedCountry);
    return matchSearch && matchCountry;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/15 via-primary/5 to-transparent border p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Pencarian Kandidat Tenaga Kerja Terverifikasi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Temukan kandidat pekerja migran Indonesia dengan kompetensi terverifikasi W3C Verifiable Credential
          </p>
        </div>
        <Button asChild className="gap-2">
          <Link href="/dashboard/employer/verify">
            <ShieldCheck className="h-4 w-4" />
            Portal Verifikasi VC
          </Link>
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama atau skill kandidat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 h-9 text-sm"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-muted-foreground shrink-0">Negara Tujuan:</span>
          {['Semua', 'Jepang', 'Singapura', 'Hong Kong', 'Korea Selatan', 'Taiwan'].map(country => (
            <Button
              key={country}
              size="sm"
              variant={selectedCountry === country ? 'default' : 'outline'}
              onClick={() => setSelectedCountry(country)}
              className="text-xs rounded-full h-8"
            >
              {country}
            </Button>
          ))}
        </div>
      </div>

      {/* Candidates List */}
      <div className="grid gap-4 md:grid-cols-2">
        {filtered.map(cand => (
          <Card key={cand.id} className="hover:border-primary/40 transition-all shadow-sm">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center text-lg border-2 border-primary/20">
                    {cand.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base">{cand.name}</h3>
                      <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> VC Terbit
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{cand.experience}</p>
                  </div>
                </div>

                <Badge variant={cand.status === 'Tersedia' ? 'outline' : 'secondary'} className={cand.status === 'Tersedia' ? 'border-emerald-500 text-emerald-600' : ''}>
                  {cand.status}
                </Badge>
              </div>

              {/* Skill & Score */}
              <div className="p-3 rounded-lg bg-muted/30 border space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-primary">{cand.mainSkill}</span>
                  <Badge variant="outline" className="font-mono text-xs">{cand.skillLevel}</Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Skor Asesmen Kompetensi:</span>
                  <span className="font-bold text-foreground">{cand.score}%</span>
                </div>
              </div>

              {/* Languages & Preference */}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-primary" />
                  <span>Minat Negara: <strong className="text-foreground">{cand.preferredCountry}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-medium text-foreground">Bahasa:</span>
                  {cand.languages.map((l, i) => (
                    <Badge key={i} variant="secondary" className="text-[10px] px-1.5 py-0">
                      {l}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t flex items-center justify-between gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => toast.success(`Undangan interview terkirim ke WhatsApp ${cand.name}`)}
                  className="text-xs flex-1 gap-1"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-500" />
                  Hubungi Kandidat
                </Button>

                <Button
                  size="sm"
                  asChild
                  className="text-xs flex-1 gap-1"
                >
                  <Link href={`/dashboard/employer/verify`}>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verifikasi Kredensial
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
