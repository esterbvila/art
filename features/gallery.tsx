import { getCollections } from "@/features/collection/collection-actions";
import CollectionCard from "@/features/collection/collection-card";

export default async function Gallery() {
  const collections = await getCollections();

  return (
    <div className="flex flex-col gap-8 px-5 py-15 pb-20 md:gap-10 md:px-12">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <span className="font-normal font-sans text-[16px] text-text-tertiary uppercase tracking-wide3">
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
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
