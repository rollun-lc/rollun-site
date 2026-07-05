/**
 * Single source of the primary site navigation (Story 1.3).
 *
 * Order and labels are ported VERBATIM from the Handoff prototype header
 * (`rollun_handoff/.../Home.html` <nav class="nav">). Prototype hrefs point at
 * per-page `*.html` files; here they map to the 6 App Router routes.
 *
 * Reused by the header nav (1.3), the footer (1.4) and the mobile drawer (1.5).
 */
export type NavItem = {
  /** Uppercase label as rendered in the prototype. */
  label: string
  /** App Router path. */
  href: string
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT US', href: '/about' },
  { label: 'CATALOG', href: '/catalog' },
  { label: 'OUR SHOPS', href: '/shops' },
  { label: 'OUR BRANDS', href: '/brands' },
  { label: 'CONTACT US', href: '/contact' },
]
