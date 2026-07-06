import { cacheTag } from 'next/cache'

import { MARQUEE_BRANDS, type CatalogBrand } from '@/content/catalog'
import { BRANDS_TAG } from '@/lib/cache-tags'
import { getPayload } from '@/lib/payload'
import type { Brand as BrandDoc } from '@/payload-types'

export { BRANDS_TAG }

/** Reshape a Payload `Brands` row into the flat `CatalogBrand` the marquee
 *  consumes. `href` presence drives linked vs linkless tiles, so it is spread
 *  only when set. */
function toBrand(d: BrandDoc): CatalogBrand {
  return {
    domain: d.domain ?? '',
    name: d.name,
    ...(d.href ? { href: d.href } : {}),
  }
}

/**
 * The SINGLE server-side accessor for the Catalog marquee brands (Epic 8, Phase 3
 * — the `Brands` COLLECTION, distinct from the `BrandsContent` global, AD-5).
 * Reshapes rows (ordered by `order`) split by `line` into `{ auto, health }`. On
 * an EMPTY collection or ANY read error it returns the Phase-1 `MARQUEE_BRANDS`
 * constant so the rendered pixel is identical (parity).
 */
export async function getMarqueeBrands(): Promise<{ auto: CatalogBrand[]; health: CatalogBrand[] }> {
  'use cache'
  cacheTag(BRANDS_TAG)
  try {
    const payload = await getPayload()
    // Sort by (line, order): each line's marquee row stays deterministic regardless
    // of tie-break stability across lines.
    const { docs } = await payload.find({ collection: 'brands', limit: 0, sort: ['line', 'order'], depth: 0 })
    if (!docs.length) return MARQUEE_BRANDS
    const out: { auto: CatalogBrand[]; health: CatalogBrand[] } = { auto: [], health: [] }
    for (const d of docs) out[d.line].push(toBrand(d))
    return out
  } catch (err) {
    console.error('[getMarqueeBrands] read failed; falling back to Phase-1 MARQUEE_BRANDS:', err)
    return MARQUEE_BRANDS
  }
}
