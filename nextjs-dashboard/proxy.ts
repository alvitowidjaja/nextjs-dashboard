import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('basekamp_token')?.value;
  const isTryingToAccessDashboard = request.nextUrl.pathname.startsWith('/dashboard');
  const isTryingToAccessLogin = request.nextUrl.pathname.startsWith('/login');

  if (isTryingToAccessDashboard && !token) {
    console.log("🚨 Trespasser blocked! Redirecting to login.");
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isTryingToAccessLogin && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
