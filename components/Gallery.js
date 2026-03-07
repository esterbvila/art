import ArtworkCard from './ArtworkCard';

/**
 * Gallery section — renders all artworks in a responsive grid.
 * Desktop: 3 columns | Tablet: 2 columns | Mobile: 1 column.
 * Matches the "Gallery Section" from the prototype.
 */
export default function Gallery({ artworks = [] }) {
  return (
    <div className="flex flex-col gap-8 md:gap-[30px] px-5 md:px-[48px] py-[60px]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between w-full">
          <span className="font-sans font-normal text-text-tertiary text-[15px] tracking-[3px] uppercase">
            Available works
          </span>
          <span className="font-sans font-normal text-text-tertiary text-[15px] tracking-[0.5px]">
            {artworks.length} painting{artworks.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="font-sans font-normal text-text-tertiary text-[11px]">
          Each painting is an original, one-of-a-kind artwork.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      {artworks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-[38px]">
          {artworks.map((artwork) => (
            <ArtworkCard key={artwork.id} artwork={artwork} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-text-tertiary text-sm">
          No artworks available at the moment. Check back soon.
        </p>
      )}
    </div>
  );
}
