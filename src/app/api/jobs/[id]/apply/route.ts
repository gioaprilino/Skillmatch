import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { calculateMatch, updateJobMatchScores } from '@/lib/matching';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { coverLetter, expectedSalary, availabilityDate } = body;

    if (!coverLetter || !coverLetter.trim()) {
      return NextResponse.json({ error: 'Cover letter is required' }, { status: 400 });
    }

    const job = await prisma.jobPost.findUnique({
      where: { id, status: 'PUBLISHED' },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found or not published' }, { status: 404 });
    }

    // Check if already applied
    const existing = await prisma.jobApplication.findUnique({
      where: { jobId_userId: { jobId: id, userId: session.user.id } },
    });

    if (existing) {
      return NextResponse.json({ error: 'Already applied to this job' }, { status: 400 });
    }

    // Calculate match score
    let matchScore: number | undefined;
    let matchedSkills: any | undefined;

    try {
      const match = await calculateMatch(session.user.id, id);
      matchScore = match.overallScore;
      matchedSkills = { items: match.matchedSkills };
    } catch {
      // Ignore match calculation errors
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId: id,
        userId: session.user.id,
        coverLetter: coverLetter.trim(),
        expectedSalary,
        availabilityDate: availabilityDate ? new Date(availabilityDate) : null,
        matchScore,
        matchedSkills: matchedSkills ? JSON.parse(JSON.stringify(matchedSkills)) : undefined,
        status: 'APPLIED',
      },
    });

    // Update job application count
    await prisma.jobPost.update({
      where: { id },
      data: { applicationCount: { increment: 1 } },
    });

    // Create notification for employer
    await prisma.notification.create({
      data: {
        userId: job.employerId,
        type: 'APPLICATION_UPDATE',
        title: 'Lamaran Baru',
        message: `${session.user.name} melamar posisi ${job.title}`,
        data: { applicationId: application.id, jobId: id },
      },
    });

    return NextResponse.json({ data: application });
  } catch (error) {
    console.error('Apply error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}