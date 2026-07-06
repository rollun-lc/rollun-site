// Story 4.1 — About US Presence (06) (RSC). SCAFFOLD ONLY.
//
// Desktop renders the section shell: the map head + a `.map-wrap` with an EMPTY
// `#map` mount point (Story 4.2 mounts the D3 map island there), a static live-
// count of 30, and the `.map-hint`. NO d3 / topojson / us-atlas imports. Mobile
// renders only the section container + heading — Story 4.3 fills the static
// location list / city chips beneath it. Both compositions in one DOM (AD-3);
// the mobile subtree carries NO map (AD-13).
import type { AboutContent } from '@/content/about'

import { Rich } from './Rich'

export default function UsPresence({ usPresence }: { usPresence: AboutContent['usPresence'] }) {
  const { eyebrowMobile, title, intro, liveCount, liveLabel, mapHint } = usPresence
  return (
    <>
      {/* ── Desktop composition — map shell (island mounts into #map in 4.2) ── */}
      <section className="about-dk map-section reveal">
        <div className="container">
          <div className="map-head">
            <h2 className="section-title">{title}</h2>
            <p>{intro.dk}</p>
          </div>
          <div className="map-wrap" id="map-wrap" data-borders="on">
            <div className="map-canvas" id="map">
              <div className="loc-popup" id="loc-popup" />
            </div>
            <div className="map-foot">
              <div className="map-overlay">
                <span className="live-num" id="live-count">
                  {liveCount}
                </span>{' '}
                {liveLabel}
              </div>
            </div>
            <p className="map-hint">
              <Rich segments={mapHint} />
            </p>
          </div>
        </div>
      </section>

      {/* ── Mobile composition — heading only (Story 4.3 fills the list) ── */}
      <section className="about-mb section paper reveal">
        <div className="section-head wrap">
          <div className="section-eyebrow">{eyebrowMobile}</div>
          <h2 className="section-title">{title}</h2>
          <p>{intro.mb}</p>
        </div>
      </section>
    </>
  )
}
