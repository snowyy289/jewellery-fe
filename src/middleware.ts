import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies or check localStorage (will be handled client-side)
  const token = request.cookies.get('token')?.value;
  
  // Admin routes that require authentication
  const isAdminRoute = pathname.startsWith('/admin') && !pathname.startsWith('/admin/login') && !pathname.startsWith('/admin/forgot-password') && !pathname.startsWith('/admin/otp-password') && !pathname.startsWith('/admin/reset-password');
  
  // If accessing admin route without token, redirect to login
  if (isAdminRoute && !token) {
    // Check if there's a token in the URL (from client-side)
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }
  
  // If accessing login page with token, redirect to dashboard
  if (pathname === '/admin/login' && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/dashboard';
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
