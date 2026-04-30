"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";
import { stripe } from "@/features/payment/stripe";
import { resolveImages } from "@/lib/storage";

interface CartLineItem {
  id: string;
  type: "original" | "print";
  quantity: number;
}

const ALLOWED_COUNTRIES: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] = [
  "AC",
  "AD",
  "AE",
  "AF",
  "AG",
  "AI",
  "AL",
  "AM",
  "AO",
  "AQ",
  "AR",
  "AT",
  "AU",
  "AW",
  "AX",
  "AZ",
  "BA",
  "BB",
  "BD",
  "BE",
  "BF",
  "BG",
  "BH",
  "BI",
  "BJ",
  "BL",
  "BM",
  "BN",
  "BO",
  "BQ",
  "BR",
  "BS",
  "BT",
  "BV",
  "BW",
  "BY",
  "BZ",
  "CA",
  "CD",
  "CF",
  "CG",
  "CH",
  "CI",
  "CK",
  "CL",
  "CM",
  "CN",
  "CO",
  "CR",
  "CV",
  "CW",
  "CY",
  "CZ",
  "DE",
  "DJ",
  "DK",
  "DM",
  "DO",
  "DZ",
  "EC",
  "EE",
  "EG",
  "EH",
  "ER",
  "ES",
  "ET",
  "FI",
  "FJ",
  "FK",
  "FO",
  "FR",
  "GA",
  "GB",
  "GD",
  "GE",
  "GF",
  "GG",
  "GH",
  "GI",
  "GL",
  "GM",
  "GN",
  "GP",
  "GQ",
  "GR",
  "GS",
  "GT",
  "GU",
  "GW",
  "GY",
  "HK",
  "HN",
  "HR",
  "HT",
  "HU",
  "ID",
  "IE",
  "IL",
  "IM",
  "IN",
  "IO",
  "IQ",
  "IS",
  "IT",
  "JE",
  "JM",
  "JO",
  "JP",
  "KE",
  "KG",
  "KH",
  "KI",
  "KM",
  "KN",
  "KR",
  "KW",
  "KY",
  "KZ",
  "LA",
  "LB",
  "LC",
  "LI",
  "LK",
  "LR",
  "LS",
  "LT",
  "LU",
  "LV",
  "LY",
  "MA",
  "MC",
  "MD",
  "ME",
  "MF",
  "MG",
  "MK",
  "ML",
  "MM",
  "MN",
  "MO",
  "MQ",
  "MR",
  "MS",
  "MT",
  "MU",
  "MV",
  "MW",
  "MX",
  "MY",
  "MZ",
  "NA",
  "NC",
  "NE",
  "NG",
  "NI",
  "NL",
  "NO",
  "NP",
  "NR",
  "NU",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PF",
  "PG",
  "PH",
  "PK",
  "PL",
  "PM",
  "PN",
  "PR",
  "PS",
  "PT",
  "PY",
  "QA",
  "RE",
  "RO",
  "RS",
  "RU",
  "RW",
  "SA",
  "SB",
  "SC",
  "SD",
  "SE",
  "SG",
  "SH",
  "SI",
  "SJ",
  "SK",
  "SL",
  "SM",
  "SN",
  "SO",
  "SR",
  "SS",
  "ST",
  "SV",
  "SX",
  "SZ",
  "TA",
  "TC",
  "TD",
  "TF",
  "TG",
  "TH",
  "TJ",
  "TK",
  "TL",
  "TM",
  "TN",
  "TO",
  "TR",
  "TT",
  "TV",
  "TW",
  "TZ",
  "UA",
  "UG",
  "US",
  "UY",
  "UZ",
  "VA",
  "VC",
  "VE",
  "VG",
  "VN",
  "VU",
  "WF",
  "WS",
  "XK",
  "YE",
  "YT",
  "ZA",
  "ZM",
  "ZW",
  "ZZ",
];

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

  const resolvedImages = await Promise.all(artworks.map(async a => (await resolveImages(a.imageUrl))[0] ?? null));

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
    shipping_address_collection: {
      allowed_countries: ALLOWED_COUNTRIES,
    },
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

async function getBaseUrl() {
  const h = await headers();
  return (
    process.env.NEXT_PUBLIC_BASE_URL ??
    (() => {
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })()
  );
}

const SESSION_CONFIG = {
  mode: "payment" as const,
  customer_creation: "always" as const,
  custom_fields: [
    {
      key: "message",
      label: { type: "custom" as const, custom: "Message for the artist (optional)" },
      type: "text" as const,
      optional: true,
    },
  ],
  shipping_address_collection: { allowed_countries: ALLOWED_COUNTRIES },
  phone_number_collection: { enabled: true },
};

export async function createPrintCheckoutSession(artworkId: string, quantity: number): Promise<{ url: string }> {
  const result = await db
    .select({
      id: artworkSchema.id,
      title: artworkSchema.title,
      price: artworkSchema.price,
      imageUrl: artworkSchema.imageUrl,
      stock: artworkSchema.stock,
      slug: artworkSchema.slug,
    })
    .from(artworkSchema)
    .where(eq(artworkSchema.id, artworkId))
    .limit(1);

  const artwork = result[0];
  if (!artwork) {
    throw new Error("Artwork not found.");
  }
  if (artwork.stock < quantity) {
    throw new Error(`Not enough stock for "${artwork.title}".`);
  }

  const baseUrl = await getBaseUrl();
  const image = (await resolveImages(artwork.imageUrl))[0] ?? null;

  const session = await stripe.checkout.sessions.create({
    ...SESSION_CONFIG,
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${artwork.title} (Print)`,
            images: image ? [image] : [],
          },
          unit_amount: artwork.price,
        },
        quantity,
      },
    ],
    metadata: { artworkId, quantity: String(quantity) },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/${artwork.slug ?? artworkId}`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session.");
  }
  return { url: session.url };
}

export async function createCartCheckoutSession(cartItems: CartLineItem[]): Promise<{ url: string }> {
  if (!cartItems.length) {
    throw new Error("Cart is empty.");
  }

  const ids = cartItems.map(i => i.id);
  const artworks = await db
    .select({
      id: artworkSchema.id,
      title: artworkSchema.title,
      price: artworkSchema.price,
      imageUrl: artworkSchema.imageUrl,
      stock: artworkSchema.stock,
      slug: artworkSchema.slug,
      type: artworkSchema.type,
      collectionPrice: collectionSchema.price,
    })
    .from(artworkSchema)
    .leftJoin(collectionSchema, eq(artworkSchema.collectionId, collectionSchema.id))
    .where(inArray(artworkSchema.id, ids));

  const artworkMap = Object.fromEntries(artworks.map(a => [a.id, a]));

  for (const item of cartItems) {
    const artwork = artworkMap[item.id];
    if (!artwork) {
      throw new Error("An item in your cart was not found.");
    }
    if (artwork.stock < item.quantity) {
      throw new Error(`Not enough stock for "${artwork.title}".`);
    }
  }

  const baseUrl = await getBaseUrl();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = await Promise.all(
    cartItems.map(async item => {
      const artwork = artworkMap[item.id]!;
      const image = (await resolveImages(artwork.imageUrl))[0] ?? null;
      const unitAmount = artwork.price ?? (artwork.collectionPrice ? Number(artwork.collectionPrice) : 0);
      const name = item.type === "print" ? `${artwork.title} (Print)` : artwork.title;
      return {
        price_data: {
          currency: "eur",
          product_data: { name, images: image ? [image] : [] },
          unit_amount: unitAmount,
        },
        quantity: item.quantity,
      };
    }),
  );

  const session = await stripe.checkout.sessions.create({
    ...SESSION_CONFIG,
    line_items,
    metadata: { items: JSON.stringify(cartItems.map(i => ({ id: i.id, qty: i.quantity, type: i.type }))) },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session.");
  }
  return { url: session.url };
}
