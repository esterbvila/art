"use client";
import { artworkSchema } from "@/drizzle/schema";
import { useCart } from "@/features/cart/card-provider";

export function AddArtworkToCart({ artwork }: { artwork: typeof artworkSchema.$inferSelect }) {
  const isAvailable = artwork.stock > 0;

  const { isInCart, setIsOpen, addItem } = useCart();

  if (!isAvailable) {
    return null;
  }
  const inCart = isInCart(artwork.id);

  return (
    <button
      onClick={() => {
        if (inCart) {
          setIsOpen(true);
        } else {
          addItem({
            id: artwork.id,
            title: artwork.title,
            price: artwork.price,
            imageUrl: artwork.imageUrl ?? "",
          });
        }
      }}
      className="w-full cursor-pointer border border-accent px-12 py-4 font-normal font-sans text-[14px] text-accent tracking-[0.5px] transition-colors hover:bg-accent hover:text-bg-main"
    >
      {inCart ? "View Cart" : "Add to Cart"}
    </button>
  );
}
