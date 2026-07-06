// Story 6.1 — Brands page hero (01) (RSC, no 'use client').
//
// Renders BOTH compositions into one DOM (AD-3): a desktop subtree (`.brands-dk`,
// Our Brands.html) and a mobile subtree (`.brands-mb`, Our Brands Mobile.html);
// the visible one is chosen ONLY by the CSS `@media` at 768px in brands.css — no
// JS width gating. Hero is the FIRST section and is intentionally excluded from
// `.reveal` (above the fold).
import type { BrandsContent } from '@/content/brands'

export default function Hero({ hero }: { hero: BrandsContent['hero'] }) {
  return (
    <>
      {/* ── Desktop composition (visible ≥768px via brands.css) ── */}
      <section className="brands-dk page-hero">
        <div className="container page-hero-inner">
          <div className="eyebrow">{hero.eyebrow}</div>
          <h1>{hero.title}</h1>
          <p>{hero.intro}</p>
        </div>
      </section>

      {/* ── Mobile composition (visible <768px via brands.css) ── */}
      <section className="brands-mb page-hero">
        <div className="page-hero-inner">
          <div className="eyebrow">{hero.eyebrow}</div>
          <h1>{hero.title}</h1>
          <p>{hero.intro}</p>
        </div>
      </section>
    </>
  )
}
