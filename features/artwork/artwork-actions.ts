import { and, asc, desc, eq, gt, isNull, ne, notInArray } from "drizzle-orm";
import { cache } from "react";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";
import { resolveDisplayImage } from "@/lib/storage";

export async function getArtworksWithoutCollection() {
  const result = await db
    .select()
    .from(artworkSchema)
    .where(and(isNull(artworkSchema.collectionId), eq(artworkSchema.visible, true)))
    .orderBy(desc(artworkSchema.stock), desc(artworkSchema.createdAt));

  return Promise.all(
    result.map(async artwork => ({
      ...artwork,
      imageUrl: await resolveDisplayImage(artwork.imageUrl),
    })),
  );
}

export async function getArtworksByCollection(collectionId: string) {
  return db
    .select()
    .from(artworkSchema)
    .where(and(eq(artworkSchema.collectionId, collectionId), eq(artworkSchema.visible, true)))
    .orderBy(asc(artworkSchema.createdAt));
}

export async function getFeaturedArtwork() {
  const result = await db.select().from(artworkSchema).where(eq(artworkSchema.featured, true)).limit(1);

  const featuredRaw = result[0] ?? null;

  if (!featuredRaw) {
    return null;
  }

  return {
    ...featuredRaw,
    imageUrl: await resolveDisplayImage(featuredRaw.imageUrl),
  };
}

export const getArtworkBySlug = cache(async (slug: string) => {
  const result = await db.query.artworkSchema.findFirst({
    where: eq(artworkSchema.slug, slug),
    with: { collection: true },
  });

  return result ?? null;
});

export async function getRelatedArtworks(artwork: typeof artworkSchema.$inferSelect, limit = 4) {
  const collectionId = artwork.collectionId;

  const sameCollection = collectionId
    ? await db
        .select()
        .from(artworkSchema)
        .leftJoin(collectionSchema, eq(artworkSchema.collectionId, collectionSchema.id))
        .where(
          and(
            eq(artworkSchema.visible, true),
            eq(artworkSchema.collectionId, collectionId),
            ne(artworkSchema.id, artwork.id),
            gt(artworkSchema.stock, 0),
          ),
        )
        .limit(limit)
    : [];

  const excludeIds = sameCollection.map(a => a.artworks.id);
  const remaining = limit - sameCollection.length;

  const others =
    remaining > 0
      ? (
          await db
            .select()
            .from(artworkSchema)
            .leftJoin(collectionSchema, eq(artworkSchema.collectionId, collectionSchema.id))
            .where(
              and(
                eq(artworkSchema.visible, true),
                gt(artworkSchema.stock, 0),
                excludeIds.length > 0 ? notInArray(artworkSchema.id, excludeIds) : undefined,
                ne(artworkSchema.id, artwork.id),
              ),
            )
            .limit(remaining * 3)
        )
          .sort(() => Math.random() - 0.5)
          .slice(0, remaining)
      : [];

  return Promise.all(
    [...sameCollection, ...others].map(async a => ({
      ...a.artworks,
      imageUrl: await resolveDisplayImage(a.artworks.imageUrl),
    })),
  );
}
