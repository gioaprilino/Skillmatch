import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ data: [] });
    }

    const certs = await prisma.certification.findMany({
      where: { userId: session.user.id },
      include: {
        skill: true,
      },
      orderBy: { issuedAt: 'desc' },
    });

    const formatted = certs.map((c) => ({
      id: c.id,
      credentialId: c.credentialId,
      skillName: c.skill.name,
      category: c.skill.category,
      level: c.level,
      score: (c.vcData as any)?.credentialSubject?.assessment?.score || 85,
      issuedAt: c.issuedAt.toISOString(),
      issuer: c.issuer || 'SkillMatch & Standar BNSP RI',
      ipfsHash: c.ipfsHash || 'QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco',
      vcData: c.vcData,
    }));

    return NextResponse.json({ data: formatted });
  } catch (error) {
    console.error('Certificates GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
