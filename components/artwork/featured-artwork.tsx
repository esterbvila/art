import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../../lib/utils";

export default function FeaturedArtwork({ artwork }) {
  if (!artwork) {
    return null;
  }

  return (
    <section className="flex w-full flex-col bg-bg-deep md:h-[560px] md:flex-row">
      <div className="relative h-[340px] w-full shrink-0 overflow-hidden md:h-full md:flex-1">
        <Image
          src={artwork.image_url}
          alt={artwork.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      <div className="flex flex-col justify-center gap-5 px-5 py-8 md:w-[500px] md:shrink-0 md:px-[56px] md:py-[64px]">
        <p className="font-normal font-sans text-[13px] text-text-light-muted uppercase tracking-[3px]">
          Featured Work
        </p>

        <h2
          className="font-normal font-sans text-text-light leading-tight95"
          style={{
            fontSize: "clamp(36px, 3.3vw, 48px)",
            letterSpacing: "-1.5px",
          }}
        >
          {artwork.title}
        </h2>

        <p className="font-normal font-sans text-[13px] text-text-light-muted">
          {[artwork.medium, artwork.dimensions, artwork.year].filter(Boolean).join(" · ")}
        </p>

        <p className="font-normal font-sans text-[15px] text-text-light-muted leading-[1.7]">{artwork.description}</p>

        <div className="flex items-center gap-8 pt-3">
          <span className="font-normal font-sans text-[24px] text-text-light">{formatPrice(artwork.price)}</span>
          <Link
            href={`/${artwork.id}`}
            className="font-normal font-sans text-[14px] text-accent transition-opacity hover:opacity-80"
          >
            Purchase this painting →
          </Link>
        </div>
      </div>
    </section>
  );
}
