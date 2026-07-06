import { cacheTag } from 'next/cache'

import { getPayload } from '@/lib/payload'
import type { AboutContent } from '@/payload-types'

/**
 * Canonical cache tag for the About page content global. `getAboutContent()` tags
 * its cached read with it; Story 7.4's Payload `afterChange` hook will
 * `revalidateTag(ABOUT_CONTENT_TAG)` so a manager's edit refreshes `/about` (AD-10).
 */
export const ABOUT_CONTENT_TAG = 'about-content'

/**
 * The SINGLE server-side accessor for the About content global (AD-12). Wrapped in
 * `'use cache'` + `cacheTag` so `/about` stays statically prerenderable under
 * `cacheComponents: true` and 7.4 can revalidate by tag. Only RSC/build-time code
 * calls this. A never-saved global returns the `defaultValue`s = exact Phase-1
 * literals, so the first build is pixel-identical.
 */
export async function getAboutContent(): Promise<AboutContent> {
  'use cache'
  cacheTag(ABOUT_CONTENT_TAG)
  const payload = await getPayload()
  // Explicit depth: the CEO-photo image slot is an `upload` relationship; the
  // builder's `resolveMediaUrl` only yields a URL from a POPULATED `Media` doc, so
  // pin depth here rather than rely on Payload's default depth staying at 2.
  return payload.findGlobal({ slug: 'about-content', depth: 2 })
}
