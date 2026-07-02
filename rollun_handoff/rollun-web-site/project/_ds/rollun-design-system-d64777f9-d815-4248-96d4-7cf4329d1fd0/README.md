# Rollun Design System

A working design system for **Rollun LC** — a US-based e-commerce distribution
company specializing in **automotive parts & accessories** and **health
products**. This repository holds the brand's visual foundations, reusable CSS
tokens, logo assets, preview cards, and a high-fidelity Storefront UI kit so
design agents can produce on-brand interfaces, mocks, and assets.

> **Source material provided:** one logo file — `uploads/rollun_logo_W.png`
> (the full-color `rollun` wordmark + 2×2 tile mark on white). No codebase,
> Figma, or decks were supplied. The brand colors below are sampled directly
> from that logo; typography, spacing, components, and the UI kit are an
> informed system built around the mark and the company's e-commerce category.
> See **Caveats** for what's inferred vs. given.

---

## 1. Company & Product Context

Rollun is an online distributor operating high-volume storefronts in the
powersports / automotive aftermarket and health space. The catalog is broad
(many thousands of SKUs across many brands), so the design language is built
for **density, scannability, and trust** — the priorities of a parts catalog:
fast filtering, clear fitment/compatibility, visible part numbers, stock and
shipping status, and price.

**Primary surface represented here:** an e-commerce **Storefront** (catalog →
product listing → product detail → cart). This is the natural product for the
business and the one the UI kit recreates. If Rollun has additional surfaces
(internal ops dashboard, marketplace seller tools, marketing site), they can be
added as new UI kits following the same foundations.

---

## 2. Brand Snapshot

| Token | Value | Role |
|---|---|---|
| Rollun Orange | `#EA7B08` | Primary brand / action color (sampled from wordmark) |
| Charcoal | `#54585A` | Brand neutral (sampled from wordmark) |
| Dark surface | `#2A2D2E` | Headers, footers, dark sections |
| Ink | `#1A1C1D` | Primary text |
| White | `#FFFFFF` | Page background |

The logo is **two parts**: a **2×2 grid of rounded-square tiles** (three
charcoal, one orange in the top-right) and the **lowercase `rollun` wordmark**
in charcoal, where the second letter "o" is rendered in orange. Both the mark
and the wordmark use generous, evenly-rounded corners — that rounding is the
brand's core geometric signature.

---

## 3. Content Fundamentals (Voice & Copy)

Rollun is a transactional retail brand, so copy is **practical, direct, and
confidence-building** — never playful or salesy-cute.

- **Person:** Address the customer as **"you"**; the company is **"we"** ("We
  ship same-day on in-stock orders"). Product copy is written about the part,
  not the brand.
- **Tone:** Plain, helpful, no-nonsense. Lead with the useful fact (fitment,
  stock, shipping, price) before benefits. Think "auto-parts counter pro," not
  "lifestyle brand."
- **Casing:** Sentence case for body, headings, and buttons
  (`Add to cart`, `Check fitment`). **UPPERCASE** is reserved for small
  eyebrow/label chips and section kickers (`FREE SHIPPING`, `IN STOCK`,
  `BEST SELLER`) — always short, always tracked-out.
- **Buttons / CTAs:** Verb-first and specific — `Add to cart`, `Buy it now`,
  `Check fitment`, `View details`, `Track order`. Avoid vague `Submit` / `Click
  here`.
- **Numbers & specs:** Part numbers, SKUs, OEM refs and measurements are set in
  the **mono** face so they read as precise, copy-pasteable data
  (`SKU RL-48829-BK`, `OEM 17220-RNA-A00`).
- **Microcopy examples:**
  - Stock: `In stock — ships today`, `Only 3 left`, `Backorder · 2–3 wks`
  - Trust: `30-day returns`, `Fits your 2019 Honda CRF250L`,
    `Verified buyer`
  - Empty/helper: `Enter your vehicle to see parts that fit.`
- **Emoji:** **Not used.** Status and emphasis are carried by colored chips,
  icons, and weight — never emoji.
- **Vibe:** Reliable, fast, knowledgeable. The customer should feel like they're
  buying from people who know the parts.

---

## 4. Visual Foundations

**Color & vibe.** A tight, high-contrast palette: white canvas, charcoal
structure, and **orange used sparingly as the single action/accent color**
(primary buttons, active states, sale/price highlights, the one "hot" chip).
Orange is a spice, not a sauce — if everything is orange, nothing is. Status
greens/reds/blues are muted and desaturated so they sit calmly next to the
brand orange. Backgrounds are **flat** — solid white or `--surface` (`#F6F7F7`)
panels and a charcoal (`#2A2D2E`) header/footer. **No gradients** in UI chrome
(the only acceptable gradient is a subtle image-protection scrim over photos).

**Typography.**
- **Display / headings — Archivo** (700–900): a sturdy, slightly
  industrial grotesk that echoes the geometric, confident logo. Used for hero
  text, section titles, prices.
- **Body / UI — Hanken Grotesk** (400–600): a clean humanist grotesk with
  gently rounded terminals that rhyme with the logo's rounded corners; highly
  legible at small sizes for dense catalog rows.
- **Mono — Spline Sans Mono** (400–600): SKUs, part numbers, OEM refs, specs.
- Headings use tight tracking (`-0.02em`); uppercase labels use wide tracking
  (`0.08em`). Body line-height 1.5; lead paragraphs 1.65.

**Spacing & layout.** 4px base grid. Generous gutters between catalog cards;
dense but breathable inside data rows. Content max-width ~1280px for the
storefront. Layout favors **left filter rail + product grid**, sticky header,
and a sticky buy-box on product detail. Fixed elements: top utility bar + main
nav (sticky), and the cart/buy CTA.

**Corners & cards.** Default radius **8px** (`--radius-md`) for controls and
cards; **5px** for small chips; **pill** for filter tags and status chips. Cards
are white with a **1px `--border` hairline** and a **soft, low shadow**
(`--shadow-sm`), lifting to `--shadow-md` on hover. Cards do **not** use a
colored left-border accent. Rounding everywhere is even and moderate — never
fully sharp, never pill-round on large surfaces.

**Borders & shadows.** Structure is carried primarily by **1px hairline
borders** (`#DCDEDF`) plus restrained shadows; this keeps the dense catalog
feeling crisp rather than floaty. Elevation scale: `xs → sm → md → lg`. A
dedicated **orange glow** shadow (`--shadow-orange`) is available for the
primary CTA on hover only.

**Transparency & blur.** Used sparingly: the sticky header may sit on a 92%
white with a light backdrop-blur when scrolled over content; image scrims use a
bottom-up charcoal gradient at low opacity. No frosted-glass everywhere.

**Imagery.** Product photography is **clean, well-lit, on white/neutral
backgrounds** (catalog convention) — color, true-to-life, not heavily filtered
or graded. Lifestyle/hero imagery skews **warm and slightly contrasty**
(garage, road, trail) to match the powersports energy, but always with legible
text via a scrim. No heavy grain, no duotones in product shots.

**Motion.** Subtle and quick. Transitions 120–280ms on `ease-out`. Hovers are
**fast** (120ms); page/section reveals use short fades + small upward moves
(8–12px). **No bounces, no springy overshoot, no parallax theater** — the brand
reads as efficient, so motion stays efficient.

**Interaction states.**
- **Hover:** primary buttons darken one step (`--primary` → `--primary-hover`)
  and gain the orange glow; secondary/ghost controls fill with `--surface-2`;
  cards raise shadow + show a 1px `--border-strong`.
- **Press/active:** darken a further step (`--primary-active`) and nudge
  `translateY(1px)` — a small physical "click," never a scale-down on large
  elements.
- **Focus:** 2px `--focus-ring` (orange-300) outline with a 2px offset — always
  visible for keyboard users.
- **Disabled:** `--neutral-200` fill, `--fg3` text, no shadow, `not-allowed`.

---

## 5. Iconography

- **System:** [**Lucide**](https://lucide.dev) — a consistent **line/stroke**
  icon set (≈1.75–2px stroke, rounded joins). Its rounded-but-geometric
  character matches the logo's rounded corners and the clean grotesk type. Load
  from CDN (`https://unpkg.com/lucide@latest`) or `lucide-react` in JSX kits.
- **Why a substitute:** no original Rollun icon set was provided, so Lucide is
  the documented stand-in. **Flag:** swap for the real set if one exists.
- **Style rules:** stroke icons only (no filled/duotone mixing); 20px default in
  UI, 16px inline with text, 24px for nav/feature; icon color inherits
  `currentColor` so it follows text. Orange icons only when the icon *is* the
  action accent.
- **Common icons for this domain:** `search`, `shopping-cart`, `user`, `heart`,
  `truck`, `package`, `wrench`, `shield-check`, `star`, `chevron-right`,
  `sliders-horizontal` (filters), `map-pin`, `badge-check`, `rotate-ccw`
  (returns).
- **Emoji / unicode as icons:** never. Use Lucide glyphs or the tile mark.
- **Brand mark as icon:** the 2×2 tile (`assets/rollun-mark*.png`) is the
  favicon / avatar / app-icon lockup — never redraw it; use the PNG.

---

## 6. Assets

Located in `assets/`:

| File | Use |
|---|---|
| `rollun-logo-onwhite.png` | Full-color wordmark + mark on white (original) |
| `rollun-logo.png` | Full-color wordmark + mark, **transparent** bg (light surfaces) |
| `rollun-logo-white.png` | **White** wordmark + orange accent, transparent (dark surfaces) |
| `rollun-logo-mono.png` | Single-color charcoal wordmark, transparent |
| `rollun-mark.png` | 2×2 tile mark only, color, transparent (favicon/avatar) |
| `rollun-mark-white.png` | 2×2 tile mark only, white+orange, transparent |

> Iconography is loaded from the **Lucide** CDN (not committed as files).

---

## 7. Index / Manifest

Root files:
- **`README.md`** — this document (overview, voice, visual foundations, icons).
- **`colors_and_type.css`** — all design tokens: color scales, semantic roles,
  type families & scale, radii, spacing, shadows, motion + ready-made
  `.rl-*` type classes. Import this into any artifact.
- **`SKILL.md`** — Agent-Skill manifest for using this system in Claude Code.
- **`assets/`** — logo & mark variants (see §6).
- **`preview/`** — small HTML cards that populate the Design System tab
  (colors, type, spacing, components, brand). Reference specimens.
- **`ui_kits/storefront/`** — high-fidelity Storefront UI kit:
  `README.md`, `index.html` (interactive click-through), and JSX components
  (header, filter rail, product card/grid, product detail buy-box, cart, etc.).

---

## 8. Caveats

- **Given:** the logo and the two-line company description. **Inferred:**
  everything else — full color scales, typography, spacing, components, voice,
  and the entire Storefront UI kit are an informed construction, **not** a
  recreation of an existing Rollun interface (no codebase/Figma was available).
- **Fonts are substitutes** (Archivo / Hanken Grotesk / Spline Sans Mono via
  Google Fonts) for the unknown original brand face. Provide the real font to
  finalize.
- **Icons are Lucide** as a documented stand-in.
- Orange and charcoal hex values **are** sampled directly from the supplied
  logo and are accurate.
