import { EXTRA_FIELDS } from './config'

// Menu follows Nadine's Google Business "Services" list. Bridal is handled by the enquiry form on the home page, not slot booking.
// TODO(client): ALL prices and durations are PLACEHOLDERS — replace with her price list. price: 0 shows "Price on request".
export type Category = { id: string; label: string; blurb: string }
export type Service = { id: string; category: string; name: string; description: string; price: number; from?: boolean; minutes: number }

export const CATEGORIES: Category[] = [
  { id: 'cuts', label: 'Cuts & styling', blurb: 'Ladies, gents and children.' },
  { id: 'colour', label: 'Colour', blurb: 'From fresh roots to a full change.' },
  { id: 'treatments', label: 'Treatments', blurb: 'Smoother, healthier, longer. Consultation first.' },
  { id: 'nails', label: 'Nails', blurb: 'Hands and feet.' },
  { id: 'beauty', label: 'Beauty', blurb: 'Brows, waxing and make-up.' },
]

export const SERVICES: Service[] = [
  { id: 'ladies-cut', category: 'cuts', name: 'Ladies’ cut & blow-dry', description: 'Wash, cut and blow-dry.', price: 280, from: true, minutes: 60 },
  { id: 'gents-cut', category: 'cuts', name: 'Gents’ cut', description: 'Cut, tidy and finish.', price: 150, minutes: 30 },
  { id: 'kids-cut', category: 'cuts', name: 'Children’s cut', description: 'For under-12s.', price: 120, minutes: 30 },
  { id: 'curly', category: 'cuts', name: 'Curly hair cut & style', description: 'Cut and shaped for curls, finished with definition.', price: 380, from: true, minutes: 75 },
  { id: 'blow-wave', category: 'cuts', name: 'Hairstyling & blow-wave', description: 'Wash and a smooth, curled or straight finish.', price: 200, from: true, minutes: 45 },
  { id: 'updo', category: 'cuts', name: 'Updo', description: 'For matric dances, weddings and events.', price: 450, from: true, minutes: 60 },

  { id: 'colour', category: 'colour', name: 'Full colour / roots', description: 'Single-process colour or root touch-up.', price: 650, from: true, minutes: 120 },
  { id: 'highlights', category: 'colour', name: 'Highlights & foils', description: 'Partial or full foils, toned and finished.', price: 850, from: true, minutes: 150 },
  { id: 'balayage', category: 'colour', name: 'Balayage', description: 'Hand-painted, soft-blended colour.', price: 1400, from: true, minutes: 180 },
  { id: 'colour-match', category: 'colour', name: 'Colour matching', description: 'Bring a photo. We work out the formula and the price with you first.', price: 0, minutes: 150 },
  { id: 'toner', category: 'colour', name: 'Toner & gloss', description: 'Refresh tone and shine between colours.', price: 250, minutes: 45 },

  { id: 'brazilian', category: 'treatments', name: 'Brazilian blow wave', description: 'Smooth, frizz-free hair for weeks. Quote after a consultation.', price: 0, minutes: 150 },
  { id: 'botox', category: 'treatments', name: 'Hair Botox', description: 'Deep repair for dry, damaged hair. Quote after a consultation.', price: 0, minutes: 120 },
  { id: 'extensions', category: 'treatments', name: 'Hair extensions', description: 'Length and volume, fitted to your hair. Quote after a consultation.', price: 0, minutes: 180 },
  { id: 'perm', category: 'treatments', name: 'Perm', description: 'Lasting curl or wave.', price: 650, from: true, minutes: 150 },

  { id: 'gel-nails', category: 'nails', name: 'Gel nails', description: 'Chip-free gel colour on natural nails.', price: 280, minutes: 60 },
  { id: 'acrylic', category: 'nails', name: 'Acrylic nails', description: 'Full set of extensions, shaped and finished.', price: 400, from: true, minutes: 90 },
  { id: 'manicure', category: 'nails', name: 'Manicure', description: 'Shape, cuticle care and polish.', price: 160, minutes: 45 },
  { id: 'pedicure', category: 'nails', name: 'Pedicure', description: 'Soak, nail and cuticle care, heel buff and polish.', price: 220, minutes: 60 },

  { id: 'brow-tint', category: 'beauty', name: 'Eyebrow tint', description: 'Tint to define and fill.', price: 90, minutes: 20 },
  { id: 'facial-wax', category: 'beauty', name: 'Facial waxing', description: 'Brows, lip or chin.', price: 80, from: true, minutes: 20 },
  { id: 'body-wax', category: 'beauty', name: 'Body waxing', description: 'Legs, underarms and more.', price: 200, from: true, minutes: 45 },
  { id: 'makeup', category: 'beauty', name: 'Make-up application', description: 'For events and photos. Bridal make-up: use the bridal enquiry.', price: 450, minutes: 60 },
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
  return EXTRA_FIELDS.filter((f) => f.type !== 'confirm' && data[f.id]).map((f) => [f.label.replace(' *', ''), String(data[f.id])])
}
