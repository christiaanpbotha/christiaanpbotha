import { ACTIVE_STATUSES, query, type Booking } from './db'
import { BUSINESS } from './config'
import { freeSlots, type Busy } from './slots'

export async function busyOn(date: string, excludeId?: string): Promise<Busy[]> {
  return query<Busy>(
    `SELECT time, minutes FROM bookings WHERE date = ? AND status IN ${ACTIVE_STATUSES} AND id != ?`,
    [date, excludeId ?? '']
  )
}

export async function slotsFor(date: string, minutes: number) {
  return freeSlots(date, minutes, await busyOn(date))
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

