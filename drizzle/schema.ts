import { sql } from "drizzle-orm";
import {
  boolean,
  foreignKey,
  index,
  integer,
  numeric,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const contactSubmissionSchema = pgTable("contact_submissions", {
  id: uuid().defaultRandom().primaryKey().notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text().notNull(),
  message: text().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
});

export const artworkSchema = pgTable(
  "artworks",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    title: text().notNull(),
    description: text(),
    process: text(),
    medium: text(),
    dimensions: text(),
    year: text(),
    price: integer().notNull(),
    imageUrl: text("image_url").notNull(),
    stock: integer().default(1).notNull(),
    featured: boolean().default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    images: text().array(),
    collectionId: uuid("collection_id"),
    tagline: text(),
    visible: boolean().default(true),
    slug: text(),
  },
  table => [
    index("artworks_collection_id_idx").using("btree", table.collectionId.asc().nullsLast().op("uuid_ops")),
    index("artworks_featured_idx").using("btree", table.featured.asc().nullsLast().op("bool_ops")),
    foreignKey({
      columns: [table.collectionId],
      foreignColumns: [collectionSchema.id],
      name: "artworks_collection_id_fkey",
    }),
    pgPolicy("artworks: public read", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
  ],
);

export const orderSchema = pgTable(
  "orders",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    artworkId: uuid("artwork_id"),
    stripeSessionId: text("stripe_session_id").notNull(),
    amountCents: integer("amount_cents"),
    customerEmail: text("customer_email"),
    status: text().default("completed").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow().notNull(),
    customerName: text("customer_name"),
    customerPhone: text("customer_phone"),
    shippingName: text("shipping_name"),
    shippingLine1: text("shipping_line1"),
    shippingLine2: text("shipping_line2"),
    shippingCity: text("shipping_city"),
    shippingState: text("shipping_state"),
    shippingPostalCode: text("shipping_postal_code"),
    shippingCountry: text("shipping_country"),
    paymentMethod: text("payment_method"),
    message: text(),
  },
  table => [
    index("orders_artwork_id_idx").using("btree", table.artworkId.asc().nullsLast().op("uuid_ops")),
    index("orders_stripe_id_idx").using("btree", table.stripeSessionId.asc().nullsLast().op("text_ops")),
    foreignKey({
      columns: [table.artworkId],
      foreignColumns: [artworkSchema.id],
      name: "orders_artwork_id_fkey",
    }).onDelete("set null"),
    unique("orders_session_artwork_unique").on(table.artworkId, table.stripeSessionId),
  ],
);

export const collectionSchema = pgTable(
  "collections",
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: text().notNull(),
    name: text().notNull(),
    descriptionCollection: text("description_collection"),
    coverImageUrl: text("cover_image_url"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "string" }).defaultNow(),
    tagline: text(),
    heroImage: text("hero_image"),
    visible: boolean().default(true),
    description: text(),
    process: text(),
    medium: text(),
    year: text(),
    price: numeric(),
  },
  table => [
    unique("collections_slug_key").on(table.slug),
    pgPolicy("Public read", { as: "permissive", for: "select", to: ["public"], using: sql`true` }),
  ],
);
