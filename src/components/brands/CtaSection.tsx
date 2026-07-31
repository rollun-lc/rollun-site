// Story 6.1 — CTA (desktop 05 / mobile 06) (RSC shell + client trigger).
//
// Both compositions in one DOM (AD-3), switched only by the 768px CSS media. The
// heading is `Interested in <span.or-txt>Mototou</span>?`. The label case differs
// desktop↔mobile (`CONTACT US` vs `Contact us`) — a `{ dk, mb }` variant.
//
// Design v3 extended the contact modal to this page: the DESKTOP button opens the
// dialog. As on Home/Catalog exactly ONE <GetInTouch/> is mounted (desktop only)
// so the DOM never carries two ContactModals; mobile keeps its <Link>.
import Link from 'next/link'

import GetInTouch from '@/components/contact-form/GetInTouch.client'
import type { BrandsContent } from '@/content/brands'
import { type ContactInfoContent } from '@/content/contact-info'

export default function CtaSection({
  cta,
  contactInfo,
}: {
  cta: BrandsContent['cta']
  contactInfo: ContactInfoContent
}) {
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
          <GetInTouch contactInfo={contactInfo} label={ctaLabel.dk} />
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
