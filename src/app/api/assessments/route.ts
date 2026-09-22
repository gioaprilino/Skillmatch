import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const skillId = searchParams.get('skillId');

    const where: any = { isActive: true };
    if (skillId) where.skillId = skillId;
    if (category) where.skill = { category };

    const assessments = await prisma.assessment.findMany({
      where,
      include: {
        skill: {
          select: { id: true, code: true, name: true, category: true, icon: true },
        },
        _count: { select: { attempts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Get user's latest attempt for each assessment
    const userAttempts = await prisma.assessmentAttempt.findMany({
      where: { userId: session.user.id },
      select: { assessmentId: true, score: true, passed: true, completedAt: true },
      orderBy: { completedAt: 'desc' },
    });

    const attemptMap = new Map(userAttempts.map(a => [a.assessmentId, a]));

    const data = assessments.map(a => ({
      ...a,
      userAttempt: attemptMap.get(a.id) || null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Assessments GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}