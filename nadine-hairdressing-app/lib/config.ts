// Everything client-specific lives here + lib/services.ts. Components read from these.
// Contact, address and hours are from Nadine's own sign and Google/Facebook listings (Nov 2026).
export const BUSINESS = {
  name: 'Nadine',
  fullName: 'Nadine Hairdressing',
  refPrefix: 'NH',
  phone: '084 656 2918',
  landline: '011 867 7001',
  whatsapp: '27846562918', // international format, no +, used for wa.me links
  email: 'Email to be confirmed',
  address: '85 Hennie Alberts Street, Brackenhurst, Alberton',
  instagram: 'nadine.hairdressing', // handle without @; leave blank to hide
  facebook: 'nadinehairdressing85',
  timezone: 'Africa/Johannesburg',
}

export const COPY = {
  kicker: 'Brackenhurst · Alberton',
  tagline: 'Hair, nails and beauty, all under one roof.',
  heroBody: 'Colour, cuts and blow waves, bridal hair and make-up, gel nails, brows and waxing. A clean, friendly salon where clients keep coming back.',
  cta: 'Book a visit',
  menuTitle: 'Services',
  menuNote: 'Treatments marked “price on request” start with a short consultation so the quote fits your hair.',
  bookIntro: 'Choose your service and a time that suits you. Nadine confirms on WhatsApp.',
  bookedTitle: 'You’re booked in',
  bookedBody: 'Nadine will confirm on WhatsApp shortly. Keep your reference in case you need to change anything.',
  policies: [
    'Please arrive 5 minutes early so we can start on time.',
    'Colour, extensions, Brazilian blow waves and Hair Botox start with a consultation. Send a photo of the look you want.',
    'Give at least 24 hours’ notice to move or cancel your appointment.',
    'Running late? WhatsApp us and we’ll do our best to fit you in.',
  ],
}

// Optional discount the customer can tick (e.g. pensioners). null = hidden.
export const DISCOUNT: { label: string; rate: number } | null = null

// Opening hours per weekday (0 = Sunday). null = closed. From her sign.
export const HOURS: Record<number, { open: string; close: string } | null> = {
  0: null,
  1: null,
  2: { open: '08:00', close: '17:00' },
  3: { open: '08:00', close: '17:00' },
  4: { open: '08:00', close: '17:00' },
  5: { open: '08:00', close: '17:00' },
  6: { open: '08:00', close: '16:00' },
}

export const SLOT_MINUTES = 15
export const CAPACITY = 2 // clients being served at once (2 basins + nail station) — TODO(client): confirm staff
export const MIN_NOTICE_MINUTES = 12 * 60 // TODO(client)
export const BOOKING_WINDOW_DAYS = 60

// Extra questions asked in the booking form; answers are stored as JSON on the booking.
export type ExtraField =
  | { id: string; label: string; type: 'text' | 'textarea'; placeholder?: string; required?: boolean; wide?: boolean }
  | { id: string; label: string; type: 'select'; options: string[]; required?: boolean; wide?: boolean }
  | { id: string; label: string; type: 'confirm'; required?: boolean; wide?: boolean }

export const EXTRA_FIELDS: ExtraField[] = [
  { id: 'visit', label: 'Been to Nadine before?', type: 'select', options: ['Yes, I’m a regular', 'First visit'] },
  { id: 'length', label: 'Hair length', type: 'select', options: ['Not applicable', 'Short', 'Shoulder length', 'Long', 'Very long'] },
]
