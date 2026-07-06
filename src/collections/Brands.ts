import type { CollectionConfig } from 'payload'

import { isAdminOrManager } from '../access/roles'
import { BRANDS_TAG } from '../lib/cache-tags'
import { revalidateCollection, revalidateCollectionAfterDelete } from '../hooks/revalidate-collection'

/**
 * Brands — the third-party brand logos in the Catalog marquee (Epic 8, Phase 3).
 *
 * DISTINCT from the `BrandsContent` GLOBAL (the MOTOTOU `/brands` page, AD-5) — do
 * not conflate them. Reshaped by `getMarqueeBrands()` (`src/lib/marquee-brands.ts`)
 * into `{ auto: CatalogBrand[]; health: CatalogBrand[] }` split by `line`; an
 * empty collection falls back to the Phase-1 `MARQUEE_BRANDS` constant (parity).
 *
 * `href` presence drives the linked (`<a>`, Health) vs linkless (`<div>`,
 * Automotive) tile — so it is optional. `order` preserves marquee row order.
 *
 * Access: public read; create/update/delete = admin|manager.
 */
export const Brands: CollectionConfig = {
  slug: 'brands',
  admin: {
    group: 'Catalog',
    useAsTitle: 'name',
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateCollection(BRANDS_TAG)],
    afterDelete: [revalidateCollectionAfterDelete(BRANDS_TAG)],
  },
  fields: [
    { name: 'domain', type: 'text' },
    { name: 'name', type: 'text', required: true },
    {
      name: 'href',
      type: 'text',
      admin: { description: 'Present → linked <a> tile (Health); empty → linkless <div> tile (Automotive).' },
    },
    {
      name: 'line',
      type: 'select',
      required: true,
      options: [
        { label: 'Automotive', value: 'auto' },
        { label: 'Health', value: 'health' },
      ],
    },
    { name: 'order', type: 'number' },
  ],
}
