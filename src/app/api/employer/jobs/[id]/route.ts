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

    const job = await prisma.jobPost.findUnique({
      where: { id },
      include: {
        skills: { include: { skill: { select: { id: true, name: true, category: true } } } },
        _count: { select: { applications: true } },
      },
    });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.employerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: job });
  } catch (error) {
    console.error('Employer job GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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

    const job = await prisma.jobPost.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.employerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const {
      title,
      description,
      requirements,
      responsibilities,
      benefits,
      country,
      province,
      city,
      workType,
      salaryMin,
      salaryMax,
      salaryCurrency,
      salaryPeriod,
      contractType,
      contractDurationMonths,
      minAge,
      maxAge,
      gender,
      languageReq,
      passportRequired,
      visaProvided,
      medicalCheckRequired,
      status,
    } = body;

    const publishedAt = status === 'PUBLISHED' && job.status !== 'PUBLISHED' ? new Date() : job.publishedAt;

    const updated = await prisma.jobPost.update({
      where: { id },
      data: {
        title,
        description,
        requirements,
        responsibilities,
        benefits,
        country,
        province,
        city,
        workType,
        salaryMin,
        salaryMax,
        salaryCurrency,
        salaryPeriod,
        contractType,
        contractDurationMonths,
        minAge,
        maxAge,
        gender,
        languageReq,
        passportRequired,
        visaProvided,
        medicalCheckRequired,
        status,
        publishedAt,
      },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('Employer job PUT error:', error);
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

    const job = await prisma.jobPost.findUnique({ where: { id } });

    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (job.employerId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.jobPost.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Employer job DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}