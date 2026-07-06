/**
 * Brands content atoms (Story 6.1).
 *
 * The SINGLE home (AD-14) of every static string the Our Brands page (`/brands`)
 * renders — ported VERBATIM from the two Handoff prototypes:
 *   desktop → rollun_handoff/rollun-web-site/project/Our Brands.html
 *   mobile  → rollun_handoff/rollun-web-site/project/Our Brands Mobile.html
 *
 * The page (`app/(site)/brands/page.tsx`) and every section RSC in
 * `components/brands/*` read from THIS module, never from a forked copy. The
 * shape is FLAT SERIALIZABLE DATA (strings / arrays / objects — no functions, no
 * JSX) so a future Payload Global `BrandsContent` (Phase 2) can supply the very
 * same shape (AD-7).
 *
 * Desktop↔mobile text differences are captured as EXPLICIT `{ dk, mb }` fields
 * (never runtime logic): the brand-card actions (desktop Amazon vs mobile
 * mototou.com), the trademark facts placement (desktop brand-card block vs the
 * mobile-only Trademark section), the product-note copy, the block-1 alt text,
 * and the CTA label case (`CONTACT US` vs `Contact us`).
 */

/** A desktop/mobile pair for a string that differs between the two prototypes. */
export type BrandsVariant = { dk: string; mb: string }

/** One trademark fact row: label (`k`) + value (`v`). */
export type TmFact = { k: string; v: string }

/** A labelled link/button target. */
export type BrandLink = { label: string; href: string }

/** One Products (04) block. `paragraphs` (block 1) OR `categories` (block 2). */
export type BrandProdBlock = {
  img: string
  alt: BrandsVariant
  h3: string
  paragraphs?: string[]
  categories?: string[]
}

/** The full Brands content contract — the page is a pure function of this. */
export type BrandsContent = {
  hero: { eyebrow: string; title: string; intro: string }
  brand: {
    tag: string
    logoText: string
    status: string
    h2: string
    sub: string
    paragraphs: string[]
    /** Desktop renders these as the `.bc-trademark` block inside the brand card;
     *  the mobile-only Trademark section reuses the same `desc` + `facts`. */
    trademark: { head: string; desc: string; facts: TmFact[] }
    actions: {
      desktop: { becomePartner: BrandLink; amazon: BrandLink }
      mobile: { visit: BrandLink; becomePartner: BrandLink }
    }
  }
  story: { eyebrow: string; title: string; lead: string; paragraphs: string[]; pull: string }
  products: {
    eyebrow: string
    title: string
    blocks: BrandProdBlock[]
    /** The dark product note. `pre` differs desktop↔mobile; `strong` is wrapped
     *  in `<strong>`; `post` follows the strong fragment. */
    note: { pre: BrandsVariant; strong: string; post: string }
  }
  /** Mobile-only Trademark section (05). Facts come from `brand.trademark.facts`. */
  trademark: {
    eyebrow: string
    title: string
    desc: string
    cert: { img: string; alt: string; caption: string; enlargedAlt: string }
  }
  cta: {
    headingPre: string
    headingAccent: string
    headingPost: string
    sub: string
    ctaLabel: BrandsVariant
    ctaHref: string
  }
}

/** The single Brands content instance (AD-14) consumed by the page + sections. */
export const brandsContent: BrandsContent = {
  hero: {
    eyebrow: 'Private Label',
    title: 'Our Brands',
    intro:
      'We build and grow brands with a long-term focus on quality and customer experience — not only distribution, but products we own and stand behind.',
  },
  brand: {
    tag: 'Brand 01',
    logoText: 'MOTOTOU',
    status: 'In active development',
    h2: 'Mototou',
    sub: 'Motorcycle parts & accessories',
    paragraphs: [
      'Practical, functional motorcycle components designed for everyday reliability and long-term performance. A U.S.-registered trademark, built and refined by Rollun.',
      "Our lineup is still growing — we're actively expanding the catalog, refining materials, and tightening quality checks with our production partners.",
    ],
    trademark: {
      head: 'A U.S. registered trademark',
      desc: "MOTOTOU is a registered trademark on the Principal Register of the United States Patent and Trademark Office, owned by Rollun LC — your assurance that you're working with a genuine, protected brand.",
      facts: [
        { k: 'Registration No.', v: '5,513,305' },
        { k: 'Registered', v: 'Jul. 10, 2018' },
        { k: 'Int. Class', v: '12 — Land vehicle parts' },
        { k: 'Owner', v: 'Rollun LC (Wyoming)' },
        { k: 'First use', v: 'May 26, 2015' },
        { k: 'Register', v: 'Principal' },
      ],
    },
    actions: {
      desktop: {
        becomePartner: { label: 'BECOME A PARTNER', href: '/contact' },
        amazon: {
          label: 'SHOP MOTOTOU ON AMAZON',
          href: 'https://www.amazon.com/s?srs=76258337011&rh=p_89%3AMototou',
        },
      },
      mobile: {
        visit: { label: 'Visit mototou.com', href: 'https://mototou.com' },
        becomePartner: { label: 'Become a partner', href: '/contact' },
      },
    },
  },
  story: {
    eyebrow: 'Mototou',
    title: 'Our story',
    lead: 'MOTOTOU began with sourcing and manufacturing, focusing on accessibility and value for customers in the US. As the brand evolving, our priority shifting toward stronger standards and better control over production.',
    paragraphs: [
      "Today, MOTOTOU is not just about manufacturing — it's about quality, precision, and long-term reliability. We work closely with our production partners, improving materials, tightening specifications, and strengthening quality checks.",
      'Several new products are currently in development and refinement. We are not publicly presenting the full lineup yet. If you are interested in learning more or becoming a partner, please reach out.',
    ],
    pull: 'Our goal is simple: deliver products riders can install with confidence and use without doubt.',
  },
  products: {
    eyebrow: 'What we make',
    title: 'Our products',
    blocks: [
      {
        img: '/mototou-product-reflectors.jpg',
        alt: {
          dk: 'Mototou reflector hardware kit in branded packaging',
          mb: 'Mototou reflector hardware kit',
        },
        h3: 'Built for real-world riding',
        paragraphs: [
          'MOTOTOU focuses on practical, functional motorcycle components designed for everyday reliability. We prioritize durability, proper fitment, and straightforward installation.',
          'Every product is developed with real-world use in mind — built to perform, not just to look good.',
        ],
      },
      {
        img: '/mototou-filters.jpg',
        alt: {
          dk: 'MOTOTOU air and oil filters in branded packaging on a retail shelf',
          mb: 'MOTOTOU air and oil filters in branded packaging on a retail shelf',
        },
        h3: 'Current & upcoming categories',
        categories: [
          'Structural & replacement motorcycle parts',
          'Handlebars, grips & control components',
          'Tubes & essential riding components',
          'Small hardware & functional accessories',
        ],
      },
    ],
    note: {
      pre: {
        dk: 'MOTOTOU is a developing brand. We are actively refining our product line and expanding into new categories step by step — several products are currently undergoing testing and quality improvement. ',
        mb: 'MOTOTOU is a developing brand. We are actively refining our product line and expanding into new categories step by step. ',
      },
      strong: 'We are not publicly showcasing the full lineup yet.',
      post: ' If you are interested in distribution, retail partnership, or early access, please contact us.',
    },
  },
  trademark: {
    eyebrow: 'Registered & protected',
    title: 'A U.S. registered trademark',
    desc: "MOTOTOU is a registered trademark on the Principal Register of the United States Patent and Trademark Office, owned by Rollun LC — your assurance that you're working with a genuine, protected brand.",
    cert: {
      img: '/mototou-trademark.png',
      alt: 'MOTOTOU U.S. trademark registration certificate',
      caption: 'Tap to enlarge — USPTO Certificate of Registration',
      enlargedAlt: 'MOTOTOU trademark certificate enlarged',
    },
  },
  cta: {
    headingPre: 'Interested in ',
    headingAccent: 'Mototou',
    headingPost: '?',
    sub: "For distribution, retail partnership, or early access to new products — we'd love to hear from you.",
    ctaLabel: { dk: 'CONTACT US', mb: 'Contact us' },
    ctaHref: '/contact',
  },
}
