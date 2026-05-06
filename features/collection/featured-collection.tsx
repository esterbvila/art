import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getArtworksByCollection } from "@/features/artwork/artwork-actions";
import { getCollections } from "@/features/collection/collection-actions";
import { resolveDisplayImage } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export default async function FeaturedCollection() {
  const collections = await getCollections();
  const collection = collections[0];

  if (!collection) {
    return null;
  }

  const image = collection.heroImage || collection.coverImageUrl;

  const artworksRaw = await getArtworksByCollection(collection.id);
  const previewArtworks = await Promise.all(
    (artworksRaw ?? []).slice(0, 3).map(async a => ({
      ...a,
      imageUrl: await resolveDisplayImage(a.imageUrl),
    })),
  );

  const minPrice = previewArtworks.length > 0 ? Math.min(...previewArtworks.map(a => a.price)) : null;

  return (
    <section
      id="collections"
      className="flex w-full flex-col md:flex-row"
      style={{ minHeight: "clamp(480px, 65vh, 680px)" }}
    >
      {image && (
        <div className="relative h-64 w-full overflow-hidden md:h-auto md:flex-1">
          <Image
            src={image}
            alt={collection.name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 60vw, 100vw"
            quality={75}
          />
        </div>
      )}

      <div className="flex w-full shrink-0 flex-col justify-between bg-bg-warm px-8 py-10 md:w-[520px] md:px-12 md:py-15">
        <div className="flex flex-col gap-5">
          <span className="font-normal font-sans text-[14px] text-text-tertiary uppercase tracking-wide3">
            Featured Collection
          </span>

          <h2
            className="font-heading font-normal text-text-primary"
            style={{ fontSize: "clamp(36px, 3.5vw, 54px)", letterSpacing: "-1.5px", lineHeight: 0.95 }}
          >
            {collection.name}
          </h2>

          {collection.descriptionCollection && (
            <p className="font-normal font-sans text-[14px] text-text-secondary leading-[1.7]">
              {collection.descriptionCollection}
            </p>
          )}

          <p className="font-normal font-sans text-[12px] text-text-tertiary tracking-[0.5px]">
            {collection.artworkCount ?? 0} work{collection.artworkCount !== 1 ? "s" : ""}
            {minPrice ? ` · From ${formatPrice(minPrice)}` : ""}
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-5 md:mt-0">
          {previewArtworks.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="font-medium font-sans text-[10px] text-text-tertiary uppercase tracking-[2px]">
                From the collection
              </span>
              <div className="flex gap-3">
                {previewArtworks.map(artwork => (
                  <div key={artwork.id} className="relative h-24 w-24 overflow-hidden">
                    <Image
                      src={artwork.imageUrl}
                      alt={artwork.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                      quality={60}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <Link
            href={`/collections/${collection.slug}`}
            className="flex w-fit items-center gap-2 font-medium font-sans text-[14px] text-accent tracking-[0.5px] transition-opacity hover:opacity-70"
          >
            View Collection <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
