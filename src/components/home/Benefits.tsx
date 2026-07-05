// Story 3.1 — Home "Key benefits" (RSC, no 'use client').
//
// Both compositions in one DOM (AD-3); 768px CSS switch picks the visible one.
// The four cards' heading/body text come from content (dk/mb variants); the
// icons are presentation, so they live here as inline SVG — and the desktop and
// mobile prototypes ship DIFFERENT (detailed vs simplified) icons, so each
// composition renders its own set, zipped to the cards by index.
import type { HomeContent } from '@/content/home'
import type { ReactElement } from 'react'

/** Detailed desktop benefit icons (Home.html), zipped to cards by index. */
const DESKTOP_ICONS: ReactElement[] = [
  // Own Software — stacked layers + gear
  <svg key="dk-0" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 78 L20 64 L50 50 L80 64 Z" />
    <path d="M50 66 L20 52 L50 38 L80 52 Z" />
    <path d="M50 54 L20 40 L50 26 L80 40 Z" />
    <circle cx="50" cy="22" r="7" />
    <circle cx="50" cy="22" r="2.5" />
    <g strokeWidth="2.5">
      <path d="M50 11 V14" />
      <path d="M50 30 V33" />
      <path d="M39 22 H42" />
      <path d="M58 22 H61" />
      <path d="M42.5 14.5 L44.5 16.5" />
      <path d="M55.5 27.5 L57.5 29.5" />
      <path d="M57.5 14.5 L55.5 16.5" />
      <path d="M44.5 27.5 L42.5 29.5" />
    </g>
  </svg>,
  // Smart Processes — lightbulb with wifi rays
  <svg key="dk-1" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 22 C 36 22, 28 32, 28 44 C 28 53, 33 59, 38 64 L 38 70 L 62 70 L 62 64 C 67 59, 72 53, 72 44 C 72 32, 64 22, 50 22 Z" />
    <path d="M42 50 L50 42 L58 50 L50 58 Z" />
    <path d="M50 42 V58" />
    <path d="M40 70 H60" />
    <path d="M40 74 H60" />
    <path d="M43 78 H57" />
    <path d="M46 82 H54" />
    <path d="M22 38 Q 18 30, 22 24" />
    <path d="M16 40 Q 10 30, 16 18" />
    <path d="M78 38 Q 82 30, 78 24" />
    <path d="M84 40 Q 90 30, 84 18" />
    <path d="M50 14 V8" />
    <path d="M38 16 L34 10" />
    <path d="M62 16 L66 10" />
  </svg>,
  // Turnover without team growth — group of people
  <svg key="dk-2" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="38" r="12" />
    <path d="M28 80 C 28 65, 38 58, 50 58 C 62 58, 72 65, 72 80" />
    <circle cx="22" cy="44" r="8" />
    <path d="M8 80 C 8 70, 14 64, 22 64" />
    <circle cx="78" cy="44" r="8" />
    <path d="M92 80 C 92 70, 86 64, 78 64" />
  </svg>,
  // Ukrainian AI startup — rocket + laptop + target
  <svg key="dk-3" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M22 78 H78" />
    <path d="M28 78 L32 70 H68 L72 78" />
    <path d="M44 64 C 44 50, 50 36, 50 30 C 50 36, 56 50, 56 64 Z" />
    <circle cx="50" cy="46" r="3" />
    <path d="M44 58 L38 62 L44 62" />
    <path d="M56 58 L62 62 L56 62" />
    <path d="M47 64 L50 70 L53 64" />
    <path d="M18 22 V30 M14 26 H22" />
    <path d="M30 14 V20 M27 17 H33" />
    <circle cx="76" cy="30" r="8" />
    <path d="M76 24 V36" />
    <path d="M73 27 Q 76 26, 79 28 Q 76 32, 73 30 Q 76 35, 79 33" />
  </svg>,
]

/** Simplified mobile benefit icons (Home Mobile.html), zipped by index. */
const MOBILE_ICONS: ReactElement[] = [
  <svg key="mb-0" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 78 L20 64 L50 50 L80 64 Z" />
    <path d="M50 66 L20 52 L50 38 L80 52 Z" />
    <path d="M50 54 L20 40 L50 26 L80 40 Z" />
    <circle cx="50" cy="22" r="7" />
    <circle cx="50" cy="22" r="2.5" />
  </svg>,
  <svg key="mb-1" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M50 22 C 36 22, 28 32, 28 44 C 28 53, 33 59, 38 64 L 38 70 L 62 70 L 62 64 C 67 59, 72 53, 72 44 C 72 32, 64 22, 50 22 Z" />
    <path d="M42 50 L50 42 L58 50 L50 58 Z" />
    <path d="M40 70 H60" />
    <path d="M43 78 H57" />
  </svg>,
  <svg key="mb-2" viewBox="0 0 100 100" aria-hidden="true">
    <circle cx="50" cy="38" r="12" />
    <path d="M28 80 C 28 65, 38 58, 50 58 C 62 58, 72 65, 72 80" />
    <circle cx="22" cy="44" r="8" />
    <circle cx="78" cy="44" r="8" />
  </svg>,
  <svg key="mb-3" viewBox="0 0 100 100" aria-hidden="true">
    <path d="M22 78 H78" />
    <path d="M28 78 L32 70 H68 L72 78" />
    <path d="M44 64 C 44 50, 50 36, 50 30 C 50 36, 56 50, 56 64 Z" />
    <circle cx="50" cy="46" r="3" />
    <path d="M47 64 L50 70 L53 64" />
  </svg>,
]

export default function Benefits({ benefits }: { benefits: HomeContent['benefits'] }) {
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="home-dk benefits reveal">
        <div className="container">
          <h2 className="section-title">{benefits.title}</h2>
          <div className="benefits-grid">
            {benefits.cards.map((card, i) => (
              <div key={card.heading.dk} className="benefit">
                <div className="bicon">{DESKTOP_ICONS[i]}</div>
                <div>
                  <h3>{card.heading.dk}</h3>
                  <p>{card.text.dk}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="home-mb section bg reveal">
        <div className="section-head center wrap">
          <h2 className="section-title">{benefits.title}</h2>
        </div>
        <div className="wrap">
          <div className="benefits-list">
            {benefits.cards.map((card, i) => (
              <div key={card.heading.mb} className="benefit">
                <div className="bicon">{MOBILE_ICONS[i]}</div>
                <div>
                  <h3>{card.heading.mb}</h3>
                  <p>{card.text.mb}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
