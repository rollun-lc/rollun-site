// Story 3.1 — Home "Find us on marketplaces" (RSC, no 'use client').
//
// Both compositions in one DOM (AD-3); 768px CSS switch picks the visible one.
// AD-13 defect reproduced AS-IS: the desktop cards show a star rating + score +
// meta, the mobile cards show NONE (and all three mobile cards share the same
// generic blurb). Ratings live only on `card.rating` and are rendered solely by
// the desktop composition below. Logos are presentation (per-brand inline SVG /
// the eBay <img>), selected by `card.id`.
import type { HomeContent, HomeMarketplaceCard } from '@/content/home'
import type { CSSProperties } from 'react'

/** Per-brand logo mark (shared markup; sizes differ by composition via CSS). */
function MarketplaceLogo({ id }: { id: HomeMarketplaceCard['id'] }) {
  if (id === 'ebay') {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- fixed-height brand logo (AD-13 pixel fidelity); next/image adds no value here
      <img src="/shop/ebay-logo.png" alt="eBay" />
    )
  }
  if (id === 'amazon') {
    return (
      <div className="amazon-wrap">
        <span className="lbl amazon">amazon</span>
        <svg className="amazon-smile" viewBox="0 0 140 22" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <path d="M6 4 C 30 22, 110 22, 134 4" />
          <path d="M126 4 L 134 4 L 134 12" strokeWidth="3" />
        </svg>
      </div>
    )
  }
  return (
    <div className="walmart-wrap">
      <svg className="walmart-spark" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" aria-hidden="true">
        <line x1="24" y1="17" x2="24" y2="4" />
        <line x1="30.1" y1="20.5" x2="41.3" y2="14" />
        <line x1="30.1" y1="27.5" x2="41.3" y2="34" />
        <line x1="24" y1="31" x2="24" y2="44" />
        <line x1="17.9" y1="27.5" x2="6.7" y2="34" />
        <line x1="17.9" y1="20.5" x2="6.7" y2="14" />
      </svg>
      <span className="lbl walmart">Walmart</span>
    </div>
  )
}

export default function Marketplaces({ marketplaces }: { marketplaces: HomeContent['marketplaces'] }) {
  const { eyebrow, title, cards } = marketplaces
  return (
    <>
      {/* ── Desktop composition — cards carry ratings (AD-13) ── */}
      <section className="home-dk marketplaces reveal">
        <div className="container">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
          <div className="mp-grid">
            {cards.map((card) => (
              <div key={card.id} className="mp-card">
                <div className="mp-logo">
                  <MarketplaceLogo id={card.id} />
                </div>
                <div className="mp-rating">
                  <span className="stars" style={{ '--pct': `${card.rating.pct}%` } as CSSProperties} />
                  <span className="score">{card.rating.score}</span>
                  <span className="meta">{card.rating.meta}</span>
                </div>
                <p>{card.descDesktop}</p>
                <a className="mp-link" href={card.href} target="_blank" rel="noopener">
                  {card.cta}&nbsp;▸
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile composition — NO ratings, shared blurb (AD-13) ── */}
      <section className="home-mb section paper reveal">
        <div className="section-head center wrap">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="wrap">
          <div className="mp-list">
            {cards.map((card) => (
              <div key={card.id} className="mp-card">
                <div className="mp-logo">
                  <MarketplaceLogo id={card.id} />
                </div>
                <p>{card.descMobile}</p>
                <a className="mp-link" href={card.href} target="_blank" rel="noopener">
                  {card.cta} ▸
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
