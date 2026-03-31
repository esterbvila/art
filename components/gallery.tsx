import CollectionCard from "./collection/collection-card";

interface Collection {
  id: string;
}

export default function Gallery({ collections = [] }: { collections: Collection[] }) {
  return (
    <div className="flex flex-col gap-8 px-5 py-[60px] pb-[80px] md:gap-[40px] md:px-[48px]">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <span className="font-normal font-sans text-[16px] text-text-tertiary uppercase tracking-[3px]">
            Collections
          </span>
          <span className="font-normal font-sans text-[13px] text-text-tertiary tracking-[0.5px]">
            {collections.length} collection{collections.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="font-normal font-sans text-[11px] text-text-tertiary">
          Browse original artworks organized by thematic collections.
        </p>
      </div>

      {collections.length > 0 ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-[32px] lg:grid-cols-3 xl:grid-cols-4">
          {collections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      ) : (
        <p className="font-sans text-sm text-text-tertiary">No collections available at the moment. Check back soon.</p>
      )}
    </div>
  );
}
