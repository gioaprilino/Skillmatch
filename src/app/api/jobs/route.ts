import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTopMatches } from '@/lib/matching';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

    // Calculate match scores for each job
    const jobsWithMatch = await Promise.all(
      jobs.map(async (job) => {
        let matchScore: number | undefined;
        let matchedSkills: { items: any[] } | undefined;
        
        try {
          const match = await getTopMatches(session.user.id, 1).then(m => m.find(x => x.jobId === job.id));
          if (match) {
            matchScore = match.overallScore;
            matchedSkills = { items: match.matchedSkills };
          }
        } catch {
          // Ignore match calculation errors
        }

        return {
          ...job,
          matchScore,
          matchedSkills,
        };
      })
    );

    return NextResponse.json({ data: jobsWithMatch });
  } catch (error) {
    console.error('Jobs GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}