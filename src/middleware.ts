import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const authToken = request.cookies.get('auth-token');

  const pathname = request.nextUrl.pathname;
  const isPublicPath =
    pathname === '/' ||
    pathname.startsWith('/auth') ||
    pathname.startsWith('/verify') ||
    pathname.startsWith('/jobs') ||
    pathname.startsWith('/upskilling');

  if (!authToken && !isPublicPath && pathname.startsWith('/dashboard')) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (authToken && request.nextUrl.pathname.startsWith('/auth/')) {
    const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/dashboard';
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|sw.js|icons).*)',
  ],
};