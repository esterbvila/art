import { createAdminClient } from '../../lib/supabase';

/**
 * POST /api/contact
 *
 * Saves a contact form submission to Supabase `contact_submissions` table.
 *
 * Request body: { firstName, lastName, email, message }
 * Response:     { success: boolean }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

  return res.status(200).json({ success: true });
}
