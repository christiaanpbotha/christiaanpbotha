// Fills the diary with demo bookings via the running app's own API.
// Usage: npm run dev (in another terminal), then npm run seed  ·  BASE_URL=https://… npm run seed for prod
// Edit DEMO below per client — serviceIds must exist in lib/services.ts, extra keys in EXTRA_FIELDS.
const BASE = process.env.BASE_URL ?? 'http://localhost:3110'

const DEMO = [
  ['Liezl Coetzee', '082 555 0301', 'balayage', { visit: 'Yes, I’m a regular', length: 'Long' }],
  ['Tumi Mahlangu', '083 555 0302', 'ladies-cut', { visit: 'First visit', length: 'Shoulder length' }],
  ['Elna Viljoen', '072 555 0303', 'highlights', { visit: 'Yes, I’m a regular', length: 'Shoulder length' }],
  ['Bianca Roux', '084 555 0304', 'gel-nails', { visit: 'First visit', length: 'Not applicable' }],
  ['Hennie van der Merwe', '061 555 0305', 'gents-cut', { visit: 'Yes, I’m a regular', length: 'Short' }],
  ['Zinhle Mthembu', '079 555 0306', 'blow-wave', { visit: 'Yes, I’m a regular', length: 'Long' }],
  ['Annelize Botha', '082 555 0307', 'colour', { visit: 'Yes, I’m a regular', length: 'Shoulder length' }],
  ['Karabo Sithole', '083 555 0308', 'manicure', { visit: 'First visit', length: 'Not applicable' }],
  ['Michelle Naidoo', '076 555 0309', 'brow-tint', { visit: 'Yes, I’m a regular', length: 'Not applicable' }],
]

let made = 0
for (let i = 0, p = 0; i < 14 && made < 24; i++) {
  const d = new Date()
  d.setDate(d.getDate() + i)
  const date = d.toISOString().slice(0, 10)
  for (let n = 0; n < 3; n++) {
    const [name, phone, serviceId, extra] = DEMO[p++ % DEMO.length]
    const { slots = [] } = await (await fetch(`${BASE}/api/slots?date=${date}&service=${serviceId}`)).json()
    if (!slots.length) continue
    const time = slots[Math.floor((n / 3) * slots.length)]
    const res = await fetch(`${BASE}/api/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, time, serviceId, name, phone, extra }),
    })
    if (res.ok) made++
  }
}

console.log(`Seeded ${made} demo bookings.`)
