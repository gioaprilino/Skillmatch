import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateMatch, getTopMatches } from '@/lib/matching';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const job = await prisma.jobPost.findUnique({
      where: { id, status: 'PUBLISHED' },
      include: {
        employer: { select: { id: true, name: true, companyName: true, companyWebsite: true, companyDescription: true, companySize: true } },
        skills: {
          include: { skill: { select: { id: true, name: true, category: true } } },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    // Calculate match
    let matchScore: number | undefined;
    let matchedSkills: any | undefined;
    let gaps: any[] | undefined;

    try {
      const match = await calculateMatch(session.user.id, job.id);
      matchScore = match.overallScore;
      matchedSkills = { items: match.matchedSkills };
      gaps = match.gaps;
    } catch {
      // Ignore match calculation errors
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: { jobId_userId: { jobId: id, userId: session.user.id } },
      select: { id: true, status: true },
    });

    return NextResponse.json({
      data: {
        ...job,
        requirements: job.requirements as string[],
        responsibilities: job.responsibilities as string[],
        benefits: job.benefits as string[],
        languageReq: job.languageReq as { language: string; level: string }[] | null,
        matchScore,
        matchedSkills,
        gaps,
        alreadyApplied: !!existingApplication,
        applicationStatus: existingApplication?.status,
      },
    });
  } catch (error) {
    console.error('Job GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}