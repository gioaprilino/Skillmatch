import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
);

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const requestedRole = body.role;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Toggle role if not explicitly specified
    const newRole = requestedRole || (user.role === 'WORKER' ? 'EMPLOYER' : 'WORKER');

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        role: newRole,
        companyName: newRole === 'EMPLOYER' && !user.companyName ? 'PT Global Manpower International' : user.companyName,
      },
    });

    // Create fresh JWT with new role
    const token = await new SignJWT({
      sub: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      success: true,
      message: `Peran berhasil diubah menjadi ${newRole === 'WORKER' ? 'Pekerja Migran (Worker)' : 'Majikan / Agensi (Employer)'}`,
      role: updatedUser.role,
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Switch role error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
