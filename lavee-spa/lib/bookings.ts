import { ACTIVE_STATUSES, query, type Booking } from './db'
import { BUSINESS } from './config'
import { findService } from './services'
import { freeSlots, type Busy } from './slots'

// Each booking ties up `people` therapists (couples specials = 2).
export async function busyOn(date: string, excludeId?: string): Promise<Busy[]> {
  const rows = await query<{ time: string; minutes: number; serviceId: string }>(
    `SELECT time, minutes, serviceId FROM bookings WHERE date = ? AND status IN ${ACTIVE_STATUSES} AND id != ?`,
    [date, excludeId ?? '']
  )
  return rows.map((r) => ({ time: r.time, minutes: Number(r.minutes), people: findService(r.serviceId)?.people ?? 1 }))
}

export async function slotsFor(date: string, minutes: number, people = 1) {
  return freeSlots(date, minutes, await busyOn(date), people)
}

export function bookingsBetween(from: string, to: string) {
  return query<Booking>(`SELECT * FROM bookings WHERE date >= ? AND date <= ? ORDER BY date, time`, [from, to])
}

export function newRef() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  for (let i = 0; i < 5; i++) s += chars[Math.floor(Math.random() * chars.length)]
  return `${BUSINESS.refPrefix}-${s}`
}

export function finalPrice(base: number, discountRate: number | null) {
  return discountRate ? Math.round(base * (1 - discountRate)) : base
}

