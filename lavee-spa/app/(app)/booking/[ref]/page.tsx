import Link from 'next/link'
import { notFound } from 'next/navigation'
import { queryOne, type Booking } from '@/lib/db'
import { BUSINESS, COPY, DISCOUNT } from '@/lib/config'
import { extraEntries, priceLabel } from '@/lib/services'
import { prettyDate } from '@/lib/slots'

export const dynamic = 'force-dynamic'

export default async function BookingConfirmed({ params }: { params: Promise<{ ref: string }> }) {
  const { ref } = await params
  const b = await queryOne<Booking>(`SELECT * FROM bookings WHERE ref = ?`, [ref])
  if (!b) notFound()

  const msg = encodeURIComponent(`Hi ${BUSINESS.name}, this is ${b.name}. I’m checking on booking ${b.ref} (${b.serviceName}) on ${prettyDate(b.date)} at ${b.time}.`)

  return (
    <div className="max-w-lg mx-auto text-center">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold mt-4">{COPY.bookedTitle}</h1>
      <p className="text-th-text-muted mt-2">{COPY.bookedBody}</p>

      <div className="mt-8 rounded-th bg-th-card border border-th-border p-6 text-left space-y-3 text-sm">
        <Row k="Reference" v={<span className="font-mono font-semibold text-th-accent">{b.ref}</span>} />
        <Row k="Booking" v={b.serviceName} />
        <Row k="When" v={`${prettyDate(b.date)} · ${b.time}`} />
        <Row k="Price" v={`${priceLabel({ price: b.price, from: b.priceFrom })}${b.discounted && DISCOUNT ? ` (${DISCOUNT.label.toLowerCase()})` : ''}`} />
        {extraEntries(b.extra).map(([k, v]) => (
          <Row key={k} k={k} v={v} />
        ))}
        <Row
          k="Status"
          v={
            <span className="rounded-th px-2.5 py-0.5 text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              {b.status === 'pending' ? 'Awaiting confirmation' : b.status}
            </span>
          }
        />
      </div>

      <div className="flex flex-wrap justify-center gap-3 mt-6">
        <a href={`https://wa.me/${BUSINESS.whatsapp}?text=${msg}`} className="px-5 py-2.5 rounded-th font-semibold" style={{ backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }}>
          Message us on WhatsApp
        </a>
        <Link href="/" className="px-5 py-2.5 rounded-th border border-th-border hover:border-th-accent">
          Back home
        </Link>
      </div>
      <p className="text-xs text-th-text-muted mt-6">Need to change or cancel? Call {BUSINESS.phone} and quote your reference.</p>
    </div>
  )
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-th-text-muted shrink-0">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  )
}
