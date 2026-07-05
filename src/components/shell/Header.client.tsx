'use client'

/**
 * Site header — the first `.client.tsx` leaf island (AD-1), establishing the
 * convention. It renders BOTH the desktop and the mobile header compositions in
 * a single DOM; the visible one is chosen ONLY by CSS `@media` at 768px in
 * `shell.css` (AD-3 / NFR-2). NO width-based JS gating, no media hooks, no UA
 * sniffing here — that would cause a hydration mismatch.
 *
 * The only interactivity is the scroll listener (`scrolled` / `hide`) and the
 * active-route highlight via `usePathname()`. Nav content comes from the
 * `NAV_ITEMS` import — the island does not fetch (AD-1/AD-4).
 *
 * The 44px burger is rendered but INERT (static `aria-expanded="false"`, no
 * handler): the drawer/scrim/scroll-lock/burger-to-cross belong to Story 1.5.
 */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

import { NAV_ITEMS } from './nav-config'

export default function Header() {
  const pathname = usePathname()
  // Desktop and mobile shrink at DIFFERENT scroll thresholds in the prototype
  // (desktop >30 / >60 on /about; mobile >20), so they get independent state —
  // a single shared flag would shrink the mobile header 10px too late.
  const [dkScrolled, setDkScrolled] = useState(false)
  const [mbScrolled, setMbScrolled] = useState(false)
  const [hide, setHide] = useState(false)

  // Scroll behaviour, ported verbatim from the prototype:
  //   desktop: `scrolled` at scrollY>30 (>60 on /about); `hide` on scroll-down
  //            past y>200, removed on scroll-up or y<200.
  //   mobile:  `scrolled` at scrollY>20; NO `hide` (mobile CSS has no `.hide`).
  //   /about:  hide uses the prototype's 4px deadband to avoid jitter near y=200.
  // rAF-throttled; the pending frame is cancelled on cleanup.
  useEffect(() => {
    const dkThreshold = pathname === '/about' ? 60 : 30
    const aboutHide = pathname === '/about'
    let lastY = window.scrollY
    let ticking = false
    let raf = 0

    const update = () => {
      const y = window.scrollY
      setDkScrolled(y > dkThreshold)
      setMbScrolled(y > 20)
      if (aboutHide) {
        if (y > 200 && y > lastY + 4) setHide(true)
        else if (y < lastY - 4 || y < 200) setHide(false)
      } else {
        if (y > lastY && y > 200) setHide(true)
        else setHide(false)
      }
      lastY = y
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        raf = requestAnimationFrame(update)
      }
    }

    // Sync initial state (e.g. reload while already scrolled).
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [pathname])

  // Root matches exactly; other routes also light up on their sub-paths so the
  // nav item stays active on nested routes (e.g. /catalog/tires → CATALOG).
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`)

  return (
    <>
      {/* ── Desktop composition (visible ≥768px via shell.css) ── */}
      <header
        className={`site-header site-header--dk${dkScrolled ? ' scrolled' : ''}${
          hide ? ' hide' : ''
        }`}
      >
        <div className="header-inner">
          <Link className="logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height self-hosted logo (AD-13 pixel fidelity); next/image adds no value at this size */}
            <img src="/rollun-logo.png" alt="rollun" width={1106} height={224} />
          </Link>
          <nav className="nav">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={active ? 'active' : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>

      {/* ── Mobile composition (visible <768px via shell.css) ── */}
      <header
        className={`site-header site-header--mb${mbScrolled ? ' scrolled' : ''}`}
      >
        <div className="header-inner">
          <Link className="logo" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element -- fixed-height self-hosted logo (AD-13 pixel fidelity); next/image adds no value at this size */}
            <img src="/rollun-logo.png" alt="rollun" width={1106} height={224} />
          </Link>
          {/* INERT in 1.3 — drawer toggle lands in Story 1.5. */}
          <button
            className="burger"
            type="button"
            aria-label="Open menu"
            aria-expanded="false"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>
    </>
  )
}
