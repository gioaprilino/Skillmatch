'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Search,
  Award,
  ArrowLeft,
  QrCode,
  Loader2,
  ExternalLink
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-hot-toast';

function VerifyContent() {
  const searchParams = useSearchParams();
  const idFromUrl = searchParams.get('id') || '';

  const [credentialId, setCredentialId] = useState(idFromUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    if (idFromUrl) {
      setCredentialId(idFromUrl);
      verifyId(idFromUrl);
    }
  }, [idFromUrl]);

  const verifyId = async (id: string) => {
    if (!id.trim()) {
      toast.error('Masukkan Credential ID.');
      return;
    }
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch('/api/vc/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credentialId: id.trim() }),
      });
      const data = await res.json();
      setResult(data);
    } catch {
      setResult({ valid: false, reason: 'Gagal terhubung dengan server verifikasi.' });
    } finally {
      setIsLoading(false);
    }
  };

  const cred = result?.credential;
  const subject = cred?.credentialSubject;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors font-medium"
          >
            <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Kembali ke Beranda SkillMatch
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-1">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Portal Verifikasi Kredensial Publik
          </h1>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Layanan verifikasi terbuka W3C Verifiable Credentials untuk Agensi, Majikan, & Kedutaan Besar.
          </p>
        </div>

        {/* Input Card */}
        <Card className="border-border shadow-sm">
          <CardContent className="pt-6 space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Masukkan Credential ID (urn:uuid:...)"
                value={credentialId}
                onChange={(e) => setCredentialId(e.target.value)}
                className="font-mono text-xs"
              />
              <Button
                onClick={() => verifyId(credentialId)}
                disabled={isLoading}
                className="shrink-0"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verifikasi'}
              </Button>
            </div>

            {/* Quick Demo Helper */}
            <div className="pt-1 flex flex-wrap items-center justify-between text-[11px] text-muted-foreground gap-2">
              <span>Ingin mencoba fitur ini?</span>
              <button
                type="button"
                onClick={() => {
                  const demoId = 'urn:uuid:34938f3f-d481-45cb-8552-88dfbb84bec9';
                  setCredentialId(demoId);
                  verifyId(demoId);
                }}
                className="inline-flex items-center gap-1 font-medium text-primary hover:underline hover:text-primary/80 transition-colors"
              >
                <span>💡 Coba ID Contoh Terdaftar</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Informative Guide Card */}
        {!result && (
          <div className="rounded-xl border border-dashed border-border bg-card/60 p-4 text-xs space-y-3">
            <div className="font-semibold text-foreground flex items-center gap-2">
              <QrCode className="h-4 w-4 text-primary" />
              <span>Bagaimana Cara Kerja Verifikasi Ini?</span>
            </div>
            <ul className="space-y-1.5 text-muted-foreground list-disc list-inside">
              <li>
                <strong className="text-foreground">Dari Mana ID Berasal:</strong> Credential ID terbit secara otomatis saat pekerja lulus ujian asesmen di menu <span className="text-foreground font-medium">Pelatihan & Asesmen</span>.
              </li>
              <li>
                <strong className="text-foreground">Pemindaian QR Code:</strong> Setiap sertifikat di menu <span className="text-foreground font-medium">Dashboard ➔ Sertifikat</span> memiliki QR code unik. Majikan cukup memindai QR code tersebut dan halaman ini akan otomatis memvalidasi keasliannya.
              </li>
              <li>
                <strong className="text-foreground">Kriptografi Anti-Pemalsuan:</strong> Sistem memvalidasi tanda tangan digital <span className="font-mono text-foreground">Ed25519</span> berstandar W3C untuk memastikan data kompetensi tidak dimanipulasi.
              </li>
            </ul>
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div>
            {result.valid ? (
              <Card className="border-2 border-emerald-500 shadow-md">
                <div className="bg-emerald-600 px-6 py-4 text-white flex items-center justify-between rounded-t-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                    <div>
                      <h3 className="font-bold text-base">SERTIFIKAT RESMI & SAH</h3>
                      <p className="text-[11px] text-emerald-100">Kredensial valid dan terverifikasi di registry</p>
                    </div>
                  </div>
                  <Badge className="bg-white text-emerald-800 font-bold text-xs uppercase">
                    VERIFIED
                  </Badge>
                </div>
                <CardContent className="p-6 space-y-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px]">Nama Pekerja:</span>
                    <span className="font-bold text-base text-foreground">
                      {result.details?.userName || subject?.name || 'Pekerja Migran Terdaftar'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pb-2 border-b">
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Bidang Keahlian:</span>
                      <span className="font-semibold text-foreground">
                        {result.details?.skillName || subject?.skill?.name || 'Kompetensi TKI'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[11px]">Tingkat Kompetensi:</span>
                      <Badge variant="default" className="text-[10px] mt-0.5">
                        {result.details?.level || subject?.skill?.level || 'ADVANCED'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-1 text-muted-foreground text-[11px]">
                    <div>Penerbit: <strong className="text-foreground">{result.details?.issuer || cred?.issuer || 'SkillMatch ID'}</strong></div>
                    <div>Tanggal Terbit: <strong className="text-foreground">{result.details?.issuedAt ? new Date(result.details.issuedAt).toLocaleDateString('id-ID') : '-'}</strong></div>
                    <div>Algoritma Tanda Tangan: <span className="font-mono text-foreground">Ed25519Signature2020</span></div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-red-500 shadow-md">
                <div className="bg-red-600 px-6 py-4 text-white flex items-center gap-3 rounded-t-lg">
                  <XCircle className="h-6 w-6 text-white" />
                  <div>
                    <h3 className="font-bold text-base">KREDENSIAL TIDAK DITEMUKAN / TIDAK VALID</h3>
                    <p className="text-[11px] text-red-100">{result.reason || 'Kredensial tidak terdaftar di sistem.'}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Memuat portal verifikasi...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
