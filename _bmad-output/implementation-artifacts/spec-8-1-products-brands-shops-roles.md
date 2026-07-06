---
title: 'Products/Brands/Shops collections + admin/manager roles (Phase 3 CMS)'
type: 'feature'
created: '2026-07-06'
status: 'done'
baseline_revision: '8f8f188862e8377b75e976867d42a4955f7c9102'
final_revision: '6373c8c865a04d741f16db16e12f34201546f5ff'
review_loop_iteration: 0
followup_review_recommended: false
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-8-context.md'
warnings: [multiple-goals, oversized]
---

<intent-contract>

## Intent

**Problem:** Catalog products, the Catalog brand marquee, and the Our Shops marketplace cards are hard-coded static data; a manager cannot edit catalog content, and Payload has no role separation. This is the final piece of FR-13 (catalog data from CMS).

**Approach:** Introduce three Payload collections — `Products`, `Brands` (marquee logos), `Shops` (marketplace cards) — plus an `admin`/`manager` role on `Users` with access control. Server-side accessors read each collection via the Payload local API and reshape rows back into the EXACT shapes the render components already consume; when a collection is empty/unavailable they fall back to the Phase-1 constant, so the rendered pixel is identical at every stage (the collection analogue of the globals' `defaultValue` parity guarantee). Offers stay a runtime `buildOffers` derivation — never stored.

## Boundaries & Constraints

**Always:**
- Rendered markup/CSS and the on-screen pixel of `/catalog` and `/shops` stay identical. Render components (`ProductLines`, `ProductCard`, `ProductQuickView`, `BrandMarquee`, `Marketplaces`) and their prop contracts are UNCHANGED — only the page's data source and the content builders change.
- Accessors reshape collection rows into the existing shapes: `getProducts()` → `Record<ProductCategory, Product[]>`; `getMarqueeBrands()` → `{ auto: CatalogBrand[]; health: CatalogBrand[] }`; `getShops()` → `ShopCardData[]`. Row order is preserved via an explicit `order` field (sort ascending).
- Product `category` (`tires|oils|elec|health`) is a stored field and continues to drive line derivation (`cat === 'health' ? 'health' : 'auto'`) and mobile shelf grouping.
- Offers are NEVER a field — `buildOffers` in `src/lib/offers.ts` stays the server-only source (AD-9). `sku`/`externalId` are stored but reserved (empty) as the Phase-4 feed seam; feed-overwritable fields (`imgs`, `sku`, `externalId`) are demarcated as feed-owned.
- Reads are server-only via the local API, wrapped in `'use cache'` + `cacheTag(TAG)`; each collection gets a canonical tag in `src/lib/cache-tags.ts` and a collection `afterChange`/`afterDelete` revalidate hook (mirroring the Epic-7 global pattern, AD-10/AD-12).
- `admin` is full-access; `manager` can create/read/update/delete the three catalog collections but CANNOT touch `Users` or change roles. Public site stays unauthenticated; catalog collections are publicly readable.
- The `Brands` COLLECTION (third-party marquee logos on `/catalog`) is a DISTINCT entity from the existing `BrandsContent` GLOBAL (the MOTOTOU `/brands` page). Do not conflate them (AD-5).
- The Phase-1 constants remain the single source of truth for both the accessor fallback AND the seed. Deliberate defects (`Houston,Texas`, the Conroe `directions.href`) and all `{dk,mb}` pairs stay code-owned in the shops builder.

**Block If:**
- Preserving the exact rendered pixel would require changing a render component's markup or prop contract.
- The database is unreachable AND cannot be reached for `generate:types`/`migrate` (schema cannot be created) — a normal run has DB access as prior stories did.

**Never:**
- Do not modify the `/brands` page or `BrandsContent` global — the MOTOTOU own-brand showcase is out of scope.
- Do not store offers, price, or availability; do not import `src/lib/offers.ts` into any client island.
- Do not introduce a page-builder, free-form blocks, or an RBAC matrix beyond the admin/manager default below.
- Do not reconcile or "fix" the deliberate shops defects; do not change any component CSS/markup.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Collection populated | Rows exist | Accessor reshapes rows into the existing shape, ordered by `order`, grouped by `category`/`line`/brand | — |
| Collection empty | 0 rows | Accessor returns the Phase-1 constant (pixel parity) | No error |
| Read fails (missing table/DB error) | `payload.find` throws | Accessor logs a warning and returns the Phase-1 constant | Swallow → fallback |
| Manager edits a product | user.role = manager | Create/update/delete on Products/Brands/Shops succeeds | — |
| Manager opens Users | user.role = manager | Users collection hidden & access denied | Payload 403 |
| Manager changes own role | user.role = manager | `role` field is read-only for managers; escalation blocked | Field access denied |
| Unauthenticated write | no user | Create/update/delete on any collection denied | Payload 403 |
| Admin saves a catalog row | in-request admin edit | `afterChange` calls `revalidateTag(TAG,'max')`; `/catalog` or `/shops` refreshes on next visit | — |
| Programmatic seed write | `req.context.disableRevalidate` set | Revalidate hook skips (no request scope) | Guarded |

</intent-contract>

## Code Map

- `src/collections/Products.ts` -- NEW collection: fields `brand, domain, name, category(select), imgs(array), rating, reviews, specs(array label/value), fits(array), desc, amazon?, order`, sidebar feed group `sku/externalId`; access read-public + write admin|manager; revalidate hooks.
- `src/collections/Brands.ts` -- NEW marquee collection: `domain, name, href?, line(select auto|health), order`; same access + hooks.
- `src/collections/Shops.ts` -- NEW cards collection: `brand(select amazon|ebay|walmart), shot(group img/alt/href), rating(group pct/score/meta), blurb, cta(group labelDk/labelMb/href), order`; same access + hooks.
- `src/collections/Users.ts` -- ADD required `role` select (`admin`/`manager`, defaultValue `admin`); admin-only access for create/update/delete/read; `role` field admin-only; hide/deny for managers.
- `src/access/roles.ts` -- NEW: `isAdmin`, `isAdminOrManager`, `isAdminFieldLevel` (signature `({ req: { user } }) => boolean`).
- `src/hooks/revalidate-collection.ts` -- NEW: `revalidateCollection(tag)` (afterChange) + `revalidateCollectionAfterDelete(tag)` mirroring `revalidate-global.ts` (respect `context.disableRevalidate`, `revalidateTag(tag,'max')`).
- `src/lib/cache-tags.ts` -- ADD `PRODUCTS_TAG='products'`, `BRANDS_TAG='brands'`, `SHOPS_TAG='shops'`.
- `src/lib/products.ts` -- NEW `getProducts()` accessor (cache+tag, reshape, fallback to `PRODUCTS`).
- `src/lib/marquee-brands.ts` -- NEW `getMarqueeBrands()` accessor (fallback to `MARQUEE_BRANDS`).
- `src/lib/shops.ts` -- NEW `getShops()` accessor (fallback to `SHOP_CARDS`). Distinct from existing `src/lib/shops-content.ts` (the global).
- `src/content/products.ts` -- keep `PRODUCTS` as fallback+seed source (unchanged data).
- `src/content/catalog.ts` -- extract marquee arrays into exported `MARQUEE_BRANDS = { auto, health }`; `buildCatalogContent(c, brands = MARQUEE_BRANDS)` uses them; `autoRepeat/healthRepeat/intro/labels` stay code-owned.
- `src/content/shops.ts` -- extract cards into exported `SHOP_CARDS: ShopCardData[]`; `buildShopsContent(c, s, cards = SHOP_CARDS)` uses them; defects/`{dk,mb}` stay code-owned.
- `src/app/(site)/catalog/page.tsx` -- `products={await getProducts()}`; `buildCatalogContent(await getCatalogContent(), await getMarqueeBrands())`. Drop the static `PRODUCTS` import.
- `src/app/(site)/shops/page.tsx` -- `buildShopsContent(await getShopsContent(), await getSiteSettings(), await getShops())`.
- `payload.config.ts` -- register `Products, Brands, Shops` in `collections`.
- `src/migrations/<ts>_products_brands_shops_roles.ts` -- schema for the 3 collections + `users.role`, plus idempotent seed from the Phase-1 constants (see Design Notes).
- `src/payload-types.ts` -- regenerated (`npm run generate:types`).

## Tasks & Acceptance

**Execution:**
- [x] `src/access/roles.ts` -- add `isAdmin` / `isAdminOrManager` / `isAdminFieldLevel` access helpers.
- [x] `src/collections/Users.ts` -- add `role` select field + apply access matrix (admin-only Users management, `role` admin-only, `admin.hidden` for managers, `defaultValue: 'admin'` for first-user bootstrap).
- [x] `src/hooks/revalidate-collection.ts` -- add collection revalidate afterChange + afterDelete factories.
- [x] `src/lib/cache-tags.ts` -- add `PRODUCTS_TAG`, `BRANDS_TAG`, `SHOPS_TAG`.
- [x] `src/collections/Products.ts` -- define collection matching the `Product` shape + `category`/`order`, feed-owned isolation, access, revalidate hooks.
- [x] `src/collections/Brands.ts` -- define marquee collection (`domain/name/href?/line/order`), access, hooks.
- [x] `src/collections/Shops.ts` -- define cards collection matching `ShopCardData` + `order`, access, hooks.
- [x] `payload.config.ts` -- register the three new collections.
- [x] `src/content/catalog.ts` -- extract `MARQUEE_BRANDS`; add optional `brands` param to `buildCatalogContent`.
- [x] `src/content/shops.ts` -- extract `SHOP_CARDS`; add optional `cards` param to `buildShopsContent`.
- [x] `src/lib/products.ts` / `src/lib/marquee-brands.ts` / `src/lib/shops.ts` -- add the three accessors (cache+tag, reshape, empty/error → Phase-1 fallback).
- [x] `src/app/(site)/catalog/page.tsx` + `src/app/(site)/shops/page.tsx` -- wire pages to the accessors.
- [x] `npm run generate:types` -- regenerate `payload-types.ts`; fix any type drift in accessors/builders.
- [x] `src/migrations/<ts>_products_brands_shops_roles.ts` -- create via `payload migrate:create products_brands_shops_roles`; add idempotent seeding (guard on `payload.count`, write with `context: { disableRevalidate: true }`) importing the Phase-1 constants.

**Acceptance Criteria:**
- Given the three collections are empty, when `/catalog` and `/shops` render, then the product grid, brand marquee, and marketplace cards are pixel-identical to the pre-change static output.
- Given rows exist in a collection, when its page renders, then the page shows the collection data in the seeded order via the local API.
- Given a `manager` user, when they use `/admin`, then they can create/edit/delete Products/Brands/Shops but cannot see or modify Users or their own role.
- Given an admin saves a Products/Brands/Shops row, when the save completes, then the corresponding page tag is revalidated and the next visit shows the change without a rebuild.
- Given `buildOffers` and the render components, when the migration is complete, then `offers` is still computed at render time (no `offers` field exists) and no client island imports `src/lib/offers.ts`.

## Spec Change Log

_No `bad_spec` loopback occurred; implementation followed the spec faithfully._

## Review Triage Log

### 2026-07-06 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 2: (high 0, medium 1, low 1)
- defer: 2: (high 0, medium 1, low 1)
- reject: 9
- addressed_findings:
  - `[medium]` `[patch]` Accessors swallowed read errors silently (blanket `catch`), masking a real misconfig/DB fault as an "empty → parity" fallback — added `console.error` logging in all three accessor catch blocks while keeping the intentional Phase-1 fallback.
  - `[low]` `[patch]` Per-bucket ordering relied on sort tie-break stability — switched `getProducts` to `sort: ['category','order']` and `getMarqueeBrands` to `sort: ['line','order']` for deterministic per-bucket order (also guards the admin-duplicate-`order` case).
- deferred: `Users.role` defaulting to `admin` (least-privilege hardening, tied to the still-`[ASSUMPTION]` permission matrix); Brands link/linkless keyed on `href` independent of `line` (unguarded editor discipline). Both recorded in `deferred-work.md`.

## Design Notes

**Reshaping keeps render code untouched.** Each accessor rebuilds the exact legacy shape so `ProductLines`/`BrandMarquee`/`Marketplaces` are byte-for-byte unchanged. Example (`getProducts`):
```ts
export async function getProducts(): Promise<Record<ProductCategory, Product[]>> {
  'use cache'
  cacheTag(PRODUCTS_TAG)
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({ collection: 'products', limit: 0, sort: 'order', depth: 0 })
    if (!docs.length) return PRODUCTS
    const out: Record<ProductCategory, Product[]> = { tires: [], oils: [], elec: [], health: [] }
    for (const d of docs) out[d.category].push(toProduct(d)) // map arrays → string[]/tuples
    return out
  } catch { return PRODUCTS } // missing table / DB blip → Phase-1 parity
}
```
`getMarqueeBrands`/`getShops` follow the same empty-or-error → constant pattern (the collection analogue of the globals' `defaultValue`).

**Access matrix (the deferred `[ASSUMPTION]`, resolved to a minimal default).** admin = full. manager = full CRUD on Products/Brands/Shops, no access to Users, `role` field read-only. Public read on the three catalog collections (local API bypasses access anyway; public read serves REST/admin). Media is left unchanged. This is intentionally the smallest matrix that makes the roles meaningful; refine later.

**Feed isolation.** `imgs` carries an `admin.description` marking it feed-overwritable (Phase 4); `sku`/`externalId` live in a sidebar `group` labeled as the reserved feed seam. None are populated in Phase 3.

**Seeding.** Add idempotent seeding to the migration `up()`: if `payload.count({collection})` is 0, `payload.create` each Phase-1 row (importing `PRODUCTS`, `MARQUEE_BRANDS`, `SHOP_CARDS` — all pure serializable data) with `context: { disableRevalidate: true }` and `req` so it runs in the migration transaction. Prefer `payload migrate:create` to author the schema DDL (child tables for array fields + select enums); follow the exact style of `src/migrations/20260706_080705_page_content_globals.ts` if hand-authoring is needed.

## Verification

**Commands:**
- `npm run generate:types` -- expected: regenerates `src/payload-types.ts` cleanly with `Product`/`Brand`/`Shop` interfaces and `role` on `User`.
- `npm run lint` -- expected: no new errors.
- `npm run build` -- expected: Next build succeeds; `/catalog` and `/shops` prerender (accessors resolve via local API or fall back to Phase-1 constants without throwing).

**Manual checks:**
- Load `/catalog` (product grid + brand marquee) and `/shops` (marketplace cards) before and after: rendered output is pixel-identical whether collections are empty (fallback) or seeded.
- In `/admin`, a `manager` sees Products/Brands/Shops but not Users; the `role` field is not editable by a manager.

## Auto Run Result

Status: done

**Summary.** Phase-3 CMS migration: Catalog products, the Catalog brand marquee, and the Our Shops marketplace cards now come from three new Payload collections (`Products`, `Brands`, `Shops`) via server-side local-API accessors that reshape rows back into the exact legacy shapes the render components already consume, with a Phase-1-constant fallback on empty/error so the rendered pixel is identical whether the collections are empty or seeded. Added `admin`/`manager` roles on `Users` with access control (managers get full CRUD on the three catalog collections, no access to Users, cannot change roles). Offers remain a runtime `buildOffers` derivation — never stored. A migration creates the schema and idempotently seeds all three collections from the same Phase-1 constants (12 products, 17 marquee brands, 3 shop cards).

**Files changed (created/modified):**
- `src/collections/Products.ts`, `Brands.ts`, `Shops.ts` — new collections (public read, admin|manager write, revalidate hooks, feed-seam isolation on Products).
- `src/collections/Users.ts` — `role` select + admin-only access matrix, `role` field admin-only, hidden from managers.
- `src/access/roles.ts` — `isAdmin` / `isAdminOrManager` / `isAdminFieldLevel` helpers.
- `src/hooks/revalidate-collection.ts` — collection `afterChange`/`afterDelete` tag-revalidate factories.
- `src/lib/products.ts`, `marquee-brands.ts`, `shops.ts` — accessors (`'use cache'` + tag, reshape, empty/error → Phase-1 fallback, deterministic sort, error logging).
- `src/lib/cache-tags.ts` — `PRODUCTS_TAG` / `BRANDS_TAG` / `SHOPS_TAG`.
- `src/content/catalog.ts`, `shops.ts` — extracted `MARQUEE_BRANDS` / `SHOP_CARDS` constants; builders take optional collection-sourced params.
- `src/app/(site)/catalog/page.tsx`, `shops/page.tsx` — wired to the new accessors.
- `payload.config.ts` — registered the three collections; `src/payload-types.ts` + `src/migrations/index.ts` regenerated.
- `src/migrations/20260706_090618_products_brands_shops_roles.ts` (+ `.json`) — schema DDL + idempotent seed.

**Review findings breakdown:** 2 patches applied ([medium] silent error-masking → added logging; [low] non-deterministic per-bucket ordering → composite sort). 2 deferred (role default = admin; Brands link/line invariant) recorded in `deferred-work.md`. 9 rejected (Payload first-user bypass, by-design empty buckets, reserved feed round-trip, DDL idempotency matching convention, seed-in-transaction atomicity, fixed enums, cosmetic admin title, DRY nit, /me role read).

**Verification:** `npm run generate:types` clean; `npm run lint` no errors; `npm run build` succeeds with `/catalog` and `/shops` prerendered as static (○). Migration applied and seed verified in DB (12 products with per-category order preserved, 14 auto + 3 health brands, 3 shops).

**Residual risks:** Pixel parity for seeded data depends on the seed matching the Phase-1 constants (single-source-of-truth mitigates this); the two deferred items are editorial-integrity/least-privilege hardening, not current regressions. The permission matrix remains the Epic-8 `[ASSUMPTION]`, resolved here to a minimal default.
