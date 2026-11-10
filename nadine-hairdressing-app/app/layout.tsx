import type { Metadata } from 'next'
import { Cormorant_Garamond, Great_Vibes, Jost } from 'next/font/google'
import './globals.css'
import Link from 'next/link'
import { BUSINESS, COPY } from '@/lib/config'

const body = Jost({ subsets: ['latin'] })
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-display' })
const script = Great_Vibes({ subsets: ['latin'], weight: '400', variable: '--font-script' })

export const metadata: Metadata = {
  title: `${BUSINESS.fullName} · Brackenhurst, Alberton`,
  description: `${COPY.tagline} ${COPY.heroBody}`,
}

const navLink = 'hidden sm:inline px-3 py-1.5 text-th-text-muted hover:text-th-text underline-offset-4 hover:underline'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${script.variable}`}>
      <body className={`${body.className} min-h-screen`} style={{ backgroundColor: 'var(--th-bg)', color: 'var(--th-text)' }}>
        <header className="sticky top-0 z-30 border-b border-th-border bg-th-bg/90 backdrop-blur">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
            <Link href="/" className="flex items-baseline gap-2.5" aria-label={`${BUSINESS.fullName}, home`}>
              <span className="font-script text-4xl leading-none">{BUSINESS.name}</span>
              <span className="hidden sm:inline text-[11px] tracking-[0.3em] uppercase">Hairdressing</span>
            </Link>
            <nav className="flex items-center gap-1 text-sm" aria-label="Main">
              <Link href="/#menu" className={navLink}>Services</Link>
              <Link href="/#bridal" className={navLink}>Bridal</Link>
              <Link href="/#gallery" className={navLink}>Gallery</Link>
              <Link href="/#visit" className={navLink}>Visit</Link>
              <Link href="/book" className="ml-2 px-5 py-2.5 rounded-full font-medium text-sm" style={{ backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }}>
                Book now
              </Link>
            </nav>
          </div>
        </header>
        {children}
        <footer className="border-t border-th-border">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 text-xs text-th-text-muted flex flex-wrap gap-x-6 gap-y-2 justify-between items-center pb-24 sm:pb-8">
            <span className="font-script text-3xl text-th-text leading-none">{BUSINESS.name}</span>
            <span>
              {BUSINESS.phone} · {BUSINESS.address}
            </span>
            <span>
              © {new Date().getFullYear()} {BUSINESS.fullName} ·{' '}
              <Link href="/admin" className="hover:text-th-text">
                Staff login
              </Link>
            </span>
          </div>
        </footer>
      </body>
    </html>
  )
}
