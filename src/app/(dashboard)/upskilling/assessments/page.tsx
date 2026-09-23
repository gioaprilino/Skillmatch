import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AssessmentsListClient, { AssessmentItem } from './AssessmentsListClient';

export const dynamic = 'force-dynamic';

export default async function AssessmentsListPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const assessments = await prisma.assessment.findMany({
    where: { isActive: true },
    include: {
      skill: {
        select: { id: true, code: true, name: true, category: true, icon: true },
      },
      _count: { select: { attempts: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  let userAttempts: any[] = [];
  if (userId) {
    try {
      userAttempts = await prisma.assessmentAttempt.findMany({
        where: { userId },
        select: { assessmentId: true, score: true, passed: true, completedAt: true },
        orderBy: { completedAt: 'desc' },
      });
    } catch {
      // ignore
    }
  }

  const attemptMap = new Map(userAttempts.map((a) => [a.assessmentId, a]));

  const initialAssessments: AssessmentItem[] = assessments.map((a) => {
    const attempt = attemptMap.get(a.id);
    return {
      id: a.id,
      title: a.title,
      description: a.description,
      durationMin: a.durationMin,
      passingScore: a.passingScore,
      skill: a.skill,
      userAttempt: attempt
        ? {
            score: attempt.score,
            passed: attempt.passed,
            completedAt: attempt.completedAt ? attempt.completedAt.toISOString() : new Date().toISOString(),
          }
        : null,
    };
  });

  return <AssessmentsListClient initialAssessments={initialAssessments} />;
}