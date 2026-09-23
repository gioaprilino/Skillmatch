'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Award,
  ShieldCheck,
  QrCode,
  Download,
  Share2,
  ExternalLink,
  BookOpen,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

interface CertificateItem {
  id: string;
  credentialId: string;
  skillName: string;
  category: string;
  level: string;
  score: number;
  issuedAt: string;
  issuer: string;
  ipfsHash: string;
  vcData: any;
}

const DEFAULT_CERTIFICATES: CertificateItem[] = [
  {
    id: 'cert_1',
    credentialId: 'urn:uuid:e7b39a44-2451-4fae-b2d9-f41857946a01',
    skillName: 'Perawatan Lansia (Elderly Caregiving)',
    category: 'DOMESTIC_CARE',
    level: 'ADVANCED',
    score: 88,
    issuedAt: '2026-09-18T10:00:00Z',
    issuer: 'SkillMatch & Standar BNSP RI',
    ipfsHash: 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
    vcData: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": "urn:uuid:e7b39a44-2451-4fae-b2d9-f41857946a01",
      "type": ["VerifiableCredential", "SkillCertificate"],
      "issuer": "did:web:skillmatch.id",
      "credentialSubject": {
        "skill": { "name": "Perawatan Lansia", "level": "ADVANCED" },
        "assessment": { "score": 88 }
      }
    }
  },
  {
    id: 'cert_2',
    credentialId: 'urn:uuid:98c761ba-1122-4fe8-a309-8d1976a45b99',
    skillName: 'Keselamatan Kerja Konstruksi & Las SMAW',
    category: 'CONSTRUCTION',
    level: 'INTERMEDIATE',
    score: 78,
    issuedAt: '2026-09-12T14:30:00Z',
    issuer: 'SkillMatch & Kemenaker RI',
    ipfsHash: 'QmZtmD2qtWbpPyv6CW1sEBRnniN7dk6iW6Fi62bqoHYuvs',
    vcData: {
      "@context": [
        "https://www.w3.org/2018/credentials/v1",
        "https://w3id.org/security/suites/ed25519-2020/v1"
      ],
      "id": "urn:uuid:98c761ba-1122-4fe8-a309-8d1976a45b99",
      "type": ["VerifiableCredential", "SkillCertificate"],
      "issuer": "did:web:skillmatch.id",
      "credentialSubject": {
        "skill": { "name": "Las SMAW & K3 Konstruksi", "level": "INTERMEDIATE" },
        "assessment": { "score": 78 }
      }
    }
  }
];

export default function CertificatesWalletPage() {
  const [certificates, setCertificates] = useState<CertificateItem[]>(DEFAULT_CERTIFICATES);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);

  const handleDownloadVC = (cert: CertificateItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(cert.vcData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `SkillMatch_VC_${cert.skillName.replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('File W3C Verifiable Credential berhasil diunduh!');
  };

  const handleShare = (cert: CertificateItem) => {
    const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(cert.credentialId)}`;
    navigator.clipboard.writeText(verifyUrl);
    toast.success('Link verifikasi kredensial berhasil disalin ke clipboard!');
  };

  const handleOpenQR = (cert: CertificateItem) => {
    const verifyUrl = `${window.location.origin}/verify?id=${encodeURIComponent(cert.credentialId)}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=${encodeURIComponent(verifyUrl)}`;
    window.open(qrUrl, '_blank');
    toast.success('QR Code verifikasi dibuka di tab baru!');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 rounded-2xl text-white shadow-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-sm mb-3">
          <ShieldCheck className="h-4 w-4" /> Dompet Kredensial Digital
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Sertifikat Kompetensi & Skill Passport (W3C VC)
        </h1>
        <p className="text-blue-100 mt-1 max-w-2xl text-sm md:text-base">
          Koleksi sertifikat digital terdesentralisasi Anda. Bebas pemalsuan, dapat diverifikasi secara instan oleh majikan luar negeri tanpa birokrasi legalisasi kertas.
        </p>
      </div>

      {/* Grid of Certificates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {certificates.map((cert) => (
          <Card key={cert.id} className="border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Badge variant="outline" className="text-[10px] mb-1.5 border-primary/40 text-primary">
                    {cert.category}
                  </Badge>
                  <CardTitle className="text-base font-bold text-foreground">
                    {cert.skillName}
                  </CardTitle>
                </div>
                <Badge className="bg-emerald-600 text-white text-xs shrink-0 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> VERIFIED
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Penerbit: {cert.issuer}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-3 rounded-xl bg-muted/50 border flex items-center justify-between text-xs">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Level Kompetensi</span>
                  <span className="font-bold text-sm text-foreground">{cert.level}</span>
                </div>
                <div className="text-right">
                  <span className="text-muted-foreground block text-[11px]">Skor Kelulusan</span>
                  <span className="font-bold text-sm text-emerald-600">{cert.score} / 100</span>
                </div>
              </div>

              <div className="text-[11px] font-mono text-muted-foreground truncate">
                ID: {cert.credentialId}
              </div>

              <div className="pt-2 border-t flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleOpenQR(cert)}
                  className="text-xs flex-1"
                >
                  <QrCode className="mr-1.5 h-3.5 w-3.5 text-primary" /> Tampilkan QR
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownloadVC(cert)}
                  className="text-xs flex-1"
                >
                  <Download className="mr-1.5 h-3.5 w-3.5" /> Unduh JSON
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleShare(cert)}
                  className="text-xs px-2.5"
                  title="Salin Tautan Verifikasi"
                >
                  <Share2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Banner Upskilling Call to action */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:bg-slate-900 border border-blue-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-blue-600 text-white">
            <BookOpen className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm sm:text-base">
              Ingin Menambah Sertifikat Kompetensi Lainnya?
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ikuti asesmen keahlian adaptif berikutnya untuk meningkatkan skor AI Job Matching Anda hingga +10%.
            </p>
          </div>
        </div>
        <Link href="/upskilling/assessments">
          <Button className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Ikuti Asesmen Baru
          </Button>
        </Link>
      </div>
    </div>
  );
}
