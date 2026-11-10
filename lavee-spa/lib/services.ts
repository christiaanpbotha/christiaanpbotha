import { EXTRA_FIELDS } from './config'

// Services from LaVee's posters (Nov 2026). Only the R899 couples specials have known prices.
// TODO(client): prices for single treatments (price: 0 shows "Price on request") and all durations are PLACEHOLDERS.
export type Category = { id: string; label: string; blurb: string }
export type Service = {
  id: string
  category: string
  name: string
  description: string
  price: number // 0 = price on request
  from?: boolean
  minutes: number
  photo?: string
  people?: number // therapists the booking ties up at once (couples = 2). Default 1.
  per?: string // shown after the price, e.g. "for 2"
}

export const CATEGORIES: Category[] = [
  { id: 'specials', label: 'Specials for two', blurb: 'Side-by-side pampering at one easy price.' },
  { id: 'massage', label: 'Massage', blurb: 'Slow, soothing, deeply relaxing.' },
  { id: 'body', label: 'Body & face', blurb: 'Exfoliate, nourish and glow.' },
]

export const SERVICES: Service[] = [
  { id: 'pre-festive', category: 'specials', name: 'Pre-Festive Season Vibe', description: '50-minute full-body massage plus 10 minutes of head massage, foot massage or hot stones.', price: 899, per: 'for 2', minutes: 60, people: 2, photo: '/images/svc-hotstones.jpg' },
  { id: 'spring-affairs', category: 'specials', name: 'Spring Affairs for 2', description: '50-minute full-body massage, 10-minute head massage and a welcome drink.', price: 899, per: 'for 2', minutes: 60, people: 2, photo: '/images/svc-head.jpg' },
  { id: 'full-body', category: 'massage', name: 'Full body massage', description: 'A slow, soothing full-body massage to release tension from head to toe.', price: 0, minutes: 60, photo: '/images/svc-scrub.jpg' },
  { id: 'hot-stones', category: 'massage', name: 'Hot stone massage', description: 'Warm basalt stones melt deep into tired muscles.', price: 0, minutes: 60, photo: '/images/svc-hotstones.jpg' },
  { id: 'head', category: 'massage', name: 'Head massage', description: 'Gentle scalp, neck and temple work that quiets a busy mind.', price: 0, minutes: 30, photo: '/images/svc-head.jpg' },
  { id: 'foot', category: 'massage', name: 'Foot massage', description: 'Reflexology-inspired relief for feet that carry you all day.', price: 0, minutes: 30, photo: '/images/svc-foot.jpg' },
  { id: 'scrub', category: 'body', name: 'Body scrub', description: 'Exfoliate and polish for soft, glowing skin.', price: 0, minutes: 45, photo: '/images/svc-scrub.jpg' },
  { id: 'facial', category: 'body', name: 'Facial', description: 'Cleanse, nourish and refresh with a calming facial.', price: 0, minutes: 60, photo: '/images/svc-facial.jpg' },
]

export const findService = (id: string) => SERVICES.find((s) => s.id === id)

export const rand = (n: number) => `R${n.toLocaleString('en-ZA', { maximumFractionDigits: 0 })}`

export const priceLabel = (s: { price: number; from?: boolean | number }) => (s.price === 0 ? 'Price on request' : `${s.from ? 'from ' : ''}${rand(s.price)}`)

// Booking's extra answers as [label, value] pairs, in EXTRA_FIELDS order.
export function extraEntries(json: string): [string, string][] {
  let data: Record<string, unknown> = {}
  try {
    data = JSON.parse(json || '{}')
  } catch {}
  return EXTRA_FIELDS.filter((f) => f.type !== 'confirm' && data[f.id] && data[f.id] !== 'None').map((f) => [f.label.replace(' *', ''), String(data[f.id])])
}
