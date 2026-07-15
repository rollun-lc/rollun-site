/**
 * Product catalog data (Story 5.2 — product card with image slider).
 *
 * A typed static source for the Catalog product cards, ported VERBATIM from the
 * `PRODUCTS` object in the two Handoff prototypes:
 *   desktop → rollun_handoff/rollun-web-site/project/Catalog.html        (~line 1366)
 *   mobile  → rollun_handoff/rollun-web-site/project/Catalog Mobile.html (~line 661)
 * (both prototypes carry the identical `PRODUCTS`).
 *
 * This is a SEPARATE module from `content/catalog.ts` (Global `CatalogContent`):
 * it mirrors a FUTURE Payload COLLECTION `Products` (AD-7), not the page Global.
 * The shape is FLAT SERIALIZABLE DATA (strings / numbers / arrays / tuples — no
 * functions, no JSX) so the same shape can be supplied by Payload in Phase 2. The
 * reserved optional `sku` / `externalId` are the seam to the Phase 4 product feed.
 *
 * `imgs` holds the prototype file NAMES only — Phase 1 renders `Photo N`
 * placeholders (N = `imgs.length`); real product photos arrive later.
 *
 * Marketplace chips on the card are the first two runtime-derived offers
 * (`buildOffers(p, line).slice(0, 2)` — invariantly `amazon`,`ebay` for BOTH
 * lines; Walmart is only the 3rd auto offer, sliced off). That derivation lives
 * in the SERVER-ONLY `src/lib/offers.ts` (Story 5.3, AD-9) — offers are NOT a
 * field here; this module holds only the flat product data.
 */

/** The four product categories that back the Catalog line containers. */
export type ProductCategory = 'tires' | 'oils' | 'elec' | 'health'

/** A single `[label, value]` specification row. */
export type ProductSpec = [label: string, value: string]

/** One product — flat serializable, compatible with a future Payload `Products`
 *  collection (AD-7). `sku` / `externalId` are reserved seams to the Phase 4 feed. */
export type Product = {
  brand: string
  domain: string
  name: string
  imgs: string[]
  rating: number
  reviews: number
  specs: ProductSpec[]
  fits: string[]
  desc: string
  /** Real product photos (public paths). When present, the card slider / quick-view
   *  gallery render these in place of the `Photo N` placeholders (index-aligned to `imgs`). */
  photos?: string[]
  /** Direct marketplace product URLs (override the derived search URL when set). */
  amazon?: string
  ebay?: string
  /** Real marketplace prices (override the derived `priceFor` when set). */
  price?: string
  ebayPrice?: string
  /** Product not listed on Walmart — drop the derived Walmart offer. */
  noWalmart?: boolean
  /** Sold on request (health line): show a "Contact to buy" CTA instead of marketplace offers. */
  contact?: boolean
  /** Real brand logo (public path) — overrides the derived favicon. */
  logo?: string
  /** Reserved seams to the Phase 4 product feed (not used in Story 5.2). */
  sku?: string
  externalId?: string
}

// Shared image-name sets from the prototype (drive the slide COUNT).
const TIRE = ['cat-tires.png', 'cat-parts.png', 'mototou-product-reflectors.jpg']
const OIL = ['cat-oils.png', 'cat-parts.png', 'mototou-product-filter.jpg']
const ELEC = ['cat-electrical.png', 'mototou-product-reflectors.jpg', 'cat-parts.png']

// Real public-path photo sets for the products that ship without a dedicated
// product shoot — index-aligned to TIRE/OIL/ELEC so the card slider and quick-view
// gallery render actual category imagery instead of the grey "Photo N" placeholder.
const TIRE_PHOTOS = ['/cat-tires.png', '/cat-parts.png', '/mototou-product-reflectors.jpg']
const OIL_PHOTOS = ['/cat-oils.png', '/cat-parts.png', '/mototou-product-filter.jpg']
const ELEC_PHOTOS = ['/cat-electrical.png', '/mototou-product-reflectors.jpg', '/cat-parts.png']

/** The Catalog product set — VERBATIM from the prototypes' `PRODUCTS` (3 each). */
export const PRODUCTS: Record<ProductCategory, Product[]> = {
  tires: [
    {
      brand: 'Dunlop',
      domain: 'dunlop.com',
      name: 'D404 Rear Motorcycle Tire 170/80-15 (77H) Black Wall',
      imgs: TIRE,
      rating: 4.7,
      reviews: 1827,
      photos: ['/products/dunlop-d404-1.webp', '/products/dunlop-d404-2.jpg', '/products/dunlop-d404-3.webp'],
      logo: '/products/dunlop-logo.png',
      amazon: 'https://www.amazon.com/Dunlop-D404-Motorcycle-80-15-Black/dp/B000GZDUHO/',
      price: '$148.98',
      ebay: 'https://www.ebay.com/itm/277429574555',
      ebayPrice: '$180.99',
      noWalmart: true,
      specs: [
        ['Brand', 'Dunlop'],
        ['Size', '170/80-15'],
        ['Rim Size', '15 in'],
        ['Load Index', '77'],
        ['Speed Rating', 'H'],
        ['Load Capacity', '908 lb'],
        ['Tread', 'Symmetrical'],
        ['Condition', 'New'],
      ],
      fits: ['Older bikes & cruisers', 'Wide fitment range', 'Rear position', 'DOT-approved'],
      desc: 'Expanded size range fits a wide variety of older bikes and cruisers. Tread compound delivers an excellent balance of mileage and grip.',
    },
    {
      brand: 'Dunlop',
      domain: 'dunlop.com',
      name: 'Geomax MX33 Tire',
      imgs: TIRE,
      photos: TIRE_PHOTOS,
      rating: 4.8,
      reviews: 389,
      specs: [
        ['Part #', '45234080'],
        ['Size', '110/90-19'],
        ['Type', 'Motocross'],
        ['Compound', 'Soft–Intermediate'],
        ['Position', 'Rear'],
        ['Condition', 'New'],
      ],
      fits: ['Most 250cc–450cc MX bikes', 'Honda CRF250R / CRF450R', 'Yamaha YZ250F / YZ450F', 'KTM SX-F range'],
      desc: 'Race-proven motocross tire engineered for soft-to-intermediate terrain with excellent bite and control.',
    },
    {
      brand: 'Bridgestone',
      domain: 'bridgestone.com',
      name: 'Battlax BT46 Tire',
      imgs: TIRE,
      photos: TIRE_PHOTOS,
      rating: 4.7,
      reviews: 156,
      specs: [
        ['Part #', '12612'],
        ['Size', '120/70-17'],
        ['Type', 'Sport-touring'],
        ['Position', 'Front'],
        ['Load/Speed', '58W'],
        ['Condition', 'New'],
      ],
      fits: ['Kawasaki Ninja 650', 'Honda CB650R', 'Yamaha MT-07', 'Suzuki SV650'],
      desc: 'Bias sport-touring tire delivering dependable grip in dry and wet, with long, even wear.',
    },
  ],
  oils: [
    {
      brand: 'Motul',
      domain: 'motul.com',
      name: '7100 10W-50 4T Full-Synthetic Engine Oil',
      imgs: OIL,
      rating: 4.9,
      reviews: 512,
      photos: ['/products/motul-7100-4l.webp', '/products/motul-7100-1l-back.jpg', '/products/motul-7100-newdesign.jpg'],
      amazon: 'https://www.amazon.com/Motul-7100-10w50-Synthetic-Liter/dp/B00CVT5UQM/',
      price: '$30.78',
      ebay: 'https://www.ebay.com/sch/i.html?_nkw=Motul+7100+10W-50+4T+4L',
      ebayPrice: '$77.45',
      noWalmart: true,
      specs: [
        ['Part #', '104092'],
        ['Type', 'Full synthetic'],
        ['Viscosity', '10W-50'],
        ['Volume', '1 L / 4 L'],
        ['Spec', 'JASO MA2 · API SP · Ester'],
        ['Condition', 'New'],
      ],
      fits: ['All 4-stroke motorcycles', 'Wet-clutch applications', 'Road / off-road / adventure'],
      desc: '100% synthetic ester-based 4-stroke oil for maximum engine and gearbox protection. 1 L at $30.78 or 4 L at $77.45.',
    },
    {
      brand: 'Maxima',
      domain: 'maximausa.com',
      name: 'Extra4 20W-50 Engine Oil',
      imgs: OIL,
      photos: OIL_PHOTOS,
      rating: 4.6,
      reviews: 178,
      specs: [
        ['Part #', '35901'],
        ['Type', 'Synthetic blend'],
        ['Viscosity', '20W-50'],
        ['Volume', '1 L'],
        ['Use', '4-stroke'],
        ['Condition', 'New'],
      ],
      fits: ['V-twin & cruiser engines', 'Air-cooled 4-stroke', 'High-temperature use'],
      desc: 'Premium synthetic-blend oil formulated for hot-running 4-stroke and V-twin engines.',
    },
    {
      brand: 'Bel-Ray',
      domain: 'belray.com',
      name: 'Gear Saver 80W-90',
      imgs: OIL,
      photos: OIL_PHOTOS,
      rating: 4.7,
      reviews: 97,
      specs: [
        ['Part #', '99250'],
        ['Type', 'Gear oil'],
        ['Viscosity', '80W-90'],
        ['Volume', '1 L'],
        ['Spec', 'API GL-5'],
        ['Condition', 'New'],
      ],
      fits: ['Manual transmissions', 'Final-drive gearboxes', 'Shaft-drive models'],
      desc: 'High-film-strength gear oil that protects against pitting and wear under shock load.',
    },
  ],
  elec: [
    {
      brand: 'James Gaskets',
      domain: 'jamesgaskets.com',
      name: 'Carb Rebuild Kit JGI-2700688 — Keihin CV Carb, Harley Big Twin & XL',
      imgs: ['jg1', 'jg2'],
      rating: 4.7,
      reviews: 143,
      photos: ['/products/james-gasket-1.webp', '/products/james-gasket-2.webp'],
      amazon: 'https://www.amazon.com/JAMES-GASKET-KEIHIN-CARB-88-06/dp/B000GTY2Y0/',
      price: '$55.52',
      ebay: 'https://www.ebay.com/itm/277457588187',
      ebayPrice: '$59.48',
      noWalmart: true,
      specs: [
        ['Part #', '27006-88'],
        ['Brand', 'James Gaskets'],
        ['Mfr', 'James Gasket'],
        ['UPC', '727270417818'],
        ['Fitment', 'Keihin CV carb'],
        ['Condition', 'New'],
      ],
      fits: ['Harley-Davidson Big Twin', 'Harley-Davidson Sportster XL', 'Keihin CV carburetors', '1988–2006 models'],
      desc: 'Complete Keihin CV carburetor rebuild kit with genuine James gaskets, seals and O-rings for Harley Big Twin and XL models.',
    },
    {
      brand: 'Badlands',
      domain: 'badlandsmoto.com',
      name: 'Plug-In Load Equalizer',
      imgs: ELEC,
      photos: ELEC_PHOTOS,
      rating: 4.4,
      reviews: 88,
      specs: [
        ['Part #', 'ILL-02'],
        ['Function', 'LED signal fix'],
        ['Connector', 'OEM plug'],
        ['Fit', 'Universal'],
        ['Condition', 'New'],
      ],
      fits: ['LED turn-signal conversions', 'Most metric cruisers', 'Harley OEM connectors'],
      desc: 'Plug-and-play equalizer that corrects hyper-flash when switching to LED signals.',
    },
    {
      brand: 'Custom Dynamics',
      domain: 'customdynamics.com',
      name: 'ProBEAM LED Bulb',
      imgs: ELEC,
      photos: ELEC_PHOTOS,
      rating: 4.8,
      reviews: 131,
      specs: [
        ['Part #', 'PB-1157-AW'],
        ['Type', 'Signal/brake'],
        ['Color', 'Red'],
        ['Fit', 'Plug-and-play'],
        ['Condition', 'New'],
      ],
      fits: ['1157 bulb sockets', 'Harley front/rear signals', 'Touring & Softail'],
      desc: 'High-output LED bulb upgrade with brighter, faster response than incandescent.',
    },
  ],
  health: [
    {
      brand: 'Mueller',
      domain: 'muellersportsmed.com',
      name: 'Adjustable Support Brace',
      imgs: ['m1', 'm2', 'm3'],
      rating: 4.5,
      reviews: 1203,
      contact: true,
      photos: ['/products/mueller-brace-1.jpg', '/products/mueller-brace-2.jpg', '/products/mueller-brace-3.jpg'],
      specs: [
        ['Brand', 'Mueller'],
        ['Sizes', 'S: 56–86 cm · Reg: 71–127 cm'],
        ['Material', 'Natural rubber latex'],
        ['Closure', 'Front'],
        ['Origin', 'Made in China'],
        ['Condition', 'New'],
      ],
      fits: [
        'Relieves lower-back pain without restricting movement',
        'Steel springs support weak or injured backs',
        '9" main elastic band for broad support',
        '4" outer straps for adjustable tension',
        'Tapered unisex fit, front closure',
      ],
      desc: 'The Mueller Adjustable Back Brace provides firm support to help relieve lower back pain without restricting movement. Ideal for back strains, sprains, and moderate disc and arthritic conditions. Lightweight, breathable fabric for comfortable all-day wear.',
    },
    {
      brand: 'Optimum Nutrition',
      domain: 'optimumnutrition.com',
      name: 'Opti-Men Multi-Vitamin for Active Men',
      imgs: ['om1', 'om2'],
      rating: 4.7,
      reviews: 5821,
      contact: true,
      photos: ['/products/optimen-150.webp', '/products/optimen-90.webp'],
      specs: [
        ['Brand', 'Optimum Nutrition'],
        ['Form', 'Tablets'],
        ['Size', '90 tablets · 30 servings'],
        ['Serving', '3 tablets'],
        ['Type', 'Multivitamin'],
        ['Condition', 'New'],
      ],
      fits: [
        'Supports cellular energy & metabolism',
        'Supports muscle health',
        'Supports immunity',
        '30+ active ingredients in 4 blends',
        'Free-form amino acids + vitamins A, C, E',
      ],
      desc: 'OPTI-MEN is more than a multi — it’s a nutrient optimization system providing 30+ active ingredients in 4 blends designed to support the needs of active men. Each 3-tablet serving delivers free-form amino acids, antioxidant vitamins A, C and E, and essential minerals. A food supplement with vitamins, minerals and amino acids; not a substitute for a varied diet. Do not exceed the recommended daily dose. Keep out of reach of children.',
    },
    {
      brand: 'Optimum Nutrition',
      domain: 'optimumnutrition.com',
      name: 'Opti-Women Multi-Vitamin for Active Women',
      imgs: ['ow1'],
      rating: 4.8,
      reviews: 6740,
      contact: true,
      photos: ['/products/optiwomen-60.webp'],
      specs: [
        ['Brand', 'Optimum Nutrition'],
        ['Form', 'Vcaps capsules'],
        ['Size', '60 capsules · 30 servings'],
        ['Serving', '2 capsules'],
        ['Calcium', '150 mg / serving'],
        ['Condition', 'New'],
      ],
      fits: [
        '22 vitamins & minerals',
        'Supports cellular energy & metabolism',
        'Supports immune health',
        'Supports muscle & bone health',
        'Vegetarian Society approved Vcaps',
      ],
      desc: 'OPTI-WOMEN is more than a multi — it’s a Nutrient Optimization System providing 22 vitamins and minerals designed to support the nutrient needs of active women. Each 2-capsule serving delivers wide-reaching nutrient support in Vegetarian Society approved Vcaps, with 150 mg of calcium per serving. A food supplement with vitamins and minerals; not a substitute for a varied diet.',
    },
  ],
}
