import Image from 'next/image'
import Link from 'next/link'
import { BUSINESS, COPY, HOURS } from '@/lib/config'
import { CATEGORIES, SERVICES, priceLabel } from '@/lib/services'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const duration = (m: number) => (m < 60 ? `${m} min` : `${Math.floor(m / 60)}h${m % 60 ? ` ${m % 60}` : ''}`)
const wa = (text?: string) => `https://wa.me/${BUSINESS.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

// Featured special in the hero: first service in the specials category.
const FEATURED = SERVICES.find((s) => s.category === 'specials')

const GROUPS = ['Families', 'Sisterhood', 'Birthdays', 'Baby showers', 'Bridal showers', 'Team building', 'Social clubs', 'Year-end functions']

function Sprig({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
      <path d="M20 190 C70 140 110 100 180 20" />
      <path d="M60 150c-20-6-34-22-36-40 20 2 34 18 36 40z" />
      <path d="M60 150c6-20 22-32 40-32-4 20-20 32-40 32z" />
      <path d="M95 112c-20-6-33-22-35-40 20 2 33 18 35 40z" />
      <path d="M95 112c6-20 22-32 40-32-4 20-20 32-40 32z" />
      <path d="M128 75c-18-8-28-24-28-42 18 4 29 21 28 42z" />
      <path d="M128 75c8-18 25-28 42-27-6 19-23 28-42 27z" />
      <path d="M160 40c-6-12-6-24 0-34 7 10 7 22 0 34z" />
    </svg>
  )
}

function WaIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3-.2.3-.9.9-.9 2.2s.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
    </svg>
  )
}

export default function Home() {
  return (
    <div className="home">
      {/* Hero */}
      <div className="hero">
        <Sprig className="hero-leaf one" />
        <Sprig className="hero-leaf two" />
        <div className="wrap">
          <div>
            <span className="eyebrow">{COPY.kicker}</span>
            <h1>
              {COPY.heroTitle[0]} <em>{COPY.heroTitle[1]}</em> {COPY.heroTitle[2]}
            </h1>
            <p className="lead">{COPY.heroBody}</p>
            <div className="actions">
              <Link href="/book" className="btn">{COPY.cta}</Link>
              <a href="#treatments" className="btn btn-ghost">View the menu</a>
            </div>
            <div className="hours-chip">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
              Mon–Sat 09:00–17:00 · Sun 09:00–16:00
            </div>
          </div>
          {FEATURED && (
            <div className="feature-card">
              <div className="towels" aria-hidden="true"><span /><span /><span /></div>
              <span className="tag">Current special</span>
              <h3 style={{ marginTop: '.6rem' }}>{FEATURED.name}</h3>
              <div className="price">
                {priceLabel(FEATURED)} {FEATURED.per && <small>{FEATURED.per}</small>}
              </div>
              <ul>
                <li>50-minute full-body massage</li>
                <li>Plus 10 minutes: head, foot or hot stones</li>
                <li>Side by side, for you and someone special</li>
              </ul>
              <Link href={`/book?service=${FEATURED.id}`} className="btn btn-oak" style={{ width: '100%' }}>Book this special</Link>
            </div>
          )}
        </div>
      </div>
      <div className="wood" aria-hidden="true" />

      {/* Ethos */}
      <section className="white">
        <div className="wrap ethos">
          <div>
            <span className="eyebrow">Welcome to LaVee</span>
            <blockquote>“We believe in creating moments of pure relaxation and rejuvenation, from soothing massages to a mobile experience.”</blockquote>
          </div>
          <div>
            <p className="lead">Step out of the Hartbeespoort heat into crisp white linen, warm towels and quiet. Whether it’s an hour to yourself, a treat for two, or a pamper day for the whole group, we’ve got everything you need to unwind and feel fabulous.</p>
            <div className="pillars">
              <div className="pillar"><strong>Calm space</strong><span>Clean, quiet treatment rooms</span></div>
              <div className="pillar"><strong>Couples</strong><span>Side-by-side specials</span></div>
              <div className="pillar"><strong>Mobile</strong><span>We come to you</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Treatments */}
      <section id="treatments">
        <div className="wrap">
          <div className="section-head center" style={{ marginBottom: '1rem' }}>
            <span className="eyebrow">The menu</span>
            <h2>{COPY.menuTitle}</h2>
            <p className="lead">{COPY.menuNote}</p>
          </div>
          {CATEGORIES.map((c) => (
            <div key={c.id}>
              <p className="cat-label">{c.label}</p>
              <div className="treatments">
                {SERVICES.filter((s) => s.category === c.id).map((s) => (
                  <Link key={s.id} href={`/book?service=${s.id}`} className="treat">
                    {s.photo && (
                      <div className="ph"><Image src={s.photo} alt="" fill sizes="116px" style={{ objectFit: 'cover' }} /></div>
                    )}
                    <div className="meta">{duration(s.minutes)}</div>
                    <h3>{s.name}</h3>
                    <p>{s.description}</p>
                    <div className="foot">
                      <span className={`cost ${s.price === 0 ? 'enq' : ''}`}>
                        {priceLabel(s)} {s.per && <small style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{s.per}</small>}
                      </span>
                      <span className="book">Book</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Specials */}
      <section id="specials" className="white">
        <div className="wrap">
          <div className="section-head center">
            <span className="eyebrow">For two</span>
            <h2>Seasonal specials</h2>
            <p className="lead">Our couples packages: a full hour of side-by-side pampering at one easy price.</p>
          </div>
          <div className="specials">
            <article className="special">
              <Image src="/images/poster-pre-festive.jpg" alt="Pre-Festive Season Vibe poster: 50-minute full-body massage plus 10 minutes head massage, foot massage or hot stones, R899 for 2" width={720} height={1016} sizes="(max-width: 640px) 100vw, 560px" />
              <div className="body"><div><h3>Pre-Festive Season Vibe</h3><span>60 min · R899 for 2</span></div><Link href="/book?service=pre-festive" className="btn btn-sm">Book</Link></div>
            </article>
            <article className="special">
              <Image src="/images/poster-spring-affairs.jpg" alt="Spring Affairs for 2 poster: 50-minute full body massage, 10-minute head massage and welcome drink, R899" width={720} height={1016} sizes="(max-width: 640px) 100vw, 560px" />
              <div className="body"><div><h3>Spring Affairs for 2</h3><span>60 min · R899 for 2 · welcome drink</span></div><Link href="/book?service=spring-affairs" className="btn btn-sm">Book</Link></div>
            </article>
          </div>
        </div>
      </section>

      {/* Groups */}
      <section id="groups" className="sand">
        <div className="wrap split">
          <div className="media">
            <Image src="/images/mobile-spa-group.jpg" alt="Five therapists giving massages to a group on a covered patio in Hartbeespoort" width={720} height={538} sizes="(max-width: 980px) 100vw, 560px" />
            <Image className="inset" src="/images/poster-add-ons.jpg" alt="Add-ons: hot stones, body scrub, foot massage, head massage, facials" width={720} height={574} sizes="260px" />
          </div>
          <div>
            <span className="eyebrow">Celebrate together</span>
            <h2>Group discounts &amp; mobile spa</h2>
            <div className="chip-row"><span className="chip">Groups of 5+ · discounted</span><span className="chip sage">Mobile for 6+ · around Harties</span></div>
            <p>Gather your people for a pamper session at the spa, or let us set up at your home, guest house or venue. Any spa package of your choice, for groups of more than six around Hartbeespoort.</p>
            <ul className="ticks">{GROUPS.map((g) => <li key={g}>{g}</li>)}</ul>
            <div style={{ display: 'flex', gap: '.8rem', flexWrap: 'wrap' }}>
              <a href={wa('Hi LaVee, I’d like a quote for a group booking. Number of people: … Date: …')} className="btn" target="_blank" rel="noopener">Get a group quote</a>
              <a href={wa('Hi LaVee, I’d like to book the mobile spa. Number of people: … Date: … Venue: …')} className="btn btn-ghost" target="_blank" rel="noopener">Book the mobile spa</a>
            </div>
          </div>
        </div>
      </section>

      {/* Vouchers */}
      <section id="vouchers" className="white">
        <div className="wrap voucher">
          <div><Image src="/images/gift-voucher.jpg" alt="LaVee Spa Gift Voucher for massage and spa pampering" width={720} height={508} sizes="(max-width: 980px) 100vw, 600px" /></div>
          <div>
            <span className="eyebrow">The perfect gift</span>
            <h2>Spa gift vouchers</h2>
            <p className="lead">Give the gift of an hour’s peace. Vouchers are available for any treatment or special and make a lovely birthday, anniversary or festive-season surprise.</p>
            <a className="btn btn-wa" href={wa('Hi LaVee, I’d like to buy a gift voucher.')} target="_blank" rel="noopener"><WaIcon /> Order a voucher on WhatsApp</a>
          </div>
        </div>
      </section>

      {COPY.policies.length > 0 && (
        <section>
          <div className="wrap policies">
            <h2>Before your visit</h2>
            <ol>{COPY.policies.map((p) => <li key={p}>{p}</li>)}</ol>
          </div>
        </section>
      )}

      {/* Visit */}
      <section id="visit" className="white">
        <div className="wrap">
          <div className="section-head">
            <span className="eyebrow">Find us</span>
            <h2>Visit the spa</h2>
          </div>
          <div className="visit">
            <div>
              <h3>Opening hours</h3>
              <table className="hours-table">
                <tbody>
                  {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                    <tr key={d}><td>{DAYS[d]}</td><td>{HOURS[d] ? `${HOURS[d]!.open} – ${HOURS[d]!.close}` : 'Closed'}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <h3>Get in touch</h3>
              <ul className="contact-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12z" /><circle cx="12" cy="10" r="2.5" /></svg>
                  <span>Shop H, Chameleon Village<br />R501 Rustenburg Road<br />Hartbeespoort</span>
                </li>
                <li><WaIcon size={20} /><a href={wa()} target="_blank" rel="noopener">{BUSINESS.phone}</a></li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
                  <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
                </li>
              </ul>
            </div>
            <div className="map">
              <iframe title="Map to LaVee Spa, Chameleon Village, Hartbeespoort" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src={`https://www.google.com/maps?q=${encodeURIComponent(BUSINESS.mapsQuery)}&output=embed`} />
            </div>
          </div>
        </div>
      </section>

      <a className="wa-float" href={wa()} target="_blank" rel="noopener" aria-label="Chat with LaVee on WhatsApp"><WaIcon size={28} /></a>
    </div>
  )
}
