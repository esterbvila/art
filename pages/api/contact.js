import { createAdminClient } from '../../lib/supabase';
import { notifyContactSubmission } from '../../lib/email';

// In-memory rate limit store: ip → { count, resetAt }
const rateLimitMap = new Map();
const LIMIT = 3;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * POST /api/contact
 *
 * Saves a contact form submission to Supabase `contact_submissions` table.
 *
 * Request body: { firstName, lastName, email, message, website }
 * Response:     { success: boolean }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Honeypot check — bots fill in the hidden "website" field
  if (req.body?.website) {
    return res.status(200).json({ success: true }); // silent rejection
  }

  // Rate limiting by IP — max 3 submissions per hour
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? req.socket.remoteAddress ?? 'unknown';
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (entry && now < entry.resetAt) {
    if (entry.count >= LIMIT) {
      return res.status(429).json({ error: 'Too many messages. Please try again later.' });
    }
    entry.count += 1;
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  const { firstName, lastName, email, message } = req.body;

  // Basic server-side validation
  if (!firstName || !lastName || !email || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const adminSupabase = createAdminClient();

  const { error } = await adminSupabase.from('contact_submissions').insert({
    first_name: firstName.trim(),
    last_name:  lastName.trim(),
    email:      email.trim().toLowerCase(),
    message:    message.trim(),
  });

  if (error) {
    console.error('Failed to save contact submission:', error.message);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }

  await notifyContactSubmission({ firstName, lastName, email, message });

  return res.status(200).json({ success: true });
}
