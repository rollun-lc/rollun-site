import { cacheTag } from 'next/cache'

import { getPayload } from '@/lib/payload'
import type { BrandsContent } from '@/payload-types'

/**
 * Canonical cache tag for the Our Brands page content global. `getBrandsContent()`
 * tags its cached read with it; Story 7.4's Payload `afterChange` hook will
 * `revalidateTag(BRANDS_CONTENT_TAG)` so an edit refreshes `/brands` (AD-10).
 */
export const BRANDS_CONTENT_TAG = 'brands-content'

/**
 * The SINGLE server-side accessor for the Brands content global (AD-12). Wrapped
 * in `'use cache'` + `cacheTag` so `/brands` stays statically prerenderable under
 * `cacheComponents: true` and 7.4 can revalidate by tag. Only RSC/build-time code
 * calls this. A never-saved global returns the `defaultValue`s = exact Phase-1
 * literals, so the first build is pixel-identical.
 */
export async function getBrandsContent(): Promise<BrandsContent> {
  'use cache'
  cacheTag(BRANDS_CONTENT_TAG)
  const payload = await getPayload()
  // Explicit depth: the product/cert image slots are `upload` relationships; the
  // builder's `resolveMediaUrl` only yields a URL from a POPULATED `Media` doc, so
  // pin depth here rather than rely on Payload's default depth staying at 2.
  return payload.findGlobal({ slug: 'brands-content', depth: 2 })
}
