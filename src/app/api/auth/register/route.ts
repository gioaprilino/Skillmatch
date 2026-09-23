import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, phone, agreeTerms } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'Semua field wajib diisi' }, { status: 400 });
    }

    if (!agreeTerms) {
      return NextResponse.json({ error: 'Anda harus menyetujui syarat & ketentuan' }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password minimal 8 karakter' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 400 });
    }

    if (phone) {
      const existingPhone = await prisma.user.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return NextResponse.json({ error: 'Nomor telepon sudah terdaftar' }, { status: 400 });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        passwordHash,
        role: role as 'WORKER' | 'EMPLOYER',
        phone,
        language: 'id',
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const token = await new SignJWT({
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1d')
      .sign(JWT_SECRET);

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 });
  }
}