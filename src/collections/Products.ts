import type { CollectionConfig } from 'payload'

import { isAdminOrManager } from '../access/roles'
import { PRODUCTS_TAG } from '../lib/cache-tags'
import { revalidateCollection, revalidateCollectionAfterDelete } from '../hooks/revalidate-collection'

/**
 * Products — the Catalog product cards (Epic 8, Phase 3). Reshaped by
 * `getProducts()` (`src/lib/products.ts`) back into the exact `Product` shape the
 * render components (`ProductLines`/`ProductCard`/`ProductQuickView`) already
 * consume; an empty collection falls back to the Phase-1 `PRODUCTS` constant so
 * the rendered pixel is identical (parity, AD-7).
 *
 * `category` is a stored field that drives line derivation (`health` → Health,
 * else Automotive) and mobile shelf grouping. `order` gives a stable per-category
 * sort. Offers are NEVER stored — `buildOffers` derives them at render (AD-9).
 *
 * Feed seam (Phase 4): `imgs` is feed-overwritable, and the sidebar `feed` group
 * holds the reserved `sku`/`externalId`. None are populated in Phase 3.
 *
 * Access: public read (serves REST/admin); create/update/delete = admin|manager.
 */
export const Products: CollectionConfig = {
  slug: 'products',
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
    afterChange: [revalidateCollection(PRODUCTS_TAG)],
    afterDelete: [revalidateCollectionAfterDelete(PRODUCTS_TAG)],
  },
  fields: [
    { name: 'brand', type: 'text' },
    { name: 'domain', type: 'text' },
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Tires', value: 'tires' },
        { label: 'Oils', value: 'oils' },
        { label: 'Electrical', value: 'elec' },
        { label: 'Health', value: 'health' },
      ],
    },
    {
      name: 'imgs',
      type: 'array',
      admin: {
        description:
          'Feed-overwritable in Phase 4 (product feed owns images). Phase 1 renders "Photo N" placeholders from the item count.',
      },
      fields: [{ name: 'img', type: 'text' }],
    },
    { name: 'rating', type: 'number' },
    { name: 'reviews', type: 'number' },
    {
      name: 'specs',
      type: 'array',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'value', type: 'text' },
      ],
    },
    {
      name: 'fits',
      type: 'array',
      fields: [{ name: 'value', type: 'text' }],
    },
    { name: 'desc', type: 'textarea' },
    { name: 'amazon', type: 'text' },
    { name: 'order', type: 'number' },
    {
      name: 'feed',
      type: 'group',
      admin: {
        position: 'sidebar',
        description: 'Reserved seam for the Phase-4 product feed. Not populated in Phase 3.',
      },
      fields: [
        { name: 'sku', type: 'text' },
        { name: 'externalId', type: 'text' },
      ],
    },
  ],
}
