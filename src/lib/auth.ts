import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const nextAuthInstance = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const parsed = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (!parsed.success) return null;

        const { email, password } = parsed.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user?.passwordHash) return null;

        const valid = await bcrypt.compare(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.avatar,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      if (trigger === 'update' && session) {
        token.name = session.name;
        token.image = session.image;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    authorized: async ({ auth }) => !!auth,
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
});

export const { handlers, signIn, signOut } = nextAuthInstance;
const nextAuthAuth = nextAuthInstance.auth;

export async function auth(...args: any[]): Promise<any> {
  // 1. NextAuth session check
  try {
    const nextAuthSession = await (nextAuthAuth as any)(...args);
    if (nextAuthSession?.user) {
      return nextAuthSession;
    }
  } catch {
    // Ignore
  }

  // 2. Custom auth-token cookie fallback (used by local login & registration)
  try {
    const { cookies } = await import('next/headers');
    const { jwtVerify } = await import('jose');
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (token) {
      const JWT_SECRET = new TextEncoder().encode(
        process.env.NEXTAUTH_SECRET || 'fallback-secret-change-in-production'
      );
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload && payload.sub) {
        return {
          user: {
            id: payload.sub as string,
            email: payload.email as string,
            name: payload.name as string,
            role: payload.role as any,
            image: (payload.image as string) || null,
          },
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        };
      }
    }
  } catch {
    // Ignore when called outside request lifecycle
  }

  return null;
}

declare module 'next-auth' {
  interface User {
    role: UserRole;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
    };
  }
}

// NextAuth v5 uses this for JWT type
declare module 'next-auth' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}

type UserRole = 'WORKER' | 'EMPLOYER' | 'ADMIN' | 'VERIFIER';