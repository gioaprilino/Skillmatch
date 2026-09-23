import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getTopMatches } from '@/lib/matching';
import { issueSkillCredential, loadIssuerKeyFromEnv, saveCredentialToDb } from '@/lib/vc';

function mapScoreToLevel(score: number): string {
  if (score >= 90) return 'EXPERT';
  if (score >= 75) return 'ADVANCED';
  if (score >= 60) return 'INTERMEDIATE';
  return 'BEGINNER';
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = (await params) as { id: string };
    const body = await request.json();
    const { answers, startedAt } = body;

    if (!answers || typeof answers !== 'object') {
      return NextResponse.json({ error: 'Answers required' }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { id, isActive: true },
      include: { skill: true },
    });

    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }

    const questions = assessment.questions as Array<{ id: string; correctAnswer: string; weight?: number }>;
    let totalWeight = 0;
    let earnedWeight = 0;

    for (const q of questions) {
      totalWeight += q.weight || 1;
      const userAnswer = answers[q.id];
      if (
        userAnswer !== undefined &&
        String(userAnswer).trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
      ) {
        earnedWeight += q.weight || 1;
      }
    }

    const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;
    const passed = score >= assessment.passingScore;

    const attempt = await prisma.assessmentAttempt.create({
      data: {
        userId: session.user.id,
        assessmentId: id,
        score,
        answers,
        passed,
        startedAt: startedAt ? new Date(startedAt) : new Date(),
        completedAt: new Date(),
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    let credential = null;
    // Issue Verifiable Credential if passed
    if (passed && assessment.skill) {
      const level = mapScoreToLevel(score);
      await prisma.userSkill.upsert({
        where: {
          userId_skillId: {
            userId: session.user.id,
            skillId: assessment.skill.id,
          },
        },
        update: {
          level: level as any,
          verified: true,
          verifiedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          skillId: assessment.skill.id,
          level: level as any,
          verified: true,
          verifiedAt: new Date(),
        },
      });

      // Issue VC
      try {
        const issuerKey = await loadIssuerKeyFromEnv();
        const userDid = `did:web:skillmatch.id#${session.user.id}`;
        const vc = await issueSkillCredential(
          userDid,
          {
            id: assessment.skill.id,
            code: assessment.skill.code,
            name: assessment.skill.name,
            category: assessment.skill.category,
          },
          {
            id: assessment.id,
            title: assessment.title,
            passingScore: assessment.passingScore,
          },
          {
            id: attempt.id,
            score,
            completedAt: new Date(),
            answers,
          },
          issuerKey
        );
        await saveCredentialToDb(session.user.id, assessment.skill.id, vc, '');
        credential = { id: vc.id, vcData: vc };
      } catch (vcError) {
        console.error('VC issuance failed:', vcError);
        // Don't fail the attempt if VC fails
      }

      // Trigger job matching recalculation
      try {
        await getTopMatches(session.user.id);
      } catch {
        // Ignore matching errors
      }
    }

    return NextResponse.json({
      data: {
        ...attempt,
        attempt: {
          id: attempt.id,
          score: attempt.score,
          passed: attempt.passed,
          completedAt: attempt.completedAt,
        },
        assessment: { title: assessment.title, passingScore: assessment.passingScore },
        credential,
      },
    });
  } catch (error) {
    console.error('Assessment attempt error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}