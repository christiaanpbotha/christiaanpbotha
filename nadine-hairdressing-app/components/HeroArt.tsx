// Polish bottle + named shade chart. Stands in until the salon sends photos of their work.
const SHADES = [
  { name: 'Oxblood', c: '#7a1631' },
  { name: 'Rosewater', c: '#e8b9bf' },
  { name: 'Champagne', c: '#e2c9a0' },
  { name: 'Plum', c: '#5a3a63' },
  { name: 'Milk', c: '#f7f1e8' },
]

export default function HeroArt() {
  return (
    <figure className="border border-th-border bg-th-card-alt">
      <div className="grid place-items-center py-10">
        <svg viewBox="0 0 200 200" className="w-40 sm:w-48" aria-hidden>
          <rect x="88" y="18" width="24" height="62" rx="4" fill="#2a1820" />
          <rect x="80" y="78" width="40" height="10" rx="2" fill="#b89766" />
          <path d="M62 104 Q62 88 80 88 H120 Q138 88 138 104 V160 Q138 180 118 180 H82 Q62 180 62 160 Z" fill="#7a1631" />
          <path d="M74 106 Q74 98 84 98" stroke="#fff" strokeOpacity="0.3" strokeWidth="4" strokeLinecap="round" fill="none" />
        </svg>
      </div>
      <figcaption className="grid grid-cols-5 border-t border-th-border text-[11px] text-th-text-muted">
        {SHADES.map((s) => (
          <span key={s.name} className="border-l border-th-border first:border-l-0">
            <span className="block h-8" style={{ background: s.c }} />
            <span className="block px-2 py-1.5 truncate">{s.name}</span>
          </span>
        ))}
      </figcaption>
    </figure>
  )
}
