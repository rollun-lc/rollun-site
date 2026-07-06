// Story 4.1 — About Team (07) (RSC). Both compositions in one DOM (AD-3).
//
// The 2×2 mosaic has three photo tiles + one SOLID orange tile (`.team-tile.tr`).
// AD-13 DEFECT reproduced: `.team-tile.tr` keeps the LITERAL colour `#ea7b07`
// (in about.css), NOT normalized to the `--or`/`--color-or` token. The heading's
// "love" runs handwritten (Caveat / `--font-hand`, `.love-word`) on desktop; the
// mobile prototype uses a plain-orange `.lv` (no cursive), so mobile passes that
// class to <Rich>. A broken photo `src` degrades to the tile's solid background.
// Plain <img> (project convention, matches the prototype's object-fit tiles).
import type { AboutContent, AboutTeamTile } from '@/content/about'

import { Rich } from './Rich'

function Tile({ tile }: { tile: AboutTeamTile }) {
  return (
    <div className={`team-tile ${tile.pos}`} aria-label="Team photo slot">
      {tile.src && (
        // eslint-disable-next-line @next/next/no-img-element -- fixed-ratio object-fit mosaic tile (AD-13 pixel fidelity); next/image adds no value here
        <img
          src={tile.src}
          alt={tile.alt ?? ''}
          loading="lazy"
          style={tile.objectPosition ? { objectPosition: tile.objectPosition } : undefined}
        />
      )}
    </div>
  )
}

function Sig({ name, role, photo }: { name: string; role: string; photo: string }) {
  return (
    <div className="team-sig">
      <div className="av">
        {/* eslint-disable-next-line @next/next/no-img-element -- fixed 54px avatar (AD-13 pixel fidelity); next/image adds no value here */}
        <img src={photo} alt="CEO" loading="lazy" />
      </div>
      <div>
        <div className="name">{name}</div>
        <div className="role">{role}</div>
      </div>
    </div>
  )
}

export default function Team({ team }: { team: AboutContent['team'] }) {
  const { tilesDesktop, tilesMobile, heading, quote, ceoName, ceoRole, ceoPhoto } = team
  return (
    <>
      {/* ── Desktop composition ── */}
      <section className="about-dk team reveal">
        <div className="container team-grid">
          <div className="team-mark">
            {tilesDesktop.map((tile) => (
              <Tile key={tile.pos} tile={tile} />
            ))}
          </div>
          <div className="team-text">
            <h2 className="section-display">
              <Rich segments={heading} />
            </h2>
            <p className="quote">{quote}</p>
            <Sig name={ceoName} role={ceoRole} photo={ceoPhoto} />
          </div>
        </div>
      </section>

      {/* ── Mobile composition ── */}
      <section className="about-mb section team reveal">
        <div className="team-inner">
          <div className="team-mark">
            {tilesMobile.map((tile) => (
              <Tile key={tile.pos} tile={tile} />
            ))}
          </div>
          <h2>
            <Rich segments={heading} handClass="lv" />
          </h2>
          <p className="quote">{quote}</p>
          <Sig name={ceoName} role={ceoRole} photo={ceoPhoto} />
        </div>
      </section>
    </>
  )
}
