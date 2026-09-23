import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTopMatches } from '@/lib/matching';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const country = searchParams.get('country') || 'all';
    const workType = searchParams.get('workType') || 'all';

    const where: any = {
      status: 'PUBLISHED',
      expiresAt: { gt: new Date() },
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { employer: { companyName: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (country !== 'all') where.country = country;
    if (workType !== 'all') where.workType = workType;

    const jobs = await prisma.jobPost.findMany({
      where,
      take: 50,
      orderBy: { publishedAt: 'desc' },
      include: {
        employer: { select: { id: true, name: true, companyName: true, companyWebsite: true } },
        skills: {
          include: { skill: { select: { id: true, name: true, category: true } } },
        },
      },
    });

    // Calculate match scores for all jobs at once if logged in
    let matchMap = new Map();
    if (userId) {
      try {
        const matches = await getTopMatches(userId, 50);
        matchMap = new Map(matches.map((m) => [m.jobId, m]));
      } catch (err) {
        console.warn('Matching calculation error:', err);
      }
    }

    const jobsWithMatch = jobs.map((job) => {
      const match = matchMap.get(job.id);
      return {
        ...job,
        matchScore: match ? match.overallScore : undefined,
        matchedSkills: match ? { items: match.matchedSkills } : undefined,
      };
    });

    return NextResponse.json({ data: jobsWithMatch });
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}