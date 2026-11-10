import { bookingsBetween } from '@/lib/bookings'
import { query, type Booking } from '@/lib/db'
import { addDays, nowLocal, weekday } from '@/lib/slots'
import AdminBoard from '@/components/AdminBoard'

export const dynamic = 'force-dynamic'

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ date?: string }> }) {
  const sp = await searchParams
  const today = nowLocal().date
  const date = sp.date && /^\d{4}-\d{2}-\d{2}$/.test(sp.date) ? sp.date : today

  // Monday-start week containing `date`
  const weekStart = addDays(date, -((weekday(date) + 6) % 7))
  const week = await bookingsBetween(weekStart, addDays(weekStart, 6))
  const pending = await query<Booking>(`SELECT * FROM bookings WHERE status = 'pending' AND date >= ? ORDER BY date, time`, [today])

  return <AdminBoard date={date} today={today} weekStart={weekStart} week={week} pending={pending} />
}
