'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Booking } from '@/lib/db'
import { extraEntries, priceLabel, rand } from '@/lib/services'
import { BUSINESS, DISCOUNT } from '@/lib/config'

type Props = { date: string; today: string; weekStart: string; week: Booking[]; pending: Booking[] }

const shift = (d: string, n: number) => {
  const x = new Date(`${d}T12:00:00Z`)
  x.setUTCDate(x.getUTCDate() + n)
  return x.toISOString().slice(0, 10)
}
const fmt = (d: string, o: Intl.DateTimeFormatOptions) => new Date(`${d}T12:00:00Z`).toLocaleDateString('en-ZA', { ...o, timeZone: 'UTC' })
const endTime = (t: string, mins: number) => {
  const [h, m] = t.split(':').map(Number)
  const e = h * 60 + m + mins
  return `${String(Math.floor(e / 60)).padStart(2, '0')}:${String(e % 60).padStart(2, '0')}`
}

const STATUS_STYLE: Record<Booking['status'], string> = {
  pending: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  confirmed: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  completed: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  cancelled: 'bg-red-500/15 text-red-300 border-red-500/30',
  'no-show': 'bg-red-500/15 text-red-300 border-red-500/30',
}

// Turn a local 0xx number into wa.me's 27xx format.
const waNumber = (p: string) => {
  const d = p.replace(/\D/g, '')
  return d.startsWith('0') ? `27${d.slice(1)}` : d
}

export default function AdminBoard({ date, today, weekStart, week, pending }: Props) {
  const router = useRouter()
  const [busy, setBusy] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const go = (d: string) => router.push(`/admin?date=${d}`)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).closest('input, textarea, select')) return
      if (e.metaKey || e.ctrlKey || e.altKey) return
      if (e.key === 'ArrowLeft' || e.key === 'j') go(shift(date, -1))
      else if (e.key === 'ArrowRight' || e.key === 'k') go(shift(date, 1))
      else if (e.key === 't') go(today)
      else if (e.key === 'w') go(shift(date, 7))
      else if (e.key === 'b') go(shift(date, -7))
      else if (e.key === 'Escape') setConfirmDelete(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  async function setStatus(id: string, status: Booking['status']) {
    setBusy(id)
    await fetch(`/api/admin/bookings/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) })
    setBusy(null)
    router.refresh()
  }

  async function remove(id: string) {
    setBusy(id)
    await fetch(`/api/admin/bookings/${id}`, { method: 'DELETE' })
    setBusy(null)
    setConfirmDelete(null)
    router.refresh()
  }

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const dayList = week.filter((b) => b.date === date)
  const live = (b: Booking) => b.status !== 'cancelled' && b.status !== 'no-show'
  const weekDays = Array.from({ length: 7 }, (_, i) => shift(weekStart, i))
  const weekTakings = week.filter((b) => b.status === 'completed').reduce((s, b) => s + b.price, 0)
  const weekBooked = week.filter(live).reduce((s, b) => s + b.price, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-th-accent font-semibold">Diary</p>
          <h1 className="font-display text-3xl font-semibold">{fmt(date, { weekday: 'long', day: 'numeric', month: 'long' })}</h1>
        </div>
        <div className="flex items-center gap-2">
          <NavBtn onClick={() => go(shift(date, -1))} k="←">Prev</NavBtn>
          <NavBtn onClick={() => go(today)} k="t">Today</NavBtn>
          <NavBtn onClick={() => go(shift(date, 1))} k="→">Next</NavBtn>
          <button onClick={logout} className="ml-2 px-3 py-1.5 rounded-th text-sm text-th-text-muted hover:text-th-text">
            Log out
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Bookings today" value={String(week.filter((b) => b.date === today && live(b)).length)} />
        <Stat label="Awaiting confirmation" value={String(pending.length)} tone={pending.length ? 'amber' : undefined} />
        <Stat label="Booked this week" value={rand(weekBooked)} />
        <Stat label="Taken this week" value={rand(weekTakings)} tone="emerald" />
      </div>

      {/* Week strip */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((d) => {
          const n = week.filter((b) => b.date === d && live(b)).length
          const on = d === date
          return (
            <button
              key={d}
              onClick={() => go(d)}
              className={`rounded-th border py-2 text-center ${on ? 'border-th-accent' : 'border-th-border bg-th-card hover:border-th-accent'}`}
              style={on ? { backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' } : undefined}
            >
              <div className="text-[11px] uppercase opacity-80">{fmt(d, { weekday: 'short' })}</div>
              <div className="font-semibold">{fmt(d, { day: 'numeric' })}</div>
              <div className="text-[11px] opacity-80">{n ? `${n} booked` : '—'}</div>
              {d === today && !on && <div className="mx-auto mt-1 size-1.5 rounded-full bg-th-accent" />}
            </button>
          )
        })}
      </div>
      <p className="text-xs text-th-text-muted -mt-3">
        <Kbd>b</Kbd> / <Kbd>w</Kbd> previous / next week
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Day list */}
        <section className="space-y-3">
          {dayList.length === 0 && (
            <div className="rounded-th border border-dashed border-th-border p-10 text-center text-th-text-muted">No bookings this day.</div>
          )}
          {dayList.map((b) => (
            <article key={b.id} className={`rounded-th bg-th-card border border-th-border p-4 sm:p-5 ${live(b) ? '' : 'opacity-60'}`}>
              <div className="flex flex-wrap items-start gap-4">
                <div className="w-20 shrink-0">
                  <div className="text-xl font-semibold">{b.time}</div>
                  <div className="text-xs text-th-text-muted">to {endTime(b.time, b.minutes)}</div>
                </div>
                <div className="flex-1 min-w-[12rem]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-lg">{b.name}</span>
                    <span className={`rounded-th border px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLE[b.status]}`}>{b.status}</span>
                    {b.discounted && DISCOUNT ? <span className="rounded-th border border-th-border px-2.5 py-0.5 text-xs">{DISCOUNT.label}</span> : null}
                  </div>
                  <div className="text-sm mt-1">
                    {b.serviceName} · <span className="text-th-accent font-semibold">{priceLabel({ price: b.price, from: b.priceFrom })}</span>
                  </div>
                  <div className="text-sm text-th-text-muted mt-1">
                    {' '}
                    <a href={`tel:${b.phone}`} className="hover:text-th-text underline-offset-2 hover:underline">
                      {b.phone}
                    </a>
                    {b.email ? ` · ${b.email}` : ''}
                  </div>
                  {extraEntries(b.extra).length > 0 && (
                    <dl className="text-sm mt-2 rounded-th bg-th-card-alt px-3 py-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
                      {extraEntries(b.extra).map(([k, v]) => (
                        <div key={k} className="contents">
                          <dt className="text-th-text-muted">{k}</dt>
                          <dd className="whitespace-pre-line">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                  {b.notes && <p className="text-sm mt-2 rounded-th bg-th-card-alt px-3 py-2">{b.notes}</p>}
                  <div className="text-[11px] text-th-text-muted mt-2 font-mono">{b.ref}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {b.status === 'pending' && (
                  <Action tone="emerald" disabled={busy === b.id} onClick={() => setStatus(b.id, 'confirmed')}>
                    Confirm
                  </Action>
                )}
                {(b.status === 'pending' || b.status === 'confirmed') && (
                  <Action tone="slate" disabled={busy === b.id} onClick={() => setStatus(b.id, 'completed')}>
                    Mark done
                  </Action>
                )}
                <a
                  href={`https://wa.me/${waNumber(b.phone)}?text=${encodeURIComponent(
                    `Hi ${b.name}, ${BUSINESS.name} here. Confirming your ${b.serviceName.toLowerCase()} on ${fmt(b.date, { weekday: 'long', day: 'numeric', month: 'long' })} at ${b.time} (${priceLabel({ price: b.price, from: b.priceFrom })}). See you then!`
                  )}`}
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-th text-sm border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10"
                >
                  WhatsApp
                </a>
                {live(b) && b.status !== 'completed' && (
                  <>
                    <Action tone="amber" disabled={busy === b.id} onClick={() => setStatus(b.id, 'no-show')}>
                      No-show
                    </Action>
                    <Action tone="red" disabled={busy === b.id} onClick={() => setStatus(b.id, 'cancelled')}>
                      Cancel
                    </Action>
                  </>
                )}
                {!live(b) && (
                  <Action tone="slate" disabled={busy === b.id} onClick={() => setStatus(b.id, 'pending')}>
                    Restore
                  </Action>
                )}
                <div className="ml-auto">
                  {confirmDelete === b.id ? (
                    <span className="flex items-center gap-2 text-sm">
                      Delete for good?
                      <Action tone="red" disabled={busy === b.id} onClick={() => remove(b.id)}>
                        Yes, delete
                      </Action>
                      <button onClick={() => setConfirmDelete(null)} className="text-th-text-muted text-sm">
                        Keep <Kbd>Esc</Kbd>
                      </button>
                    </span>
                  ) : (
                    <button onClick={() => setConfirmDelete(b.id)} className="px-3 py-1.5 rounded-th text-sm text-th-text-muted hover:text-red-300">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* Pending queue */}
        <aside className="rounded-th bg-th-card border border-th-border p-4 h-fit">
          <h2 className="font-semibold flex items-center gap-2">
            Needs confirming
            <span className="rounded-th border px-2 py-0.5 text-xs bg-amber-500/15 text-amber-300 border-amber-500/30">{pending.length}</span>
          </h2>
          <ul className="mt-3 space-y-2">
            {pending.length === 0 && <li className="text-sm text-th-text-muted">All caught up.</li>}
            {pending.map((b) => (
              <li key={b.id}>
                <button onClick={() => go(b.date)} className="w-full text-left rounded-th bg-th-card-alt px-3 py-2 hover:ring-1 ring-th-accent">
                  <div className="text-sm font-semibold">
                    {b.name} <span className="font-normal text-th-text-muted">· {b.serviceName}</span>
                  </div>
                  <div className="text-xs text-th-text-muted">
                    {fmt(b.date, { weekday: 'short', day: 'numeric', month: 'short' })} · {b.time}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  )
}

function Kbd({ children }: { children: React.ReactNode }) {
  return <kbd className="rounded-th border border-th-border px-1.5 py-0.5 text-[10px] text-th-text-muted font-sans">{children}</kbd>
}

function NavBtn({ onClick, k, children }: { onClick: () => void; k: string; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-3 py-1.5 rounded-th border border-th-border bg-th-card text-sm hover:border-th-accent">
      {children} <Kbd>{k}</Kbd>
    </button>
  )
}

function Stat({ label, value, tone }: { label: string; value: string; tone?: 'amber' | 'emerald' }) {
  const color = tone === 'amber' ? 'text-amber-300' : tone === 'emerald' ? 'text-emerald-300' : ''
  return (
    <div className="rounded-th bg-th-card border border-th-border p-4">
      <div className="text-xs text-th-text-muted">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${color}`}>{value}</div>
    </div>
  )
}

const TONES = {
  emerald: 'border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/10',
  amber: 'border-amber-500/30 text-amber-300 hover:bg-amber-500/10',
  red: 'border-red-500/30 text-red-300 hover:bg-red-500/10',
  slate: 'border-slate-500/30 text-slate-300 hover:bg-slate-500/10',
}

function Action({ tone, onClick, disabled, children }: { tone: keyof typeof TONES; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled} className={`px-3.5 py-1.5 rounded-th text-sm border disabled:opacity-40 ${TONES[tone]}`}>
      {children}
    </button>
  )
}
