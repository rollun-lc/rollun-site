// Story 4.1 — inline-rich text renderer (RSC, no 'use client').
//
// Turns a flat `AboutSegment[]` from content/about.ts into JSX: `accent` →
// `.or-txt` (orange), `hand` → `.love-word` (handwritten Caveat accent via
// `--font-hand`), `strong` → `<strong>`, `lineBreak` → a leading `<br>`. Keeps
// all copy in the content module (no hardcoded strings in section JSX) while the
// presentation (which run is orange / handwritten / bold) stays here.
import type { AboutSegment } from '@/content/about'

export function Rich({ segments, handClass = 'love-word' }: { segments: AboutSegment[]; handClass?: string }) {
  return (
    <>
      {segments.map((seg, i) => {
        let node: React.ReactNode = seg.text
        if (seg.accent) node = <span className="or-txt">{seg.text}</span>
        else if (seg.hand) node = <span className={handClass}>{seg.text}</span>
        else if (seg.strong) node = <strong>{seg.text}</strong>
        return (
          <span key={i}>
            {seg.lineBreak && <br />}
            {node}
          </span>
        )
      })}
    </>
  )
}
