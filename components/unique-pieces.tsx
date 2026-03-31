import ArtworkCard from "./artwork/artwork-card";

export default function UniquePieces({ artworks = [] }) {
  if (artworks.length === 0) {
    return null;
  }

  const sorted = [...artworks].sort((a, b) => (a.stock > 0 ? 0 : 1) - (b.stock > 0 ? 0 : 1));

  return (
    <div className="flex flex-col gap-8 px-5 py-[60px] pb-[80px] md:gap-[40px] md:px-[48px]">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <span className="font-normal font-sans text-[16px] text-text-tertiary uppercase tracking-[3px]">
            Unique Pieces
          </span>
          <span className="font-normal font-sans text-[13px] text-text-tertiary tracking-[0.5px]">
            {artworks.length} work{artworks.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="font-normal font-sans text-[12px] text-text-tertiary">
          Original works that stand on their own — not part of any collection.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sorted.map(artwork => (
          <ArtworkCard key={artwork.id} artwork={artwork} />
        ))}
      </div>
    </div>
  );
}
