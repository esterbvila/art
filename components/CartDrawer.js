import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { X, Trash2 } from 'lucide-react';
import useCart from '../context/useCart';
import { formatPrice } from '../lib/utils';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const drawerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const el = drawerRef.current;
    if (!el) return;

    // Only attach on mobile
    const isMobile = () => window.innerWidth < 768;

    function onTouchStart(e) {
      if (!isMobile()) return;
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (!isMobile() || touchStartX.current === null) return;

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

      // Only trigger if swipe is more horizontal than vertical and goes right (dx > 0)
      if (dx > 50 && dy < 80) setIsOpen(false);

      touchStartX.current = null;
      touchStartY.current = null;
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [setIsOpen]);

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
      <div
        ref={drawerRef}
        className="fixed top-0 right-0 h-full w-full max-w-[370px] bg-bg-main z-50 flex flex-col"
      >

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
            <div className="flex flex-col gap-4">
              <p className="font-sans text-text-tertiary text-[14px]">Your cart is empty.</p>
              <button
                onClick={() => setIsOpen(false)}
                className="w-full border border-divider font-sans text-text-secondary text-[13px] tracking-[0.5px] py-4 hover:text-text-primary hover:border-text-secondary transition-colors cursor-pointer"
              >
                Browse paintings
              </button>
            </div>
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
                  <p className="font-sans text-text-primary text-[16px]">{item.title}</p>
                  <p className="font-sans text-text-secondary text-[14px]">{formatPrice(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-text-tertiary hover:text-text-primary transition-colors mt-0.5"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 size={14} />
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
              <span className="font-sans text-text-primary text-[16px]">{formatPrice(total)}</span>
            </div>
            {error && <p className="font-sans text-[13px] text-red-500">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-accent text-white font-sans text-[14px] tracking-[0.5px] py-4 hover:opacity-90 transition-opacity disabled:opacity-60 cursor-pointer"
            >
              {loading ? 'Redirecting…' : 'Checkout'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full font-sans text-text-secondary text-[13px] tracking-[0.5px] py-2 hover:text-text-primary transition-colors cursor-pointer"
            >
              Continue shopping
            </button>
          </div>
        )}

      </div>
    </>
  );
}
