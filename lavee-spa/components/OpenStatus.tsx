'use client'

import { useEffect, useState } from 'react'
import { BUSINESS, HOURS } from '@/lib/config'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))

// "Open now" / "Closed · opens …", worked out in the spa's timezone on the visitor's device.
function status() {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: BUSINESS.timezone, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date())
  const get = (t: string) => parts.find((p) => p.type === t)!.value
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
  const mins = Number(get('hour')) * 60 + Number(get('minute'))
  const today = HOURS[day]
  if (today && mins >= toMin(today.open) && mins < toMin(today.close)) return { open: true, text: `Open now · until ${today.close}` }
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7
    const h = HOURS[d]
    if (!h || (i === 0 && mins >= toMin(h.open))) continue
    return { open: false, text: `Closed · opens ${i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]} at ${h.open}` }
  }
  return { open: false, text: 'Closed' }
}

export default function OpenStatus() {
  const [s, setS] = useState<{ open: boolean; text: string } | null>(null)
  useEffect(() => setS(status()), [])
  return (
    <span>
      <span className={`dot ${s && !s.open ? 'closed' : ''}`} />
      {s ? s.text : 'Open 7 days a week'}
    </span>
  )
}
