import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";
import { resolveImages } from "@/lib/storage";

export async function getCollections() {
  const collections = await db
    .select({
      ...getTableColumns(collectionSchema),
      artworkCount: sql<number>`count(${artworkSchema.id})`,
    })
    .from(collectionSchema)
    .leftJoin(artworkSchema, and(eq(artworkSchema.collectionId, collectionSchema.id), eq(artworkSchema.visible, true)))
    .where(eq(collectionSchema.visible, true))
    .groupBy(collectionSchema.id)
    .orderBy(asc(collectionSchema.sortOrder));

  return Promise.all(
    collections.map(async collection => ({
      ...collection,
      coverImageUrl: collection.coverImageUrl ? ((await resolveImages(collection.coverImageUrl))[0] ?? null) : null,
      heroImage: collection.heroImage ? ((await resolveImages(collection.heroImage))[0] ?? null) : null,
    })),
  );
}
