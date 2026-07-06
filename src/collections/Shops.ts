import type { CollectionConfig } from 'payload'

import { isAdminOrManager } from '../access/roles'
import { SHOPS_TAG } from '../lib/cache-tags'
import { revalidateCollection, revalidateCollectionAfterDelete } from '../hooks/revalidate-collection'

/**
 * Shops — the Our Shops marketplace cards (Epic 8, Phase 3). Reshaped by
 * `getShops()` (`src/lib/shops.ts`) into `ShopCardData[]` the `Marketplaces`
 * component already consumes; an empty collection falls back to the Phase-1
 * `SHOP_CARDS` constant (parity). Distinct from the `ShopsContent` GLOBAL and its
 * accessor `src/lib/shops-content.ts`.
 *
 * `brand` drives the presentational logo switch. The `dk/mb` CTA label pair and
 * the deliberate defects stay code-owned in `buildShopsContent`; here the cards
 * carry only the flat per-card data. `order` preserves card order.
 *
 * Access: public read; create/update/delete = admin|manager.
 */
export const Shops: CollectionConfig = {
  slug: 'shops',
  admin: {
    group: 'Catalog',
    useAsTitle: 'brand',
  },
  access: {
    read: () => true,
    create: isAdminOrManager,
    update: isAdminOrManager,
    delete: isAdminOrManager,
  },
  hooks: {
    afterChange: [revalidateCollection(SHOPS_TAG)],
    afterDelete: [revalidateCollectionAfterDelete(SHOPS_TAG)],
  },
  fields: [
    {
      name: 'brand',
      type: 'select',
      required: true,
      options: [
        { label: 'Amazon', value: 'amazon' },
        { label: 'eBay', value: 'ebay' },
        { label: 'Walmart', value: 'walmart' },
      ],
    },
    {
      name: 'shot',
      type: 'group',
      fields: [
        { name: 'img', type: 'text' },
        { name: 'alt', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    {
      name: 'rating',
      type: 'group',
      fields: [
        { name: 'pct', type: 'number' },
        { name: 'score', type: 'text' },
        { name: 'meta', type: 'text' },
      ],
    },
    { name: 'blurb', type: 'textarea' },
    {
      name: 'cta',
      type: 'group',
      fields: [
        { name: 'labelDk', type: 'text' },
        { name: 'labelMb', type: 'text' },
        { name: 'href', type: 'text' },
      ],
    },
    { name: 'order', type: 'number' },
  ],
}
