// Story 6.1 — Trademark (05) — MOBILE-ONLY (RSC shell + client lightbox island).
//
// This section exists ONLY in the mobile subtree (`.brands-mb`): the desktop
// composition presents the trademark facts as text inside the brand card instead
// (see BrandCard). Because the section is not rendered on desktop, neither the
// certificate card nor the `.lightbox` overlay exist there — reproducing the
// prototype "desktop has no lightbox" defect (UX-DR16) without a dead duplicate.
//
// The facts are shared with the desktop brand-card block (`brand.trademark.facts`),
// passed in so the wording lives in ONE place. The certificate card + overlay are
// the CertLightbox island (the page's only interactive leaf, the only `.lightbox`).
import CertLightbox from '@/components/islands/CertLightbox.client'
import type { BrandsContent, TmFact } from '@/content/brands'

export default function Trademark({
  trademark,
  facts,
}: {
  trademark: BrandsContent['trademark']
  facts: TmFact[]
}) {
  const { eyebrow, title, desc, cert } = trademark
  return (
    <section className="brands-mb section dark reveal">
      <div className="wrap">
        <div className="tm-text">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2>{title}</h2>
          <p>{desc}</p>
          <div className="tm-facts">
            {facts.map((f) => (
              <div className="tm-fact" key={f.k}>
                <div className="k">{f.k}</div>
                <div className="v">{f.v}</div>
              </div>
            ))}
          </div>
          <CertLightbox
            img={cert.img}
            alt={cert.alt}
            caption={cert.caption}
            enlargedAlt={cert.enlargedAlt}
          />
        </div>
      </div>
    </section>
  )
}
