'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Award, Download, Share2, QrCode, Loader2, ArrowLeft, ArrowRight, Clock } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

interface AttemptResult {
  id: string;
  score: number;
  passed: boolean;
  completedAt: string;
}

interface AssessmentDetail {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  skill: { id: string; code: string; name: string; category: string; icon?: string };
}

interface Credential {
  id: string;
  vcData: any;
  ipfsHash?: string;
}

export default function AssessmentResultPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = params.id as string;
  const attemptId = searchParams.get('attempt');

  const [attempt, setAttempt] = useState<AttemptResult | null>(null);
  const [assessment, setAssessment] = useState<AssessmentDetail | null>(null);
  const [credential, setCredential] = useState<Credential | null>(null);
  const [loading, setLoading] = useState(true);
  const [qrLoading, setQrLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [assessmentId, attemptId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch assessment
      const assessRes = await fetch(`/api/assessments/${assessmentId}`);
      if (assessRes.ok) {
        const assessData = await assessRes.json();
        setAssessment(assessData.data);
      }

      // Fetch attempt
      let attemptIdToUse = attemptId;
      if (!attemptIdToUse) {
        // Get latest attempt
        const attemptsRes = await fetch(`/api/assessments/${assessmentId}`);
        if (attemptsRes.ok) {
          const data = await attemptsRes.json();
          if (data.data.userAttempt) {
            attemptIdToUse = data.data.userAttempt.id;
          }
        }
      }

      if (attemptIdToUse) {
        const attemptRes = await fetch(`/api/assessments/${assessmentId}/attempt/${attemptIdToUse}`);
        if (attemptRes.ok) {
          const attemptData = await attemptRes.json();
          setAttempt(attemptData.data.attempt);
          if (attemptData.data.credential) {
            setCredential({ id: attemptData.data.credential.id, vcData: attemptData.data.credential });
          }
        }
      }
    } catch (err) {
      toast.error('Gagal memuat hasil');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!attempt || !assessment) {
    return (
      <div className="text-center py-12">
        <XCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-xl font-semibold">Hasil tidak ditemukan</h2>
        <Button asChild className="mt-4">
          <a href={`/dashboard/upskilling/assessments/${assessmentId}/take`}>Coba Lagi</a>
        </Button>
      </div>
    );
  }

  const isPassed = attempt.passed;
  const level = attempt.score >= 90 ? 'EXPERT' : attempt.score >= 75 ? 'ADVANCED' : attempt.score >= 60 ? 'INTERMEDIATE' : 'BEGINNER';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back button */}
      <Button variant="ghost" size="sm" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
      </Button>

      {/* Result Header */}
      <Card className={isPassed ? 'border-success' : 'border-destructive'}>
        <CardContent className="p-6 text-center">
          <div className={cn('mx-auto mb-4 w-20 h-20 rounded-full flex items-center justify-center', isPassed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
            {isPassed ? (
              <CheckCircle className="h-10 w-10" />
            ) : (
              <XCircle className="h-10 w-10" />
            )}
          </div>
          <h1 className="text-3xl font-bold">{isPassed ? 'SELAMAT! ANDA LULUS' : 'BELUM LULUS'}</h1>
          <p className="mt-2 text-muted-foreground">{assessment.title}</p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <span><Clock className="mr-1 h-4 w-4 inline" /> {formatDate(attempt.completedAt)}</span>
            <span>Durasi: {assessment.durationMin} menit</span>
          </div>
        </CardContent>
      </Card>

      {/* Score Card */}
      <Card>
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3 text-center">
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-4xl font-bold text-primary">{attempt.score}%</p>
              <p className="text-sm text-muted-foreground">Skor Anda</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <p className="text-4xl font-bold text-muted-foreground">{assessment.passingScore}%</p>
              <p className="text-sm text-muted-foreground">Skor Lulus</p>
            </div>
            <div className="p-4 rounded-xl bg-muted">
              <Badge variant="outline" className={cn('text-lg', isPassed ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive')}>
                {level}
              </Badge>
              <p className="mt-1 text-sm text-muted-foreground">Level Skill</p>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={attempt.score} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span>Skor lulus: {assessment.passingScore}%</span>
              <span>100%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skill Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {assessment.skill.icon ? (
              <span className="text-2xl" role="img">{assessment.skill.icon}</span>
            ) : (
              <Award className="h-5 w-5" />
            )}
            {assessment.skill.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3 flex-wrap">
            <Badge variant="outline" className="text-sm">
              {assessment.skill.category.replace('_', ' ')}
            </Badge>
            <Badge variant="secondary" className="text-sm">
              Level: {level}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Verifiable Credential */}
      {isPassed && credential && (
        <Card className="border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Award className="h-5 w-5" />
              Verifiable Credential Diterbitkan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Credential ID</span>
                <Badge variant="outline">{credential.id.slice(0, 20)}...</Badge>
              </div>
              <p className="text-sm text-muted-foreground font-mono break-all">
                {credential.vcData?.credentialSubject?.skill?.id || 'Skill Certificate'}
              </p>
              {credential.ipfsHash && (
                <p className="text-xs text-muted-foreground mt-1">
                  IPFS: {credential.ipfsHash}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => downloadVC(credential.vcData)}>
                <Download className="mr-2 h-4 w-4" /> Unduh VC (JSON)
              </Button>
              <Button variant="outline" onClick={() => copyToClipboard(JSON.stringify(credential.vcData, null, 2))}>
                <span className="mr-2">📋</span> Salin JSON
              </Button>
              <Button variant="outline" onClick={() => generateQR(credential.vcData)}>
                <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
              </Button>
              <Button variant="outline" onClick={() => shareVC(credential.vcData)}>
                <Share2 className="mr-2 h-4 w-4" /> Bagikan
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Sertifikat ini berbasis W3C Verifiable Credential dengan tanda tangan kriptografis Ed25519.
              Dapat diverifikasi secara offline oleh employer melalui QR code.
            </p>
          </CardContent>
        </Card>
      )}

      {isPassed && !credential && (
        <Card className="border-warning">
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">
              Sertifikat Verifiable Credential sedang diproses. Silakan refresh halaman ini dalam beberapa saat.
            </p>
            <Button variant="outline" className="mt-4" onClick={fetchData}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      )}

      {!isPassed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <XCircle className="h-5 w-5" />
              Belum Memenuhi Syarat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground">
              Anda belum mencapai skor minimum {assessment.passingScore}%. Skor Anda: {attempt.score}%.
            </p>
            <p className="text-sm text-muted-foreground">
              Anda bisa mengulang asesmen ini kapan saja. Fokus pada area yang belum dikuasai.
            </p>
            <div className="flex gap-2">
              <Button onClick={() => router.push(`/dashboard/upskilling/assessments/${assessmentId}/take`)}>
                Coba Lagi
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/upskilling/assessments')}>
                Kembali ke Daftar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" asChild>
          <a href="/dashboard/upskilling/assessments">
            <ArrowLeft className="mr-2 h-4 w-4" /> Daftar Asesmen
          </a>
        </Button>
        {isPassed && (
          <Button variant="outline" asChild>
            <a href="/dashboard/certificates">
              <Award className="mr-2 h-4 w-4" /> Sertifikat Saya
            </a>
          </Button>
        )}
        {isPassed && (
          <Button asChild>
            <a href="/dashboard/jobs">
              Cari Lowongan Cocok
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}

function downloadVC(vcData: any) {
  const blob = new Blob([JSON.stringify(vcData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vc-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('VC diunduh');
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text);
  toast.success('Disalin ke clipboard');
}

async function generateQR(vcData: any) {
  // In real implementation, generate QR code with VC data
  const vcString = JSON.stringify(vcData);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(vcString)}`;
  window.open(qrUrl, '_blank');
  toast.success('QR code dibuka di tab baru');
}

async function shareVC(vcData: any) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'SkillMatch Verifiable Credential',
        text: 'Sertifikat skill terverifikasi dari SkillMatch',
        url: window.location.href,
      });
} catch {
       toast.success('Dibagikan');
     }
  } else {
    copyToClipboard(JSON.stringify(vcData));
  }
}