import { revalidateTag } from 'next/cache'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Factories for Payload Collection revalidate hooks — the collection analogue of
 * `revalidate-global.ts` (Story 7.4 / AD-10, AD-12). Each catalog collection
 * (Products/Brands/Shops) wires `afterChange` + `afterDelete` to its canonical
 * Next.js cache tag so an admin save (or delete) refreshes `/catalog` or `/shops`
 * on the next visit — no rebuild, no HTTP webhook (a single Next runtime serves
 * both `/admin` and the public site, so the hook calls `revalidateTag` directly).
 *
 * Guard: programmatic writes (the migration seed / tests) set
 * `req.context.disableRevalidate` to skip revalidation and avoid throwing
 * "revalidateTag called outside a request scope". A normal admin edit has no flag
 * → revalidation runs. `'max'` is the Next-recommended cache-profile arg (required
 * under `cacheComponents`): it marks every entry carrying the tag stale across all
 * pages that use it (stale-while-revalidate).
 */
export const revalidateCollection =
  (tag: string): CollectionAfterChangeHook =>
  ({ doc, req: { payload, context } }) => {
    if (!context?.disableRevalidate) {
      payload.logger.info(`revalidate tag "${tag}"`)
      revalidateTag(tag, 'max')
    }
    return doc
  }

export const revalidateCollectionAfterDelete =
  (tag: string): CollectionAfterDeleteHook =>
  ({ doc, req: { payload, context } }) => {
    if (!context?.disableRevalidate) {
      payload.logger.info(`revalidate tag "${tag}"`)
      revalidateTag(tag, 'max')
    }
    return doc
  }
