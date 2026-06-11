import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, decodeSession } from '@/lib/session-token';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/billing',
  '/orders',
  '/kds',
  '/tables',
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
  const needsAuth = PROTECTED_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );
  if (!needsAuth) return NextResponse.next();

  const email = decodeSession(request.cookies.get(SESSION_COOKIE)?.value);
  if (!email) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  // Redirect page requests to the SPA HashRouter equivalent.
  const url = request.nextUrl.clone();
  url.pathname = '/';
  url.hash = pathname;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/billing/:path*',
    '/orders/:path*',
    '/kds/:path*',
    '/tables/:path*',
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
