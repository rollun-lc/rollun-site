# Epic 8 Context: CMS — каталожные данные из CMS и роли (Фаза 3)

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Phase 3 of the CMS roadmap: move the catalog and Our Brands data out of static Phase-1 instances and into Payload collections so a non-technical manager can populate products, brands, and shops through the admin UI — with role-based access control separating admin from manager. This completes FR-13 for product/catalog data (the earlier text/media/passport slots were delivered in Epic 7). Marketplace offers remain a runtime derivation, never stored data. The epic matters because it is the final piece that lets the business own catalog content without a developer, while preserving the pixel-fidelity layout and the deterministic offer logic already shipped in Phase 1.

## Stories

- Story 8.1: Товары, бренды, магазины и роли (Фаза 3)

## Requirements & Constraints

- Catalog (`/catalog`) and Our Brands (`/brands`) must read their data from Payload collections via the local API (server-side only; no client fetch of content), replacing the static Phase-1 content instances without changing markup or the rendered pixel.
- Managers/admins populate catalog data through the Payload admin UI; changes reach production without a rebuild (consistent with the on-demand revalidation established in Phase 2).
- Two roles — `admin` and `manager` — gate access through Payload's built-in access control. The exact permission matrix is an open assumption (TBD), deferred to this phase.
- Offers are never a stored field; they stay a deterministic runtime derivation. Feed-overwritable fields (price, images, availability) must be isolated so a future Phase-4 feed sync can own them without touching hand-authored content.
- Only typed content slots are exposed; layout/structure is never a content field, and there is no page-builder or free-form block model.

## Technical Decisions

- **Collections vs. Globals (AD-5):** Phase-3 introduces the `Products`, `Brands`, and `Shops` collections. Critical distinction — the `Brands` collection (third-party brand logos for the Catalog marquee) is a different entity from the `BrandsContent` Global (the MOTOTOU own-brand page). Do not conflate them.
- **Products data shape:** `Products` stores `{ brand, domain, name, imgs, rating, reviews, specs, fits, desc }` plus reserved `sku` / `externalId` fields (the seam for the Phase-4 feed). `domain`/line drives offer derivation. The architecture treats these fields as an orientation guide — the code owns the exact field list at its phase.
- **Offers stay derived (AD-9):** `offers` is NOT a Payload field. `buildOffers` in `lib/offers.ts` deterministically computes offers server-side from the product line (Health → Amazon/eBay; Automotive → Amazon/eBay/Walmart). The runtime derivation is unchanged by moving product data into CMS. Consumers (card / quick-view) receive ready offers as props; importing `lib/offers.ts` into a client island is forbidden.
- **Fluidity boundary (AD-6):** live/editable data belongs in the CMS; layout stays nailed in code. When a field is ambiguous between "editable text" and "code-nailed," it stays in code by default.
- **Access control:** Payload built-in auth with `admin` / `manager` roles; the public site stays unauthenticated. Roles are enforced via Payload access-control functions on the collections. Permission matrix is deferred/TBD.
- **Naming conventions:** collections are PascalCase plural (`Products`, `Brands`, `Shops`); Page-Globals are `<Page>Content`.
- **Relations (reference only):** a brand owns many products; `CatalogContent` references `Brands` for marquee logos; `Products` reference `Media` for images (feed-overwritable in Phase 4); `Users` (admin/manager) edit products.

## Cross-Story Dependencies

- Builds on Epic 5 (Catalog) and Epic 6 (Our Brands / Our Shops), which render these pages from static Phase-1 instances — this epic swaps the data source to CMS without altering the rendered output.
- Depends on Epic 7 (Phase 2) CMS foundation: `SiteSettings`, the `Media` collection, Page Globals, and the on-demand revalidation mechanism, all of which this phase reuses.
- The `sku`/`externalId` reservation and isolated feed-overwritable fields are the explicit seam to a future Phase-4 feed-driven product sync (and `Posts`), which is out of scope for this breakdown.
