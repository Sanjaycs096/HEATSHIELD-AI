import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  const sessionId = request.cookies.get('sessionId')?.value;
  const isAuthRoute = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  const isProtectedRoute = request.nextUrl.pathname.startsWith('/dashboard') ||
                           request.nextUrl.pathname.startsWith('/assessment') ||
                           request.nextUrl.pathname.startsWith('/plans') ||
                           request.nextUrl.pathname.startsWith('/history') ||
                           request.nextUrl.pathname.startsWith('/profile') ||
                           request.nextUrl.pathname.startsWith('/settings');

  if (isProtectedRoute && !sessionId) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthRoute && sessionId) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}
 
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/assessment/:path*',
    '/plans/:path*',
    '/history/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register'
  ],
}
