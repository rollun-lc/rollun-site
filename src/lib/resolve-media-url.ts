import type { Media } from '@/payload-types'

/**
 * Resolve the served URL of an OPTIONAL Payload `upload` relationship for a
 * page-content image slot (Story 7.3).
 *
 * Page Globals model 🔴 editable content-images as an OPTIONAL `upload`
 * relationship on `media`. The parity guarantee (AD-7) for images can't ride on
 * a `defaultValue` (you can't default a relationship to a `/public` string), so
 * the builder composes it as `resolveMediaUrl(slot) ?? codeOwnedDefaultPath`:
 *
 *   - Empty / unsaved slot (`null`/`undefined`)          → `undefined` → builder
 *     falls back to the code-owned `/public` path → pixel-identical to Phase 1.
 *   - Unpopulated relationship (a bare numeric id)       → `undefined` → same
 *     fallback (never a broken `<img>`).
 *   - Populated `Media` doc with a `url`                 → that URL.
 *
 * The EXISTING render element (`<img>` / `background-image`) keeps rendering the
 * returned string. Promotion to `next/image` / `MediaImage` is deferred (7.2).
 */
export const resolveMediaUrl = (media: Media | number | null | undefined): string | undefined =>
  media && typeof media !== 'number' ? (media.url || undefined) : undefined
