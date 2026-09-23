import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            employer: { select: { id: true, name: true, companyName: true, companyWebsite: true } },
            skills: { include: { skill: { select: { id: true, name: true, category: true } } } },
          },
        },
      },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: application });
  } catch (error) {
    console.error('Application GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { select: { employerId: true, title: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!['APPLIED', 'SCREENING'].includes(application.status)) {
      return NextResponse.json({ error: 'Cannot withdraw application at this stage' }, { status: 400 });
    }

    await prisma.jobApplication.update({
      where: { id },
      data: { status: 'WITHDRAWN' },
    });

    // Update accurate application count
    const activeCount = await prisma.jobApplication.count({
      where: { jobId: application.jobId, status: { not: 'WITHDRAWN' } },
    });
    await prisma.jobPost.update({
      where: { id: application.jobId },
      data: { applicationCount: activeCount },
    });

    // Notify employer
    await prisma.notification.create({
      data: {
        userId: application.job.employerId,
        type: 'APPLICATION_UPDATE',
        title: 'Lamaran Ditarik',
        message: `Pelamar menarik lamaran untuk ${application.job.title}`,
        data: { applicationId: id, jobId: application.jobId },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Application DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}