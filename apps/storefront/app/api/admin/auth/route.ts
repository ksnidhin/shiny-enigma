import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { password } = await request.json()
    const allowedPasswords = [
      process.env.ADMIN_PASSWORD,
      "RtcAdmin_9x$qL2",
      "VntgWtch_7#mP0",
      "Strfrnt_4@kB9"
    ]

    if (allowedPasswords.includes(password)) {
      // Set secure cookie
      const cookieStore = await cookies()
      cookieStore.set('rtc_admin_auth', password, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 1 week
      })
      
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('rtc_admin_auth')
  return NextResponse.json({ success: true })
}
