// Story 6.1 — Brand card (02) (RSC).
//
// Both compositions in one DOM (AD-3), switched only by the 768px CSS media.
//
// Desktop ≠ mobile by STRUCTURE (intent-contract): the desktop subtree carries
// the `.bc-trademark` block (trademark facts as TEXT inside the card) and the
// actions BECOME A PARTNER (internal `/contact`) + SHOP MOTOTOU ON AMAZON
// (external, new tab). The mobile subtree has NO trademark block (those live in
// the separate mobile-only Trademark section) and the actions Visit mototou.com
// (external, new tab) + Become a partner (internal `/contact`).
//
// The desktop `.bc-status` keeps its inline `rgba(239, 127, 26, 0.34)` background
// VERBATIM (a deliberate prototype literal, NOT normalised to a token).
import Link from 'next/link'

import type { BrandsContent } from '@/content/brands'

/** Shield/check trademark icon (Our Brands.html). */
function TmIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

export default function BrandCard({ brand }: { brand: BrandsContent['brand'] }) {
  const { tag, logoText, status, h2, sub, paragraphs, trademark, actions } = brand
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="brands-dk brands reveal">
        <div className="container">
          <div className="brand-card">
            <div className="bc-media">
              <span className="bc-tag">{tag}</span>
              <div className="moto-logo">
                <span>{logoText}</span>
              </div>
              {/* Verbatim prototype inline literal — do NOT normalise to a token. */}
              <span className="bc-status" style={{ backgroundColor: 'rgba(239, 127, 26, 0.34)' }}>
                {status}
              </span>
            </div>
            <div className="bc-body">
              <h2>{h2}</h2>
              <div className="bc-sub">{sub}</div>
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="bc-trademark">
                <div className="bc-tm-head">
                  <TmIcon />
                  {trademark.head}
                </div>
                <p className="bc-tm-desc">{trademark.desc}</p>
                <div className="bc-tm-facts">
                  {trademark.facts.map((f) => (
                    <div className="bc-tm-fact" key={f.k}>
                      <span className="k">{f.k}</span>
                      <span className="v">{f.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bc-actions">
                <Link className="btn btn-or" href={actions.desktop.becomePartner.href}>
                  {actions.desktop.becomePartner.label}
                </Link>
                <a
                  className="btn btn-navy"
                  href={actions.desktop.amazon.href}
                  target="_blank"
                  rel="noopener"
                >
                  {actions.desktop.amazon.label}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="brands-mb section bg reveal">
        <div className="wrap">
          <div className="brand-card">
            <div className="bc-media">
              <span className="bc-tag">{tag}</span>
              <div className="moto-logo">
                <span>{logoText}</span>
              </div>
              <span className="bc-status">{status}</span>
            </div>
            <div className="bc-body">
              <h2>{h2}</h2>
              <div className="bc-sub">{sub}</div>
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <div className="bc-actions">
                <a
                  className="btn btn-navy"
                  href={actions.mobile.visit.href}
                  target="_blank"
                  rel="noopener"
                >
                  {actions.mobile.visit.label}
                </a>
                <Link className="btn btn-or" href={actions.mobile.becomePartner.href}>
                  {actions.mobile.becomePartner.label}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
