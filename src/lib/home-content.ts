import { cacheTag } from 'next/cache'

import { getPayload } from '@/lib/payload'
import type { HomeContent } from '@/payload-types'

/**
 * Canonical cache tag for the Home page content global. `getHomeContent()` tags
 * its cached read with it; Story 7.4's Payload `afterChange` hook will
 * `revalidateTag(HOME_CONTENT_TAG)` so a manager's edit refreshes `/` (AD-10).
 */
export const HOME_CONTENT_TAG = 'home-content'

/**
 * The SINGLE server-side accessor for the Home content global (AD-12). Wrapped in
 * `'use cache'` + `cacheTag` so `/` stays statically prerenderable under
 * `cacheComponents: true` and 7.4 can revalidate by tag. Only RSC/build-time code
 * calls this. A never-saved global returns the `defaultValue`s = exact Phase-1
 * literals, so the first build is pixel-identical.
 */
export async function getHomeContent(): Promise<HomeContent> {
  'use cache'
  cacheTag(HOME_CONTENT_TAG)
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'home-content' })
}
