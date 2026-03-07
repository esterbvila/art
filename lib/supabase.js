import { createClient } from '@supabase/supabase-js';

/**
 * Public Supabase client — safe to use in the browser and on the server.
 * For server-only admin operations (e.g. webhooks) use createAdminClient().
 *
 * Initialisation is lazy so Next.js can build without env vars present
 * (they are only required at runtime).
 */
let _supabase;
export function getSupabase() {
  if (!_supabase) {
    const url  = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !anon) {
      throw new Error(
        'Missing Supabase env vars. Copy .env.local.example → .env.local and fill in your credentials.'
      );
    }
    _supabase = createClient(url, anon);
  }
  return _supabase;
}

// Convenience export used throughout the app
export const supabase = new Proxy({}, {
  get: (_, prop) => getSupabase()[prop],
});

/**
 * Admin Supabase client using the service-role key.
 * NEVER import this on the client side — only in API routes / server code.
 */
export function createAdminClient() {
  const url         = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRole) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable.');
  }
  return createClient(url, serviceRole);
}
