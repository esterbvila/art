"use client";
import { useState, useTransition } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { createPrintCheckoutSession } from "@/features/payment/checkout";
import { formatPrice } from "@/lib/utils";

interface PrintControlsProps {
  artworkId: string;
  title: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export default function PrintControls({ artworkId, title, price, imageUrl, stock }: PrintControlsProps) {
  const maxQty = Math.min(stock, 10);
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const { isInCart, addItem, setIsOpen } = useCart();

  const inCart = isInCart(artworkId);

  function decrement() {
    setQuantity(q => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity(q => Math.min(maxQty, q + 1));
  }

  function handlePurchase() {
    if (isPending) {
      return;
    }
    setError(null);
    startTransition(async () => {
      try {
        const { url } = await createPrintCheckoutSession(artworkId, quantity);
        window.location.href = url;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not connect. Please try again.");
      }
    });
  }

  function handleCart() {
    if (inCart) {
      setIsOpen(true);
    } else {
      addItem({ id: artworkId, title, price, imageUrl, type: "print", quantity });
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <span className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Quantity</span>
        <div className="flex items-center border border-divider">
          <button
            onClick={decrement}
            disabled={quantity <= 1}
            className="flex h-9 w-9 items-center justify-center font-sans text-[18px] text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-8 text-center font-sans text-[14px] text-text-primary">{quantity}</span>
          <button
            onClick={increment}
            disabled={quantity >= maxQty}
            className="flex h-9 w-9 items-center justify-center font-sans text-[18px] text-text-secondary transition-colors hover:text-text-primary disabled:opacity-30"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handlePurchase}
        disabled={isPending}
        className="flex w-full cursor-pointer items-center justify-center bg-accent px-12 py-4 font-normal font-sans text-[16px] text-white tracking-[0.5px] transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {isPending ? "Redirecting…" : `Buy now — ${formatPrice(price * quantity)}`}
      </button>

      <button
        onClick={handleCart}
        className="w-full cursor-pointer border border-accent px-12 py-4 font-normal font-sans text-[16px] text-accent tracking-[0.5px] transition-colors hover:bg-accent hover:text-bg-main"
      >
        {inCart ? "View Cart" : "Add to Cart"}
      </button>

      {error && <p className="font-sans text-[13px] text-red-500">{error}</p>}
    </div>
  );
}
