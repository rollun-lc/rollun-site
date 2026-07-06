// Story 4.1 — About KeepToShip (05) (RSC). Both compositions in one DOM (AD-3).
// Desktop pairs the copy with a static line-art "analogy" visual (Uber / Airbnb /
// KeepToShip comparison); mobile drops the visual and stacks the copy. The
// external CTA "Learn more" opens keeptoship.com in a new tab
// (`target="_blank" rel="noopener"`). The diagram + compare icons are
// presentation and live here.
import type { AboutContent } from '@/content/about'

import { Rich } from './Rich'

/** Compare-row icons (About Us.html), keyed by row index: Uber / Airbnb / KeepToShip. */
const COMPARE_ICONS = [
  <svg key="uber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  <svg key="airbnb" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 4v16" />
    <path d="M2 8h18a2 2 0 0 1 2 2v10" />
    <path d="M2 17h20" />
    <path d="M6 8v9" />
  </svg>,
  <svg key="kts" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m7.5 4.27 9 5.15" />
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>,
]

function CtaBlock({ heading, text, label, href }: { heading: string; text: string; label: string; href: string }) {
  return (
    <div className="kts-cta-block">
      <div className="kts-cta-text">
        <strong>{heading}</strong>
        {text}
      </div>
      <a className="btn btn-or" href={href} target="_blank" rel="noopener">
        {label}
      </a>
    </div>
  )
}

export default function KeepToShip({ keeptoship }: { keeptoship: AboutContent['keeptoship'] }) {
  const { tag, heading, paragraphs, ctaHeading, ctaText, ctaLabel, ctaHref, visual } = keeptoship
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="about-dk kts reveal">
        <div className="container">
          <div className="kts-grid">
            <div className="kts-body">
              <div className="kts-tag">{tag}</div>
              <h2 className="section-display">
                <Rich segments={heading} />
              </h2>
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <CtaBlock heading={ctaHeading} text={ctaText} label={ctaLabel} href={ctaHref} />
            </div>

            <div className="kts-visual">
              <div className="kts-visual-label">{visual.label}</div>
              <div className="kts-analogy">
                <div className="kts-diagram" aria-hidden="true">
                  <svg className="kts-dia" viewBox="0 0 400 132" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path className="kts-dia-path" d="M52 86 C 76 104, 92 102, 108 88 C 130 72, 156 76, 178 82" />
                    <path className="kts-dia-path" d="M222 82 C 244 76, 270 72, 292 88 C 308 100, 324 104, 348 86" />
                    <g className="kts-dia-stroke">
                      <path d="M64 46 L64 40 L150 40 L150 46" />
                      <path d="M250 46 L250 40 L336 40 L336 46" />
                    </g>
                    <text className="kts-dia-label" x="107" y="33" textAnchor="middle">10 km</text>
                    <text className="kts-dia-label" x="293" y="33" textAnchor="middle">10 km</text>
                    <g className="kts-dia-stroke" transform="translate(20,64) scale(1.25)">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    </g>
                    <rect className="kts-dia-stroke" x="44" y="84" width="11" height="9" rx="1.5" />
                    <g className="kts-dia-stroke" transform="translate(92,66) scale(1.2)">
                      <circle cx="18.5" cy="17.5" r="3.5" />
                      <circle cx="5.5" cy="17.5" r="3.5" />
                      <circle cx="15" cy="5" r="1" />
                      <path d="M12 17.5V14l-3-3 4-3 2 3h2" />
                    </g>
                    <g className="kts-dia-accent" transform="translate(178,52) scale(1.8)">
                      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35a2 2 0 0 1 1.26-1.86l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
                      <path d="M6 18h12" />
                      <path d="M6 14h12" />
                      <path d="M6 22V12h12v10" />
                    </g>
                    <g className="kts-dia-stroke" transform="translate(279,62) scale(1.15)">
                      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
                      <circle cx="7" cy="17" r="2" />
                      <path d="M9 17h6" />
                      <circle cx="17" cy="17" r="2" />
                    </g>
                    <rect className="kts-dia-stroke" x="345" y="84" width="11" height="9" rx="1.5" />
                    <g className="kts-dia-stroke" transform="translate(348,64) scale(1.25)">
                      <circle cx="12" cy="7" r="4" />
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    </g>
                  </svg>
                </div>
                <p className="kts-analogy-h">
                  <Rich segments={visual.analogy} />
                </p>
                <div className="kts-compare">
                  {visual.compare.map((c, i) => (
                    <div className={`kcol${c.accent ? ' kcol-accent' : ''}`} key={c.name}>
                      <div className="kcol-name">{c.name}</div>
                      <div className="kcol-ic">{COMPARE_ICONS[i]}</div>
                      <div className="kcol-role">{c.role}</div>
                      <div className="kcol-verb">{c.verb}</div>
                    </div>
                  ))}
                </div>
                <div className="kts-note">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    <Rich segments={visual.note} />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile composition (no visual) ── */}
      <section className="about-mb section bg reveal">
        <div className="wrap">
          <div className="kts-tag">{tag}</div>
          <h2 className="kts">
            <Rich segments={heading} />
          </h2>
          <div className="kts">
            {paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <CtaBlock heading={ctaHeading} text={ctaText} label={ctaLabel} href={ctaHref} />
          </div>
        </div>
      </section>
    </>
  )
}
