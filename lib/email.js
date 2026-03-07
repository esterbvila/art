import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Formats euro cents to a display string, e.g. 36000 → "360 €"
 */
function formatPrice(cents) {
  return `${(cents / 100).toFixed(0)} €`;
}

/**
 * Sends an order confirmation email to the buyer after a successful purchase.
 *
 * @param {object} opts
 * @param {string} opts.to            - Buyer's email address
 * @param {string} opts.customerName  - Buyer's full name
 * @param {string} opts.artworkTitle  - Name of the purchased painting
 * @param {number} opts.amountCents   - Total charged in euro cents
 * @param {object} opts.shipping      - Shipping address fields from Stripe
 * @param {string} opts.phone         - Buyer's phone number
 */
export async function sendOrderConfirmation({
  to,
  customerName,
  artworkTitle,
  amountCents,
  shipping,
  phone,
}) {
  const shippingLines = [
    shipping?.name,
    shipping?.line1,
    shipping?.line2,
    [shipping?.city, shipping?.state, shipping?.postal_code].filter(Boolean).join(', '),
    shipping?.country,
  ].filter(Boolean);

  const shippingHtml = shippingLines.map((l) => `<div>${l}</div>`).join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Purchase Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#FAF8F5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF8F5;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#FAF8F5;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 40px 0;border-bottom:1px solid #DDD8D0;">
              <p style="margin:0;font-size:15px;letter-spacing:2px;color:#1A1917;">
                Ester Batllori
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px 0;">
              <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:3px;color:#9C9690;text-transform:uppercase;">
                Purchase confirmed
              </p>
              <h1 style="margin:0 0 32px 0;font-size:36px;font-weight:400;color:#1A1917;line-height:1;letter-spacing:-1px;">
                Thank you,<br/>${customerName.split(' ')[0]}.
              </h1>

              <p style="margin:0 0 32px 0;font-size:15px;color:#6B6660;line-height:1.7;">
                Your purchase of <strong style="color:#1A1917;">${artworkTitle}</strong>
                has been confirmed. I'll be in touch shortly to arrange packaging
                and shipping of your original painting.
              </p>

              <!-- Order summary -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-top:1px solid #DDD8D0;border-bottom:1px solid #DDD8D0;margin:0 0 32px 0;">
                <tr>
                  <td style="padding:20px 0;font-size:13px;color:#9C9690;">Artwork</td>
                  <td style="padding:20px 0;font-size:13px;color:#1A1917;text-align:right;">${artworkTitle}</td>
                </tr>
                <tr>
                  <td style="padding:0 0 20px 0;font-size:13px;color:#9C9690;">Total paid</td>
                  <td style="padding:0 0 20px 0;font-size:13px;color:#1A1917;text-align:right;">${formatPrice(amountCents)}</td>
                </tr>
                ${phone ? `<tr>
                  <td style="padding:0 0 20px 0;font-size:13px;color:#9C9690;">Phone</td>
                  <td style="padding:0 0 20px 0;font-size:13px;color:#1A1917;text-align:right;">${phone}</td>
                </tr>` : ''}
              </table>

              <!-- Shipping address -->
              ${shippingLines.length > 0 ? `
              <p style="margin:0 0 12px 0;font-size:12px;letter-spacing:3px;color:#9C9690;text-transform:uppercase;">
                Shipping to
              </p>
              <div style="font-size:14px;color:#6B6660;line-height:1.8;margin:0 0 32px 0;">
                ${shippingHtml}
              </div>` : ''}

              <p style="margin:0 0 8px 0;font-size:15px;color:#6B6660;line-height:1.7;">
                If you have any questions, reply to this email or reach me at
                <a href="mailto:ester.batllori@gmail.com"
                   style="color:#C4724E;text-decoration:none;">ester.batllori@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid #DDD8D0;">
              <p style="margin:0;font-size:12px;color:#9C9690;">
                © 2026 Ester Batllori — Original abstract paintings
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const { error } = await resend.emails.send({
    from:    process.env.RESEND_FROM_EMAIL ?? 'Ester Batllori <orders@yourdomain.com>',
    to,
    subject: `Your painting is on its way — ${artworkTitle}`,
    html,
  });

  if (error) {
    // Log but don't throw — a failed email must not block the webhook response
    console.error('Failed to send confirmation email:', error.message);
  }
}
