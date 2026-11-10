// Everything client-specific lives here + lib/services.ts. Components read from these.
// From LaVee's WhatsApp Business profile + posters (Nov 2026): name, number, email, website, address, hours, specials.
export const BUSINESS = {
  name: 'LaVee',
  fullName: 'LaVee Spa & Beauty',
  owner: '',
  refPrefix: 'LV',
  phone: '078 797 2238',
  whatsapp: '27787972238', // international format, no +, used for wa.me links
  email: 'laveespa6@gmail.com',
  address: 'Shop H, Chameleon Village, R501 Rustenburg Road, Hartbeespoort',
  mapsQuery: 'Chameleon Village, R501 Rustenburg Road, Hartbeespoort',
  instagram: '', // handle without @; leave blank to hide
  facebook: '',
  timezone: 'Africa/Johannesburg',
}

export const COPY = {
  kicker: 'Hartbeespoort day spa',
  heroTitle: ['Experience your', 'peace', '& tranquility.'],
  heroBody: 'Soothing massages, facials and body treatments in a calm, freshly-laundered space, or brought to your door with our mobile spa.',
  cta: 'Book a treatment',
  menuTitle: 'Treatments & add-ons',
  menuNote: 'Every treatment can be paired with an add-on: hot stones, a body scrub, foot or head massage, or a facial. Just mention it when you book.',
  bookIntro: 'Choose a treatment and a time that suits you. We confirm every booking on WhatsApp.',
  bookedTitle: 'Booking received',
  bookedBody: 'We’ll confirm on WhatsApp shortly. Keep your reference in case you need to change anything.',
  // TODO(client): confirm these with LaVee.
  policies: [
    'Arrive 10 minutes early so you can settle in and enjoy your welcome.',
    'Let us know about injuries, pregnancy, allergies or skin sensitivities when you book.',
    'Give at least 24 hours’ notice to move or cancel your appointment.',
    'Groups of 5 or more and mobile spa bookings are quoted on WhatsApp.',
  ],
}

// Optional discount the customer can tick (e.g. pensioners). null = hidden.
export const DISCOUNT: { label: string; rate: number } | null = null

// Opening hours per weekday (0 = Sunday). null = closed. From their WhatsApp Business profile.
export const HOURS: Record<number, { open: string; close: string } | null> = {
  0: { open: '09:00', close: '16:00' },
  1: { open: '09:00', close: '17:00' },
  2: { open: '09:00', close: '17:00' },
  3: { open: '09:00', close: '17:00' },
  4: { open: '09:00', close: '17:00' },
  5: { open: '09:00', close: '17:00' },
  6: { open: '09:00', close: '17:00' },
}

export const SLOT_MINUTES = 30
export const CAPACITY = 2 // therapists / beds working at once. TODO(client): confirm.
export const MIN_NOTICE_MINUTES = 2 * 60
export const BOOKING_WINDOW_DAYS = 60

// Extra questions asked in the booking form; answers are stored as JSON on the booking.
export type ExtraField =
  | { id: string; label: string; type: 'text' | 'textarea'; placeholder?: string; required?: boolean; wide?: boolean }
  | { id: string; label: string; type: 'select'; options: string[]; required?: boolean; wide?: boolean }
  | { id: string; label: string; type: 'confirm'; required?: boolean; wide?: boolean }

export const EXTRA_FIELDS: ExtraField[] = [
  { id: 'addon', label: 'Add-on (10 min with specials)', type: 'select', options: ['None', 'Head massage', 'Foot massage', 'Hot stones', 'Body scrub', 'Facial'] },
  { id: 'pressure', label: 'Massage pressure', type: 'select', options: ['Light', 'Medium', 'Firm'] },
  { id: 'health', label: 'Injuries, pregnancy, allergies or sensitivities', type: 'textarea', wide: true, placeholder: 'Anything your therapist should know…' },
]
