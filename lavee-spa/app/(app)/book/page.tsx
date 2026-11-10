import { COPY, MIN_NOTICE_MINUTES } from '@/lib/config'
import { addDays, isBookableDate, nowLocal } from '@/lib/slots'
import BookingForm from '@/components/BookingForm'

export const dynamic = 'force-dynamic'

export default async function BookPage({ searchParams }: { searchParams: Promise<{ service?: string }> }) {
  const { service } = await searchParams
  const first = addDays(nowLocal().date, Math.floor(MIN_NOTICE_MINUTES / 1440))
  const days: string[] = []
  for (let i = 0; days.length < 21 && i < 90; i++) {
    const d = addDays(first, i)
    if (isBookableDate(d)) days.push(d)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="font-display text-3xl sm:text-4xl font-semibold">{COPY.cta}</h1>
      <p className="text-th-text-muted mt-1 text-sm">{COPY.bookIntro}</p>
      <BookingForm days={days} initialService={service} />
    </div>
  )
}
