import { and, asc, desc, eq, gt, isNull, ne, notInArray } from "drizzle-orm";
import { getRLSDb } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";
import { resolveFirstImage } from "@/lib/storage";

export async function getArtworksWithoutCollection() {
  const db = await getRLSDb();
  const result = await db(tx =>
    tx
      .select()
      .from(artworkSchema)
      .where(and(isNull(artworkSchema.collectionId), eq(artworkSchema.visible, true)))
      .orderBy(desc(artworkSchema.stock), desc(artworkSchema.createdAt)),
  );

  return Promise.all(
    result.map(async artwork => ({
      ...artwork,
      imageUrl: (await resolveFirstImage(artwork.imageUrl)) ?? artwork.imageUrl,
    })),
  );
}

export async function getArtworksByCollection(collectionId: string) {
  const db = await getRLSDb();
  return db(tx =>
    tx
      .select()
      .from(artworkSchema)
      .where(and(eq(artworkSchema.collectionId, collectionId), eq(artworkSchema.visible, true)))
      .orderBy(asc(artworkSchema.createdAt)),
  );
}

export async function getFeaturedArtwork() {
  const db = await getRLSDb();
  const result = await db(tx => tx.select().from(artworkSchema).where(eq(artworkSchema.featured, true)).limit(1));

  const featuredRaw = result[0] ?? null;

  if (!featuredRaw) {
    return null;
  }

  return {
    ...featuredRaw,
    imageUrl: (await resolveFirstImage(featuredRaw.imageUrl)) ?? featuredRaw.imageUrl,
  };
}

export async function getArtworkBySlug(slug: string) {
  const db = await getRLSDb();
  const result = await db(tx =>
    tx.query.artworkSchema.findFirst({
      where: eq(artworkSchema.slug, slug),
      with: { collection: true },
    }),
  );

  return result ?? null;
}

export async function getRelatedArtworks(artwork: typeof artworkSchema.$inferSelect, limit = 4) {
  const db = await getRLSDb();
  const collectionId = artwork.collectionId;

  const sameCollection = collectionId
    ? await db(tx =>
        tx
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
          .limit(limit),
      )
    : [];

  const excludeIds = sameCollection.map(a => a.artworks.id);
  const remaining = limit - sameCollection.length;

  const others =
    remaining > 0
      ? (
          await db(tx =>
            tx
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
              .limit(remaining * 3),
          )
        )
          .sort(() => Math.random() - 0.5)
          .slice(0, remaining)
      : [];

  return Promise.all(
    [...sameCollection, ...others].map(async a => ({
      ...a.artworks,
      imageUrl: (await resolveFirstImage(a.artworks.imageUrl)) ?? a.artworks.imageUrl,
    })),
  );
}
