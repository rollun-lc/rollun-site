import { cacheTag } from 'next/cache'

import { SHOP_CARDS, type ShopCardData } from '@/content/shops'
import { SHOPS_TAG } from '@/lib/cache-tags'
import { getPayload } from '@/lib/payload'
import type { Shop as ShopDoc } from '@/payload-types'

export { SHOPS_TAG }

/** Reshape a Payload `Shops` row into the flat `ShopCardData` the `Marketplaces`
 *  component consumes (the `dk/mb` CTA labels live in the row's `cta` group). */
function toShopCard(d: ShopDoc): ShopCardData {
  return {
    brand: d.brand,
    shot: {
      img: d.shot?.img ?? '',
      alt: d.shot?.alt ?? '',
      href: d.shot?.href ?? '',
    },
    rating: {
      pct: d.rating?.pct ?? 0,
      score: d.rating?.score ?? '',
      meta: d.rating?.meta ?? '',
    },
    blurb: d.blurb ?? '',
    cta: {
      labelDk: d.cta?.labelDk ?? '',
      labelMb: d.cta?.labelMb ?? '',
      href: d.cta?.href ?? '',
    },
  }
}

/**
 * The SINGLE server-side accessor for the Our Shops marketplace cards (Epic 8,
 * Phase 3). Distinct from `src/lib/shops-content.ts` (the `ShopsContent` global).
 * Reshapes rows (ordered by `order`) into `ShopCardData[]`. On an EMPTY collection
 * or ANY read error it returns the Phase-1 `SHOP_CARDS` constant so the rendered
 * pixel is identical (parity). The deliberate defects and `dk/mb` label pairs stay
 * code-owned in `buildShopsContent`.
 */
export async function getShops(): Promise<ShopCardData[]> {
  'use cache'
  cacheTag(SHOPS_TAG)
  try {
    const payload = await getPayload()
    const { docs } = await payload.find({ collection: 'shops', limit: 0, sort: 'order', depth: 0 })
    if (!docs.length) return SHOP_CARDS
    return docs.map(toShopCard)
  } catch (err) {
    console.error('[getShops] read failed; falling back to Phase-1 SHOP_CARDS:', err)
    return SHOP_CARDS
  }
}
