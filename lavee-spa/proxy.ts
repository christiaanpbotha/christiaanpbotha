import { NextRequest, NextResponse } from 'next/server'

let _token: string | null = null

async function makeToken(): Promise<string> {
  if (_token) return _token
  const enc = new TextEncoder()
  const secret = process.env.AUTH_SECRET || 'dev-secret'
  const password = process.env.AUTH_PASSWORD || 'changeme'
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(password))
  _token = Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return _token
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Public site + booking flow are open; only the parlour's admin area is gated.
  const isAdmin = pathname.startsWith('/admin') || pathname.startsWith('/api/admin')
  if (!isAdmin) return NextResponse.next()

  const token = req.cookies.get('auth-token')?.value
  const expected = await makeToken()
  if (!token || token !== expected) {
    if (pathname.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
