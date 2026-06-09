import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, decodeSession } from '@/lib/session-token';

// Protect dashboard pages: redirect unauthenticated users to the login page.
const PROTECTED = [
  '/outlets',
  '/menu',
  '/inventory',
  '/crm',
  '/reports',
  '/locations',
  '/users',
  '/settings',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
  if (!needsAuth) return NextResponse.next();

  const email = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!email) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/outlets/:path*',
    '/menu/:path*',
    '/inventory/:path*',
    '/crm/:path*',
    '/reports/:path*',
    '/locations/:path*',
    '/users/:path*',
    '/settings/:path*',
  ],
};
