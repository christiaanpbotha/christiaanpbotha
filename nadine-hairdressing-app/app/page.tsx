import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS, COPY, HOURS } from '@/lib/config'
import { CATEGORIES, SERVICES, priceLabel } from '@/lib/services'
import BridalEnquiry from '@/components/BridalEnquiry'
import MobileBar from '@/components/MobileBar'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const duration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}` : ''}`)
const btn = 'inline-flex items-center justify-center px-6 py-3 rounded-full font-medium text-sm'
const solid = { backgroundColor: 'var(--th-accent)', color: 'var(--th-accent-fg)' }
const wrap = 'max-w-6xl mx-auto px-4 sm:px-6'
const band = 'py-14 sm:py-20'

const WORK = [
  { src: '/images/copper.jpg', w: 720, h: 1090, alt: 'Copper red colour with blonde highlights in loose curls', cap: 'Copper with highlights' },
  { src: '/images/bridal.jpg', w: 720, h: 713, alt: 'Bridal half-up curls with a floral hair vine', cap: 'Bridal half-up' },
  { src: '/images/colour-match.jpg', w: 720, h: 900, alt: 'Long layered caramel balayage', cap: 'Colour matching' },
  { src: '/images/gents-cut.jpg', w: 720, h: 713, alt: 'Before and after of a gents’ undercut with a platinum top', cap: 'Gents’ cut, before & after' },
  { src: '/images/brunette-waves.jpg', w: 720, h: 954, alt: 'Glossy brunette bob with soft waves', cap: 'Brunette waves' },
  { src: '/images/highlights.jpg', w: 720, h: 1010, alt: 'Shoulder-length dark hair with chunky blonde highlights', cap: 'Highlights & lowlights' },
  { src: '/images/blonde-curls.jpg', w: 720, h: 954, alt: 'Long blonde hair in big soft curls', cap: 'Blonde curls' },
]

export default function Home() {
  return (
    <main>
      {/* Hero */}
      <section className={`${wrap} grid md:grid-cols-[1.1fr_1fr] gap-10 md:gap-16 items-center pt-8 pb-14 sm:pt-12 sm:pb-20`}>
        <div>
          <p className="text-xs tracking-[0.2em] uppercase text-th-rose">{COPY.kicker}</p>
          <h1 className="mt-7">
            <span className="block font-script text-[5.25rem] sm:text-[9rem] leading-[0.85]">{BUSINESS.name}</span>
            <span className="block text-sm sm:text-base tracking-[0.42em] uppercase pl-2 mt-1">Hairdressing</span>
          </h1>
          <p className="font-display text-2xl sm:text-3xl leading-snug mt-6 max-w-sm">{COPY.tagline}</p>
          <p className="text-th-text-muted mt-4 max-w-md leading-relaxed">{COPY.heroBody}</p>
          <div id="hero-ctas" className="flex flex-wrap gap-3 mt-7">
            <Link href="/book" className={btn} style={solid}>
              {COPY.cta}
            </Link>
            <a href="#menu" className={`${btn} border border-th-accent`}>
              See services
            </a>
          </div>
          <p className="mt-6 text-sm text-th-text-muted">Tue–Fri 08:00–17:00 · Sat 08:00–16:00 · Parking on site</p>
        </div>
        <figure className="relative mx-auto md:ml-auto w-full max-w-[340px] md:max-w-[440px] pl-11 pb-11 sm:pl-14 sm:pb-14">
          <div aria-hidden className="absolute top-[-14px] right-[-14px] left-[44px] sm:left-[56px] bottom-[44px] sm:bottom-[56px] border border-[#c8a28c]" style={{ borderRadius: '220px 220px 10px 10px' }} />
          <Image
            src="/images/hero-colour.jpg"
            alt="A caramel balayage being finished on a client, wash basins in the background"
            width={568}
            height={710}
            priority
            className="relative w-full h-auto object-cover shadow-2xl"
            style={{ borderRadius: '220px 220px 6px 6px', filter: 'brightness(1.04) contrast(1.06) saturate(1.06)' }}
          />
          <Image
            src="/images/wash-area.jpg"
            alt="The salon’s two backwash basins against black and rose-gold panels"
            width={720}
            height={954}
            className="absolute left-0 bottom-0 w-[42%] aspect-square object-cover rounded-full border-[6px] shadow-xl"
            style={{ borderColor: 'var(--th-bg)', objectPosition: '50% 40%' }}
          />
        </figure>
      </section>

      {/* Menu */}
      <section id="menu" className={`scroll-mt-20 ${band} border-t border-th-border`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-4xl sm:text-5xl">{COPY.menuTitle}</h2>
            <p className="text-sm text-th-text-muted">Tap a service to book it.</p>
          </div>
          {COPY.menuNote && <p className="text-sm text-th-text-muted mt-2 max-w-2xl">{COPY.menuNote}</p>}
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-12 mt-10">
            {CATEGORIES.map((c) => (
              <div key={c.id}>
                <h3 className="font-display italic text-2xl">{c.label}</h3>
                <p className="text-sm text-th-text-muted mt-1">{c.blurb}</p>
                <ul className="mt-5">
                  {SERVICES.filter((s) => s.category === c.id).map((s) => (
                    <li key={s.id} className="border-t border-th-border first:border-t-0">
                      <Link href={`/book?service=${s.id}`} className="group block py-3.5">
                        <span className="flex items-baseline gap-3">
                          <span className="font-medium group-hover:text-th-rose">{s.name}</span>
                          <span className="flex-1 border-b border-dotted border-th-border -translate-y-1" />
                          <span className="tabular-nums whitespace-nowrap">{priceLabel(s)}</span>
                        </span>
                        <span className="block text-sm text-th-text-muted mt-1 pr-16">
                          {s.description} <span className="whitespace-nowrap">· {duration(s.minutes)}</span>
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal */}
      <section id="bridal" className={`scroll-mt-20 ${band}`} style={{ backgroundColor: 'var(--th-card-alt)' }}>
        <div className={`${wrap} grid md:grid-cols-[0.9fr_1.1fr] gap-10 md:gap-16 items-start`}>
          <Image src="/images/bridal.jpg" alt="Bridal half-up style with long platinum curls and a floral hair vine" width={720} height={713} className="w-full h-auto object-cover max-w-md mx-auto md:max-w-none" style={{ borderRadius: '200px 200px 10px 10px' }} />
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-th-rose">Bridal &amp; occasion</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-2">Your wedding morning, sorted</h2>
            <p className="text-th-text-muted mt-4 max-w-lg leading-relaxed">Hair, make-up and nails for the bride and the whole bridal party, planned with you from the trial to the big day.</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2 mt-6 mb-8 text-[15px]">
              {['Trial run before the day', 'Bridal hair and make-up', 'Gel nails for the party', 'Bridesmaids and moms'].map((i) => (
                <li key={i} className="flex gap-2.5">
                  <span aria-hidden className="text-th-rose">♡</span>
                  {i}
                </li>
              ))}
            </ul>
            <BridalEnquiry />
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className={`scroll-mt-20 ${band}`}>
        <div className={wrap}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-4xl sm:text-5xl">Recent work</h2>
            <a href={`https://instagram.com/${BUSINESS.instagram}`} className="text-sm underline underline-offset-4 decoration-th-border">
              More on Instagram @{BUSINESS.instagram}
            </a>
          </div>
          <div className="columns-2 md:columns-3 gap-3 sm:gap-4 mt-10 [&>figure]:mb-3 sm:[&>figure]:mb-4">
            {WORK.map((p) => (
              <figure key={p.src} className="relative break-inside-avoid overflow-hidden rounded-th">
                <Image src={p.src} alt={p.alt} width={p.w} height={p.h} className="w-full h-auto" />
                <figcaption className="absolute inset-x-0 bottom-0 px-3.5 pt-8 pb-2.5 text-[13px] text-white" style={{ background: 'linear-gradient(transparent, rgba(28,26,27,.7))' }}>
                  {p.cap}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Salon + policies */}
      <section className={`${band} border-t border-th-border bg-th-card`}>
        <div className={`${wrap} grid md:grid-cols-2 gap-10 md:gap-16 items-center`}>
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-th-rose">The salon</p>
            <h2 className="font-display text-4xl sm:text-5xl mt-2">Clean, calm and a little bit pretty</h2>
            <p className="text-th-text-muted mt-4 max-w-md leading-relaxed">Clients keep mentioning how clean the salon is and how friendly it feels. Many have been with Nadine for years.</p>
            <h3 className="font-display italic text-2xl mt-8">Before you come in</h3>
            <ol className="space-y-3 list-decimal pl-5 mt-3 marker:text-th-text-muted text-[15px]">
              {COPY.policies.map((p) => (
                <li key={p} className="pl-2 leading-relaxed">
                  {p}
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs tracking-[0.14em] uppercase text-th-text-muted">We use L’Oréal Professionnel, Osmo and Hannon</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <Image src="/images/wash-area.jpg" alt="Two backwash basins in front of black and rose-gold checkerboard panels" width={720} height={954} className="w-full h-auto rounded-th" />
            <Image src="/images/rose-wall.jpg" alt="A station with a mirror framed in pink and cream roses" width={720} height={954} className="w-full h-auto rounded-th mt-8" />
          </div>
        </div>
      </section>

      {/* Visit */}
      <section id="visit" className={`scroll-mt-20 ${band} border-t border-th-border`}>
        <div className={`${wrap} grid md:grid-cols-[1fr_2fr] gap-6 md:gap-16`}>
          <h2 className="font-display text-4xl sm:text-5xl">Visit us</h2>
          <div className="grid sm:grid-cols-2 gap-10">
            <div>
              <h3 className="text-sm text-th-text-muted mb-3">Hours</h3>
              <ul className="space-y-1.5 text-[15px]">
                {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                  <li key={d} className={`flex justify-between ${HOURS[d] ? '' : 'text-th-text-muted'}`}>
                    <span>{DAYS[d]}</span>
                    <span className="tabular-nums">{HOURS[d] ? `${HOURS[d]!.open}–${HOURS[d]!.close}` : 'Closed'}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-[15px] space-y-4">
              <div>
                <h3 className="text-sm text-th-text-muted mb-1">Address</h3>
                <p>{BUSINESS.address}</p>
                <p className="text-th-text-muted text-sm mt-1">Come through the gate. Parking inside.</p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${BUSINESS.fullName} ${BUSINESS.address}`)}`}
                  className="inline-block mt-2 underline underline-offset-4 decoration-th-border"
                >
                  Directions
                </a>
              </div>
              <div>
                <h3 className="text-sm text-th-text-muted mb-1">Cell &amp; WhatsApp</h3>
                <a href={`tel:+${BUSINESS.whatsapp}`} className="underline underline-offset-4 decoration-th-border">
                  {BUSINESS.phone}
                </a>
                <h3 className="text-sm text-th-text-muted mb-1 mt-4">Salon landline</h3>
                <a href={`tel:+27${BUSINESS.landline.replace(/\s/g, '').slice(1)}`} className="underline underline-offset-4 decoration-th-border">
                  {BUSINESS.landline}
                </a>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                <a href={`https://instagram.com/${BUSINESS.instagram}`} className="underline underline-offset-4 decoration-th-border">
                  Instagram
                </a>
                <a href={`https://facebook.com/${BUSINESS.facebook}`} className="underline underline-offset-4 decoration-th-border">
                  Facebook
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MobileBar />
    </main>
  )
}
