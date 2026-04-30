import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { db } from "@/drizzle/client";
import { artworkSchema, orderSchema } from "@/drizzle/schema";
import type { EmailItem } from "@/features/email/email";
import { notifySale, sendOrderConfirmation } from "@/features/email/email";
import { stripe } from "@/features/payment/stripe";

type ArtworkRow = { id: string; title: string; price: number; type: string | null };
type NewOrder = typeof orderSchema.$inferInsert;

async function resolvePaymentMethod(paymentIntentId: string | Stripe.PaymentIntent | null): Promise<string | null> {
  if (!paymentIntentId) {
    return null;
  }
  try {
    const pi = await stripe.paymentIntents.retrieve(paymentIntentId as string, { expand: ["payment_method"] });
    return (pi.payment_method as { type?: string } | null)?.type ?? null;
  } catch (e) {
    console.error("Failed to retrieve payment intent:", (e as Error).message);
    return null;
  }
}

async function fetchArtworksByIds(ids: string[]): Promise<ArtworkRow[]> {
  return db
    .select({ id: artworkSchema.id, title: artworkSchema.title, price: artworkSchema.price, type: artworkSchema.type })
    .from(artworkSchema)
    .where(inArray(artworkSchema.id, ids));
}

async function insertOrderAndDecrementStock(orderRow: NewOrder): Promise<boolean> {
  const quantity = orderRow.quantity ?? 1;
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
      .set({ stock: sql`${artworkSchema.stock} - ${quantity}` })
      .where(eq(artworkSchema.id, orderRow.artworkId));
  } catch (e) {
    console.error(`Failed to decrement stock for artwork ${orderRow.artworkId}:`, (e as Error).message);
  }

  return true;
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("Missing STRIPE_WEBHOOK_SECRET");
    return new Response("Server misconfiguration", { status: 500 });
  }

  const rawBody = await request.text();
  const stripeSignature = request.headers.get("stripe-signature");
  if (!stripeSignature) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: ReturnType<typeof stripe.webhooks.constructEvent>;
  try {
    event = stripe.webhooks.constructEvent(rawBody, stripeSignature, secret);
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return Response.json({ received: true }, { status: 200 });
  }

  const session = await stripe.checkout.sessions.retrieve(event.data.object.id);
  const meta = session.metadata ?? {};

  const customerDetails = session.customer_details ?? null;
  const address = customerDetails?.address ?? null;
  const shippingName = customerDetails?.name ?? null;
  const customerMessage = session.custom_fields?.find(f => f.key === "message")?.text?.value ?? null;

  const baseOrder: Omit<NewOrder, "artworkId" | "amountCents" | "quantity"> = {
    stripeSessionId: session.id,
    customerEmail: customerDetails?.email ?? null,
    customerName: customerDetails?.name ?? null,
    customerPhone: customerDetails?.phone ?? null,
    shippingName,
    shippingLine1: address?.line1 ?? null,
    shippingLine2: address?.line2 ?? null,
    shippingCity: address?.city ?? null,
    shippingState: address?.state ?? null,
    shippingPostalCode: address?.postal_code ?? null,
    shippingCountry: address?.country ?? null,
    paymentMethod: null,
    status: "completed",
    message: customerMessage,
  };

  const paymentMethod = await resolvePaymentMethod(session.payment_intent);
  const orderBase: NewOrder = { ...baseOrder, paymentMethod };

  let emailItems: EmailItem[] = [];

  // Case 1: single print direct purchase (metadata.artworkId + quantity)
  if (meta.artworkId) {
    const quantity = parseInt(meta.quantity ?? "1", 10);
    const rows = await fetchArtworksByIds([meta.artworkId]);
    const artwork = rows[0];

    if (artwork) {
      await insertOrderAndDecrementStock({
        ...orderBase,
        artworkId: meta.artworkId,
        amountCents: session.amount_total,
        quantity,
      });
      emailItems = [{ title: artwork.title, price: artwork.price, type: "print", quantity }];
    }

  // Case 2: cart checkout (metadata.items JSON)
  } else if (meta.items) {
    const cartItems: { id: string; qty: number; type: "original" | "print" }[] = JSON.parse(meta.items);
    const ids = cartItems.map(i => i.id);
    const rows = await fetchArtworksByIds(ids);
    const artworkMap = Object.fromEntries(rows.map(a => [a.id, a]));

    await Promise.all(
      cartItems.map(item =>
        insertOrderAndDecrementStock({
          ...orderBase,
          artworkId: item.id,
          amountCents: artworkMap[item.id]?.price ?? null,
          quantity: item.qty,
        }),
      ),
    );

    emailItems = cartItems.map(item => ({
      title: artworkMap[item.id]?.title ?? "your item",
      price: artworkMap[item.id]?.price ?? 0,
      type: item.type,
      quantity: item.qty,
    }));

  // Case 3: original artwork direct purchase (existing metadata.artworkIds)
  } else if (meta.artworkIds) {
    const artworkIds = meta.artworkIds.split(",").filter(Boolean);

    const alreadyProcessed = await (async () => {
      try {
        const rows = await db
          .select({ artworkId: orderSchema.artworkId })
          .from(orderSchema)
          .where(and(eq(orderSchema.stripeSessionId, session.id), inArray(orderSchema.artworkId, artworkIds)));
        return new Set(rows.map(r => r.artworkId).filter((id): id is string => id !== null));
      } catch {
        return new Set<string>();
      }
    })();

    const pendingIds = artworkIds.filter(id => !alreadyProcessed.has(id));
    if (!pendingIds.length) {
      return Response.json({ received: true }, { status: 200 });
    }

    const rows = await fetchArtworksByIds(pendingIds);
    const artworkMap = Object.fromEntries(rows.map(a => [a.id, a]));

    await Promise.all(
      pendingIds.map(artworkId =>
        insertOrderAndDecrementStock({
          ...orderBase,
          artworkId,
          amountCents: artworkMap[artworkId]?.price ?? null,
          quantity: 1,
        }),
      ),
    );

    emailItems = artworkIds.map(id => ({
      title: artworkMap[id]?.title ?? "your painting",
      price: artworkMap[id]?.price ?? 0,
      type: "original" as const,
      quantity: 1,
    }));

  } else {
    console.error("Webhook: unrecognised metadata", { sessionId: session.id, meta });
    return Response.json({ error: "Missing metadata" }, { status: 400 });
  }

  revalidatePath("/", "layout");

  const customerEmail = session.customer_details?.email;
  if (customerEmail && emailItems.length) {
    const emailPayload = {
      customerName: session.customer_details?.name ?? "there",
      items: emailItems,
      amountCents: session.amount_total,
      shipping: { ...address, name: shippingName },
      phone: session.customer_details?.phone ?? null,
      message: customerMessage,
    };

    await Promise.allSettled([
      sendOrderConfirmation({ to: customerEmail, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send order confirmation:", err.message),
      ),
      notifySale({ customerEmail, paymentMethod, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send sale notification:", err.message),
      ),
    ]);
  }

  return Response.json({ received: true }, { status: 200 });
}
