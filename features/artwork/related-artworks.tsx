import { artworkSchema } from "@/drizzle/schema";
import { getRelatedArtworks } from "@/features/artwork/artwork-actions";
import ArtworkCard from "@/features/artwork/artwork-card";

export default async function RelatedArtworks({
  artwork,
}: {
  artwork: typeof artworkSchema.$inferSelect;
  limit?: number;
}) {
  const relatedArtworks = await getRelatedArtworks(artwork);

  if (relatedArtworks.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-10 md:py-14 lg:px-14">
      <p className="mb-8 px-5 font-sans text-[11px] text-text-tertiary uppercase tracking-wide3 md:px-[56px] lg:px-0">
        You might also like
      </p>

      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto pr-5 pb-2 pl-5 lg:hidden">
        {relatedArtworks.map(artwork => (
          <div key={artwork.id} className="w-[50vw] shrink-0 snap-start sm:w-[30vw]">
            <ArtworkCard artwork={artwork} imageHeight="h-[230px]" />
          </div>
        ))}
      </div>

      <div className="hidden grid-cols-4 gap-5 lg:grid">
        {relatedArtworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
