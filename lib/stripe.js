import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error(
    'Missing STRIPE_SECRET_KEY environment variable. ' +
    'Copy .env.local.example to .env.local and fill in your credentials.'
  );
}

/**
 * Server-side Stripe instance.
 * Import this only in API routes — never in client components.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});
