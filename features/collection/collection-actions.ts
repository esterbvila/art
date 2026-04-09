import { and, asc, eq, getTableColumns, sql } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";

export async function getCollections() {
  return db
    .select({
      ...getTableColumns(collectionSchema),
      artworkCount: sql<number>`count(${artworkSchema.id})`,
    })
    .from(collectionSchema)
    .leftJoin(artworkSchema, and(eq(artworkSchema.collectionId, collectionSchema.id), eq(artworkSchema.visible, true)))
    .where(eq(collectionSchema.visible, true))
    .groupBy(collectionSchema.id)
    .orderBy(asc(collectionSchema.sortOrder));
}
