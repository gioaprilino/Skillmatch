'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BookOpen, Clock, CheckCircle2, ArrowRight, RefreshCw, Filter } from 'lucide-react';
import { cn, getSkillCategoryLabel, getSkillLevelLabel, getSkillLevelColor } from '@/lib/utils';

interface Assessment {
  id: string;
  title: string;
  description: string;
  durationMin: number;
  passingScore: number;
  skill: { id: string; code: string; name: string; category: string; icon?: string };
  userAttempt: { score: number; passed: boolean; completedAt: string } | null;
}

export default function AssessmentsListPage() {
  const { data: session, status } = useSession();
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchAssessments();
    }
  }, [status, filterCategory]);

  const fetchAssessments = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filterCategory !== 'all') params.set('category', filterCategory);
      const res = await fetch(`/api/assessments?${params}`);
      if (!res.ok) throw new Error('Failed to load assessments');
      const data = await res.json();
      setAssessments(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['DOMESTIC_CARE', 'CONSTRUCTION', 'HOSPITALITY', 'LANGUAGE', 'DRIVING', 'DIGITAL_BASIC', 'FINANCIAL_LITERACY', 'MIGRATION_RIGHTS'];

  if (status === 'loading') {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-muted rounded w-1/4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-muted rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="text-center py-12">
        <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
        <h2 className="mt-4 text-xl font-semibold">Silakan login terlebih dahulu</h2>
        <Button asChild className="mt-4">
          <Link href="/auth/login?callbackUrl=/dashboard/upskilling/assessments">Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Asesmen Skill</h1>
          <p className="text-muted-foreground">
            Ikuti asesmen untuk mendapatkan sertifikat terverifikasi (Verifiable Credential)
          </p>
        </div>
        <Button variant="outline" onClick={fetchAssessments} size="sm">
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 text-destructive" role="alert">
          {error}
          <Button variant="link" className="ml-2" size="sm" onClick={fetchAssessments}>
            Coba lagi
          </Button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={filterCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('all')}
        >
          Semua
        </Button>
        {categories.map(cat => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
          >
            {getSkillCategoryLabel(cat)}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assessments.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="mx-auto h-12 w-12 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-2.631-6.281M8.25 21h7.5" />
            </svg>
            <p className="mt-2 text-muted-foreground">Belum ada asesmen untuk kategori ini</p>
          </div>
        ) : (
          assessments.map(assessment => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))
        )}
      </div>
    </div>
  );
}

function AssessmentCard({ assessment }: { assessment: Assessment }) {
  const { userAttempt, skill, passingScore, durationMin, title, description } = assessment;
  const isCompleted = !!userAttempt;
  const isPassed = userAttempt?.passed;

  return (
    <div className="h-full flex flex-col border rounded-lg bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            {skill.icon ? (
              <span className="text-2xl" role="img" aria-label={skill.icon}>{skill.icon}</span>
            ) : (
              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-2.631-6.281M8.25 21h7.5" />
              </svg>
            )}
          </div>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700">
              {getSkillCategoryLabel(skill.category)}
            </span>
            <h3 className="mt-1 font-semibold">{title}</h3>
          </div>
        </div>
        {isCompleted && (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isPassed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {isPassed ? '✓ Lulus' : '✗ Tidak Lulus'}
          </span>
        )}
      </div>
      <div className="flex-1 flex flex-col">
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <span><svg className="mr-1 h-3 w-3 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg> {durationMin} menit</span>
          <span>Skor lulus: {passingScore}%</span>
        </div>

        {isCompleted && (
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
              <span>Skor Anda</span>
              <span className="font-semibold">{userAttempt?.score}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(userAttempt?.score || 0)}%` }} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Selesai: {new Date(userAttempt!.completedAt).toLocaleDateString('id-ID')}
            </p>
          </div>
        )}

        <div className="mt-auto pt-3 border-t">
          <Link
            href={isCompleted ? `/dashboard/upskilling/assessments/${assessment.id}/result` : `/dashboard/upskilling/assessments/${assessment.id}/take`}
            className="w-full"
          >
            <button className="w-full px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
              {isCompleted ? 'Lihat Hasil & Sertifikat' : 'Mulai Asesmen'}
              <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}