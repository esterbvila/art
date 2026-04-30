import { and, eq, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import Stripe from "stripe";
import { db } from "@/drizzle/client";
import { artworkSchema, orderSchema, printSchema } from "@/drizzle/schema";
import { notifySale, sendOrderConfirmation } from "@/features/email/email";
import { stripe } from "@/features/payment/stripe";

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

async function handlePrintCheckout(session: Stripe.Checkout.Session, printId: string): Promise<Response> {
  const quantity = parseInt(session.metadata?.quantity ?? "1", 10);

  const result = await db
    .select({ id: printSchema.id, title: artworkSchema.title, price: printSchema.price, stock: printSchema.stock })
    .from(printSchema)
    .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
    .where(eq(printSchema.id, printId))
    .limit(1);

  const print = result[0];
  if (!print) {
    console.error("Webhook: print not found", { printId });
    return Response.json({ error: "Print not found" }, { status: 400 });
  }

  const customerDetails = session.customer_details ?? null;
  const address = customerDetails?.address ?? null;
  const customerMessage = session.custom_fields?.find(f => f.key === "message")?.text?.value ?? null;
  const paymentMethod = await resolvePaymentMethod(session.payment_intent);

  try {
    await db.insert(orderSchema).values({
      stripeSessionId: session.id,
      amountCents: session.amount_total,
      customerEmail: customerDetails?.email ?? null,
      customerName: customerDetails?.name ?? null,
      customerPhone: customerDetails?.phone ?? null,
      shippingName: customerDetails?.name ?? null,
      shippingLine1: address?.line1 ?? null,
      shippingLine2: address?.line2 ?? null,
      shippingCity: address?.city ?? null,
      shippingState: address?.state ?? null,
      shippingPostalCode: address?.postal_code ?? null,
      shippingCountry: address?.country ?? null,
      paymentMethod,
      status: "completed",
      message: customerMessage,
      artworkId: null,
    });
  } catch (e) {
    const err = e as { code?: string; message: string };
    if (err.code !== "23505") {
      console.error("Failed to insert print order:", err.message);
    }
  }

  try {
    await db
      .update(printSchema)
      .set({ stock: sql`${printSchema.stock} - ${quantity}` })
      .where(eq(printSchema.id, printId));
  } catch (e) {
    console.error("Failed to decrement print stock:", (e as Error).message);
  }

  revalidatePath("/", "layout");

  const customerEmail = customerDetails?.email;
  if (customerEmail) {
    const emailPayload = {
      customerName: customerDetails?.name ?? "there",
      artworks: [{ title: `${print.title} (Print × ${quantity})`, price: print.price * quantity }],
      amountCents: session.amount_total,
      shipping: { ...address, name: customerDetails?.name ?? null },
      phone: customerDetails?.phone ?? null,
      message: customerMessage,
    };

    await Promise.allSettled([
      sendOrderConfirmation({ to: customerEmail, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send print order confirmation:", err.message),
      ),
      notifySale({ customerEmail, paymentMethod, ...emailPayload }).catch((err: Error) =>
        console.error("Failed to send print sale notification:", err.message),
      ),
    ]);
  }

  return Response.json({ received: true }, { status: 200 });
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

  const printId = session.metadata?.printId ?? null;
  if (printId) {
    return handlePrintCheckout(session, printId);
  }

  const rawPrintItems = session.metadata?.printItems ?? null;
  const rawIds = session.metadata?.artworkIds ?? "";
  const artworkIds = rawIds.split(",").filter(Boolean);

  if (!artworkIds.length && !rawPrintItems) {
    console.error("Webhook: no artworkIds or printItems in session metadata", { sessionId: session.id });
    return Response.json({ error: "Missing metadata" }, { status: 400 });
  }

  const alreadyProcessed = await fetchAlreadyProcessedIds(session.id, artworkIds);
  const pendingIds = artworkIds.filter(id => !alreadyProcessed.has(id));

  if (!pendingIds.length) {
    console.info("Webhook: all artworks already processed for session", session.id);
    return Response.json({ received: true }, { status: 200 });
  }

  const [paymentMethod, artworkMap] = await Promise.all([
    resolvePaymentMethod(session.payment_intent),
    fetchArtworks(pendingIds).catch((err: Error) => {
      console.error(err.message);
      return {} as ArtworkMap;
    }),
  ]);

  const customerDetails = session.customer_details ?? null;
  const address = customerDetails?.address ?? session.customer_details?.address ?? null;
  const shippingName = customerDetails?.name ?? session.customer_details?.name ?? null;
  const customerMessage = session.custom_fields?.find(f => f.key === "message")?.text?.value ?? null;

  const newOrder: NewOrder = {
    stripeSessionId: session.id,
    customerEmail: session.customer_details?.email ?? null,
    customerName: session.customer_details?.name ?? null,
    customerPhone: session.customer_details?.phone ?? null,
    shippingName,
    shippingLine1: address?.line1 ?? null,
    shippingLine2: address?.line2 ?? null,
    shippingCity: address?.city ?? null,
    shippingState: address?.state ?? null,
    shippingPostalCode: address?.postal_code ?? null,
    shippingCountry: address?.country ?? null,
    paymentMethod,
    status: "completed",
    message: customerMessage,
  };

  if (pendingIds.length) {
    await Promise.all(
      pendingIds.map(artworkId =>
        insertOrderAndDecrementStock({
          ...newOrder,
          artworkId,
          amountCents: artworkMap[artworkId]?.price,
        }),
      ),
    );
  }

  type PrintItem = { id: string; qty: number };
  const printCartItems: PrintItem[] = rawPrintItems ? (JSON.parse(rawPrintItems) as PrintItem[]) : [];
  const printEmailLines: { title: string; price: number }[] = [];

  if (printCartItems.length) {
    const printIds = printCartItems.map(p => p.id);
    const prints = await db
      .select({ id: printSchema.id, title: artworkSchema.title, price: printSchema.price, stock: printSchema.stock })
      .from(printSchema)
      .innerJoin(artworkSchema, eq(printSchema.artworkId, artworkSchema.id))
      .where(inArray(printSchema.id, printIds));

    await Promise.all(
      printCartItems.map(async ({ id, qty }) => {
        const print = prints.find(p => p.id === id);
        if (!print) { return; }
        try {
          await db.insert(orderSchema).values({ ...newOrder, artworkId: null, amountCents: print.price * qty });
        } catch (e) {
          const err = e as { code?: string; message: string };
          if (err.code !== "23505") { console.error("Failed to insert print cart order:", err.message); }
        }
        try {
          await db.update(printSchema).set({ stock: sql`${printSchema.stock} - ${qty}` }).where(eq(printSchema.id, id));
        } catch (e) {
          console.error("Failed to decrement print stock:", (e as Error).message);
        }
        printEmailLines.push({ title: `${print.title} (Print × ${qty})`, price: print.price * qty });
      }),
    );
  }

  revalidatePath("/", "layout");

  const customerEmail = session.customer_details?.email;
  if (customerEmail) {
    const artworkLines = artworkIds.map(id => artworkMap[id] ?? { title: "your painting", price: 0 });
    const allArtworks = [...artworkLines, ...printEmailLines];
    const emailPayload = {
      customerName: session.customer_details?.name ?? "there",
      artworks: allArtworks,
      amountCents: session.amount_total,
      shipping: { ...address, name: shippingName },
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

  return Response.json({ received: true }, { status: 200 });
}
