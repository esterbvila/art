import { eq, ne } from "drizzle-orm";
import { db } from "@/drizzle/client";
import { artworkSchema, printSchema } from "@/drizzle/schema";
import { resolveDisplayImage, resolveImages } from "@/lib/storage";

export async function getPrints() {
  const result = await db
    .select({
      id: printSchema.id,
      size: printSchema.size,
      material: printSchema.material,
      price: printSchema.price,
      stock: printSchema.stock,
      artworkId: printSchema.artworkId,
      title: artworkSchema.title,
      imageUrl: artworkSchema.imageUrl,
      slug: artworkSchema.slug,
    })
    .from(printSchema)
    .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id));

  return Promise.all(
    result.map(async print => ({
      ...print,
      imageUrl: await resolveDisplayImage(print.imageUrl),
    })),
  );
}

export async function getRelatedPrints(printId: string, limit = 4) {
  const result = await db
    .select({
      id: printSchema.id,
      size: printSchema.size,
      material: printSchema.material,
      price: printSchema.price,
      stock: printSchema.stock,
      artworkId: printSchema.artworkId,
      title: artworkSchema.title,
      imageUrl: artworkSchema.imageUrl,
      slug: artworkSchema.slug,
    })
    .from(printSchema)
    .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
    .where(ne(printSchema.id, printId))
    .limit(limit);

  return Promise.all(
    result.map(async print => ({
      ...print,
      imageUrl: await resolveDisplayImage(print.imageUrl),
    })),
  );
}

export async function getPrintById(id: string) {
  const result = await db
    .select({
      id: printSchema.id,
      size: printSchema.size,
      material: printSchema.material,
      price: printSchema.price,
      stock: printSchema.stock,
      artworkId: printSchema.artworkId,
      title: artworkSchema.title,
      imageUrl: artworkSchema.imageUrl,
      slug: artworkSchema.slug,
    })
    .from(printSchema)
    .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
    .where(eq(printSchema.id, id))
    .limit(1);

  const print = result[0] ?? null;
  if (!print) {
    return null;
  }

  const images = await resolveImages(print.imageUrl);
  return { ...print, images };
}
