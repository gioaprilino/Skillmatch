import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
);

export async function GET(request: NextRequest) {
  try {
    // 1. Try NextAuth session first
    try {
      const nextAuthSession = await auth();
      if (nextAuthSession?.user) {
        return NextResponse.json(nextAuthSession);
      }
    } catch {
      // ignore
    }

    // 2. Try auth-token cookie (custom JWT set by login / register routes)
    const authToken = request.cookies.get('auth-token')?.value;
    if (authToken) {
      try {
        const { payload } = await jwtVerify(authToken, JWT_SECRET);
        if (payload) {
          return NextResponse.json({
            user: {
              id: payload.sub as string,
              email: payload.email as string,
              name: payload.name as string,
              role: payload.role as string,
            },
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          });
        }
      } catch (jwtErr) {
        // Invalid or expired token
      }
    }

    return NextResponse.json({ user: null });
  } catch (error) {
    return NextResponse.json({ user: null });
  }
}
