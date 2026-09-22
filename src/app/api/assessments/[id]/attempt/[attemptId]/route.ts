import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; attemptId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, attemptId } = await params;

    const attempt = await prisma.assessmentAttempt.findFirst({
      where: { id: attemptId, assessmentId: id, userId: session.user.id },
      include: {
        assessment: {
          include: {
            skill: { select: { id: true, code: true, name: true, category: true } },
          },
        },
      },
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    // Get credential if exists
    const credential = await prisma.certification.findFirst({
      where: { userId: session.user.id, skillId: attempt.assessment.skillId, status: 'VERIFIED' },
      orderBy: { issuedAt: 'desc' },
    });

    return NextResponse.json({
      data: {
        attempt: {
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed,
          completedAt: attempt.completedAt.toISOString(),
        },
        credential: credential ? { id: credential.credentialId, vcData: credential.vcData } : null,
      },
    });
  } catch (error) {
    console.error('Attempt GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}