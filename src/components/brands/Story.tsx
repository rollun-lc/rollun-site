// Story 6.1 — Story (03) (RSC).
//
// Both compositions in one DOM (AD-3); the 768px CSS switch picks the visible
// one. Structure is identical in both prototypes: eyebrow, section title, a lead
// paragraph, the first body paragraph, a pull quote, then the remaining
// paragraph(s). Desktop wraps in `.container-narrow`; mobile in `.wrap`.
import type { BrandsContent } from '@/content/brands'

export default function Story({ story }: { story: BrandsContent['story'] }) {
  const { eyebrow, title, lead, paragraphs, pull } = story
  const [first, ...rest] = paragraphs
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="brands-dk story reveal">
        <div className="container-narrow">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
          <p className="lead">{lead}</p>
          <p>{first}</p>
          <div className="pull">{pull}</div>
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="brands-mb section paper story reveal">
        <div className="wrap">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
          <p className="lead">{lead}</p>
          <p>{first}</p>
          <div className="pull">{pull}</div>
          {rest.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </section>
    </>
  )
}
