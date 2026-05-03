import Image from "next/image";
import Link from "next/link";
import { artworkSchema } from "@/drizzle/schema";
import { formatPrice } from "@/lib/utils";

export default function ArtworkCard({
  artwork,
  imageHeight,
}: {
  artwork: typeof artworkSchema.$inferSelect;
  imageHeight?: string;
}) {
  const isAvailable = artwork.stock > 0;

  return (
    <Link
      href={`/${artwork.slug}`}
      className="group flex w-full cursor-pointer flex-col"
      aria-label={`View ${artwork.title}`}
    >
      <div className={`relative max-h-102.5 w-full overflow-hidden ${imageHeight ?? "aspect-3/4"}`}>
        <Image
          src={artwork.imageUrl}
          alt={artwork.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="640px"
          quality={60}
        />

        <div className="absolute top-2.5 left-2.5">
          <span className="bg-bg-main/90 px-2 py-1 font-sans text-[10px] text-text-secondary uppercase tracking-[1.5px]">
            {artwork.type === "print" ? "Print" : "Original"}
          </span>
        </div>

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-deep/50">
            <span className="font-sans text-text-light text-xs uppercase tracking-[2px]">Sold</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <span className="font-sans font-semibold text-[18px] text-text-primary leading-[1.3]">{artwork.title}</span>

        <span className="font-medium font-sans text-[16px] text-text-primary leading-[1.3]">
          {formatPrice(artwork.price)}
        </span>
      </div>
    </Link>
  );
}
