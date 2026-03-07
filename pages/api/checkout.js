import { stripe } from '../../lib/stripe';
import { supabase } from '../../lib/supabase';

/**
 * POST /api/checkout
 *
 * Creates a Stripe Checkout Session for a single artwork purchase.
 *
 * Request body: { artworkId: string }
 * Response:     { url: string }  — redirect the client to this URL
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { artworkId } = req.body;

  if (!artworkId) {
    return res.status(400).json({ error: 'artworkId is required' });
  }

  // 1. Fetch artwork from Supabase to validate it exists and is in stock
  const { data: artwork, error } = await supabase
    .from('artworks')
    .select('id, title, description, price, image_url, stock')
    .eq('id', artworkId)
    .single();

  if (error || !artwork) {
    return res.status(404).json({ error: 'Artwork not found' });
  }

  if (artwork.stock <= 0) {
    return res.status(400).json({ error: 'This artwork is no longer available' });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  // 2. Build image list for Stripe — only pass fully-qualified HTTPS URLs.
  // Local paths like /artworks/foo.png are rejected by Stripe's API.
  const images =
    artwork.image_url?.startsWith('http')
      ? [artwork.image_url]
      : [];

  // 3. Create a Stripe Checkout Session
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: artwork.title,
              description: artwork.description?.slice(0, 500) ?? undefined,
              images,
            },
            // artwork.price is stored in euro cents (e.g. 36000 = 360€)
            unit_amount: artwork.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',

      // Collect the buyer's full name + email (always on by default, made explicit here)
      customer_creation: 'always',

      // Collect a shipping address — required to know where to send the artwork
      shipping_address_collection: {
        // Full list of countries Stripe accepts for shipping address collection.
        // Remove entries for regions you don't ship to.
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

      // Collect phone number — helpful for courier contact on delivery
      phone_number_collection: { enabled: true },

      // Pass artworkId in metadata so the webhook can update inventory
      metadata: { artworkId: artwork.id },
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${baseUrl}/${artworkId}`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe Checkout error:', err.message);
    return res.status(500).json({ error: 'Failed to create checkout session' });
  }
}
