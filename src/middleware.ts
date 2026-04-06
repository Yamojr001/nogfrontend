import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Define sensitive prefixes and their authorized roles
  // Logic: All these paths REQUIRE a valid token and matching role
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
  const hasPaidCookie = request.cookies.get('has_paid_registration_fee');
  const roleVal = role?.value || '';
  const hasPaidRegistrationFee = hasPaidCookie?.value === 'true';

  // 2. Authentication Check: Redirect to login if no token
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 3. Authorization (RBAC) Check
  const allowedPathPrefix = roleMap[roleVal];
  
  // If role is missing or invalid, force logout/redirect
  if (!allowedPathPrefix) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete('access_token');
    response.cookies.delete('user_role');
    return response;
  }

  // Member payment gate at edge level: unpaid members can only access /member/payment.
  if (roleVal === 'member') {
    if (!hasPaidRegistrationFee && pathname !== '/member/payment') {
      return NextResponse.redirect(new URL('/member/payment', request.url));
    }

    if (hasPaidRegistrationFee && pathname === '/member/payment') {
      return NextResponse.redirect(new URL('/member', request.url));
    }
  }

  // Check if the current pathname is authorized for this role
  // Special Case: Allow access to paths that start with the role's primary prefix
  const isAuthorized = pathname.startsWith(allowedPathPrefix);
  
  if (!isAuthorized) {
    // Redirect to their own dashboard instead of login (they ARE authenticated, just lost)
    return NextResponse.redirect(new URL(allowedPathPrefix, request.url));
  }

  return NextResponse.next();
}

// 4. Specific Matcher: ONLY run context-bound logic for protected routes
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/member/:path*', 
    '/admin/:path*', 
    '/partner/:path*', 
    '/group/:path*', 
    '/sub-org/:path*', 
    '/wallet/:path*', 
    '/transactions/:path*'
  ],
};
