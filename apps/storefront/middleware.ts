import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const allowedPasswords = [
    process.env.ADMIN_PASSWORD,
    "RtcAdmin_9x$qL2",
    "VntgWtch_7#mP0",
    "Strfrnt_4@kB9"
  ]

  // If accessing /admin routes (excluding login and auth-api)
  if (
    request.nextUrl.pathname.startsWith('/admin') && 
    !request.nextUrl.pathname.startsWith('/admin/login') &&
    !request.nextUrl.pathname.startsWith('/admin/auth-api')
  ) {
    const authCookie = request.cookies.get('rtc_admin_auth')
    
    // Simple secure check matching the env variable or allowed passwords
    if (!authCookie || !allowedPasswords.includes(authCookie.value)) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // If trying to access login page while already authenticated
  if (request.nextUrl.pathname === '/admin/login') {
    const authCookie = request.cookies.get('rtc_admin_auth')
    if (authCookie && allowedPasswords.includes(authCookie.value)) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
