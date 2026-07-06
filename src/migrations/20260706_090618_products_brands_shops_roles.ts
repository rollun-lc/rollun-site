import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Relative imports (not `@/…` aliases) so the module resolves under the Payload
// migrate CLI, which runs outside the Next compiler. These are the SAME Phase-1
// constants the accessors fall back to — a single source of truth for fallback
// AND seed, so a seeded page is pixel-identical to the empty-fallback page.
import type { ProductCategory } from '../content/products'
import { PRODUCTS } from '../content/products'
import { MARQUEE_BRANDS } from '../content/catalog'
import { SHOP_CARDS } from '../content/shops'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'manager');
  CREATE TYPE "public"."enum_products_category" AS ENUM('tires', 'oils', 'elec', 'health');
  CREATE TYPE "public"."enum_brands_line" AS ENUM('auto', 'health');
  CREATE TYPE "public"."enum_shops_brand" AS ENUM('amazon', 'ebay', 'walmart');
  CREATE TABLE "products_imgs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"img" varchar
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "products_fits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" varchar,
  	"domain" varchar,
  	"name" varchar NOT NULL,
  	"category" "enum_products_category" NOT NULL,
  	"rating" numeric,
  	"reviews" numeric,
  	"desc" varchar,
  	"amazon" varchar,
  	"order" numeric,
  	"feed_sku" varchar,
  	"feed_external_id" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "brands" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"domain" varchar,
  	"name" varchar NOT NULL,
  	"href" varchar,
  	"line" "enum_brands_line" NOT NULL,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "shops" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand" "enum_shops_brand" NOT NULL,
  	"shot_img" varchar,
  	"shot_alt" varchar,
  	"shot_href" varchar,
  	"rating_pct" numeric,
  	"rating_score" varchar,
  	"rating_meta" varchar,
  	"blurb" varchar,
  	"cta_label_dk" varchar,
  	"cta_label_mb" varchar,
  	"cta_href" varchar,
  	"order" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'admin' NOT NULL;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "brands_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "shops_id" integer;
  ALTER TABLE "products_imgs" ADD CONSTRAINT "products_imgs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_fits" ADD CONSTRAINT "products_fits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_imgs_order_idx" ON "products_imgs" USING btree ("_order");
  CREATE INDEX "products_imgs_parent_id_idx" ON "products_imgs" USING btree ("_parent_id");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE INDEX "products_fits_order_idx" ON "products_fits" USING btree ("_order");
  CREATE INDEX "products_fits_parent_id_idx" ON "products_fits" USING btree ("_parent_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "brands_updated_at_idx" ON "brands" USING btree ("updated_at");
  CREATE INDEX "brands_created_at_idx" ON "brands" USING btree ("created_at");
  CREATE INDEX "shops_updated_at_idx" ON "shops" USING btree ("updated_at");
  CREATE INDEX "shops_created_at_idx" ON "shops" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_brands_fk" FOREIGN KEY ("brands_id") REFERENCES "public"."brands"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_shops_fk" FOREIGN KEY ("shops_id") REFERENCES "public"."shops"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_brands_id_idx" ON "payload_locked_documents_rels" USING btree ("brands_id");
  CREATE INDEX "payload_locked_documents_rels_shops_id_idx" ON "payload_locked_documents_rels" USING btree ("shops_id");`)

  // ── Idempotent seed from the Phase-1 constants ─────────────────────────────
  // Runs AFTER the DDL, in the migration transaction (`req`). Guarded on
  // `payload.count` so a re-run is a no-op. `disableRevalidate` skips the
  // afterChange revalidate hook (no request scope during a migration).
  const ctx = { req, context: { disableRevalidate: true } }

  if ((await payload.count({ collection: 'products', req })).totalDocs === 0) {
    for (const category of Object.keys(PRODUCTS) as ProductCategory[]) {
      const rows = PRODUCTS[category]
      for (let order = 0; order < rows.length; order++) {
        const p = rows[order]
        await payload.create({
          collection: 'products',
          data: {
            brand: p.brand,
            domain: p.domain,
            name: p.name,
            category,
            imgs: p.imgs.map((img) => ({ img })),
            rating: p.rating,
            reviews: p.reviews,
            specs: p.specs.map(([label, value]) => ({ label, value })),
            fits: p.fits.map((value) => ({ value })),
            desc: p.desc,
            ...(p.amazon ? { amazon: p.amazon } : {}),
            order,
          },
          ...ctx,
        })
      }
    }
  }

  if ((await payload.count({ collection: 'brands', req })).totalDocs === 0) {
    for (const line of ['auto', 'health'] as const) {
      const rows = MARQUEE_BRANDS[line]
      for (let order = 0; order < rows.length; order++) {
        const b = rows[order]
        await payload.create({
          collection: 'brands',
          data: {
            domain: b.domain,
            name: b.name,
            ...(b.href ? { href: b.href } : {}),
            line,
            order,
          },
          ...ctx,
        })
      }
    }
  }

  if ((await payload.count({ collection: 'shops', req })).totalDocs === 0) {
    for (let order = 0; order < SHOP_CARDS.length; order++) {
      const c = SHOP_CARDS[order]
      await payload.create({
        collection: 'shops',
        data: {
          brand: c.brand,
          shot: c.shot,
          rating: c.rating,
          blurb: c.blurb,
          cta: c.cta,
          order,
        },
        ...ctx,
      })
    }
  }
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_imgs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_fits" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "brands" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "shops" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_imgs" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_fits" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "brands" CASCADE;
  DROP TABLE "shops" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_brands_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_shops_fk";
  
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_brands_id_idx";
  DROP INDEX "payload_locked_documents_rels_shops_id_idx";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "brands_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "shops_id";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_products_category";
  DROP TYPE "public"."enum_brands_line";
  DROP TYPE "public"."enum_shops_brand";`)
}
