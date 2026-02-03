import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const path = req.nextUrl.pathname;

  // Check if user is accessing admin routes
  if (path.startsWith('/admin')) {
    // Redirect to login if not authenticated
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Admin-only routes
    if (path.startsWith('/admin/users')) {
      if (token.role !== 'admin') {
        return NextResponse.redirect(new URL('/admin', req.url));
      }
    }

    // Content manager and reviewer can access content routes
    if (path.startsWith('/admin/content')) {
      const allowedRoles = ['content_manager', 'content_reviewer', 'admin'];
      if (!allowedRoles.includes(token.role as string)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
