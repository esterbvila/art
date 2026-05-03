import { getArtworksWithoutCollection } from "@/features/artwork/artwork-actions";
import ArtworkCard from "@/features/artwork/artwork-card";

export default async function UniqueArtworks() {
  const artworks = await getArtworksWithoutCollection();

  if (artworks.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 px-5 py-15 pb-20 md:gap-10 md:px-12">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <span className="font-normal font-sans text-[16px] text-text-tertiary uppercase tracking-wide3">
            Original Paintings
          </span>
          <span className="font-normal font-sans text-[13px] text-text-tertiary tracking-[0.5px]">
            {artworks.length} work{artworks.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="font-normal font-sans text-[12px] text-text-tertiary">
          One-of-a-kind artworks — only one exists.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {artworks.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
