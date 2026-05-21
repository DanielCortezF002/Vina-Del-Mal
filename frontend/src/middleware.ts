import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // ── 1. Extract tenant from subdomain (multi-tenant support) ──
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const isVercel = host.includes('vercel.app');

  let tenantSlug = 'vinadelmal'; // default tenant
  if (!isLocalhost && !isVercel) {
    // Production: extract subdomain (e.g., mitienda.vinadelmal.cl → mitienda)
    const parts = host.split('.');
    if (parts.length >= 3) {
      tenantSlug = parts[0];
    }
  }

  // Inject tenant header for Server Components / API routes
  response.headers.set('x-tenant-slug', tenantSlug);

  // ── 2. Age verification ──
  // The AgeVerificationModal in root layout handles client-side gating.
  // The HttpOnly cookie `vdm_age_ok` is set via Server Action for future
  // middleware-level enforcement once the localStorage migration is complete.
  // For now, we do NOT redirect — the modal is the primary gate.

  // ── 3. Admin route protection ──
  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith('/admin');
  const isLoginRoute = pathname === '/admin/login';

  if (isAdminRoute && !isLoginRoute) {
    const token = request.cookies.get('vdm_auth_token')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - Files with extensions (images, fonts, etc.)
     * - API routes (handled separately)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)',
  ],
};
