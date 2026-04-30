"use server";

import { eq, inArray } from "drizzle-orm";
import { headers } from "next/headers";
import Stripe from "stripe";
import { db } from "@/drizzle/client";
import { artworkSchema, collectionSchema, printSchema } from "@/drizzle/schema";
import { stripe } from "@/features/payment/stripe";
import { resolveImages } from "@/lib/storage";

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

export async function createCheckoutSession(
  artworkIds: string[],
  printItems: { id: string; qty: number }[] = [],
): Promise<{ url: string }> {
  if (!artworkIds.length && !printItems.length) {
    throw new Error("Cart is empty.");
  }

  const h = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (() => {
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })();

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  if (artworkIds.length) {
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

    const resolvedImages = await Promise.all(artworks.map(async a => (await resolveImages(a.imageUrl))[0] ?? null));

    for (const [i, artwork] of artworks.entries()) {
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: artwork.title,
            images: resolvedImages[i] ? [resolvedImages[i]!] : [],
          },
          unit_amount: artwork.price ?? artwork.collectionPrice ?? 0,
        },
        quantity: 1,
      });
    }
  }

  if (printItems.length) {
    const printIds = printItems.map(p => p.id);
    const prints = await db
      .select({
        id: printSchema.id,
        title: artworkSchema.title,
        price: printSchema.price,
        stock: printSchema.stock,
        imageUrl: artworkSchema.imageUrl,
      })
      .from(printSchema)
      .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
      .where(inArray(printSchema.id, printIds));

    const outOfStock = prints.find(p => p.stock <= 0);
    if (outOfStock) {
      throw new Error(`"${outOfStock.title}" print is no longer available.`);
    }

    const resolvedImages = await Promise.all(prints.map(async p => (await resolveImages(p.imageUrl))[0] ?? null));

    for (const [i, print] of prints.entries()) {
      const qty = printItems.find(p => p.id === print.id)?.qty ?? 1;
      line_items.push({
        price_data: {
          currency: "eur",
          product_data: {
            name: `${print.title} (Print)`,
            images: resolvedImages[i] ? [resolvedImages[i]!] : [],
          },
          unit_amount: print.price,
        },
        quantity: qty,
      });
    }
  }

  const metadata: Record<string, string> = {};
  if (artworkIds.length) { metadata.artworkIds = artworkIds.join(","); }
  if (printItems.length) { metadata.printItems = JSON.stringify(printItems); }

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
    metadata,
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session.");
  }

  return { url: session.url };
}

export async function createPrintCheckoutSession(printId: string, quantity: number): Promise<{ url: string }> {
  const result = await db
    .select({
      id: printSchema.id,
      title: artworkSchema.title,
      price: printSchema.price,
      stock: printSchema.stock,
      imageUrl: artworkSchema.imageUrl,
    })
    .from(printSchema)
    .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
    .where(eq(printSchema.id, printId))
    .limit(1);

  const print = result[0];
  if (!print) {
    throw new Error("Print not found.");
  }

  if (print.stock <= 0) {
    throw new Error(`"${print.title}" is no longer available.`);
  }

  const h = await headers();
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (() => {
      const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
      const proto = h.get("x-forwarded-proto") ?? "http";
      return `${proto}://${host}`;
    })();

  const image = (await resolveImages(print.imageUrl))[0] ?? null;

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: `${print.title} (Print)`,
            images: image ? [image] : [],
          },
          unit_amount: print.price,
        },
        quantity,
      },
    ],
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
    metadata: { printId, quantity: String(quantity) },
    success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/prints/${printId}`,
  });

  if (!session.url) {
    throw new Error("Failed to create checkout session.");
  }

  return { url: session.url };
}
