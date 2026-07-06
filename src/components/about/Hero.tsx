// Story 4.1 — About hero (01) (RSC, no 'use client').
//
// Renders BOTH compositions into one DOM (AD-3): a desktop subtree (`.about-dk`,
// About Us.html) and a mobile subtree (`.about-mb`, About Us Mobile.html); the
// visible one is chosen ONLY by the CSS `@media` at 768px in about.css — no JS
// width gating. Hero is the FIRST section and is intentionally excluded from
// `.reveal` (it is above the fold). In-page anchors (`#cta`, `#focus`) target the
// desktop compositions that carry those ids (mirrors the Home convention).
import Link from 'next/link'

import type { AboutContent } from '@/content/about'

import { Rich } from './Rich'

export default function Hero({ hero }: { hero: AboutContent['hero'] }) {
  return (
    <>
      {/* ── Desktop composition (visible ≥768px via about.css) ── */}
      <section className="about-dk hero">
        <div className="container hero-inner">
          <h1>
            <Rich segments={hero.headline} />
          </h1>
          <p className="hero-sub">{hero.subheading}</p>
          <p className="hero-para">{hero.para.dk}</p>
          <div className="hero-buttons">
            <a className="btn btn-or" href="#cta">
              {hero.ctaPrimary}
            </a>
            <a className="btn btn-ghost" href="#focus">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>

      {/* ── Mobile composition (visible <768px via about.css) ── */}
      <section className="about-mb page-hero about-hero">
        <div className="page-hero-inner">
          <div className="eyebrow">{hero.eyebrowMobile}</div>
          <h1>
            <Rich segments={hero.headline} />
          </h1>
          <p className="hero-sub">{hero.subheading}</p>
          <p className="hero-para">{hero.para.mb}</p>
          <div className="hero-buttons">
            <Link className="btn btn-or btn-block" href="/contact">
              {hero.ctaPrimary}
            </Link>
            <a className="btn btn-ghost btn-block" href="#focus">
              {hero.ctaSecondary}
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
