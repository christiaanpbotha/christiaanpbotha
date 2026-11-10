import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuid } from 'uuid'
import { execute } from '@/lib/db'
import { finalPrice, newRef, slotsFor } from '@/lib/bookings'
import { DISCOUNT, EXTRA_FIELDS } from '@/lib/config'
import { findService } from '@/lib/services'
import { isBookableDate } from '@/lib/slots'

const clean = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const service = findService(clean(b.serviceId))
  const date = clean(b.date)
  const time = clean(b.time)
  const name = clean(b.name)
  const phone = clean(b.phone, 30)

  if (!service) return NextResponse.json({ error: 'Please choose a service.' }, { status: 400 })
  if (!name || !phone) return NextResponse.json({ error: 'Name and phone are required.' }, { status: 400 })
  if (!isBookableDate(date)) return NextResponse.json({ error: 'That date isn’t available.' }, { status: 400 })

  // Only keep answers to known questions; enforce required ones.
  const raw = (b.extra ?? {}) as Record<string, unknown>
  const extra: Record<string, string | boolean> = {}
  for (const f of EXTRA_FIELDS) {
    const v = f.type === 'confirm' ? raw[f.id] === true : clean(raw[f.id], 2000)
    if (f.required && !v) return NextResponse.json({ error: `Please complete: ${f.label.replace(' *', '')}` }, { status: 400 })
    if (f.type === 'select' && v && !f.options.includes(v as string)) continue
    if (v) extra[f.id] = v
  }

  // Re-check availability server-side — someone may have grabbed the slot meanwhile.
  const free = await slotsFor(date, service.minutes)
  if (!free.includes(time)) return NextResponse.json({ error: 'Sorry, that time was just taken. Please pick another.' }, { status: 409 })

  const discounted = !!DISCOUNT && b.discount === true
  const ref = newRef()
  await execute(
    `INSERT INTO bookings (id, ref, date, time, minutes, serviceId, serviceName, price, priceFrom, discounted, name, phone, email, notes, extra)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      uuid(),
      ref,
      date,
      time,
      service.minutes,
      service.id,
      service.name,
      finalPrice(service.price, discounted ? DISCOUNT!.rate : null),
      service.from ? 1 : 0,
      discounted ? 1 : 0,
      name,
      phone,
      clean(b.email) || null,
      clean(b.notes, 1000) || null,
      JSON.stringify(extra),
    ]
  )
  return NextResponse.json({ ref })
}
