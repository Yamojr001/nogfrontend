import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Define sensitive prefixes and their authorized roles
  // Logic: All these paths REQUIRE a valid token and matching role
  const protectedPrefixes = ['/dashboard', '/member', '/admin', '/partner', '/group', '/sub-org', '/wallet', '/transactions'];
  const isProtected = protectedPrefixes.some(prefix => pathname.startsWith(prefix));

  const roleMap: Record<string, string> = {
    super_admin: '/dashboard',
    finance_admin: '/dashboard',
    auditor: '/dashboard',
    partner_admin: '/partner',
    sub_org_admin: '/sub-org',
    group_admin: '/group',
    member: '/member',
  };

  const token = request.cookies.get('access_token');
  const role = request.cookies.get('user_role');
  const roleVal = role?.value || '';

  // 2. Authentication Check: Redirect to login if no token on protected routes
  if (isProtected && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authorization (RBAC) Check
  if (isProtected && token) {
    // If role is missing or invalid, force logout/redirect
    const allowedPathPrefix = roleMap[roleVal];
    
    if (!allowedPathPrefix) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('access_token');
      response.cookies.delete('user_role');
      return response;
    }

    // Check if the current pathname is unauthorized for this role
    // Special Case: Allow access to paths that start with the role's primary prefix
    const isAuthorized = pathname.startsWith(allowedPathPrefix);
    
    if (!isAuthorized) {
      // Redirect to their own dashboard instead of login (they ARE authenticated, just lost)
      return NextResponse.redirect(new URL(allowedPathPrefix, request.url));
    }
  }

  // 4. Prevent logged-in users from accessing login page (Redirect to dashboard)
  if (pathname === '/login' && token && roleVal) {
    const target = roleMap[roleVal] || '/dashboard';
    return NextResponse.redirect(new URL(target, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
