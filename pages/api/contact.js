import { createAdminClient } from '../../lib/supabase';
import { notifyContactSubmission } from '../../lib/email';

const LIMIT      = 3;
const WINDOW_MS  = 60 * 60 * 1000; // 1 hour

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

  // Rate limiting by email — check recent submissions in the database.
  // Works across serverless instances and survives cold starts.
  const windowStart = new Date(Date.now() - WINDOW_MS).toISOString();
  const { count } = await adminSupabase
    .from('contact_submissions')
    .select('*', { count: 'exact', head: true })
    .eq('email', email.trim().toLowerCase())
    .gte('created_at', windowStart);

  if (count >= LIMIT) {
    return res.status(429).json({ error: 'Too many messages. Please try again later.' });
  }

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
