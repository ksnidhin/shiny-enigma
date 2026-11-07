import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

interface RateLimitRecord {
  attempts: number
  firstAttemptAt: number
  blockedUntil?: number
}

// In-memory rate limiting map for login attempts (IP -> record)
const rateLimitMap = new Map<string, RateLimitRecord>()
const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes window
const BLOCK_DURATION_MS = 15 * 60 * 1000 // 15 minutes lockout

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) return realIp.trim()
  return 'unknown-client'
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request)
    const now = Date.now()

    // 1. Rate Limit Enforcement
    const record = rateLimitMap.get(ip)
    if (record) {
      if (record.blockedUntil && now < record.blockedUntil) {
        const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000)
        return NextResponse.json(
          { success: false, message: 'Too many failed login attempts. Please try again later.' },
          { 
            status: 429,
            headers: { 
              'Retry-After': remainingSeconds.toString(),
              'Cache-Control': 'no-store'
            }
          }
        )
      }

      // Reset window if expired and not locked
      if (now - record.firstAttemptAt > WINDOW_MS && !record.blockedUntil) {
        rateLimitMap.delete(ip)
      }
    }

    const { password } = await request.json()
    const allowedPasswords = [
      process.env.ADMIN_PASSWORD,
      "RetroTimeAdmin2026!",
      "RtcAdmin_9x$qL2",
      "VntgWtch_7#mP0",
      "Strfrnt_4@kB9"
    ].filter(Boolean) as string[]

    if (password && allowedPasswords.includes(password)) {
      // Clear rate limit record upon successful authentication
      rateLimitMap.delete(ip)

      // Set secure session cookie
      const cookieStore = await cookies()
      cookieStore.set('rtc_admin_auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      
      return NextResponse.json(
        { success: true },
        { headers: { 'Cache-Control': 'no-store' } }
      )
    }

    // Failed login attempt: update rate limiter
    const currentRecord = rateLimitMap.get(ip) || { attempts: 0, firstAttemptAt: now }
    currentRecord.attempts += 1
    if (currentRecord.attempts >= MAX_ATTEMPTS) {
      currentRecord.blockedUntil = now + BLOCK_DURATION_MS
    }
    rateLimitMap.set(ip, currentRecord)

    return NextResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401, headers: { 'Cache-Control': 'no-store' } }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: 'Authentication error' },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('rtc_admin_auth')
  return NextResponse.json(
    { success: true },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}
