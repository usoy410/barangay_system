import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const SESSION_COOKIE_NAME = 'bis_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Define Public Routes
  const isPublicRoute = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname.startsWith('/_next') || 
    pathname.includes('.') || // static files like icons
    pathname === '/favicon.ico';

  // 2. Get Session Cookie
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
  
  // 3. Handle Unauthenticated Users
  if (!sessionCookie && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // 4. Handle Authenticated Users
  if (sessionCookie) {
    // If trying to access login/register while authenticated, go home
    if (pathname === '/login' || pathname === '/register') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }

    try {
      // Decode session to check roles (Base64 decoded JSON)
      const sessionData = JSON.parse(atob(sessionCookie.value));
      const { role } = sessionData;

      // 5. Role-Based Access Control
      // Residents cannot access /admin
      if (role === 'resident' && pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
      
      // Developers and Officials can access everything for this demo
    } catch (e) {
      // If cookie is malformed, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }
  }

  return NextResponse.next();
}

// Ensure middleware runs on the right paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
