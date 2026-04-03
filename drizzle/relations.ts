import { relations } from "drizzle-orm/relations";
import { artworkSchema, collectionSchema, orderSchema } from "./schema";

export const artworksRelations = relations(artworkSchema, ({ one, many }) => ({
  collection: one(collectionSchema, {
    fields: [artworkSchema.collectionId],
    references: [collectionSchema.id],
  }),
  orders: many(orderSchema),
}));

export const collectionsRelations = relations(collectionSchema, ({ many }) => ({
  artworks: many(artworkSchema),
}));

export const ordersRelations = relations(orderSchema, ({ one }) => ({
  artwork: one(artworkSchema, {
    fields: [orderSchema.artworkId],
    references: [artworkSchema.id],
  }),
}));
