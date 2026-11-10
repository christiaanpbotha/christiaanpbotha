// Fills the diary with demo bookings via the running app's own API.
// Usage: npm run dev (in another terminal), then npm run seed  ·  BASE_URL=https://… npm run seed for prod
// Edit DEMO below per client — serviceIds must exist in lib/services.ts, extra keys in EXTRA_FIELDS.
const BASE = process.env.BASE_URL ?? 'http://localhost:3095'

const DEMO = [
  ['Thandi Mokoena', '082 555 0141', 'pre-festive', { addon: 'Hot stones', pressure: 'Medium' }],
  ['Annelie van Wyk', '083 555 0172', 'full-body', { pressure: 'Firm' }],
  ['Lerato Dlamini', '071 555 0190', 'facial', {}],
  ['Megan Botha', '072 555 0123', 'spring-affairs', { pressure: 'Light' }],
  ['Sipho Nkosi', '076 555 0168', 'hot-stones', { pressure: 'Firm', health: 'Lower back injury, gentle on the left side' }],
  ['Carla Steyn', '084 555 0110', 'foot', {}],
  ['Nadia Pillay', '082 555 0155', 'scrub', { addon: 'Head massage' }],
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
