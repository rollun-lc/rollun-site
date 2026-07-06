// Story 6.1 — Products (04) (RSC).
//
// Both compositions in one DOM (AD-3), switched only by the 768px CSS media.
// Desktop lays the two blocks as `.prod-grid` rows (the second `.flip`ped);
// mobile stacks them as `.prod-block`s. Block 1 carries body paragraphs, block 2
// a `.cat-list` of categories. The `.cat-list` check colour differs by prototype
// (desktop `--color-or`, mobile `--color-green`) — handled in brands.css.
// The dark `.prod-note` copy differs desktop↔mobile (`pre`), so it is a variant.
import type { BrandProdBlock, BrandsContent } from '@/content/brands'

/** Check-mark icon for `.cat-list` items (both prototypes). */
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12l4 4L19 6" />
    </svg>
  )
}

/** The inner text column, shared by both compositions. */
function ProdText({ block }: { block: BrandProdBlock }) {
  return (
    <div className="prod-text">
      <h3>{block.h3}</h3>
      {block.paragraphs?.map((p) => (
        <p key={p}>{p}</p>
      ))}
      {block.categories && (
        <ul className="cat-list">
          {block.categories.map((c) => (
            <li key={c}>
              <CheckIcon />
              {c}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Products({ products }: { products: BrandsContent['products'] }) {
  const { eyebrow, title, blocks, note } = products
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="brands-dk products reveal">
        <div className="container">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
          {blocks.map((block, i) => (
            <div className={`prod-grid${i === 1 ? ' flip' : ''}`} key={block.img}>
              <div className="prod-photo">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio object-fit photo (AD-13 pixel fidelity); next/image adds no value here */}
                <img src={block.img} alt={block.alt.dk} loading="lazy" />
              </div>
              <ProdText block={block} />
            </div>
          ))}
          <div className="prod-note">
            {note.pre.dk}
            <strong>{note.strong}</strong>
            {note.post}
          </div>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="brands-mb section bg reveal">
        <div className="section-head wrap">
          <div className="section-eyebrow">{eyebrow}</div>
          <h2 className="section-title">{title}</h2>
        </div>
        <div className="wrap">
          {blocks.map((block) => (
            <div className="prod-block" key={block.img}>
              <div className="prod-photo">
                {/* eslint-disable-next-line @next/next/no-img-element -- fixed-ratio object-fit photo (AD-13 pixel fidelity); next/image adds no value here */}
                <img src={block.img} alt={block.alt.mb} loading="lazy" />
              </div>
              <ProdText block={block} />
            </div>
          ))}
          <div className="prod-note">
            {note.pre.mb}
            <strong>{note.strong}</strong>
            {note.post}
          </div>
        </div>
      </section>
    </>
  )
}
