import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

// TODO add type
export default function ArtworkCard({ artwork, imageHeight }: { artwork: any; imageHeight?: string }) {
  const { title, price, image_url, stock, slug } = artwork;
  const isAvailable = stock > 0;

  return (
    <Link href={`/${slug}`} className="group flex w-full cursor-pointer flex-col" aria-label={`View ${title}`}>
      <div className={`relative max-h-102.5 w-full overflow-hidden ${imageHeight ?? "aspect-3/4"}`}>
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="640px"
          quality={60}
        />

        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-deep/50">
            <span className="font-sans text-text-light text-xs uppercase tracking-[2px]">Sold</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <span className="font-sans font-semibold text-[17px] text-text-primary leading-[1.3]">{title}</span>
        <span className="font-normal font-sans text-[15px] text-text-secondary leading-[1.3]">
          {formatPrice(price)}
        </span>
      </div>
    </Link>
  );
}
