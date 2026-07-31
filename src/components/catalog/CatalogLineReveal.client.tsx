'use client'

/**
 * CatalogLineReveal (design v3) — the MOBILE "Show automotive products" /
 * "Show health products" accordion. v3 collapsed the three always-visible
 * automotive shelves into ONE shelf of representatives behind a reveal button,
 * and did the same for health, so the mobile line sections stay short.
 *
 * A leaf island in the `CatalogLineSwitcher` / `RevealOnScroll` mould: it renders
 * NOTHING (`return null`) and only wires listeners in `useEffect`, so the SSR
 * markup — button `aria-expanded="false"` + shelf `hidden` — stands as the
 * pre-hydration / no-JS state and there is no hydration mismatch.
 *
 * Two triggers, both verbatim from `Catalog Mobile.html`:
 *   - clicking a `.cat-reveal` toggles its `#reveal-<key>` shelf;
 *   - clicking a mobile `.entrance` card FORCES that line's shelf open, so the
 *     anchor jump never lands on a collapsed section.
 *
 * The label rewrites to `Show`/`Hide <key> products` on toggle (prototype
 * behaviour), so the visible string is owned here rather than by content.
 *
 * Effect is keyed on `usePathname()` and its cleanup drops every listener, so
 * SPA navigation leaves nothing bound.
 */
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function CatalogLineReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.catalog-mb .cat-reveal'))
    if (buttons.length === 0) return

    /** Toggle (or force, when `on` is given) one line's shelf. */
    function reveal(key: string, on?: boolean) {
      const btn = document.querySelector<HTMLButtonElement>(`.catalog-mb .cat-reveal[data-reveal="${key}"]`)
      const target = document.getElementById(`reveal-${key}`)
      if (!btn || !target) return

      const show = on === undefined ? target.hasAttribute('hidden') : on
      if (show) target.removeAttribute('hidden')
      else target.setAttribute('hidden', '')

      btn.setAttribute('aria-expanded', show ? 'true' : 'false')
      btn.classList.toggle('open', show)
      const label = btn.querySelector('.cr-label')
      if (label) label.textContent = `${show ? 'Hide' : 'Show'} ${key} products`
    }

    const teardowns: Array<() => void> = []

    for (const btn of buttons) {
      const key = btn.dataset.reveal
      if (!key) continue
      const onClick = () => reveal(key)
      btn.addEventListener('click', onClick)
      teardowns.push(() => btn.removeEventListener('click', onClick))
    }

    // Choosing a line from an entrance card opens that line's products.
    for (const card of Array.from(document.querySelectorAll<HTMLAnchorElement>('.catalog-mb .entrance'))) {
      const key = (card.getAttribute('href') ?? '').replace('#', '')
      if (!key) continue
      const onClick = () => reveal(key, true)
      card.addEventListener('click', onClick)
      teardowns.push(() => card.removeEventListener('click', onClick))
    }

    return () => {
      for (const t of teardowns) t()
    }
  }, [pathname])

  return null
}
