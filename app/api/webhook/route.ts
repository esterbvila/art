import { and, eq, inArray, sql } from "drizzle-orm";
import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { db } from "@/drizzle/client";
import { artworkSchema, orderSchema } from "@/drizzle/schema";
import { notifySale, sendOrderConfirmation } from "@/lib/email";
import { stripe } from "@/lib/stripe";

export const config = {
  api: { bodyParser: false },
};

type ArtworkMap = Record<string, { title: string; price: number }>;

type NewOrder = typeof orderSchema.$inferInsert;

async function resolvePaymentMethod(paymentIntentId: string | Stripe.PaymentIntent | null): Promise<string | null> {
  if (!paymentIntentId) {
    return null;
  }

  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId as string, {
      expand: ["payment_method"],
    });
    return (pi.payment_method as { type?: string } | null)?.type ?? null;
  } catch (e) {
    console.error("Failed to retrieve payment intent:", (e as Error).message);
    return null;
  }
}

async function fetchArtworks(artworkIds: string[]): Promise<ArtworkMap> {
  const rows = await db
    .select({
      id: artworkSchema.id,
      title: artworkSchema.title,
      price: artworkSchema.price,
    })
    .from(artworkSchema)
    .where(inArray(artworkSchema.id, artworkIds));

  const map: ArtworkMap = Object.fromEntries(rows.map(a => [a.id, { title: a.title, price: a.price }]));

  const missing = artworkIds.filter(id => !map[id]);
  if (missing.length) {
    console.warn("Artwork IDs not found in DB:", missing);
  }

  return map;
}

async function fetchAlreadyProcessedIds(sessionId: string, artworkIds: string[]): Promise<Set<string>> {
  try {
    const rows = await db
      .select({ artworkId: orderSchema.artworkId })
      .from(orderSchema)
      .where(and(eq(orderSchema.stripeSessionId, sessionId), inArray(orderSchema.artworkId, artworkIds)));

    return new Set(rows.map(r => r.artworkId).filter((id): id is string => id !== null));
  } catch (e) {
    console.error("Failed to check existing orders:", (e as Error).message);
    return new Set();
  }
}

async function insertOrderAndDecrementStock(orderRow: NewOrder): Promise<boolean> {
  try {
    await db.insert(orderSchema).values(orderRow);
  } catch (e) {
    const err = e as { code?: string; message: string };
    if (err.code === "23505") {
      console.info(`Order already exists for artwork ${orderRow.artworkId}, skipping.`);
    } else {
      console.error(`Failed to insert order for artwork ${orderRow.artworkId}:`, err.message);
    }
    return false;
  }
  if (!orderRow.artworkId) {
    return false;
  }

  try {
    await db
      .update(artworkSchema)
      .set({ stock: sql`${artworkSchema.stock} - 1` })
      .where(eq(artworkSchema.id, orderRow.artworkId));
  } catch (e) {
    console.error(`Failed to decrement stock for artwork ${orderRow.artworkId}:`, (e as Error).message);
  }

  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).end("Method not allowed");
  }

  const rawBody = await buffer(req);
  const sig = req.headers["stripe-signature"] as string;
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return res.status(500).send("Server misconfiguration");
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  if (event.type !== "checkout.session.completed") {
    return res.status(200).json({ received: true });
  }

  const session = await stripe.checkout.sessions.retrieve(event.data.object.id);

  const rawIds = session.metadata?.artworkIds ?? "";
  const artworkIds = rawIds.split(",").filter(Boolean);

  if (!artworkIds.length) {
    console.error("Webhook: no artworkIds in session metadata", { sessionId: session.id });
    return res.status(400).json({ error: "Missing artworkIds in metadata" });
  }

  const alreadyProcessed = await fetchAlreadyProcessedIds(session.id, artworkIds);
  const pendingIds = artworkIds.filter(id => !alreadyProcessed.has(id));

  if (!pendingIds.length) {
    console.info("Webhook: all artworks already processed for session", session.id);
    return res.status(200).json({ received: true });
  }

  const [paymentMethod, artworkMap] = await Promise.all([
    resolvePaymentMethod(session.payment_intent),
    fetchArtworks(pendingIds).catch((err: Error) => {
      console.error(err.message);
      return {} as ArtworkMap;
    }),
  ]);

  const shippingDetails = session.shipping_details ?? null;
  const addr = shippingDetails?.address ?? session.customer_details?.address ?? null;
  const shippingName = shippingDetails?.name ?? session.customer_details?.name ?? null;
  const customerMessage = session.custom_fields?.find(f => f.key === "message")?.text?.value ?? null;

  const sharedFields: NewOrder = {
    stripeSessionId: session.id,
    customerEmail: session.customer_details?.email ?? null,
    customerName: session.customer_details?.name ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    shippingName,
    shippingLine1: addr?.line1 ?? null,
    shippingLine2: addr?.line2 ?? null,
    shippingCity: addr?.city ?? null,
    shippingState: addr?.state ?? null,
    shippingPostalCode: addr?.postal_code ?? null,
    shippingCountry: addr?.country ?? null,
    paymentMethod,
    status: "completed",
    message: customerMessage,
  };

  await Promise.all(
    pendingIds.map(artworkId =>
      insertOrderAndDecrementStock({
        ...sharedFields,
        artworkId,
        amountCents: artworkMap[artworkId]?.price,
      }),
    ),
  );

  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    const allArtworks = artworkIds.map(id => artworkMap[id] ?? { title: "your painting", price: 0 });
    const emailPayload = {
      customerName: session.customer_details?.name ?? "there",
      artworks: allArtworks,
      amountCents: session.amount_total,
      shipping: { ...addr, name: shippingName },
      phone: session.customer_details?.phone ?? null,
      message: customerMessage,
    };

    await Promise.allSettled([
      sendOrderConfirmation({ to: customerEmail, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send order confirmation email:", err.message),
      ),
      notifySale({ customerEmail, paymentMethod, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send sale notification email:", err.message),
      ),
    ]);
  }

  return res.status(200).json({ received: true });
}
