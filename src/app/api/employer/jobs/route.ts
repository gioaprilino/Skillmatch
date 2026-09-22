import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'EMPLOYER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const jobs = await prisma.jobPost.findMany({
      where: { employerId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        skills: { include: { skill: { select: { id: true, name: true } } } },
        _count: { select: { applications: true } },
      },
    });

    return NextResponse.json({ data: jobs });
  } catch (error) {
    console.error('Employer jobs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}