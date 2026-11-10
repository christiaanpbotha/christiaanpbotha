'use client'

import { useState } from 'react'
import { BUSINESS } from '@/lib/config'

const WANTS = ['Hair', 'Make-up', 'Nails', 'Trial']
const input = 'w-full px-3.5 py-2.5 rounded-th border border-th-border text-sm outline-none focus:border-th-accent'

// Composes a WhatsApp message to Nadine. No backend: weddings need a conversation, not a slot.
export default function BridalEnquiry() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState('')
  const [party, setParty] = useState('Just me')
  const [wants, setWants] = useState<string[]>(['Hair', 'Trial'])
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)

  const toggle = (w: string) => setWants((cur) => (cur.includes(w) ? cur.filter((x) => x !== w) : [...cur, w]))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim() || !date) return setError('Please add your name, cellphone and wedding date.')
    setError('')
    const text = [
      'Hi Nadine, I’d like to enquire about bridal services.',
      '',
      `Name: ${name.trim()}`,
      `Cell: ${phone.trim()}`,
      `Wedding date: ${date}`,
      `People: ${party}`,
      `Interested in: ${wants.join(', ') || 'Not sure yet'}`,
      notes.trim() ? `Notes: ${notes.trim()}` : false,
    ]
      .filter((l) => l !== false)
      .join('\n')
    window.open(`https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
  }

  return (
    <form onSubmit={submit} className="bg-th-card border border-th-border rounded-th p-5 sm:p-7 space-y-4" noValidate>
      <h3 className="font-display text-2xl">Bridal enquiry</h3>
      <div className="grid sm:grid-cols-2 gap-4">
        <label className="block">
          <span className="block text-xs text-th-text-muted mb-1">Your name</span>
          <input className={input} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label className="block">
          <span className="block text-xs text-th-text-muted mb-1">Cellphone</span>
          <input className={input} value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel" />
        </label>
        <label className="block">
          <span className="block text-xs text-th-text-muted mb-1">Wedding date</span>
          <input className={input} value={date} onChange={(e) => setDate(e.target.value)} type="date" />
        </label>
        <label className="block">
          <span className="block text-xs text-th-text-muted mb-1">People needing hair / make-up</span>
          <select className={input} value={party} onChange={(e) => setParty(e.target.value)}>
            {['Just me', '2–3', '4–6', '7 or more'].map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="text-xs text-th-text-muted mb-2">I’m interested in</legend>
        <div className="flex flex-wrap gap-2">
          {WANTS.map((w) => (
            <button
              key={w}
              type="button"
              aria-pressed={wants.includes(w)}
              onClick={() => toggle(w)}
              className="px-4 py-2 rounded-full border text-sm"
              style={wants.includes(w) ? { backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)', borderColor: 'var(--th-accent)' } : { borderColor: 'var(--th-border)' }}
            >
              {w}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="block text-xs text-th-text-muted mb-1">Anything else? Venue, style ideas</span>
        <textarea className={`${input} min-h-20`} value={notes} onChange={(e) => setNotes(e.target.value)} />
      </label>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="px-6 py-3 rounded-full font-medium text-sm" style={{ backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }}>
          Send enquiry on WhatsApp
        </button>
        <p role="status" className={`text-sm ${error ? 'text-th-danger' : 'text-th-text-muted'}`}>
          {error || (sent ? `WhatsApp should open with your message ready to send. If it doesn’t, message ${BUSINESS.phone}.` : '')}
        </p>
      </div>
    </form>
  )
}
