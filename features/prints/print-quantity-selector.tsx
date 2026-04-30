"use client";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/features/cart/cart-provider";
import { createPrintCheckoutSession } from "@/features/payment/checkout";
import { formatPrice } from "@/lib/utils";

export default function PrintQuantitySelector({
  printId,
  title,
  price,
  stock,
  imageUrl,
  size,
  material,
}: {
  printId: string;
  title: string;
  price: number;
  stock: number;
  imageUrl: string;
  size: string;
  material: string;
}) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { addItem, isInCart, setIsOpen } = useCart();

  const isAvailable = stock > 0;
  const max = Math.min(stock, 10);
  const inCart = isInCart(printId);

  async function handleBuyNow() {
    if (!isAvailable || loading) return;
    setLoading(true);
    setError(null);
    try {
      const { url } = await createPrintCheckoutSession(printId, quantity);
      window.location.href = url;
    } catch {
      setError("Could not connect. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleAddToCart() {
    if (inCart) {
      setIsOpen(true);
      return;
    }
    addItem({ id: printId, title, price, imageUrl, type: "print", quantity, size, material });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Price</p>
        <p className="font-normal font-sans text-text-primary" style={{ fontSize: "32px", letterSpacing: "-0.5px" }}>
          {formatPrice(price * quantity)}
        </p>
        <p className="font-sans text-[12px] text-text-tertiary tracking-[0.3px]">Shipping &amp; taxes included</p>
      </div>

      {isAvailable && (
        <div className="flex flex-col gap-2">
          <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Quantity</p>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(q => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-9 w-9 items-center justify-center border border-divider text-text-primary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="w-6 text-center font-sans text-[15px] text-text-primary">{quantity}</span>
            <button
              onClick={() => setQuantity(q => Math.min(max, q + 1))}
              disabled={quantity >= max}
              className="flex h-9 w-9 items-center justify-center border border-divider text-text-primary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      )}

      <div className="flex w-full flex-col gap-3">
        <button
          onClick={handleBuyNow}
          disabled={!isAvailable || loading}
          className={[
            "flex w-full items-center justify-center",
            "font-normal font-sans text-[14px] tracking-[0.5px]",
            "px-12 py-4 transition-opacity",
            isAvailable
              ? "cursor-pointer bg-accent text-white hover:opacity-90"
              : "cursor-not-allowed bg-divider text-text-tertiary",
          ].join(" ")}
        >
          {loading ? "Redirecting…" : isAvailable ? "Purchase print" : "Sold out"}
        </button>

        {isAvailable && (
          <button
            onClick={handleAddToCart}
            className="w-full cursor-pointer border border-accent px-12 py-4 font-normal font-sans text-[14px] text-accent tracking-[0.5px] transition-colors hover:bg-accent hover:text-bg-main"
          >
            {inCart ? "View Cart" : "Add to Cart"}
          </button>
        )}
      </div>

      {error && <p className="font-sans text-[13px] text-red-500">{error}</p>}
    </div>
  );
}
