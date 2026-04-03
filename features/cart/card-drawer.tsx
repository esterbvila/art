"use client";
import { Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/features/cart/card-provider";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const drawerRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  useEffect(() => {
    const el = drawerRef.current;
    if (!el) {
      return;
    }

    const isMobile = () => window.innerWidth < 768;

    function onTouchStart(e) {
      if (!isMobile()) {
        return;
      }
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchEnd(e) {
      if (!isMobile() || touchStartX.current === null) {
        return;
      }

      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY.current);

      if (dx > 50 && dy < 80) {
        setIsOpen(false);
      }

      touchStartX.current = null;
      touchStartY.current = null;
    }

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [isOpen, setIsOpen]);

  const total = items.reduce((sum, item) => sum + item.price, 0);

  async function handleCheckout() {
    if (!items.length || loading) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artworkIds: items.map(i => i.id) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      clearCart();
      window.location.href = data.url;
    } catch {
      setError("Could not connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ${isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setIsOpen(false)}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-50 flex h-full w-full max-w-92.5 flex-col bg-bg-main transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-divider border-b px-6 py-5">
          <p className="font-sans text-[13px] text-text-tertiary uppercase tracking-[3px]">
            Cart {items.length > 0 && `(${items.length})`}
          </p>
          <button
            onClick={() => setIsOpen(false)}
            className="text-text-tertiary transition-colors hover:text-text-primary"
            aria-label="Close cart"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex flex-col gap-4">
              <p className="font-sans text-[14px] text-text-tertiary">Your cart is empty.</p>
              <Link
                href="/#works"
                onClick={() => setIsOpen(false)}
                className="block w-full border border-divider py-4 text-center font-sans text-[13px] text-text-secondary tracking-[0.5px] transition-colors hover:border-text-secondary hover:text-text-primary"
              >
                Browse paintings
              </Link>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-start gap-4">
                {item.imageUrl && (
                  <div className="relative h-16 w-16 shrink-0 bg-divider">
                    <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <div className="flex flex-1 flex-col gap-1">
                  <p className="font-sans text-[16px] text-text-primary">{item.title}</p>
                  <p className="font-sans text-[14px] text-text-secondary">{formatPrice(item.price)}</p>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="mt-0.5 text-text-tertiary transition-colors hover:text-text-primary"
                  aria-label={`Remove ${item.title}`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="flex flex-col gap-4 border-divider border-t px-6 py-6">
            <div className="flex items-center justify-between">
              <span className="font-sans text-[13px] text-text-tertiary">Total</span>
              <span className="font-sans text-[16px] text-text-primary">{formatPrice(total)}</span>
            </div>
            {error && <p className="font-sans text-[13px] text-red-500">{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full cursor-pointer bg-accent py-4 font-sans text-[14px] text-white tracking-[0.5px] transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Checkout"}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="w-full cursor-pointer py-2 font-sans text-[13px] text-text-secondary tracking-[0.5px] transition-colors hover:text-text-primary"
            >
              Continue shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
