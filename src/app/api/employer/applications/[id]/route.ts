import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'EMPLOYER' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    const application = await prisma.jobApplication.findUnique({
      where: { id },
      include: { job: { select: { employerId: true, title: true } } },
    });

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    if (application.job.employerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.jobApplication.update({
      where: { id },
      data: {
        status,
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
        notes: notes || application.notes,
      },
    });

    // Create notification for applicant
    await prisma.notification.create({
      data: {
        userId: application.userId,
        type: 'APPLICATION_UPDATE',
        title: 'Status Lamaran Diperbarui',
        message: `Lamaran Anda untuk ${application.job.title} sekarang berstatus ${status}`,
        data: { applicationId: id, jobId: application.jobId },
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Application status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}