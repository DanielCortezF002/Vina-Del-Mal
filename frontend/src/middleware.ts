import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require age verification
const PROTECTED_ROUTES = ['/catalogo', '/checkout', '/cocteles'];
// Routes that require admin role (future JWT validation)
const _ADMIN_ROUTES = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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

  // ── 2. Age verification gate ──
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const ageVerified = request.cookies.get('vdm_age_ok')?.value;

  if (isProtectedRoute && !ageVerified) {
    // Redirect to home where the age modal will appear
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.searchParams.set('restricted', '1');
    return NextResponse.redirect(url);
  }

  // ── 3. Admin route protection (placeholder for JWT role check) ──
  // For now, admin is accessible — when auth is implemented,
  // uncomment and validate JWT admin role here:
  // const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  // if (isAdminRoute) {
  //   const token = request.cookies.get('vdm_auth_token')?.value;
  //   if (!token || !isAdminJWT(token)) {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

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
