import { cacheTag } from 'next/cache'

import { PRODUCTS, type Product, type ProductCategory, type ProductSpec } from '@/content/products'
import { PRODUCTS_TAG } from '@/lib/cache-tags'
import { getPayload } from '@/lib/payload'
import type { Product as ProductDoc } from '@/payload-types'

export { PRODUCTS_TAG }

/**
 * Reshape a Payload `Products` row back into the flat `Product` shape the render
 * components (`ProductLines`/`ProductCard`/`ProductQuickView`) already consume —
 * mapping the array/child-table fields back to `string[]` / `[label, value]`
 * tuples. Offers are NEVER stored; `buildOffers` derives them at render (AD-9).
 */
function toProduct(d: ProductDoc): Product {
  return {
    brand: d.brand ?? '',
    domain: d.domain ?? '',
    name: d.name,
    imgs: (d.imgs ?? []).map((i) => i.img ?? ''),
    rating: d.rating ?? 0,
    reviews: d.reviews ?? 0,
    specs: (d.specs ?? []).map((s): ProductSpec => [s.label ?? '', s.value ?? '']),
    fits: (d.fits ?? []).map((f) => f.value ?? ''),
    desc: d.desc ?? '',
    ...(d.amazon ? { amazon: d.amazon } : {}),
  }
}

/**
 * The SINGLE server-side accessor for the Catalog products (Epic 8, Phase 3).
 * Wrapped in `'use cache'` + `cacheTag` so `/catalog` stays statically
 * prerenderable and Story 8.1's `afterChange`/`afterDelete` hooks can revalidate
 * by tag. Reshapes rows (ordered by `order`) grouped by `category`. On an EMPTY
 * collection or ANY read error (missing table before migration / DB blip) it
 * returns the Phase-1 `PRODUCTS` constant so the rendered pixel is identical
 * (the collection analogue of the globals' `defaultValue` parity guarantee).
 */
export async function getProducts(): Promise<Record<ProductCategory, Product[]>> {
  'use cache'
  cacheTag(PRODUCTS_TAG)
  try {
    const payload = await getPayload()
    // Sort by (category, order): keeps each category bucket deterministic even if
    // two rows in a category share an `order`, without relying on tie-break stability.
    const { docs } = await payload.find({ collection: 'products', limit: 0, sort: ['category', 'order'], depth: 0 })
    if (!docs.length) return PRODUCTS
    const out: Record<ProductCategory, Product[]> = { tires: [], oils: [], elec: [], health: [] }
    for (const d of docs) out[d.category].push(toProduct(d))
    return out
  } catch (err) {
    // Log so a real misconfig/DB fault isn't silently masked as an "empty → parity" fallback.
    console.error('[getProducts] read failed; falling back to Phase-1 PRODUCTS:', err)
    return PRODUCTS
  }
}
