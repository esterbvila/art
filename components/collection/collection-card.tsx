import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../lib/utils";

export default function CollectionCard({ collection }) {
  const { slug, name, tagline, cover_image_url, artwork_count, min_price } = collection;

  return (
    <Link
      href={`/collections/${slug}`}
      className="group flex w-full cursor-pointer flex-col"
      aria-label={`View ${name} collection`}
    >
      <div className="relative aspect-3/4 max-h-[410px] w-full overflow-hidden">
        {cover_image_url ? (
          <Image
            src={cover_image_url}
            alt={name}
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
          {name}
        </p>

        {tagline && <p className="font-normal font-sans text-[14px] text-text-secondary leading-[1.6]">{tagline}</p>}

        <p className="font-normal font-sans text-[12px] text-text-tertiary tracking-[0.5px]">
          {artwork_count ?? 0} work{artwork_count !== 1 ? "s" : ""}
          {min_price ? ` · From ${formatPrice(min_price)}` : ""}
        </p>
      </div>
    </Link>
  );
}
