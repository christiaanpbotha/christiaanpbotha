import { BOOKING_WINDOW_DAYS, BUSINESS, CAPACITY, HOURS, MIN_NOTICE_MINUTES, SLOT_MINUTES } from './config'

export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}
export const toTime = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`

// "Now" in the parlour's timezone, as YYYY-MM-DD + minutes since midnight.
export function nowLocal() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: BUSINESS.timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  return { date: `${get('year')}-${get('month')}-${get('day')}`, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

export const weekday = (date: string) => new Date(`${date}T12:00:00Z`).getUTCDay()

export function isBookableDate(date: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false
  const today = nowLocal().date
  return date >= today && date <= addDays(today, BOOKING_WINDOW_DAYS) && HOURS[weekday(date)] !== null
}

export type Busy = { time: string; minutes: number }

// Start times on `date` where a job of `minutes` fits around existing bookings.
export function freeSlots(date: string, minutes: number, busy: Busy[]): string[] {
  const hours = HOURS[weekday(date)]
  if (!hours) return []
  const open = toMin(hours.open)
  const close = toMin(hours.close)
  // Minimum notice, measured in minutes from the start of `date`.
  const now = nowLocal()
  const daysAhead = Math.round((Date.parse(`${date}T00:00:00Z`) - Date.parse(`${now.date}T00:00:00Z`)) / 86400000)
  const earliest = now.minutes + MIN_NOTICE_MINUTES - daysAhead * 1440

  const out: string[] = []
  for (let start = open; start + minutes <= close; start += SLOT_MINUTES) {
    if (start < earliest) continue
    const end = start + minutes
    let peak = 0
    for (let t = start; t < end; t += SLOT_MINUTES) {
      const overlapping = busy.filter((b) => {
        const s = toMin(b.time)
        return t >= s && t < s + b.minutes
      }).length
      peak = Math.max(peak, overlapping)
    }
    if (peak < CAPACITY) out.push(toTime(start))
  }
  return out
}

export function prettyDate(date: string, opts: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' }) {
  return new Date(`${date}T12:00:00Z`).toLocaleDateString('en-ZA', { ...opts, timeZone: 'UTC' })
}
