// Story 4.1 — About Approach (03) (RSC). Both compositions in one DOM (AD-3):
// desktop is a 2×2 bordered grid of principles, mobile a single stacked list.
// The four principles are identical in both prototypes.
import type { AboutContent } from '@/content/about'

export default function Approach({ approach }: { approach: AboutContent['approach'] }) {
  const { title, principles } = approach
  const list = principles.map((p) => (
    <div className="principle" key={p.num}>
      <div className="principle-num">{p.num}</div>
      <div>
        <h3>{p.title}</h3>
        <p>{p.text}</p>
      </div>
    </div>
  ))
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="about-dk approach reveal">
        <div className="container">
          <h2 className="section-title">{title}</h2>
          <div className="principles">{list}</div>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="about-mb section paper reveal">
        <div className="section-head center wrap">
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="wrap">
          <div className="principles">{list}</div>
        </div>
      </section>
    </>
  )
}
