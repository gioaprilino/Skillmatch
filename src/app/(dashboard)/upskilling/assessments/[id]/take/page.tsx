'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, XCircle } from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@radix-ui/react-radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, Clock, ArrowRight } from 'lucide-react';
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
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | number>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [startedAt] = useState(Date.now());

  // Load assessment
  useEffect(() => {
    fetchAssessment();
  }, [assessmentId]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchAssessment = async () => {
    try {
      const res = await fetch(`/api/assessments/${assessmentId}`);
      if (!res.ok) throw new Error('Assessment not found');
      const data = await res.json();
      setAssessment(data.data);
      setTimeLeft(data.data.durationMin * 60);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to load assessment');
      router.push('/dashboard/upskilling/assessments');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: string | number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < (assessment?.questions.length || 0) - 1) {
      setCurrentQuestion(q => q + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(q => q - 1);
    }
  };

  const handleSubmit = async (autoSubmit = false) => {
    if (!autoSubmit) setShowConfirm(true);
    if (autoSubmit || showConfirm) {
      setSubmitting(true);
      try {
        const res = await fetch(`/api/assessments/${assessmentId}/attempt`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers, startedAt }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || 'Submit failed');
        }
        const data = await res.json();
        const attemptId = data.data?.attempt?.id || data.data?.id;
        toast.success(autoSubmit ? 'Waktu habis! Asesmen dikirim otomatis.' : 'Asesmen selesai!');
        router.push(`/dashboard/upskilling/assessments/${assessmentId}/result?attempt=${attemptId}`);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Gagal mengirim jawaban');
        setSubmitting(false);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading || !assessment) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const question = assessment.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / assessment.questions.length) * 100;
  const isLastQuestion = currentQuestion === assessment.questions.length - 1;
  const timeWarning = timeLeft < 60 * 5; // 5 minutes warning

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header with timer */}
      <Card className={timeWarning ? 'border-destructive' : ''}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{assessment.skill.name} {' > '} {assessment.title}</p>
              <p className="text-xs text-muted-foreground">Butuh {assessment.passingScore}% untuk lulus</p>
            </div>
            <div className="flex items-center gap-4">
              <Progress value={progress} className="w-48 h-2" />
              <div className={cn('font-mono text-lg font-semibold', timeWarning ? 'text-destructive animate-pulse' : '')}>
                <Clock className="mr-1 h-4 w-4 inline" />
                {formatTime(timeLeft)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-1 overflow-x-auto pb-2">
        {assessment.questions.map((_, i) => (
          <div
            key={i}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors',
              i === currentQuestion
                ? 'bg-primary text-primary-foreground'
                : answers[assessment.questions[i].id] !== undefined
                ? 'bg-success text-success-foreground'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {i + 1}
          </div>
        ))}
      </div>

      {/* Question */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Soal {currentQuestion + 1} dari {assessment.questions.length}</CardTitle>
          <CardDescription className="capitalize">Tipe: {question.type.replace('_', ' ')} • Bobot: {question.weight}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="font-medium">{question.question}</p>
          </div>

          {question.type === 'multiple_choice' && (
            <RadioGroup
              value={answers[question.id] as string}
              onValueChange={v => handleAnswerChange(question.id, v)}
              className="space-y-3"
            >
              {question.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value={opt} className="mt-0.5" />
                  <span className="flex-1">{opt}</span>
                </label>
              ))}
            </RadioGroup>
          )}

          {question.type === 'true_false' && (
            <RadioGroup
              value={answers[question.id] as string}
              onValueChange={v => handleAnswerChange(question.id, v)}
              className="flex gap-4"
            >
              <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 text-center hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="Benar" />
                <span className="flex-1 flex items-center justify-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  Benar
                </span>
              </label>
              <label className="flex items-center gap-2 p-4 border rounded-lg cursor-pointer flex-1 text-center hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                <RadioGroupItem value="Salah" />
                <span className="flex-1 flex items-center justify-center gap-2">
                  <XCircle className="h-5 w-5 text-destructive" />
                  Salah
                </span>
              </label>
            </RadioGroup>
          )}

          {question.type === 'fill_blank' && (
            <input
              type="text"
              value={(answers[question.id] as string) || ''}
              onChange={e => handleAnswerChange(question.id, e.target.value)}
              placeholder="Ketik jawaban Anda..."
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-ring"
              autoComplete="off"
            />
          )}

          {question.type === 'scenario' && (
            <RadioGroup
              value={answers[question.id] as string}
              onValueChange={v => handleAnswerChange(question.id, v)}
              className="space-y-3"
            >
              {question.options.map((opt, i) => (
                <label key={i} className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                  <RadioGroupItem value={opt} className="mt-1" />
                  <span className="flex-1">{opt}</span>
                </label>
              ))}
            </RadioGroup>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handlePrev}
          disabled={currentQuestion === 0}
          className="w-auto"
        >
          Sebelumnya
        </Button>

        <div className="flex-1 text-center text-sm text-muted-foreground">
          Dijawab: {Object.keys(answers).length} / {assessment.questions.length}
        </div>

        {isLastQuestion ? (
          <Button
            onClick={() => handleSubmit(false)}
            disabled={submitting}
            loading={submitting}
            size="lg"
            className="w-auto"
          >
            {submitting ? 'Mengirim...' : 'Selesai & Kirim'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!answers[question.id]} className="w-auto">
            Selanjutnya
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Confirm Dialog */}
      {showConfirm && (
        <Alert className="border-destructive bg-destructive/10" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">Yakin ingin mengirim jawaban?</p>
              <p className="text-sm">
                {Object.keys(answers).length} dari {assessment.questions.length} soal terjawab.
                {Object.keys(answers).length < assessment.questions.length && ' Beberapa soal belum dijawab.'}
              </p>
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm" onClick={() => setShowConfirm(false)}>Batal</Button>
              <Button size="sm" onClick={() => handleSubmit(true)}>Ya, Kirim</Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}