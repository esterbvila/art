import CollectionCard from './CollectionCard';

/**
 * Gallery section — renders collections in a 3-column grid.
 * Matches the "Gallery Section" from the "Abstract Art - Desktop" prototype.
 */
export default function Gallery({ collections = [] }) {
  return (
    <div className="flex flex-col gap-8 md:gap-[40px] px-5 md:px-[48px] py-[60px] pb-[80px]">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between w-full">
          <span className="font-sans font-normal text-text-tertiary text-[16px] tracking-[3px] uppercase">
            Collections
          </span>
          <span className="font-sans font-normal text-text-tertiary text-[13px] tracking-[0.5px]">
            {collections.length} collection{collections.length !== 1 ? 's' : ''}
          </span>
        </div>
        <p className="font-sans font-normal text-text-tertiary text-[11px]">
          Browse original artworks organized by thematic collections.
        </p>
      </div>

      {/* ── Grid ───────────────────────────────────────────────────────── */}
      {collections.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-[32px]">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-text-tertiary text-sm">
          No collections available at the moment. Check back soon.
        </p>
      )}
    </div>
  );
}
