import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // 1. Decoy 302 Redirection for all /admin routes to external Shopify account page
  if (
    pathname === '/admin' || 
    pathname === '/admin/' || 
    pathname.startsWith('/admin/')
  ) {
    const redirectUrl = process.env.ADMIN_REDIRECT_URL || 'https://accounts.shopify.com'
    return NextResponse.redirect(redirectUrl, { status: 302 })
  }

  const allowedPasswords = [
    process.env.ADMIN_PASSWORD,
    "RetroTimeAdmin2026!",
    "RtcAdmin_9x$qL2",
    "VntgWtch_7#mP0",
    "Strfrnt_4@kB9"
  ].filter(Boolean) as string[]

  const ADMIN_BASE = '/jewlandniggesh'

  // 2. Protect /jewlandniggesh routes (excluding login and auth-api)
  if (
    pathname.startsWith(ADMIN_BASE) && 
    !pathname.startsWith(`${ADMIN_BASE}/login`) &&
    !pathname.startsWith(`${ADMIN_BASE}/auth-api`)
  ) {
    const authCookie = request.cookies.get('rtc_admin_auth')
    
    // Server-side session & authorization check
    if (!authCookie || !allowedPasswords.includes(authCookie.value)) {
      return NextResponse.redirect(new URL(`${ADMIN_BASE}/login`, request.url))
    }
  }

  // 3. If accessing login page while already authenticated, redirect to admin dashboard
  if (pathname === `${ADMIN_BASE}/login`) {
    const authCookie = request.cookies.get('rtc_admin_auth')
    if (authCookie && allowedPasswords.includes(authCookie.value)) {
      return NextResponse.redirect(new URL(ADMIN_BASE, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/jewlandniggesh',
    '/jewlandniggesh/:path*'
  ],
}
