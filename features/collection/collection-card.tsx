import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

export default function CollectionCard({ collection }) {
  return (
    <Link
      href={`/collections/${collection.slug}`}
      className="group flex w-full cursor-pointer flex-col"
      aria-label={`View ${collection.name} collection`}
    >
      <div className="relative aspect-3/4 max-h-102.5 w-full overflow-hidden">
        {collection.cover_image_url ? (
          <Image
            src={collection.cover_image_url}
            alt={collection.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            sizes="640px"
            quality={60}
          />
        ) : (
          <div className="h-full w-full bg-divider" />
        )}
      </div>

      <div className="flex flex-col gap-1.5 pt-3">
        <p className="font-sans font-semibold text-text-primary" style={{ fontSize: "22px", letterSpacing: "-0.5px" }}>
          {collection.name}
        </p>

        {collection.tagline && (
          <p className="font-normal font-sans text-[14px] text-text-secondary leading-[1.6]">{collection.tagline}</p>
        )}

        <p className="font-normal font-sans text-[12px] text-text-tertiary tracking-[0.5px]">
          {collection.artwork_count ?? 0} work{collection.artwork_count !== 1 ? "s" : ""}
          {collection.min_price ? ` · From ${formatPrice(collection.min_price)}` : ""}
        </p>
      </div>
    </Link>
  );
}
