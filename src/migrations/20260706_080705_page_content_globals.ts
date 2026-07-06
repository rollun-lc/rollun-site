import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "home_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_subheading" varchar DEFAULT 'Rollun is a U.S.-based e-commerce distribution company focused on automotive parts & accessories and health products.' NOT NULL,
  	"product_lines_eyebrow" varchar DEFAULT 'What we do' NOT NULL,
  	"product_lines_title" varchar DEFAULT 'Two focused product lines' NOT NULL,
  	"product_lines_intro" varchar DEFAULT 'Focused expertise in two categories where automation, sourcing, and marketplace operations create real advantage.' NOT NULL,
  	"stats_title" varchar DEFAULT 'Proven at scale' NOT NULL,
  	"benefits_title" varchar DEFAULT 'Key benefits' NOT NULL,
  	"marketplaces_eyebrow" varchar DEFAULT 'Where to buy' NOT NULL,
  	"marketplaces_title" varchar DEFAULT 'Find us on marketplaces' NOT NULL,
  	"cta_heading" varchar DEFAULT 'Let''s talk business' NOT NULL,
  	"cta_intro" varchar DEFAULT 'Wholesale, partnership, and marketplace operations.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_subheading" varchar DEFAULT 'A traditional business mindset powered by modern operations and automation.' NOT NULL,
  	"approach_title" varchar DEFAULT 'Our approach' NOT NULL,
  	"automation_lede" varchar DEFAULT 'We scale through innovation and technology — not by expanding headcount. Internal tools and process automation reduce operational costs and keep execution consistent, year after year.' NOT NULL,
  	"keeptoship_tag" varchar DEFAULT 'Our technological startup' NOT NULL,
  	"keeptoship_cta_heading" varchar DEFAULT 'Want to work with us?' NOT NULL,
  	"keeptoship_cta_text" varchar DEFAULT 'Invest, store products in your area, or use KeepToShip in your free time.' NOT NULL,
  	"us_presence_title" varchar DEFAULT 'US presence' NOT NULL,
  	"team_ceo_photo_id" integer,
  	"team_quote" varchar DEFAULT 'A small, stable team that has worked together for years — disciplined operators on the business side, sharp engineers on the platform side. We hire slowly, invest in tooling, and let the work speak for itself.' NOT NULL,
  	"team_ceo_name" varchar DEFAULT 'Natalia Gretchukha' NOT NULL,
  	"team_ceo_role" varchar DEFAULT 'CEO' NOT NULL,
  	"cta_heading" varchar DEFAULT 'Let''s talk business' NOT NULL,
  	"cta_sub" varchar DEFAULT 'Wholesale, partnership, and marketplace operations.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "catalog_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'What we distribute' NOT NULL,
  	"hero_title" varchar DEFAULT 'Catalog' NOT NULL,
  	"hero_intro" varchar DEFAULT 'Explore our two main product lines. For purchases, you’ll be redirected to our marketplace stores.' NOT NULL,
  	"hero_redirect_note" varchar DEFAULT 'Buy on marketplaces' NOT NULL,
  	"entrances_head_eyebrow" varchar DEFAULT 'Where to start' NOT NULL,
  	"entrances_head_title" varchar DEFAULT 'Choose a product line' NOT NULL,
  	"entrances_auto_image_id" integer,
  	"entrances_health_image_id" integer,
  	"brands_eyebrow" varchar DEFAULT 'Trusted partners' NOT NULL,
  	"brands_title" varchar DEFAULT 'Brands we work with' NOT NULL,
  	"brands_auto_cat_label" varchar DEFAULT 'Automotive & Motorcycle' NOT NULL,
  	"brands_health_cat_label" varchar DEFAULT 'Health & Wellness' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "brands_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Private Label' NOT NULL,
  	"hero_title" varchar DEFAULT 'Our Brands' NOT NULL,
  	"hero_intro" varchar DEFAULT 'We build and grow brands with a long-term focus on quality and customer experience — not only distribution, but products we own and stand behind.' NOT NULL,
  	"brand_status" varchar DEFAULT 'In active development' NOT NULL,
  	"brand_h2" varchar DEFAULT 'Mototou' NOT NULL,
  	"brand_sub" varchar DEFAULT 'Motorcycle parts & accessories' NOT NULL,
  	"story_eyebrow" varchar DEFAULT 'Mototou' NOT NULL,
  	"story_title" varchar DEFAULT 'Our story' NOT NULL,
  	"story_lead" varchar DEFAULT 'MOTOTOU began with sourcing and manufacturing, focusing on accessibility and value for customers in the US. As the brand evolving, our priority shifting toward stronger standards and better control over production.' NOT NULL,
  	"story_pull" varchar DEFAULT 'Our goal is simple: deliver products riders can install with confidence and use without doubt.' NOT NULL,
  	"products_eyebrow" varchar DEFAULT 'What we make' NOT NULL,
  	"products_title" varchar DEFAULT 'Our products' NOT NULL,
  	"products_reflectors_image_id" integer,
  	"products_filters_image_id" integer,
  	"trademark_eyebrow" varchar DEFAULT 'Registered & protected' NOT NULL,
  	"trademark_title" varchar DEFAULT 'A U.S. registered trademark' NOT NULL,
  	"trademark_cert_image_id" integer,
  	"cta_sub" varchar DEFAULT 'For distribution, retail partnership, or early access to new products — we''d love to hear from you.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "shops_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Where to buy' NOT NULL,
  	"hero_title" varchar DEFAULT 'Our stores' NOT NULL,
  	"hero_intro" varchar DEFAULT 'Visit us in person at our store in Texas, or shop the full Rollun catalog online across the marketplaces you trust.' NOT NULL,
  	"store_eyebrow" varchar DEFAULT 'In person' NOT NULL,
  	"store_title" varchar DEFAULT 'Visit our store in Texas' NOT NULL,
  	"store_intro" varchar DEFAULT 'Drop by our Texas location for parts, accessories, and friendly face-to-face support.' NOT NULL,
  	"store_location_label" varchar DEFAULT 'Location' NOT NULL,
  	"store_photo_id" integer,
  	"shops_eyebrow" varchar DEFAULT 'Buy online' NOT NULL,
  	"shops_title" varchar DEFAULT 'Shop on marketplaces' NOT NULL,
  	"shops_intro" varchar DEFAULT 'Same Rollun catalog, backed by thousands of verified ratings across major platforms.' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "contact_content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_eyebrow" varchar DEFAULT 'Get in touch' NOT NULL,
  	"hero_title" varchar DEFAULT 'Contact us' NOT NULL,
  	"map_eyebrow" varchar DEFAULT 'Find us' NOT NULL,
  	"map_title" varchar DEFAULT 'Our locations' NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "about_content" ADD CONSTRAINT "about_content_team_ceo_photo_id_media_id_fk" FOREIGN KEY ("team_ceo_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalog_content" ADD CONSTRAINT "catalog_content_entrances_auto_image_id_media_id_fk" FOREIGN KEY ("entrances_auto_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "catalog_content" ADD CONSTRAINT "catalog_content_entrances_health_image_id_media_id_fk" FOREIGN KEY ("entrances_health_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_content" ADD CONSTRAINT "brands_content_products_reflectors_image_id_media_id_fk" FOREIGN KEY ("products_reflectors_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_content" ADD CONSTRAINT "brands_content_products_filters_image_id_media_id_fk" FOREIGN KEY ("products_filters_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "brands_content" ADD CONSTRAINT "brands_content_trademark_cert_image_id_media_id_fk" FOREIGN KEY ("trademark_cert_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "shops_content" ADD CONSTRAINT "shops_content_store_photo_id_media_id_fk" FOREIGN KEY ("store_photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "about_content_team_team_ceo_photo_idx" ON "about_content" USING btree ("team_ceo_photo_id");
  CREATE INDEX "catalog_content_entrances_entrances_auto_image_idx" ON "catalog_content" USING btree ("entrances_auto_image_id");
  CREATE INDEX "catalog_content_entrances_entrances_health_image_idx" ON "catalog_content" USING btree ("entrances_health_image_id");
  CREATE INDEX "brands_content_products_products_reflectors_image_idx" ON "brands_content" USING btree ("products_reflectors_image_id");
  CREATE INDEX "brands_content_products_products_filters_image_idx" ON "brands_content" USING btree ("products_filters_image_id");
  CREATE INDEX "brands_content_trademark_trademark_cert_image_idx" ON "brands_content" USING btree ("trademark_cert_image_id");
  CREATE INDEX "shops_content_store_store_photo_idx" ON "shops_content" USING btree ("store_photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "home_content" CASCADE;
  DROP TABLE "about_content" CASCADE;
  DROP TABLE "catalog_content" CASCADE;
  DROP TABLE "brands_content" CASCADE;
  DROP TABLE "shops_content" CASCADE;
  DROP TABLE "contact_content" CASCADE;`)
}
