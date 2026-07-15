import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Design refresh (zip "Rollun web site (1)") — data-only migration.
 *
 * 1. Catalog products. The refreshed design adds real product photos, direct
 *    marketplace URLs/prices, a "Contact to buy" (on-request) flow and a
 *    Walmart-omission flag — fields the current `Products` collection schema does
 *    NOT hold. The code-owned `PRODUCTS` constant now carries the full new set, and
 *    `getProducts()` returns it VERBATIM when the collection is empty (the documented
 *    "empty → pixel-identical fallback"). So we clear the seeded demo rows; children
 *    cascade via their FK `ON DELETE CASCADE`.
 *
 * 2. Globals. Uniform opening hours ("11:00 to 21:00 UTC") and the "Our stores" →
 *    "Our shops" rename. We UPDATE the already-seeded global rows in place. On a
 *    fresh DB the global row is created later from the (already updated) field
 *    defaults, so these UPDATEs are harmless no-ops there.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DELETE FROM "products";`)

  await db.execute(sql`
    UPDATE "site_settings" SET
      "hours_home_cta_mobile"   = '11:00 to 21:00 UTC',
      "hours_about_cta_desktop" = '11:00 to 21:00 UTC',
      "hours_about_cta_mobile"  = '11:00 to 21:00 UTC',
      "hours_contact"           = '11:00 to 21:00 UTC';
  `)

  await db.execute(sql`UPDATE "shops_content" SET "hero_title" = 'Our shops';`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Data-only refresh — the previous demo products and values are not restored.
}
