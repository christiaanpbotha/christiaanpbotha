'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BUSINESS } from '@/lib/config'

// Floating pill for phones. Hidden while the hero buttons are on screen, so it never covers the first view.
export default function MobileBar() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById('hero-ctas')
    if (!target || !('IntersectionObserver' in window)) return setShow(true)
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting))
    io.observe(target)
    return () => io.disconnect()
  }, [])

  const item = 'flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-xs uppercase tracking-[0.12em]'
  const icon = { width: 16, height: 16, fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const
  return (
    <nav
      aria-label="Quick actions"
      className={`sm:hidden fixed z-40 left-3.5 right-3.5 flex items-center gap-1.5 p-1.5 rounded-full shadow-xl transition duration-300 ${show ? 'translate-y-0 opacity-100' : 'translate-y-[150%] opacity-0 pointer-events-none'}`}
      style={{ bottom: 'calc(14px + env(safe-area-inset-bottom, 0px))', backgroundColor: 'rgba(28,26,27,.93)', color: '#faf8f6' }}
    >
      <a href={`tel:+${BUSINESS.whatsapp}`} className={item}>
        <svg viewBox="0 0 24 24" {...icon}><path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2" /></svg>Call
      </a>
      <a href={`https://wa.me/${BUSINESS.whatsapp}`} className={item}>
        <svg viewBox="0 0 24 24" {...icon}><path d="M3 21l1.6-4.8A8.5 8.5 0 1 1 8 19.6z" /></svg>WhatsApp
      </a>
      <Link href="/book" className={`${item} font-medium`} style={{ flex: 1.3, backgroundColor: 'var(--th-blush)', color: 'var(--th-text)' }}>
        <svg viewBox="0 0 24 24" {...icon}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>Book
      </Link>
    </nav>
  )
}
