import { cacheTag } from 'next/cache'

import { getPayload } from '@/lib/payload'
import type { ContactContent } from '@/payload-types'

/**
 * Canonical cache tag for the Contact page content global. `getContactContent()`
 * tags its cached read with it; Story 7.4's Payload `afterChange` hook will
 * `revalidateTag(CONTACT_CONTENT_TAG)` so an edit refreshes `/contact` (AD-10).
 */
export const CONTACT_CONTENT_TAG = 'contact-content'

/**
 * The SINGLE server-side accessor for the Contact content global (AD-12). Wrapped
 * in `'use cache'` + `cacheTag` so `/contact` stays statically prerenderable under
 * `cacheComponents: true` and 7.4 can revalidate by tag. Only RSC/build-time code
 * calls this. A never-saved global returns the `defaultValue`s = exact Phase-1
 * literals, so the first build is pixel-identical.
 */
export async function getContactContent(): Promise<ContactContent> {
  'use cache'
  cacheTag(CONTACT_CONTENT_TAG)
  const payload = await getPayload()
  return payload.findGlobal({ slug: 'contact-content' })
}
