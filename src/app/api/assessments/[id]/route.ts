import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { id } = (await params) as { id: string };

    const assessment = await prisma.assessment.findUnique({
      where: { id, isActive: true },
      include: {
        skill: { select: { id: true, code: true, name: true, category: true } },
      },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    // Remove correct answers from questions for client
    const questions = assessment.questions as any[];
    const safeQuestions = questions.map(q => ({
      id: q.id,
      type: q.type,
      question: q.question,
      options: q.options,
      weight: q.weight,
    }));

    // Get user's latest attempt if logged in
    let latestAttempt = null;
    if (userId) {
      latestAttempt = await prisma.assessmentAttempt.findFirst({
        where: { userId, assessmentId: id },
        orderBy: { startedAt: 'desc' },
        select: { id: true, score: true, passed: true, completedAt: true, answers: true },
      });
    }

    return NextResponse.json({
      data: {
        ...assessment,
        questions: safeQuestions,
        latestAttempt: latestAttempt || null,
      },
    });
  } catch (error) {
    console.error('Assessment GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}