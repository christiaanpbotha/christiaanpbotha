import { NextRequest, NextResponse } from 'next/server'
import { slotsFor } from '@/lib/bookings'
import { findService } from '@/lib/services'
import { isBookableDate } from '@/lib/slots'

export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  const date = p.get('date') ?? ''
  const service = findService(p.get('service') ?? '')
  if (!service) return NextResponse.json({ error: 'Unknown service' }, { status: 400 })
  if (!isBookableDate(date)) return NextResponse.json({ slots: [] })
  return NextResponse.json({ slots: await slotsFor(date, service.minutes) })
}
