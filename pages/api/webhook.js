import { buffer } from 'micro';
import { stripe } from '../../lib/stripe';
import { createAdminClient } from '../../lib/supabase';
import { sendOrderConfirmation, notifySale } from '../../lib/email';

/**
 * Disable Next.js body parsing — Stripe requires the raw request body
 * to verify the webhook signature.
 */
export const config = {
  api: { bodyParser: false },
};

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

  if (event.type === 'checkout.session.completed') {
    // Re-fetch the session to get the full object including shipping_details
    // (the webhook payload may be truncated for some payment methods like PayPal)
    const session = await stripe.checkout.sessions.retrieve(event.data.object.id);

    // Support both old format (artworkId) and new format (artworkIds)
    const rawIds    = session.metadata?.artworkIds ?? session.metadata?.artworkId ?? '';
    const artworkIds = rawIds.split(',').filter(Boolean);

    if (!artworkIds.length) {
      console.error('Webhook: no artworkIds in session metadata');
      return res.status(400).json({ error: 'Missing artworkIds in metadata' });
    }

    const adminSupabase = createAdminClient();

    // 1. Resolve payment method
    let paymentMethod = null;
    if (session.payment_intent) {
      try {
        const pi = await stripe.paymentIntents.retrieve(session.payment_intent, {
          expand: ['payment_method'],
        });
        paymentMethod = pi.payment_method?.type ?? null;
      } catch (e) {
        console.error('Failed to retrieve payment intent:', e.message);
      }
    }

    // 2. Extract custom message field
    const customerMessage = session.custom_fields?.find(f => f.key === 'message')?.text?.value ?? null;

    // 3. Fetch artwork details (needed for both order insertion and emails)
    const { data: artworksData } = await adminSupabase
      .from('artworks')
      .select('id, title, price, collections(price)')
      .in('id', artworkIds);

    const artworkMap = Object.fromEntries(
      (artworksData ?? []).map((a) => [
        a.id,
        { title: a.title, price: a.price || a.collections?.price || 0 },
      ])
    );

    // 4. Shared order fields (without amount_cents — that's per-artwork)
    const shippingDetails = session.shipping_details ?? null;
    const addr            = shippingDetails?.address ?? session.customer_details?.address ?? null;
    const shippingName    = shippingDetails?.name ?? session.customer_details?.name ?? null;

    const sharedFields = {
      stripe_session_id:    session.id,
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
      payment_method:       paymentMethod,
      status:               'completed',
      message:              customerMessage,
    };

    // 5. Decrement stock and insert order for each artwork with its individual price
    // Only the first artwork's insert failing with 23505 means the whole session
    // was already processed (duplicate webhook delivery). Later failures for other
    // artworks in the same session would be a constraint issue, not a duplicate.
    const firstId = artworkIds[0];
    const { error: firstOrderError } = await adminSupabase.from('orders').insert({
      ...sharedFields,
      artwork_id:   firstId,
      amount_cents: artworkMap[firstId]?.price ?? 0,
    });

    if (firstOrderError) {
      console.error(`Failed to insert order for ${firstId}:`, firstOrderError.message);
      if (firstOrderError.code === '23505') {
        // Duplicate webhook delivery — already processed
        return res.status(200).json({ received: true });
      }
    } else {
      await adminSupabase.rpc('decrement_stock', { artwork_id: firstId });
    }

    for (const artworkId of artworkIds.slice(1)) {
      await adminSupabase.rpc('decrement_stock', { artwork_id: artworkId });

      const { error: orderError } = await adminSupabase.from('orders').insert({
        ...sharedFields,
        artwork_id:   artworkId,
        amount_cents: artworkMap[artworkId]?.price ?? 0,
      });

      if (orderError) {
        console.error(`Failed to insert order for ${artworkId}:`, orderError.message);
      }
    }

    // 6. Send emails
    const customerEmail = session.customer_details?.email;
    if (customerEmail) {
      const artworks = artworkIds.map((id) => artworkMap[id] ?? { title: 'your painting', price: 0 });

      await sendOrderConfirmation({
        to:           customerEmail,
        customerName: session.customer_details?.name ?? 'there',
        artworks,
        amountCents:  session.amount_total,
        shipping:     { ...addr, name: shippingName },
        phone:        session.customer_details?.phone ?? null,
        message:      customerMessage,
      });

      await notifySale({
        customerName:  session.customer_details?.name ?? 'Unknown',
        customerEmail,
        artworks,
        amountCents:   session.amount_total,
        phone:         session.customer_details?.phone ?? null,
        shipping:      { ...addr, name: shippingName },
        paymentMethod,
        message:       customerMessage,
      });
    }
  }

  return res.status(200).json({ received: true });
}
