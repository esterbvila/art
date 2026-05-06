import { Resend } from "resend";

export interface EmailItem {
  title: string;
  price: number;
  type: "original" | "print";
  quantity: number;
}

const resend = new Resend(process.env.RESEND_API_KEY);

function escapeHtml(str: unknown): string {
  if (!str) {
    return "";
  }
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatPrice(cents: number): string {
  return `${(cents / 100).toFixed(0)} €`;
}

function itemLabel(item: EmailItem): string {
  return item.type === "print" ? "Print" : "Original";
}

export async function sendOrderConfirmation({
  to,
  customerName,
  items,
  amountCents,
  shipping,
  phone,
  message,
}: {
  to: string;
  customerName: string;
  items: EmailItem[];
  amountCents: number | null;
  shipping: Record<string, string | null | undefined> | null;
  phone: string | null;
  message: string | null;
}) {
  const shippingLines = [
    shipping?.name,
    shipping?.line1,
    shipping?.line2,
    [shipping?.city, shipping?.state, shipping?.postal_code].filter(Boolean).join(", "),
    shipping?.country,
  ].filter(Boolean) as string[];

  const shippingHtml = shippingLines.map(l => `<div>${escapeHtml(l)}</div>`).join("");

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const isSingle = items.length === 1;
  const firstItem = items[0]!;

  const subjectLine = "Your esterii creates order has been received";

  const introLine = isSingle
    ? `I have received your order of <strong style="color:#1A1917;">${escapeHtml(firstItem.title)}</strong> successfully.`
    : `I have received your order of <strong style="color:#1A1917;">${totalQuantity} items</strong> successfully.`;

  const hasOriginals = items.some(i => i.type === "original");
  const hasPrints = items.some(i => i.type === "print");
  const followUpCopy =
    hasOriginals && !hasPrints
      ? "I will be in touch shortly to arrange packaging and shipping for your original painting."
      : hasPrints && !hasOriginals
        ? "Your print will be carefully packed and shipped within 2–5 business days. I'll be in touch within 48 hours with your shipping confirmation."
        : "I'll now prepare your pieces with care and will be in touch shortly to confirm the shipping details.";

  const itemRows = items
    .map(
      (item, i) => `
      <tr>
        <td style="padding:${i === 0 ? "20px" : "8px"} 0 0 0;font-size:14px;color:#1A1917;">
          ${escapeHtml(item.title)} <span style="color:#9C9690;">(${escapeHtml(itemLabel(item))})</span>${item.quantity > 1 ? ` <span style="color:#9C9690;">×${item.quantity}</span>` : ""}
        </td>
        <td style="padding:${i === 0 ? "20px" : "8px"} 0 0 0;font-size:14px;color:#1A1917;text-align:right;white-space:nowrap;">
          ${formatPrice(item.price * item.quantity)}
        </td>
      </tr>`,
    )
    .join("");

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

          <tr>
            <td style="padding:0 0 40px 0;border-bottom:1px solid #DDD8D0;">
              <p style="margin:0;font-size:15px;letter-spacing:2px;color:#1A1917;">esterii creates</p>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 0;">
              <p style="margin:0 0 8px 0;font-size:12px;letter-spacing:3px;color:#9C9690;text-transform:uppercase;">Order received</p>
              <h1 style="margin:0 0 24px 0;font-size:36px;font-weight:400;color:#1A1917;line-height:1;letter-spacing:-1px;">
                I’m so excited to prepare your pieces, ${escapeHtml(customerName.split(" ")[0])}.
              </h1>

              <p style="margin:0 0 16px 0;font-size:15px;color:#6B6660;line-height:1.7;">${introLine}</p>
              <p style="margin:0 0 32px 0;font-size:15px;color:#6B6660;line-height:1.7;">${followUpCopy}</p>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border-top:1px solid #DDD8D0;border-bottom:1px solid #DDD8D0;margin:0 0 32px 0;">
                ${itemRows}
                <tr>
                  <td style="padding:16px 0 20px 0;font-size:15px;font-weight:bold;color:#1A1917;">Total paid</td>
                  <td style="padding:16px 0 20px 0;font-size:15px;font-weight:bold;color:#1A1917;text-align:right;">${formatPrice(amountCents ?? 0)}</td>
                </tr>
              </table>

              ${
                shippingLines.length > 0
                  ? `<p style="margin:0 0 12px 0;font-size:12px;letter-spacing:3px;color:#9C9690;text-transform:uppercase;">Shipping to</p>
              <div style="font-size:14px;color:#6B6660;line-height:1.8;margin:0 0 32px 0;">${shippingHtml}${phone ? `<div>${escapeHtml(phone)}</div>` : ""}</div>`
                  : ""
              }

              ${
                message
                  ? `<p style="margin:0 0 12px 0;font-size:12px;letter-spacing:3px;color:#9C9690;text-transform:uppercase;">Your message</p>
              <p style="margin:0 0 32px 0;font-size:14px;color:#6B6660;line-height:1.7;">${escapeHtml(message)}</p>`
                  : ""
              }

              <p style="margin:0 0 8px 0;font-size:15px;color:#6B6660;line-height:1.7;">
                If you have any questions, you can reach me at
                <a href="mailto:ester.batllori@gmail.com" style="color:#C4724E;text-decoration:none;">ester.batllori@gmail.com</a>.
              </p>

              <p style="margin:24px 0 0 0;font-size:15px;color:#6B6660;line-height:1.7;">
                Thank you again,<br/>
                Ester<br/>
                <span style="letter-spacing:1px;">esterii creates</span>
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 0 0 0;border-top:1px solid #DDD8D0;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#9C9690;line-height:1.6;">
                This email is a confirmation of receipt only and does not yet constitute acceptance of your order.
              </p>
              <p style="margin:0;font-size:12px;color:#9C9690;">© 2026 esterii creates — Original abstract paintings</p>
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
    from: process.env.RESEND_FROM_EMAIL ?? "esterii creates <orders@yourdomain.com>",
    replyTo: process.env.NOTIFY_EMAIL ?? "ester.batllori@gmail.com",
    to,
    subject: subjectLine,
    html,
  });

  if (error) {
    console.error("Failed to send confirmation email:", error.message);
  }
}

export async function notifyContactSubmission({
  firstName,
  lastName,
  email,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? "esterii creates <orders@yourdomain.com>";
  const to = process.env.NOTIFY_EMAIL ?? "ester.batllori@gmail.com";

  const { error } = await resend.emails.send({
    from,
    replyTo: email,
    to,
    subject: `New message from ${firstName} ${lastName}`,
    html: `
      <p><strong>From:</strong> ${escapeHtml(firstName)} ${escapeHtml(lastName)} &lt;${escapeHtml(email)}&gt;</p>
      <p><strong>Message:</strong></p>
      <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
    `.trim(),
  });

  if (error) {
    console.error("Failed to send contact notification:", error.message);
  }
}

export async function notifySale({
  customerName,
  customerEmail,
  items,
  amountCents,
  phone,
  shipping,
  paymentMethod,
  message,
}: {
  customerName: string;
  customerEmail: string;
  items: EmailItem[];
  amountCents: number | null;
  phone: string | null;
  shipping: Record<string, string | null | undefined> | null;
  paymentMethod: string | null;
  message: string | null;
}) {
  const from = process.env.RESEND_FROM_EMAIL ?? "esterii creates <orders@yourdomain.com>";
  const to = process.env.NOTIFY_EMAIL ?? "ester.batllori@gmail.com";

  const shippingLines = [
    shipping?.name,
    shipping?.line1,
    shipping?.line2,
    [shipping?.city, shipping?.state, shipping?.postal_code].filter(Boolean).join(", "),
    shipping?.country,
  ].filter(Boolean) as string[];

  const totalQuantity = items.reduce((sum, i) => sum + i.quantity, 0);
  const isSingle = items.length === 1;
  const firstItem = items[0]!;
  const subjectLine = isSingle
    ? `Sold: ${firstItem.title}${firstItem.type === "print" ? " (Print)" : ""}`
    : `Sold: ${totalQuantity} items`;

  const itemsList = items
    .map(item => {
      const qty = item.quantity > 1 ? ` × ${item.quantity}` : "";
      return `<p style="margin:4px 0"><strong>${escapeHtml(item.title)}${qty}</strong> [${escapeHtml(itemLabel(item))}] — ${formatPrice(item.price * item.quantity)}</p>`;
    })
    .join("");

  const { error } = await resend.emails.send({
    from,
    replyTo: customerEmail,
    to,
    subject: subjectLine,
    html: `
      <h2 style="margin:0 0 16px 0">${escapeHtml(subjectLine)}</h2>
      ${itemsList}
      <p><strong>Total:</strong> ${formatPrice(amountCents ?? 0)}</p>
      ${paymentMethod ? `<p><strong>Payment method:</strong> ${escapeHtml(paymentMethod)}</p>` : ""}
      <hr/>
      <p><strong>Buyer:</strong> ${escapeHtml(customerName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(customerEmail)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
      ${shippingLines.length > 0 ? `<p><strong>Ship to:</strong><br/>${shippingLines.map(escapeHtml).join("<br/>")}</p>` : ""}
      ${message ? `<hr/><p><strong>Message from buyer:</strong><br/>${escapeHtml(message)}</p>` : ""}
    `.trim(),
  });

  if (error) {
    console.error("Failed to send sale notification:", error.message);
  }
}
