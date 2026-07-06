/**
 * About content atoms (Story 4.1).
 *
 * The SINGLE home (AD-14) of every static string the About page (`/about`)
 * renders — ported VERBATIM from the two Handoff prototypes:
 *   desktop → rollun_handoff/rollun-web-site/project/About Us.html
 *   mobile  → rollun_handoff/rollun-web-site/project/About Us Mobile.html
 *
 * The page (`app/(site)/about/page.tsx`) and every section RSC in
 * `components/about/*` read from THIS module, never from a forked copy, so
 * wording changes in one place. The shape is FLAT SERIALIZABLE DATA (strings /
 * numbers / arrays / objects — no functions, no JSX) so a future Payload Global
 * `AboutContent` (Phase 2) can supply the very same shape (AD-7). Presentation-
 * only details — the section SVG icons, the KeepToShip diagram, the map/coin/
 * people scaffold containers, the social icons — live in the components' JSX.
 *
 * Desktop↔mobile text differences are captured as EXPLICIT `{ dk, mb }` fields
 * (never runtime logic), including the intentional AD-13 defects (the CTA hours
 * differ between the two prototypes; the Automation "80%" label differs; the
 * mobile-only stat note "Internal benchmark").
 */

/** A desktop/mobile pair for a string that differs between the two prototypes. */
export type AboutVariant = { dk: string; mb: string }

/** One run of a heading/inline-rich string. `accent` colours it orange
 *  (`.or-txt`); `hand` renders it in the handwritten Caveat accent (`--font-hand`,
 *  `.love-word`); `strong` bolds it (`<strong>`); `lineBreak` inserts a `<br>`
 *  before the run. */
export type AboutSegment = {
  text: string
  accent?: boolean
  hand?: boolean
  strong?: boolean
  lineBreak?: boolean
}

/** A Snapshot (02) focus card. Desktop groups the first two under
 *  "Distribution" and the third under "Technology"; mobile lists all three. */
export type AboutFocusCard = { tag: AboutVariant; title: string; text: AboutVariant }

/** An Approach (03) principle: number + heading + body (identical in both). */
export type AboutPrinciple = { num: string; title: string; text: string }

/** One Automation (04) counter — FINAL static values (Story 4.4 adds count-up).
 *  `display` is the formatted final string; `note` is mobile-only. */
export type AboutStat = { value: number; display: string; unit: string; label: AboutVariant; note?: string }

/** A Team (07) mosaic tile. `.tr` ships no `src` (solid `#ea7b07`, AD-13). */
export type AboutTeamTile = { pos: 'tl' | 'tr' | 'bl' | 'br'; src?: string; alt?: string; objectPosition?: string }

/** The full About content contract — the page is a pure function of this. */
export type AboutContent = {
  hero: {
    eyebrowMobile: string
    headline: AboutSegment[]
    subheading: string
    para: AboutVariant
    ctaPrimary: string
    ctaSecondary: string
  }
  snapshot: {
    title: AboutVariant
    intro: AboutVariant
    groupLabels: { distribution: string; technology: string }
    cards: AboutFocusCard[]
  }
  approach: {
    title: string
    principles: AboutPrinciple[]
  }
  automation: {
    eyebrowMobile: string
    heading: AboutSegment[]
    lede: string
    stats: AboutStat[]
  }
  keeptoship: {
    tag: string
    heading: AboutSegment[]
    paragraphs: string[]
    ctaHeading: string
    ctaText: string
    ctaLabel: string
    ctaHref: string
    visual: {
      label: string
      analogy: AboutSegment[]
      compare: { name: string; role: string; verb: string; accent?: boolean }[]
      note: AboutSegment[]
    }
  }
  usPresence: {
    eyebrowMobile: string
    title: string
    intro: AboutVariant
    liveCount: number
    liveLabel: string
    mapHint: AboutSegment[]
  }
  team: {
    tilesDesktop: AboutTeamTile[]
    tilesMobile: AboutTeamTile[]
    heading: AboutSegment[]
    quote: string
    ceoName: string
    ceoRole: string
    ceoPhoto: string
  }
  cta: {
    heading: string
    sub: string
    hoursPrefix: string
    /** AD-13: the two prototypes disagree on the hours spacing — reproduced. */
    hours: AboutVariant
  }
}

/** The single About content instance (AD-14) consumed by the page + sections. */
export const aboutContent: AboutContent = {
  hero: {
    eyebrowMobile: 'Who we are',
    headline: [
      { text: 'Why ' },
      { text: 'partners', accent: true },
      { text: ' choose ' },
      { text: 'Rollun', accent: true },
    ],
    subheading: 'A traditional business mindset powered by modern operations and automation.',
    para: {
      dk: 'Rollun is a U.S.‑based LLC registered in Sheridan, Wyoming, and founded by a Ukrainian team. Since April 2015, we have been building automated e‑commerce distribution that helps products reach customers through leading marketplaces — and creating our own automated solutions along the way.',
      mb: "Rollun is a U.S.-based LLC registered in Sheridan, Wyoming, founded by a Ukrainian team. Since April 2015 we've built automated e-commerce distribution that helps products reach customers through leading marketplaces.",
    },
    ctaPrimary: 'Contact us',
    ctaSecondary: 'Explore our work',
  },
  snapshot: {
    title: { dk: 'Who we are and what we do', mb: 'Who we are & what we do' },
    intro: {
      dk: 'We are a small, focused team running a U.S.‑based e‑commerce distribution business. Three product lines, one operating playbook, all built on technology we own.',
      mb: 'A small, focused team running a U.S.-based e-commerce distribution business — three product lines, one operating playbook, all built on technology we own.',
    },
    groupLabels: { distribution: 'Distribution', technology: 'Technology' },
    cards: [
      {
        tag: { dk: '01 · Distribution line', mb: '01 · Category' },
        title: 'Automotive parts & accessories',
        text: {
          dk: 'Motorcycle and automotive products — oils & fluids, electrical & electronic systems, tires & wheels, batteries.',
          mb: 'Motorcycle and automotive products — oils & fluids, electrical systems, tires & wheels, batteries.',
        },
      },
      {
        tag: { dk: '02 · Distribution line', mb: '02 · Category' },
        title: 'Health products',
        text: {
          dk: 'Medical supplies and wellness — orthopedic supports, pain relief & recovery rubs, supplements, energy & focus.',
          mb: 'Medical supplies and wellness — orthopedic supports, pain relief & recovery rubs, supplements, energy & focus.',
        },
      },
      {
        tag: { dk: '03 · IT Solutions', mb: '03 · Platform' },
        title: 'AI‑driven automation',
        text: {
          dk: 'Internal tools developed, used, and tested by our own team — then offered to partners.',
          mb: 'Internal tools developed, used, and tested by our own team — then offered to partners.',
        },
      },
    ],
  },
  approach: {
    title: 'Our approach',
    principles: [
      {
        num: '01',
        title: 'Integrity above all',
        text: 'Honest, transparent, ethical. Partners, suppliers, customers — the same standard for everyone, every time.',
      },
      {
        num: '02',
        title: 'Innovation as our growth engine',
        text: 'Automation, analytics, and AI. We grow by sharpening the system — not by adding headcount.',
      },
      {
        num: '03',
        title: 'Efficiency, long‑term focus',
        text: 'Durable value over quick wins. Every decision is weighed against a multi‑year horizon.',
      },
      {
        num: '04',
        title: 'Small, stable team',
        text: 'Led by an experienced CEO — an expert in business development and operations, with the team to match.',
      },
    ],
  },
  automation: {
    eyebrowMobile: 'Automation',
    heading: [{ text: 'Automation that improves ' }, { text: 'reliability', accent: true }],
    lede: 'We scale through innovation and technology — not by expanding headcount. Internal tools and process automation reduce operational costs and keep execution consistent, year after year.',
    stats: [
      {
        value: 50000,
        display: '50,000',
        unit: '+',
        label: {
          dk: 'Items in inventory handled by a small team',
          mb: 'Items in inventory handled by a small team',
        },
      },
      {
        value: 80,
        display: '80',
        unit: '%',
        label: { dk: 'Less manual work than before', mb: 'Operations without human work' },
      },
      {
        value: 30,
        display: '30',
        unit: '%',
        label: { dk: 'Cost savings via automation', mb: 'Cost savings via automation' },
        note: 'Internal benchmark',
      },
    ],
  },
  keeptoship: {
    tag: 'Our technological startup',
    heading: [{ text: 'KeepToShip', accent: true }, { text: 'Logistics, distributed.', lineBreak: true }],
    paragraphs: [
      'KeepToShip is an AI‑powered logistics platform that connects online sellers with a distributed network of independent keep‑and‑ship partners.',
      'Our Uber‑like system replaces complex centralized logistics by storing products closer to customers — enabling faster delivery, lower shipping costs, and scalable fulfillment without expensive warehouses.',
    ],
    ctaHeading: 'Want to work with us?',
    ctaText: 'Invest, store products in your area, or use KeepToShip in your free time.',
    ctaLabel: 'Learn more',
    ctaHref: 'https://keeptoship.com/',
    visual: {
      label: '// KeepToShip · model',
      analogy: [
        { text: 'Think of it as an ' },
        { text: 'Airbnb', strong: true },
        { text: ' or ' },
        { text: 'Uber', strong: true },
        { text: ' — but for fulfillment.' },
      ],
      compare: [
        { name: 'Uber', role: 'Driver', verb: 'to ride' },
        { name: 'Airbnb', role: 'Host', verb: 'to stay' },
        { name: 'KeepToShip', role: 'Independent shipper', verb: 'to keep & ship', accent: true },
      ],
      note: [
        { text: 'Partners keep stock within ' },
        { text: '~10 km', strong: true },
        { text: ' of buyers — a nationwide micro-fulfillment network instead of distant mega-warehouses.' },
      ],
    },
  },
  usPresence: {
    eyebrowMobile: 'Across the country',
    title: 'US presence',
    intro: {
      dk: 'Registered in Wyoming, operating from Texas, shipping across the country through a network of partner nodes. Hover any pin to see the details.',
      mb: 'Registered in Wyoming, operating from Texas, shipping nationwide through a network of partner nodes.',
    },
    liveCount: 30,
    liveLabel: 'ship-from locations',
    mapHint: [
      { text: 'Tap any point to see the ' },
      { text: 'supplier & warehouse address', strong: true },
      { text: ' we ship from.' },
    ],
  },
  team: {
    tilesDesktop: [
      { pos: 'tl', src: '/team-shop.jpg', alt: 'Rollun team member in the shop', objectPosition: '48% 26%' },
      { pos: 'tr' },
      { pos: 'bl', src: '/team-support.jpg', alt: 'Rollun customer-support specialist on a headset', objectPosition: '50% 24%' },
      { pos: 'br', src: '/team-storefront.jpg', alt: 'Rollun team in front of the Texas storefront', objectPosition: '50% 38%' },
    ],
    tilesMobile: [
      { pos: 'tl', src: '/team-tile-1.png', alt: '' },
      { pos: 'tr' },
      { pos: 'bl', src: '/team-photo.jpg', alt: '' },
      { pos: 'br', src: '/team-tile-4.jpg', alt: '', objectPosition: '70% 35%' },
    ],
    heading: [{ text: 'We ' }, { text: 'love', hand: true }, { text: 'what we do.', lineBreak: true }],
    quote:
      'A small, stable team that has worked together for years — disciplined operators on the business side, sharp engineers on the platform side. We hire slowly, invest in tooling, and let the work speak for itself.',
    ceoName: 'Natalia Gretchukha',
    ceoRole: 'CEO',
    ceoPhoto: '/ceo-photo.png',
  },
  cta: {
    heading: "Let's talk business",
    sub: 'Wholesale, partnership, and marketplace operations.',
    hoursPrefix: 'Monday to Friday from ',
    // AD-13: desktop renders "UTC +2" (with a space), mobile "UTC+2" — verbatim.
    hours: { dk: '09:00 to 21:00 UTC +2', mb: '09:00 to 21:00 UTC+2' },
  },
}
