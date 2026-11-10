import type { Metadata } from 'next'
import { Cormorant_Garamond, Jost } from 'next/font/google'
import './globals.css'
import './lavee.css'
import Link from 'next/link'
import { BUSINESS, COPY } from '@/lib/config'
import OpenStatus from '@/components/OpenStatus'

const body = Jost({ subsets: ['latin'], weight: ['300', '400', '500'] })
const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-display' })

export const metadata: Metadata = {
  title: `${BUSINESS.fullName} · Massage & spa in Hartbeespoort`,
  description: COPY.heroBody,
}

function Monogram() {
  return (
    <span className="monogram" aria-hidden="true">
      <span className="l">L</span>
      <span className="a">a</span>
      <span className="v">V</span>
    </span>
  )
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={display.variable}>
      <body className={`${body.className} min-h-screen`} style={{ backgroundColor: 'var(--th-bg)', color: 'var(--th-text)' }}>
        <div className="topbar">
          <div className="wrap">
            <OpenStatus />
            <span>
              <span className="hide-sm">Chameleon Village, Hartbeespoort · </span>
              <a href={`https://wa.me/${BUSINESS.whatsapp}`}>WhatsApp {BUSINESS.phone}</a>
            </span>
          </div>
        </div>
        <header className="site-nav">
          <div className="wrap">
            <Link href="/" className="brand" aria-label={`${BUSINESS.fullName}, home`}>
              <Monogram />
              <span className="brand-name">
                LaVee<small>Spa &amp; Beauty</small>
              </span>
            </Link>
            <nav className="nav-links">
              <Link href="/#treatments" className="hide-md">Treatments</Link>
              <Link href="/#specials" className="hide-md">Specials</Link>
              <Link href="/#groups" className="hide-md">Groups &amp; mobile</Link>
              <Link href="/#visit" className="hide-md">Visit</Link>
              <Link href="/book" className="btn btn-sm">Book now</Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            <div>
              <Link href="/" className="brand">
                <Monogram />
                <span className="brand-name">
                  LaVee<small>Spa &amp; Beauty</small>
                </span>
              </Link>
              <p style={{ marginTop: '1rem', maxWidth: '36ch' }}>Indulge in peace and tranquility. Beauty, cosmetic &amp; personal care in Hartbeespoort.</p>
            </div>
            <div>
              <h4>Explore</h4>
              <p>
                <Link href="/#treatments">Treatments</Link>
                <br />
                <Link href="/#specials">Specials</Link>
                <br />
                <Link href="/#groups">Groups &amp; mobile spa</Link>
                <br />
                <Link href="/#vouchers">Gift vouchers</Link>
                <br />
                <Link href="/book">Book online</Link>
              </p>
            </div>
            <div>
              <h4>Contact</h4>
              <p>
                <a href={`https://wa.me/${BUSINESS.whatsapp}`}>WhatsApp {BUSINESS.phone}</a>
                <br />
                <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                <br />
                Chameleon Village, Hartbeespoort
              </p>
            </div>
            <div className="footer-base">
              <span>
                © {new Date().getFullYear()} {BUSINESS.fullName}
              </span>
              <Link href="/admin">Staff login</Link>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
