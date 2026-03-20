import Image from 'next/image';
import Link from 'next/link';
import { formatPrice } from '../lib/utils';

/**
 * Painting Card component — matches the "Painting Card" reusable component
 * from the prototype.
 *
 * Layout:
 *   - Full-width artwork image (320px tall on desktop)
 *   - Dark strip below with title (left) + price (right)
 *   - Medium/dimensions sub-text beneath the title
 *
 * Clicking the card navigates to the artwork detail page.
 */
export default function ArtworkCard({ artwork }) {
  const { id, title, medium, price, image_url, stock } = artwork;
  const isAvailable = stock > 0;

  return (
    <Link
      href={`/${id}`}
      className="group flex flex-col w-full cursor-pointer"
      aria-label={`View ${title}`}
    >
      {/* ── Artwork image ─────────────────────────────────────────────── */}
      <div className="relative w-full h-[300px] lg:h-[350px] overflow-hidden">
        <Image
          src={image_url}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Sold overlay */}
        {!isAvailable && (
          <div className="absolute inset-0 bg-bg-deep/50 flex items-center justify-center">
            <span className="text-text-light font-sans text-xs tracking-[2px] uppercase">
              Sold
            </span>
          </div>
        )}
      </div>

      {/* ── Card info ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 pt-3">
        <div className="flex items-start justify-between gap-3">
          <span className="font-sans font-semibold text-text-primary text-[17px] leading-[1.3]">
            {title}
          </span>
          <span className="font-sans font-normal text-text-primary text-[16px] leading-[1.3] whitespace-nowrap flex-shrink-0">
            {formatPrice(price)}
          </span>
        </div>
        {medium && (
          <span className="font-sans font-normal text-text-tertiary text-[12px] leading-[1.4]">
            {medium}
          </span>
        )}
      </div>
    </Link>
  );
}
