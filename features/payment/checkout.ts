"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";
import { resolveFirstImage } from "@/lib/storage";
import { stripe } from "@/lib/stripe";

export async function createCheckoutSession(artworkIds: string[]): Promise<{ url: string }> {
  if (!artworkIds.length) {
    throw new Error("No artwork IDs provided.");
  }
  const artworks = await db
    .select({
      id: artworkSchema.id,
      title: artworkSchema.title,
      price: artworkSchema.price,
      imageUrl: artworkSchema.imageUrl,
      stock: artworkSchema.stock,
      collectionPrice: collectionSchema.price,
    })
    .from(artworkSchema)
    .leftJoin(collectionSchema, eq(artworkSchema.collectionId, collectionSchema.id))
    .where(inArray(artworkSchema.id, artworkIds));

  if (!artworks.length) {
    throw new Error("Artwork not found.");
  }

  const outOfStock = artworks.find(a => a.stock <= 0);
  if (outOfStock) {
    throw new Error(`"${outOfStock.title}" is no longer available.`);
  }

  const h = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (() => {
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })();

  const resolvedImages = await Promise.all(artworks.map(a => resolveFirstImage(a.imageUrl)));

  const line_items = artworks.map((artwork, i) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: artwork.title,
        images: resolvedImages[i] ? [resolvedImages[i]!] : [],
      },
      unit_amount: artwork.price ?? artwork.collectionPrice ?? 0,
    },
    quantity: 1,
  }));

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    customer_creation: "always",
    custom_fields: [
      {
        key: "message",
        label: { type: "custom", custom: "Message for the artist (optional)" },
        type: "text",
        optional: true,
      },
    ],
    phone_number_collection: { enabled: true },
    metadata: { artworkIds: artworkIds.join(",") },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: artworkIds.length === 1 ? `${baseUrl}/${artworkIds[0]}` : `${baseUrl}/`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session.");
  }

  return { url: session.url };
}
