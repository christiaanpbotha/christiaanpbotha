'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CATEGORIES, SERVICES, findService, priceLabel, rand } from '@/lib/services'
import { DISCOUNT, EXTRA_FIELDS } from '@/lib/config'

type Props = { days: string[]; initialService?: string }

const fmtDay = (d: string) => {
  const dt = new Date(`${d}T12:00:00Z`)
  return {
    wd: dt.toLocaleDateString('en-ZA', { weekday: 'short', timeZone: 'UTC' }),
    day: dt.getUTCDate(),
    mon: dt.toLocaleDateString('en-ZA', { month: 'short', timeZone: 'UTC' }),
  }
}

const duration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}m` : ''}`)

export default function BookingForm({ days, initialService }: Props) {
  const router = useRouter()
  const [serviceId, setServiceId] = useState<string | null>(findService(initialService ?? '') ? initialService! : null)
  const [date, setDate] = useState<string | null>(null)
  const [time, setTime] = useState<string | null>(null)
  const [slots, setSlots] = useState<string[] | null>(null)
  const [form, setForm] = useState({ name: '', phone: '', email: '', notes: '' })
  const [extra, setExtra] = useState<Record<string, string | boolean>>({})
  const [discount, setDiscount] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const service = serviceId ? findService(serviceId) : undefined
  const price = service ? (discount && DISCOUNT ? Math.round(service.price * (1 - DISCOUNT.rate)) : service.price) : null

  const loadSlots = (d: string, id: string) =>
    fetch(`/api/slots?date=${d}&service=${id}`)
      .then((r) => r.json())
      .then((j) => j.slots ?? [])

  // Fetch free times whenever the day or job length changes.
  useEffect(() => {
    if (!date || !serviceId) return
    let live = true
    setSlots(null)
    loadSlots(date, serviceId).then((s: string[]) => {
      if (!live) return
      setSlots(s)
      setTime((t) => (t && s.includes(t) ? t : null))
    })
    return () => {
      live = false
    }
  }, [date, serviceId])

  const groupedSlots = useMemo(() => {
    const am = (slots ?? []).filter((s) => s < '12:00')
    const pm = (slots ?? []).filter((s) => s >= '12:00')
    return [
      { label: 'Morning', items: am },
      { label: 'Afternoon', items: pm },
    ].filter((g) => g.items.length)
  }, [slots])

  const extrasDone = EXTRA_FIELDS.every((f) => !f.required || !!extra[f.id])
  const ready = service && date && time && form.name.trim() && form.phone.trim() && extrasDone

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!ready) return
    setSubmitting(true)
    setError('')
    const res = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ serviceId, date, time, discount, extra, ...form }),
    })
    const j = await res.json()
    if (res.ok) return router.push(`/booking/${j.ref}`)
    setError(j.error ?? 'Something went wrong.')
    setSubmitting(false)
    if (res.status === 409 && date && serviceId) {
      setTime(null)
      loadSlots(date, serviceId).then(setSlots)
    }
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  const input = 'w-full px-3 py-2.5 rounded-th text-sm outline-none border border-th-border focus:border-th-accent'
  const selectedStyle = { backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }

  return (
    <form onSubmit={submit} className="mt-8 space-y-8 pb-28">
      {/* 1. Service */}
      <Step n={1} title="What are you booking?">
        <div className="space-y-5">
          {CATEGORIES.map((c) => (
            <div key={c.id}>
              <p className="text-xs uppercase tracking-widest text-th-text-muted mb-2">{c.label}</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {SERVICES.filter((s) => s.category === c.id).map((s) => {
                  const on = serviceId === s.id
                  return (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={`text-left rounded-th border p-4 transition-colors ${on ? 'border-th-accent bg-th-card-alt' : 'border-th-border bg-th-card hover:border-th-accent'}`}
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="font-semibold">{s.name}</span>
                        <span className="font-semibold text-th-accent whitespace-nowrap">{priceLabel(s)}</span>
                      </div>
                      <p className="text-xs text-th-text-muted mt-1.5">{s.description}</p>
                      <p className="text-xs text-th-text-muted mt-2">{duration(s.minutes)}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Step>

      {/* 2. When */}
      {service && (
        <Step n={2} title="When suits you?">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {days.map((d) => {
              const f = fmtDay(d)
              const on = date === d
              return (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDate(d)}
                  className={`shrink-0 w-16 rounded-th border py-2.5 text-center transition-colors ${on ? 'border-th-accent' : 'border-th-border bg-th-card hover:border-th-accent'}`}
                  style={on ? selectedStyle : undefined}
                >
                  <div className="text-[11px] uppercase tracking-wide opacity-80">{f.wd}</div>
                  <div className="text-lg font-semibold leading-tight">{f.day}</div>
                  <div className="text-[11px] opacity-80">{f.mon}</div>
                </button>
              )
            })}
          </div>

          {date && (
            <div className="mt-4">
              {slots === null ? (
                <p className="text-sm text-th-text-muted">Checking the diary…</p>
              ) : slots.length === 0 ? (
                <p className="text-sm rounded-th bg-th-card border border-th-border px-4 py-3">Nothing free that day. Try another date.</p>
              ) : (
                groupedSlots.map((g) => (
                  <div key={g.label} className="mb-3">
                    <p className="text-xs uppercase tracking-wide text-th-text-muted mb-2">{g.label}</p>
                    <div className="flex flex-wrap gap-2">
                      {g.items.map((s) => (
                        <button
                          type="button"
                          key={s}
                          onClick={() => setTime(s)}
                          className={`px-4 py-2 rounded-th text-sm border transition-colors ${time === s ? 'border-th-accent' : 'border-th-border bg-th-card hover:border-th-accent'}`}
                          style={time === s ? selectedStyle : undefined}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </Step>
      )}

      {/* 3. Details */}
      {service && date && time && (
        <Step n={3} title="Your details">
          <div className="grid sm:grid-cols-2 gap-3">
            <Field label="Your name *">
              <input className={input} value={form.name} onChange={set('name')} autoComplete="name" required />
            </Field>
            <Field label="Cell number *">
              <input className={input} value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" placeholder="082 123 4567" required />
            </Field>
            <Field label="Email (optional)">
              <input className={input} value={form.email} onChange={set('email')} type="email" autoComplete="email" />
            </Field>
            {DISCOUNT && (
              <label className="flex items-center gap-3 rounded-th border border-th-border bg-th-card px-3 py-2.5 sm:mt-5 cursor-pointer">
                <input type="checkbox" checked={discount} onChange={(e) => setDiscount(e.target.checked)} className="size-4 accent-[var(--th-accent)]" />
                <span className="text-sm">
                  {DISCOUNT.label} <span className="text-th-text-muted">({Math.round(DISCOUNT.rate * 100)}% off)</span>
                </span>
              </label>
            )}

            {EXTRA_FIELDS.map((f) => {
              const wrap = f.wide ? 'sm:col-span-2' : ''
              if (f.type === 'confirm')
                return (
                  <label key={f.id} className={`flex items-center gap-3 rounded-th border border-th-border bg-th-card px-3 py-2.5 cursor-pointer ${wrap}`}>
                    <input
                      type="checkbox"
                      checked={extra[f.id] === true}
                      onChange={(e) => setExtra((x) => ({ ...x, [f.id]: e.target.checked }))}
                      className="size-4 accent-[var(--th-accent)]"
                    />
                    <span className="text-sm">{f.label}</span>
                  </label>
                )
              const value = (extra[f.id] as string) ?? ''
              const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setExtra((x) => ({ ...x, [f.id]: e.target.value }))
              return (
                <div key={f.id} className={wrap}>
                  <Field label={f.label}>
                    {f.type === 'select' ? (
                      <select className={input} value={value} onChange={onChange}>
                        <option value="">Choose…</option>
                        {f.options.map((o) => (
                          <option key={o}>{o}</option>
                        ))}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea className={input} rows={3} value={value} onChange={onChange} placeholder={f.placeholder} />
                    ) : (
                      <input className={input} value={value} onChange={onChange} placeholder={f.placeholder} />
                    )}
                  </Field>
                </div>
              )
            })}

            <div className="sm:col-span-2">
              <Field label="Anything else we should know?">
                <textarea className={input} rows={2} value={form.notes} onChange={set('notes')} />
              </Field>
            </div>
          </div>
        </Step>
      )}

      {error && <p className="text-sm rounded-th border border-red-500/40 bg-red-500/10 text-red-300 px-4 py-3">{error}</p>}

      {/* Sticky summary */}
      <div className="fixed bottom-0 inset-x-0 border-t border-th-border bg-th-card z-40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-3 flex items-center gap-4">
          <div className="flex-1 min-w-0 text-sm">
            {service ? (
              <>
                <div className="font-semibold truncate">{service.name}</div>
                <div className="text-th-text-muted truncate">
                  {date ? `${fmtDay(date).wd} ${fmtDay(date).day} ${fmtDay(date).mon}` : 'Pick a day'}
                  {time ? ` · ${time}` : ''}
                </div>
              </>
            ) : (
              <span className="text-th-text-muted">Choose a service to get started</span>
            )}
          </div>
          {service && price !== null && (
            <div className="text-right">
              {discount && DISCOUNT && service.price > 0 && <div className="text-xs line-through text-th-text-muted">{rand(service.price)}</div>}
              <div className="font-semibold text-lg text-th-accent whitespace-nowrap">{priceLabel({ price, from: service.from })}</div>
            </div>
          )}
          <button type="submit" disabled={!ready || submitting} className="px-5 py-2.5 rounded-th font-semibold disabled:opacity-40" style={selectedStyle}>
            {submitting ? 'Booking…' : 'Confirm'}
          </button>
        </div>
      </div>

    </form>
  )
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-th-border pt-5">
      <h2 className="flex items-baseline gap-3 mb-4">
        <span className="font-display text-th-accent text-lg tabular-nums">{n}.</span>
        <span className="font-display text-xl sm:text-2xl">{title}</span>
      </h2>
      {children}
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs text-th-text-muted mb-1">{label}</span>
      {children}
    </label>
  )
}
