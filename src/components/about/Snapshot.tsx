// Story 4.1 — About Snapshot (02, `id="focus"`) (RSC).
//
// Both compositions in one DOM (AD-3). Desktop groups the three focus cards into
// a "Distribution" tray (cards 0–1, linked by a connector node) + a "Technology"
// tray (card 2); mobile is a flat scroll list. The per-card line-art icons are
// presentation and live here, keyed by card index.
//
// The `id="focus"` (hero "Explore our work" anchor target) sits on a wrapper that
// spans BOTH subtrees, so the fragment resolves on every viewport — a
// desktop-only id would be `display:none` (no layout box) on mobile and the
// mobile hero anchor would scroll nowhere.
import type { AboutContent } from '@/content/about'

/** Desktop card icons (About Us.html) keyed by card index. */
const ICONS_DK = [
  <svg key="0" className="icon" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="21" cy="54" r="11" />
    <circle cx="59" cy="54" r="11" />
    <path d="M21 54 L30 36 H44" />
    <path d="M44 36 L38 54" />
    <path d="M21 54 H38" />
    <path d="M44 36 L52 30 H59" />
    <path d="M52 30 L59 54" />
    <path d="M44 36 H30" />
  </svg>,
  <svg key="1" className="icon" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <path d="M40 68s-26-15-26-36c0-8 7-14 14-14 5 0 9 3 12 8 3-5 7-8 12-8 7 0 14 6 14 14 0 21-26 36-26 36z" />
  </svg>,
  <svg key="2" className="icon" width="80" height="80" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <rect x="14" y="14" width="52" height="52" rx="2" />
    <path d="M26 30h28M26 40h28M26 50h18" />
    <circle cx="62" cy="62" r="3" fill="currentColor" />
  </svg>,
]

/** Mobile card icons (About Us Mobile.html) keyed by card index. */
const ICONS_MB = [
  <svg key="0" className="icon" width="64" height="64" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <circle cx="22" cy="52" r="8" />
    <circle cx="58" cy="52" r="8" />
    <path d="M8 52h6M30 52h20M66 52h6M14 40l8-16h28l8 10 10 2v16" />
  </svg>,
  <svg key="1" className="icon" width="64" height="64" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <path d="M40 68s-26-15-26-36c0-8 7-14 14-14 5 0 9 3 12 8 3-5 7-8 12-8 7 0 14 6 14 14 0 21-26 36-26 36z" />
  </svg>,
  <svg key="2" className="icon" width="64" height="64" viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
    <rect x="14" y="14" width="52" height="52" rx="2" />
    <path d="M26 30h28M26 40h28M26 50h18" />
    <circle cx="62" cy="62" r="3" fill="currentColor" />
  </svg>,
]

function GroupLabel({ label, ink }: { label: string; ink?: boolean }) {
  return (
    <div className="group-label" style={ink ? { color: 'var(--color-ink)' } : undefined}>
      <span className="gl-dot" />
      {label}
      <span className="gl-line" />
    </div>
  )
}

export default function Snapshot({ snapshot }: { snapshot: AboutContent['snapshot'] }) {
  const { title, intro, groupLabels, cards } = snapshot
  return (
    <div id="focus">
      {/* ── Desktop composition ── */}
      <section className="about-dk snapshot reveal">
        <div className="container">
          <h2 className="section-title">{title.dk}</h2>
          <div className="snapshot-intro">
            <p>{intro.dk}</p>
          </div>
          <div className="focus-grid">
            <div className="focus-col dist-col">
              <GroupLabel label={groupLabels.distribution} ink />
              <div className="dist-tray">
                <div className="dist-cards">
                  {cards.slice(0, 2).map((card, i) => (
                    <article className="focus-card" key={card.title}>
                      <div className="img">{ICONS_DK[i]}</div>
                      <div className="focus-card-body">
                        <div className="tag">{card.tag.dk}</div>
                        <h3>{card.title}</h3>
                        <p>{card.text.dk}</p>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
            <div className="focus-col tech-col">
              <GroupLabel label={groupLabels.technology} />
              <div className="tech-tray">
                <article className="focus-card">
                  <div className="img">{ICONS_DK[2]}</div>
                  <div className="focus-card-body">
                    <div className="tag">{cards[2].tag.dk}</div>
                    <h3>{cards[2].title}</h3>
                    <p>{cards[2].text.dk}</p>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Desktop wave bridging Snapshot → Approach (About Us.html). */}
      <div className="about-dk wave" aria-hidden="true">
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path d="M0,55 C200,90 360,15 540,40 C720,65 900,15 1080,40 C1260,65 1380,30 1440,45 L1440,90 L0,90 Z" fill="#E2E2E2" />
          <path d="M0,72 C200,100 360,40 540,60 C720,80 900,40 1080,60 C1260,80 1380,55 1440,65 L1440,90 L0,90 Z" fill="#E2E2E2" opacity="0.6" />
        </svg>
      </div>

      {/* ── Mobile composition ── */}
      <section className="about-mb section bg reveal">
        <div className="section-head center wrap">
          <h2 className="section-title">{title.mb}</h2>
          <p>{intro.mb}</p>
        </div>
        <div className="wrap">
          <div className="focus-list">
            {cards.map((card, i) => (
              <article className="focus-card" key={card.title}>
                <div className="img">{ICONS_MB[i]}</div>
                <div className="focus-card-body">
                  <div className="tag">{card.tag.mb}</div>
                  <h3>{card.title}</h3>
                  <p>{card.text.mb}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
