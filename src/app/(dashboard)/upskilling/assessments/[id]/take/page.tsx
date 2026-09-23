'use client';

import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Loader2, AlertCircle, Clock, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'scenario';
  question: string;
  options: string[];
  weight: number;
}

interface Assessment {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  questions: Question[];
  skill: { id: string; code: string; name: string; category: string };
}

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const assessmentId = params.id as string;

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startedAt] = useState(Date.now());

  // Load assessment
  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  // Timer: Only start counting down once assessment is loaded and timeLeft is initialized
  useEffect(() => {
    if (timeLeft === null || loading || submitting) return;

    if (timeLeft <= 0) {
      handleFinalSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => (t !== null && t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, submitting]);

  const fetchAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Asesmen tidak ditemukan');
      const data = await res.json();
      setAssessment(data.data);
      setTimeLeft(data.data.durationMin * 60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal memuat asesmen');
      router.push('/dashboard/upskilling');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion((q) => q + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((q) => q - 1);
    }
  };

  const handleFinalSubmit = async (autoSubmit = false) => {
    if (!assessment || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assessments/${assessmentId}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, startedAt }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal mengirim jawaban');
      }

      const data = await res.json();
      const attemptId = data.data?.attempt?.id || data.data?.id;
      toast.success(autoSubmit ? 'Waktu habis! Asesmen dikirim otomatis.' : 'Asesmen berhasil diserahkan!');
      router.push(`/dashboard/upskilling/assessments/${assessmentId}/result?attempt=${attemptId}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Gagal mengirim jawaban');
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Menyiapkan lembar asesmen...</p>
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;
  const timeWarning = timeLeft !== null && timeLeft < 60 * 5; // 5 minutes warning

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 py-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/upskilling"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Keluar ke Daftar Asesmen
        </Link>
        <span className="text-xs text-muted-foreground font-medium">
          Passing Score: <strong className="text-foreground">{assessment.passingScore}%</strong>
        </span>
      </div>

      {/* Timer & Module Banner */}
      <Card className={cn('border', timeWarning ? 'border-destructive bg-destructive/5' : 'bg-card')}>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {assessment.skill.name}
              </span>
              <h2 className="text-base sm:text-lg font-bold text-foreground mt-1">
                {assessment.title}
              </h2>
            </div>
            <div className="flex items-center gap-3 self-end sm:self-center">
              <div
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono text-base font-bold border',
                  timeWarning
                    ? 'border-destructive text-destructive animate-pulse bg-destructive/10'
                    : 'border-border text-foreground bg-muted/50'
                )}
              >
                <Clock className="h-4 w-4 text-primary" />
                {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
              </div>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progres Pengerjaan</span>
              <span>{currentQuestion + 1} dari {assessment.questions.length} Soal</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Question Number Stepper */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none justify-start sm:justify-center">
        {assessment.questions.map((q, i) => {
          const isAnswered = answers[q.id] !== undefined;
          const isCurrent = i === currentQuestion;
          return (
            <button
              key={q.id}
              onClick={() => setCurrentQuestion(i)}
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold transition-all border shrink-0',
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/30'
                  : isAnswered
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                  : 'border-border bg-card text-muted-foreground hover:bg-muted'
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      {/* Active Question Box */}
      <Card className="bg-card border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border/60">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold">
              Pertanyaan #{currentQuestion + 1}
            </CardTitle>
            <span className="text-xs text-muted-foreground px-2 py-0.5 rounded-md bg-muted">
              Bobot Nilai: {question.weight || 10} poin
            </span>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-5">
          <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
            {question.question}
          </p>

          {/* Multiple Choice Options */}
          {(question.type === 'multiple_choice' || question.type === 'scenario') && (
            <div className="space-y-3 pt-2">
              {question.options.map((opt, i) => {
                const isSelected =
                  String(answers[question.id]) === String(i) ||
                  answers[question.id] === opt;
                return (
                  <button
                    type="button"
                    key={i}
                    onClick={() => handleAnswerChange(question.id, i)}
                    className={cn(
                      'w-full text-left flex items-start gap-3.5 p-4 rounded-xl border transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 shadow-sm text-foreground ring-1 ring-primary/40'
                        : 'border-border bg-card hover:bg-muted/40 text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <span
                      className={cn(
                        'w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border transition-colors mt-0.5',
                        isSelected
                          ? 'border-primary bg-primary text-primary-foreground'
                          : 'border-border bg-muted text-muted-foreground'
                      )}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1 text-sm font-medium leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* True / False Options */}
          {question.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-4 pt-2">
              {[
                { label: 'Benar', val: 0, icon: CheckCircle2, color: 'text-emerald-500' },
                { label: 'Salah', val: 1, icon: XCircle, color: 'text-rose-500' },
              ].map(({ label, val, icon: Icon, color }) => {
                const isSelected =
                  answers[question.id] === val ||
                  answers[question.id] === label ||
                  String(answers[question.id]) === String(val);
                return (
                  <button
                    type="button"
                    key={val}
                    onClick={() => handleAnswerChange(question.id, val)}
                    className={cn(
                      'p-5 rounded-xl border flex items-center justify-center gap-2.5 font-bold text-sm transition-all',
                      isSelected
                        ? 'border-primary bg-primary/10 text-foreground ring-1 ring-primary/40 shadow-sm'
                        : 'border-border bg-card hover:bg-muted/40 text-muted-foreground'
                    )}
                  >
                    <Icon className={cn('h-5 w-5', color)} />
                    {label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Fill in the blank */}
          {question.type === 'fill_blank' && (
            <div className="pt-2">
              <input
                type="text"
                value={(answers[question.id] as string) || ''}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                placeholder="Ketik jawaban Anda di sini..."
                className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                autoComplete="off"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="rounded-xl gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Sebelumnya
        </Button>

        <span className="text-xs text-muted-foreground hidden sm:block">
          Terjawab: <strong className="text-foreground">{Object.keys(answers).length}</strong> dari {assessment.questions.length} soal
        </span>

        {isLastQuestion ? (
          <Button
            onClick={() => setShowConfirm(true)}
            disabled={submitting}
            className="rounded-xl gap-2 bg-primary text-primary-foreground"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim...
              </>
            ) : (
              <>
                Selesai & Kirim
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} className="rounded-xl gap-2">
            Selanjutnya
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Confirm Submit Modal Dialog */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl border border-border bg-card shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <AlertCircle className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">Konfirmasi Selesai Ujian</h3>
                <p className="text-xs text-muted-foreground">Periksa kembali sebelum menyerahkan lembar ujian</p>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs space-y-1">
              <div className="flex justify-between">
                <span>Soal Terjawab:</span>
                <strong className="text-foreground">{Object.keys(answers).length} dari {assessment.questions.length}</strong>
              </div>
              {Object.keys(answers).length < assessment.questions.length && (
                <p className="text-amber-500 font-medium pt-1">
                  ⚠️ Ada {assessment.questions.length - Object.keys(answers).length} soal yang belum Anda jawab.
                </p>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl"
                onClick={() => setShowConfirm(false)}
                disabled={submitting}
              >
                Kembali Periksa
              </Button>
              <Button
                size="sm"
                className="rounded-xl"
                onClick={() => {
                  setShowConfirm(false);
                  handleFinalSubmit(false);
                }}
                disabled={submitting}
              >
                {submitting ? 'Mengirim...' : 'Ya, Kirim Sekarang'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}