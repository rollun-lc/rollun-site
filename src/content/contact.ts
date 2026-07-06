/**
 * Contact content atoms (Story 6.3).
 *
 * The SINGLE typed home (AD-7/AD-14) of every static string the Contact page
 * (`/contact`) renders in its Hero (01) and Map (03) sections — ported VERBATIM
 * from the two Handoff prototypes:
 *   desktop → rollun_handoff/rollun-web-site/project/Contact.html
 *   mobile  → rollun_handoff/rollun-web-site/project/Contact Mobile.html
 *
 * The page (`app/(site)/contact/page.tsx`) and every section component in
 * `components/contact/*` read from THIS module. The shape is FLAT SERIALIZABLE
 * DATA (strings / arrays / objects — no functions, no JSX) so a future Payload
 * Global `ContactContent` (Phase 2) can supply the very same shape (AD-7). The
 * inline form/info card is Epic 2's `ContactInline` and does NOT read this
 * module — it keeps its own content atoms (`contact-form.ts`/`contact-info.ts`).
 *
 * AD-13 (start-src typo, reproduced VERBATIM, NOT fixed): `map.initialSrc` is a
 * standalone literal whose query reads `q=53%2F27%20Aldine…` — it deliberately
 * does NOT match `map.tabs[0].q` (`5327 Aldine…`). On load, tab 0 is `active`
 * but the iframe shows the typo; clicking tab 0 rebuilds the URL through
 * `encodeURIComponent(tabs[0].q)` and "corrects" it to `5327 Aldine…` — exactly
 * the prototype behaviour. Do NOT collapse `initialSrc` to `tabs[0].q`.
 *
 * Story 7.1: the passport atoms (the hero's opening hours, the two map tabs'
 * addresses) moved to `SiteSettings` (their single home, AD-14). `buildContactContent(s)`
 * composes `hero.intro` (code prose + `hours.contact`) and each `map.tabs[].addr/q`
 * from the passport addresses — reproducing the deliberate divergences verbatim
 * (tab[1] `addr` has NO comma between city and state; `q` does). The tab labels,
 * `map.eyebrow`/`title`, and the `initialSrc` typo literal stay code-owned (AD-6/AD-13).
 */
import type { ContactContent as ContactContentGlobal, SiteSetting } from '@/payload-types'
import { registeredMapQuery, shopAddressInline } from '@/lib/site-settings-format'

/** One map location tab: `label` (eyebrow) + `addr` (shown line) + `q` (the
 *  Google-Maps query rebuilt through `encodeURIComponent` on click). */
export type ContactMapTab = { label: string; addr: string; q: string }

/** The full Contact content contract — the page is a pure function of this. */
export type ContactContent = {
  hero: { eyebrow: string; title: string; intro: string }
  map: { eyebrow: string; title: string; initialSrc: string; tabs: ContactMapTab[] }
}

/**
 * Build the Contact content by composing the `ContactContent` Payload global (🟡
 * editable section headings) with the `SiteSettings` passport (the hero intro
 * hours + the two map tabs' addresses, AD-14) and code-owned presentation. The
 * hero/map heading slots come from `c`; the passport-composed intro/addresses and
 * the deliberate `initialSrc` typo literal stay code-owned (AD-6/AD-13). The page
 * (RSC) calls this with the resolved global + settings.
 */
export const buildContactContent = (c: ContactContentGlobal, s: SiteSetting): ContactContent => ({
  hero: {
    eyebrow: c.hero.eyebrow,
    title: c.hero.title,
    // Code-owned prose sentence; only the trailing hours come from the passport.
    intro: `Wholesale, partnership, and marketplace operations. Monday to Friday from ${s.hours.contact}.`,
  },
  map: {
    eyebrow: c.map.eyebrow,
    title: c.map.title,
    // AD-13: verbatim typo literal — `53%2F27` ≠ tabs[0].q (`5327`). NOT fixed.
    initialSrc:
      'https://maps.google.com/maps?q=53%2F27%20Aldine%20Mail%20Route%20Rd%2C%20Houston%2C%20TX%2077039&z=13&output=embed',
    tabs: [
      {
        label: 'Shop and return center',
        addr: shopAddressInline(s),
        q: shopAddressInline(s),
      },
      {
        label: 'Only for legal purposes',
        // AD-13: `addr` has NO comma between city and state; `q` does — verbatim.
        // "Registered … —" is code-owned prose; the address atoms come from the passport.
        addr: `Registered ${s.registeredAddress.company} — ${s.registeredAddress.street}, ${s.registeredAddress.city} ${s.registeredAddress.state} ${s.registeredAddress.zip}`,
        q: registeredMapQuery(s),
      },
    ],
  },
})
