import { useState } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/utils';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  async function handleCheckout() {
    if (!items.length || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ artworkIds: items.map(i => i.id) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Something went wrong.');
        return;
      }
      clearCart();
      window.location.href = data.url;
    } catch {
      setError('Could not connect. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[400px] bg-bg-main z-50 flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-divider">
          <p className="font-sans text-[13px] tracking-[3px] uppercase text-text-tertiary">
            Cart {items.length > 0 && `(${items.length})`}
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-tertiary hover:text-text-primary transition-colors"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
          {items.length === 0 ? (
            <p className="font-sans text-text-tertiary text-[14px]">Your cart is empty.</p>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 items-start">
                {item.imageUrl && (
                  <div className="relative w-16 h-16 flex-shrink-0 bg-divider">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                )}
                <div className="flex-1 flex flex-col gap-1">
                  <p className="font-sans text-text-primary text-[14px]">{item.title}</p>
                  <p className="font-sans text-text-secondary text-[13px]">{formatPrice(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-text-tertiary hover:text-text-primary transition-colors mt-0.5"
                  aria-label={`Remove ${item.title}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-6 border-t border-divider flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-text-tertiary text-[13px]">Total</span>
              <span className="font-sans text-text-primary text-[15px]">{formatPrice(total)}</span>
            </div>
            {error && <p className="font-sans text-[13px] text-red-500">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-accent text-white font-sans text-[14px] tracking-[0.5px] py-4 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Redirecting…' : 'Checkout'}
            </button>
          </div>
        )}

      </div>
    </>
  );
}
