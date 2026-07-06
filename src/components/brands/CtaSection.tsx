// Story 6.1 — CTA (desktop 05 / mobile 06) (RSC).
//
// Both compositions in one DOM (AD-3), switched only by the 768px CSS media. The
// heading is `Interested in <span.or-txt>Mototou</span>?`; the single CTA button
// links internally to `/contact`. The label case differs desktop↔mobile
// (`CONTACT US` vs `Contact us`) — captured as a `{ dk, mb }` variant.
import Link from 'next/link'

import type { BrandsContent } from '@/content/brands'

export default function CtaSection({ cta }: { cta: BrandsContent['cta'] }) {
  const { headingPre, headingAccent, headingPost, sub, ctaLabel, ctaHref } = cta
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="brands-dk cta reveal">
        <div className="container">
          <h2>
            {headingPre}
            <span className="or-txt">{headingAccent}</span>
            {headingPost}
          </h2>
          <p>{sub}</p>
          <Link className="btn btn-or" href={ctaHref}>
            {ctaLabel.dk}
          </Link>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="brands-mb section paper brand-cta reveal">
        <div className="wrap">
          <h2>
            {headingPre}
            <span className="or-txt">{headingAccent}</span>
            {headingPost}
          </h2>
          <p>{sub}</p>
          <Link className="btn btn-or" href={ctaHref}>
            {ctaLabel.mb}
          </Link>
        </div>
      </section>
    </>
  )
}
