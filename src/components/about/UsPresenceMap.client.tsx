'use client'

/**
 * US-presence D3 map (Story 4.2) — a single leaf island (AD-1) that ENHANCES the
 * static SSR scaffold Story 4.1 rendered in `UsPresence.tsx`, never rewriting the
 * DOM (same precedent as `StatsCounter` / `HeroMosaic`). It renders NOTHING
 * (`return null`): all work happens in `useEffect`, so there is no hydration
 * mismatch and the SSR scaffold (empty `#map`, `#loc-popup`, `#live-count` = 30,
 * `.map-hint`) stands as the pre-hydration / no-JS fallback.
 *
 * The gate is an `IntersectionObserver` on `.about-dk.map-section` (threshold
 * 0.3, once — `mapIO` of the prototype). Because `.about-dk` is `display:none`
 * below 768px it NEVER intersects on mobile, so the dynamic `import()` of the D3
 * stack never runs and the chunk stays off mobile — art direction "for free",
 * with no UA-sniffing and no JS width-gating (AD-3). The no-IO fallback builds
 * the map only when the section is actually displayed (`offsetParent !== null` —
 * a CSS-visibility check, not a width/UA check).
 *
 * On intersection the island (a) counts `#live-count` up 0→30 in verbatim 180ms
 * integer ticks (StatsCounter-style: reset to `0` on mount only when motion is
 * allowed AND `IntersectionObserver` exists, else leave the SSR `30`), and (b)
 * dynamically imports `d3-geo` / `d3-selection` / `topojson-client` /
 * `us-atlas` and builds the SVG map + 32 markers into `#map`, wiring click
 * popovers — all a faithful port of `initUSMap` in `About Us.html`. Any failure
 * in the build sets `.map-hint` to `Map could not load.` (the prototype `.catch`).
 *
 * The effect is keyed on `usePathname()`; cleanup aborts every listener (one
 * `AbortController`), disconnects the observer and cancels every timer / rAF, so
 * SPA navigation leaves nothing running.
 */
import type { GeoPermissibleObjects } from 'd3-geo'
import type { GeometryCollection, Topology } from 'topojson-specification'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import type { AboutMapLocation } from '@/content/about'

const W = 960
const H = 600
const POPUP_W = 286

/** Escape a trusted static string before injecting it into `innerHTML`. The
 *  `locations` prop is trusted authored content, but escaping keeps the port
 *  robust and lint-clean. */
function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** Build the popover innerHTML — faithful port of the prototype `buildPopup`. */
function buildPopup(loc: AboutMapLocation): string {
  if (loc.type === 'wh') {
    const suppliers = loc.suppliers ?? []
    const items = suppliers
      .map((it) => {
        const watch = /watch|secondary/i.test(it.address)
        return `<div class="lp-wh${watch ? ' watch' : ''}">
            <div class="lp-wh-name">${esc(it.name)}</div>
            <div class="lp-wh-addr">${esc(it.address)}</div>
          </div>`
      })
      .join('')
    const n = suppliers.length
    return `<button class="lp-close" aria-label="Close">&times;</button>
          <div class="lp-kicker"><span class="badge"></span>Supplier ship-from · ${n} ${n > 1 ? 'suppliers' : 'supplier'}</div>
          <h4>${esc(loc.city)}, ${esc(loc.state)}</h4>
          <div class="lp-whlist">${items}</div>`
  }
  const rows = (loc.rows ?? [])
    .map((r) => `<div class="lp-row"><span class="k">${esc(r.k)}</span><span class="v">${esc(r.v)}</span></div>`)
    .join('')
  return `<button class="lp-close" aria-label="Close">&times;</button>
        <div class="lp-kicker"><span class="badge"></span>${esc(loc.kicker ?? '')}</div>
        <h4>${esc(loc.city)}, ${esc(loc.state)}</h4>
        <div class="lp-desc">${esc(loc.desc ?? '')}</div>
        <div class="lp-rows">${rows}</div>`
}

export default function UsPresenceMap({ locations }: { locations: AboutMapLocation[] }) {
  const pathname = usePathname()

  useEffect(() => {
    const section = document.querySelector<HTMLElement>('.about-dk.map-section')
    const canvas = document.getElementById('map')
    const popup = document.getElementById('loc-popup')
    const liveEl = document.getElementById('live-count')
    const mapHint = document.querySelector<HTMLElement>('.about-dk.map-section .map-hint')
    if (!section || !canvas || !popup) return

    // Policy: everything animates — `prefers-reduced-motion` is NOT honoured.
    const hasIO = 'IntersectionObserver' in window
    // Count-up plays whenever we can gate it on scroll — otherwise the SSR final
    // `30` is shown immediately (matches StatsCounter).
    const animateCount = hasIO

    const controller = new AbortController()
    const { signal } = controller
    const timers = new Set<ReturnType<typeof setTimeout>>()
    const frames = new Set<number>()
    let started = false
    let disposed = false

    // ── count-up (verbatim `setTimeout(tick, 180)`, integers 0→30) ──
    if (animateCount && liveEl) liveEl.textContent = '0'
    const countUp = () => {
      if (!animateCount || !liveEl) return
      const target = 30
      let cur = 0
      const tick = () => {
        if (disposed) return
        if (cur < target) {
          cur++
          liveEl.textContent = String(cur)
          timers.add(setTimeout(tick, 180))
        }
      }
      tick()
    }

    // ── map build (faithful port of `initUSMap`) ──
    const buildMap = async () => {
      try {
        const [d3geo, d3sel, topo, atlas] = await Promise.all([
          import('d3-geo'),
          import('d3-selection'),
          import('topojson-client'),
          import('us-atlas/states-10m.json'),
        ])
        if (disposed) return
        const { geoAlbersUsa, geoPath } = d3geo
        const us = atlas.default as unknown as Topology
        const statesObj = us.objects.states as GeometryCollection

        // Guard against a double-build if the effect ever re-runs on the same DOM.
        const existing = canvas.querySelector('#us-map')
        if (existing) existing.remove()

        const svg = d3sel
          .select(canvas)
          .insert('svg', ':first-child')
          .attr('id', 'us-map')
          .attr('viewBox', `0 0 ${W} ${H}`)
          .attr('preserveAspectRatio', 'xMidYMid meet')
        const gStates = svg.append('g')
        const gMarks = svg.append('g')

        const states = topo.feature(us, statesObj)
        // geoAlbersUsa clips to the US regions and lays the map out cleanly inside
        // the fixed 960x600 viewBox.
        const proj = geoAlbersUsa().fitSize([W, H], states)
        const path = geoPath(proj)

        gStates
          .selectAll('path.state')
          .data(states.features)
          .join('path')
          .attr('class', 'state')
          .attr('d', (d) => path(d as GeoPermissibleObjects))
        gStates
          .append('path')
          .attr('class', 'nation')
          .attr('d', path(topo.mesh(us, statesObj, (a, b) => a !== b) as GeoPermissibleObjects))

        let current: AboutMapLocation | null = null

        const positionPopup = (loc: AboutMapLocation) => {
          const xy = coords.get(loc)
          if (!xy) return
          const svgEl = document.getElementById('us-map') as SVGSVGElement | null
          if (!svgEl) return
          const vb = svgEl.viewBox.baseVal
          const r = svgEl.getBoundingClientRect()
          const cr = canvas.getBoundingClientRect()
          const scale = r.width / vb.width
          const px = r.left - cr.left + (xy[0] - vb.x) * scale
          const py = r.top - cr.top + (xy[1] - vb.y) * scale
          const halfW = POPUP_W / 2
          const popLeft = Math.max(halfW + 6, Math.min(cr.width - halfW - 6, px))
          const below = py < cr.height * 0.4
          popup.style.left = popLeft + 'px'
          popup.style.top = py + 'px'
          popup.style.transform = below ? 'translate(-50%, 20px)' : 'translate(-50%, calc(-100% - 20px))'
          popup.style.setProperty('--arrow', px - (popLeft - halfW) + 'px')
          popup.classList.toggle('below', below)
        }
        const closePopup = () => {
          current = null
          popup.classList.remove('open')
          gMarks.selectAll('.mk').classed('is-active', false)
        }
        const openPopup = (loc: AboutMapLocation) => {
          current = loc
          gMarks.selectAll('.mk').classed('is-active', (d) => d === loc)
          popup.className = 'loc-popup k-' + loc.type
          popup.innerHTML = buildPopup(loc)
          popup.querySelector('.lp-close')?.addEventListener(
            'click',
            (e) => {
              e.stopPropagation()
              closePopup()
            },
            { signal },
          )
          positionPopup(loc)
          frames.add(requestAnimationFrame(() => popup.classList.add('open')))
        }

        const coords = new Map<AboutMapLocation, [number, number]>()
        locations.forEach((loc) => {
          const p = proj(loc.coord)
          if (!p) return
          coords.set(loc, p)
          const g = gMarks
            .append('g')
            .attr('class', 'mk ' + loc.type)
            .attr('transform', `translate(${p[0]},${p[1]})`)
            .datum(loc)
          if (loc.type === 'wh') {
            g.append('circle').attr('class', 'ring').attr('r', 9)
            g.append('circle').attr('class', 'dot').attr('r', 4.2)
            g.append('circle').attr('class', 'hit').attr('r', 12).attr('fill', 'transparent')
          } else {
            g.append('circle').attr('class', 'ring').attr('r', 16)
            g.append('circle').attr('class', 'mk-pinring').attr('r', 13)
            g.append('circle')
              .attr('class', 'dot')
              .attr('r', loc.type === 'store' ? 9 : 7)
            const label = (loc.type === 'hq' ? 'Legal HQ · ' : 'Shop · ') + loc.city + ', ' + loc.state
            const chip = g.append('g').attr('class', 'mk-chip')
            const tx = chip
              .append('text')
              .attr('class', 'mk-chip-tx')
              .attr('text-anchor', 'middle')
              .attr('dy', '0.34em')
              .text(label)
            const txNode = tx.node()
            const w = (txNode ? txNode.getComputedTextLength() : label.length * 7) + 24
            chip
              .insert('rect', 'text')
              .attr('class', 'mk-chip-bg')
              .attr('x', -w / 2)
              .attr('y', -11)
              .attr('rx', 5)
              .attr('width', w)
              .attr('height', 22)
            chip.attr('transform', 'translate(0,-26)')
          }
          g.node()?.addEventListener(
            'click',
            (e) => {
              e.stopPropagation()
              openPopup(loc)
            },
            { signal },
          )
        })

        canvas.addEventListener('click', closePopup, { signal })
        document.addEventListener(
          'keydown',
          (e) => {
            if (e.key === 'Escape') closePopup()
          },
          { signal },
        )
        window.addEventListener(
          'resize',
          () => {
            if (current) positionPopup(current)
          },
          { signal },
        )
      } catch {
        if (mapHint) mapHint.textContent = 'Map could not load.'
      }
    }

    const start = () => {
      if (started) return
      started = true
      countUp()
      void buildMap()
    }

    let io: IntersectionObserver | null = null
    if (hasIO) {
      io = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) {
              start()
              io?.disconnect()
            }
          }),
        { threshold: 0.3 },
      )
      io.observe(section)
    } else if (section.offsetParent !== null) {
      // No IntersectionObserver: build only when the section is actually shown.
      start()
    }

    return () => {
      disposed = true
      io?.disconnect()
      controller.abort()
      timers.forEach((id) => clearTimeout(id))
      frames.forEach((id) => cancelAnimationFrame(id))
    }
  }, [pathname, locations])

  return null
}
