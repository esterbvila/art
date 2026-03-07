import { useState } from 'react';

/**
 * Purchase / Inquire button.
 * Calls /api/checkout to create a Stripe Checkout session, then
 * redirects the user to the Stripe-hosted payment page.
 *
 * Props:
 *   artworkId   — Supabase UUID of the artwork
 *   isAvailable — whether the artwork is still in stock
 */
export default function PurchaseButton({ artworkId, isAvailable }) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  async function handlePurchase() {
    if (!isAvailable || loading) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ artworkId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError('Could not connect. Please check your internet and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handlePurchase}
        disabled={!isAvailable || loading}
        className={[
          'w-full flex items-center justify-center',
          'font-sans font-normal text-[14px] tracking-[0.5px]',
          'px-12 py-4 transition-opacity',
          isAvailable
            ? 'bg-accent text-white cursor-pointer hover:opacity-90'
            : 'bg-divider text-text-tertiary cursor-not-allowed',
        ].join(' ')}
      >
        {loading
          ? 'Redirecting…'
          : isAvailable
          ? 'Purchase this painting'
          : 'Sold'}
      </button>

      {error && (
        <p className="font-sans text-[13px] text-red-500">{error}</p>
      )}
    </div>
  );
}
