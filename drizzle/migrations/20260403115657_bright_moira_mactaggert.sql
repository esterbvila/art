-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "contact_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "contact_submissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "artworks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"process" text,
	"medium" text,
	"dimensions" text,
	"year" text,
	"price" integer,
	"image_url" text NOT NULL,
	"stock" integer DEFAULT 1 NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"images" text[],
	"collection_id" uuid,
	"tagline" text,
	"visible" boolean DEFAULT true,
	"slug" text
);
--> statement-breakpoint
ALTER TABLE "artworks" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"artwork_id" uuid,
	"stripe_session_id" text NOT NULL,
	"amount_cents" integer,
	"customer_email" text,
	"status" text DEFAULT 'completed' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"customer_name" text,
	"customer_phone" text,
	"shipping_name" text,
	"shipping_line1" text,
	"shipping_line2" text,
	"shipping_city" text,
	"shipping_state" text,
	"shipping_postal_code" text,
	"shipping_country" text,
	"payment_method" text DEFAULT '',
	"message" text DEFAULT '',
	CONSTRAINT "orders_session_artwork_unique" UNIQUE("artwork_id","stripe_session_id")
);
--> statement-breakpoint
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"description_collection" text,
	"cover_image_url" text,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"tagline" text,
	"hero_image" text,
	"visible" boolean DEFAULT true,
	"description" text,
	"process" text,
	"medium" text,
	"year" text,
	"price" numeric,
	CONSTRAINT "collections_slug_key" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "collections" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "artworks" ADD CONSTRAINT "artworks_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_artwork_id_fkey" FOREIGN KEY ("artwork_id") REFERENCES "public"."artworks"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "artworks_collection_id_idx" ON "artworks" USING btree ("collection_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "artworks_featured_idx" ON "artworks" USING btree ("featured" bool_ops);--> statement-breakpoint
CREATE INDEX "orders_artwork_id_idx" ON "orders" USING btree ("artwork_id" uuid_ops);--> statement-breakpoint
CREATE INDEX "orders_stripe_id_idx" ON "orders" USING btree ("stripe_session_id" text_ops);--> statement-breakpoint
CREATE POLICY "artworks: public read" ON "artworks" AS PERMISSIVE FOR SELECT TO public USING (true);--> statement-breakpoint
CREATE POLICY "Public read" ON "collections" AS PERMISSIVE FOR SELECT TO public USING (true);
*/