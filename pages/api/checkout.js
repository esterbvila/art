import { stripe } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session.
 * Accepts either a single artwork (Buy Now) or multiple artworks (Cart).
 *
 * Request body: { artworkId: string }            — single / Buy Now
 *             | { artworkIds: string[] }          — cart checkout
 * Response:    { url: string }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { artworkId, artworkIds: artworkIdsRaw } = req.body;
  const ids = Array.isArray(artworkIdsRaw)
    ? artworkIdsRaw
    : artworkId
    ? [artworkId]
    : [];

  if (!ids.length) {
    return res.status(400).json({ error: 'artworkId is required' });
  }

  // 1. Fetch all artworks
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, description, price, image_url, stock')
    .in('id', ids);

  if (error || !artworks?.length) {
    return res.status(404).json({ error: 'Artwork not found' });
  }

  // 2. Validate all are in stock
  const outOfStock = artworks.find(a => a.stock <= 0);
  if (outOfStock) {
    return res.status(400).json({ error: `"${outOfStock.title}" is no longer available` });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 3. Build line items
  const line_items = artworks.map(artwork => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: artwork.title,
        description: artwork.description?.slice(0, 500) ?? undefined,
        images: artwork.image_url?.startsWith('http') ? [artwork.image_url] : [],
      },
      unit_amount: artwork.price,
    },
    quantity: 1,
  }));

  // 4. Create a Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card', 'paypal', 'klarna'],
      line_items,
      mode: 'payment',
      customer_creation: 'always',
      shipping_address_collection: {
        allowed_countries: [
          'AC','AD','AE','AF','AG','AI','AL','AM','AO','AQ','AR','AT','AU','AW','AX','AZ',
          'BA','BB','BD','BE','BF','BG','BH','BI','BJ','BL','BM','BN','BO','BQ','BR','BS','BT','BV','BW','BY','BZ',
          'CA','CD','CF','CG','CH','CI','CK','CL','CM','CN','CO','CR','CV','CW','CY','CZ',
          'DE','DJ','DK','DM','DO','DZ',
          'EC','EE','EG','EH','ER','ES','ET',
          'FI','FJ','FK','FO','FR',
          'GA','GB','GD','GE','GF','GG','GH','GI','GL','GM','GN','GP','GQ','GR','GS','GT','GU','GW','GY',
          'HK','HN','HR','HT','HU',
          'ID','IE','IL','IM','IN','IO','IQ','IS','IT',
          'JE','JM','JO','JP',
          'KE','KG','KH','KI','KM','KN','KR','KW','KY','KZ',
          'LA','LB','LC','LI','LK','LR','LS','LT','LU','LV','LY',
          'MA','MC','MD','ME','MF','MG','MK','ML','MM','MN','MO','MQ','MR','MS','MT','MU','MV','MW','MX','MY','MZ',
          'NA','NC','NE','NG','NI','NL','NO','NP','NR','NU','NZ',
          'OM',
          'PA','PE','PF','PG','PH','PK','PL','PM','PN','PR','PS','PT','PY',
          'QA',
          'RE','RO','RS','RU','RW',
          'SA','SB','SC','SD','SE','SG','SH','SI','SJ','SK','SL','SM','SN','SO','SR','SS','ST','SV','SX','SZ',
          'TA','TC','TD','TF','TG','TH','TJ','TK','TL','TM','TN','TO','TR','TT','TV','TW','TZ',
          'UA','UG','US','UY','UZ',
          'VA','VC','VE','VG','VN','VU',
          'WF','WS',
          'XK',
          'YE','YT',
          'ZA','ZM','ZW','ZZ',
        ],
      },
      phone_number_collection: { enabled: true },
      metadata: { artworkIds: ids.join(',') },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  ids.length === 1 ? `${baseUrl}/${ids[0]}` : `${baseUrl}/`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
