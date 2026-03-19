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
  artworks,
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

  const isSingle    = artworks.length === 1;
  const subjectLine = isSingle
    ? `Your painting is on its way — ${artworks[0].title}`
    : `Your ${artworks.length} paintings are confirmed`;

  const introLine = isSingle
    ? `Your purchase of <strong style="color:#1A1917;">${artworks[0].title}</strong> has been confirmed. I'll be in touch shortly to arrange packaging and shipping.`
    : `Your purchase of <strong style="color:#1A1917;">${artworks.length} original paintings</strong> has been confirmed. I'll be in touch shortly to arrange packaging and shipping.`;

  const artworkRows = isSingle
    ? `<tr>
        <td style="padding:20px 0;font-size:13px;color:#9C9690;">Artwork</td>
        <td style="padding:20px 0;font-size:13px;color:#1A1917;text-align:right;">${artworks[0].title}</td>
       </tr>`
    : artworks.map((a, i) => `
        <tr>
          <td style="padding:${i === 0 ? '20px' : '0'} 0 12px 0;font-size:13px;color:#9C9690;">${a.title}</td>
          <td style="padding:${i === 0 ? '20px' : '0'} 0 12px 0;font-size:13px;color:#1A1917;text-align:right;">${formatPrice(a.price)}</td>
        </tr>`).join('');

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
                esterii creates
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
                ${introLine}
              </p>

              <!-- Order summary -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-top:1px solid #DDD8D0;border-bottom:1px solid #DDD8D0;margin:0 0 32px 0;">
                ${artworkRows}
                <tr>
                  <td style="padding:12px 0 20px 0;font-size:13px;color:#9C9690;">Total paid</td>
                  <td style="padding:12px 0 20px 0;font-size:13px;color:#1A1917;text-align:right;">${formatPrice(amountCents)}</td>
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
                If you have any questions, reach me at
                <a href="mailto:ester.batllori@gmail.com"
                   style="color:#C4724E;text-decoration:none;">ester.batllori@gmail.com</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid #DDD8D0;">
              <p style="margin:0;font-size:12px;color:#9C9690;">
                © 2026 esterii creates — Original abstract paintings
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
    from:     process.env.RESEND_FROM_EMAIL ?? 'esterii creates <orders@yourdomain.com>',
    reply_to: process.env.NOTIFY_EMAIL ?? 'ester.batllori@gmail.com',
    to,
    subject:  subjectLine,
    html,
  });

  if (error) {
    console.error('Failed to send confirmation email:', error.message);
  }
}

/**
 * Sends a notification to Ester when someone submits the contact form.
 */
export async function notifyContactSubmission({ firstName, lastName, email, message }) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'esterii creates <orders@yourdomain.com>';
  const to   = process.env.NOTIFY_EMAIL ?? 'ester.batllori@gmail.com';

  const { error } = await resend.emails.send({
    from,
    reply_to: email,
    to,
    subject: `New message from ${firstName} ${lastName}`,
    html: `
      <p><strong>From:</strong> ${firstName} ${lastName} &lt;${email}&gt;</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${message}</p>
    `.trim(),
  });

  if (error) console.error('Failed to send contact notification:', error.message);
}

/**
 * Sends a notification to Ester when a purchase is completed.
 */
export async function notifySale({ customerName, customerEmail, artworks, amountCents, phone, shipping, paymentMethod }) {
  const from = process.env.RESEND_FROM_EMAIL ?? 'esterii creates <orders@yourdomain.com>';
  const to   = process.env.NOTIFY_EMAIL ?? 'ester.batllori@gmail.com';

  const shippingLines = [
    shipping?.name,
    shipping?.line1,
    shipping?.line2,
    [shipping?.city, shipping?.state, shipping?.postal_code].filter(Boolean).join(', '),
    shipping?.country,
  ].filter(Boolean);

  const subjectLine = artworks.length === 1
    ? `Sold: ${artworks[0].title}`
    : `Sold: ${artworks.length} paintings`;

  const artworksList = artworks.map(a => `<p style="margin:4px 0"><strong>${a.title}</strong> — ${formatPrice(a.price)}</p>`).join('');

  const { error } = await resend.emails.send({
    from,
    reply_to: customerEmail,
    to,
    subject: subjectLine,
    html: `
      <h2 style="margin:0 0 16px 0">${subjectLine}</h2>
      ${artworksList}
      <p><strong>Total:</strong> ${formatPrice(amountCents)}</p>
      ${paymentMethod ? `<p><strong>Payment method:</strong> ${paymentMethod}</p>` : ''}
      <hr/>
      <p><strong>Buyer:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${shippingLines.length > 0 ? `
      <p><strong>Ship to:</strong><br/>${shippingLines.join('<br/>')}</p>
      ` : ''}
    `.trim(),
  });

  if (error) console.error('Failed to send sale notification:', error.message);
}
