// Story 5.1 — Catalog "Ready to buy?" CTA (RSC shell + client trigger).
//
// Both compositions in one DOM (AD-3); the 768px CSS switch picks the visible
// one. Desktop wraps the content in `.container`; mobile does not (VERBATIM).
//
// Design v3 extended the contact modal to this page: any Contact link opens the
// dialog instead of navigating. Following the Home CtaSection precedent, exactly
// ONE <GetInTouch/> is mounted — in the DESKTOP subtree — so the DOM never holds
// two ContactModals (and two `id="contactForm"`). The mobile subtree keeps its
// plain <Link> to /contact, which is what GetInTouch does on mobile anyway.
// The other button (`/shops#online`) stays an ordinary cross-page link.
import Link from 'next/link'

import GetInTouch from '@/components/contact-form/GetInTouch.client'
import type { CatalogContent } from '@/content/catalog'
import { type ContactInfoContent } from '@/content/contact-info'

/** The topic the Catalog CTA deep-links with (mirrors `?topic=` in the href). */
const WHOLESALE_TOPIC = 'Wholesale & distribution'

/** A CTA button whose target is the Contact page — these become modal triggers. */
const isContactButton = (href: string) => href.startsWith('/contact')

/** The CTA heading with an inline orange (`.or-txt`) accent run. */
function CtaHeading({ segments }: { segments: CatalogContent['cta']['titleSegments'] }) {
  return (
    <h2>
      {segments.map((s, i) =>
        s.accent ? (
          <span key={i} className="or-txt">
            {s.text}
          </span>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </h2>
  )
}

function CtaButtons({
  buttons,
  variant,
  contactInfo,
}: {
  buttons: CatalogContent['cta']['buttons']
  variant: 'dk' | 'mb'
  /** Present only on the desktop subtree — the one that mounts the modal. */
  contactInfo?: ContactInfoContent
}) {
  return (
    <div className="cta-buttons">
      {buttons.map((b) =>
        contactInfo && isContactButton(b.href[variant]) ? (
          <GetInTouch
            key={b.label}
            contactInfo={contactInfo}
            label={b.label}
            topic={WHOLESALE_TOPIC}
            variant={b.variant}
          />
        ) : (
          <Link key={b.label} className={`btn ${b.variant === 'or' ? 'btn-or' : 'btn-dark'}`} href={b.href[variant]}>
            {b.label}
          </Link>
        ),
      )}
    </div>
  )
}

export default function CtaSection({
  cta,
  contactInfo,
}: {
  cta: CatalogContent['cta']
  contactInfo: ContactInfoContent
}) {
  const { titleSegments, text, buttons } = cta
  return (
    <>
      {/* ── Desktop composition — the only subtree that mounts the modal ── */}
      <section className="catalog-dk cta">
        <div className="container">
          <CtaHeading segments={titleSegments} />
          <p>{text}</p>
          <CtaButtons buttons={buttons} variant="dk" contactInfo={contactInfo} />
        </div>
      </section>

      {/* ── Mobile composition (no container) ── */}
      <section className="catalog-mb cta">
        <CtaHeading segments={titleSegments} />
        <p>{text}</p>
        <CtaButtons buttons={buttons} variant="mb" />
      </section>
    </>
  )
}
