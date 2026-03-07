import { buffer } from 'micro';
import { stripe } from '../../lib/stripe';
import { createAdminClient } from '../../lib/supabase';
import { sendOrderConfirmation } from '../../lib/email';

/**
 * Disable Next.js body parsing — Stripe requires the raw request body
 * to verify the webhook signature.
 */
export const config = {
  api: { bodyParser: false },
};

/**
 * POST /api/webhook
 *
 * Stripe webhook handler.
 * Listens for `checkout.session.completed` events and:
 *   1. Decrements the artwork stock via a Supabase RPC function.
 *   2. Inserts a record into the `orders` table.
 *
 * Configure this endpoint in your Stripe Dashboard →
 * Developers → Webhooks → Add endpoint → https://your-domain.com/api/webhook
 * Events to listen for: checkout.session.completed
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method not allowed');
  }

  const rawBody = await buffer(req);
  const sig     = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Only handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session    = event.data.object;
    const artworkId  = session.metadata?.artworkId;

    if (!artworkId) {
      console.error('Webhook: no artworkId in session metadata');
      return res.status(400).json({ error: 'Missing artworkId in metadata' });
    }

    // Use the admin client so we bypass Row-Level Security for server operations
    const adminSupabase = createAdminClient();

    // 1. Decrement stock (the RPC function is defined in supabase/schema.sql)
    const { error: rpcError } = await adminSupabase.rpc('decrement_stock', {
      artwork_id: artworkId,
    });
    if (rpcError) {
      console.error('Failed to decrement stock:', rpcError.message);
    }

    // 2. Record the order — include full shipping details for fulfilment
    // Stripe puts address in shipping_details OR customer_details depending on checkout flow
    const shippingDetails = session.shipping_details ?? null;
    const addr            = shippingDetails?.address ?? session.customer_details?.address ?? null;
    const shippingName    = shippingDetails?.name ?? session.customer_details?.name ?? null;

    const { error: orderError } = await adminSupabase.from('orders').insert({
      artwork_id:           artworkId,
      stripe_session_id:    session.id,
      amount_cents:         session.amount_total,
      customer_email:       session.customer_details?.email ?? null,
      customer_name:        session.customer_details?.name ?? null,
      customer_phone:       session.customer_details?.phone ?? null,
      shipping_name:        shippingName,
      shipping_line1:       addr?.line1 ?? null,
      shipping_line2:       addr?.line2 ?? null,
      shipping_city:        addr?.city ?? null,
      shipping_state:       addr?.state ?? null,
      shipping_postal_code: addr?.postal_code ?? null,
      shipping_country:     addr?.country ?? null,
      status:               'completed',
    });
    if (orderError) {
      console.error('Failed to insert order:', orderError.message);
      // Duplicate session = already processed; skip email to avoid double-sending
      if (orderError.code === '23505') {
        return res.status(200).json({ received: true });
      }
    }

    // 3. Send confirmation email to the buyer
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      // Fetch artwork title for the email
      const { data: artwork } = await adminSupabase
        .from('artworks')
        .select('title, price')
        .eq('id', artworkId)
        .single();

      await sendOrderConfirmation({
        to:           customerEmail,
        customerName: session.customer_details?.name ?? 'there',
        artworkTitle: artwork?.title ?? 'your painting',
        amountCents:  session.amount_total,
        shipping:     { ...addr, name: shippingName },
        phone:        session.customer_details?.phone ?? null,
      });
    }
  }

  // Acknowledge receipt to Stripe
  return res.status(200).json({ received: true });
}
