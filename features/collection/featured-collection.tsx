import Image from "next/image";
import Link from "next/link";
import { getCollections } from "@/features/collection/collection-actions";

export default async function FeaturedCollection() {
  const collections = await getCollections();
  const collection = collections[0];

  if (!collection) {
    return null;
  }

  const image = collection.heroImage || collection.coverImageUrl;

  return (
    <section
      id="collections"
      className="relative w-full overflow-hidden"
      style={{ height: "clamp(480px, 75vh, 800px)" }}
    >
      {image && <Image src={image} alt={collection.name} fill className="object-cover" sizes="100vw" quality={75} />}

      <div className="absolute inset-0 bg-gradient-to-r from-bg-deep/85 via-bg-deep/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-bg-deep/40 via-transparent to-transparent" />

      <div className="absolute inset-0 flex items-end px-5 pb-12 md:items-center md:px-12 md:pb-0">
        <div className="flex max-w-xl flex-col gap-5">
          <span className="font-sans text-[11px] uppercase tracking-[2.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>
            Collection
          </span>

          <h2
            className="font-normal font-sans leading-none"
            style={{
              fontSize: "clamp(38px, 5vw, 68px)",
              letterSpacing: "-1.5px",
              lineHeight: 0.95,
              color: "rgba(255,255,255,0.95)",
            }}
          >
            {collection.name}
          </h2>

          {collection.tagline && (
            <p
              className="font-normal font-sans italic leading-[1.7]"
              style={{ fontSize: "clamp(14px, 1.2vw, 15px)", color: "rgba(255,255,255,0.65)" }}
            >
              {collection.tagline}
            </p>
          )}

          <p className="font-sans text-[12px] tracking-[0.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {collection.artworkCount ?? 0} work{collection.artworkCount !== 1 ? "s" : ""}
          </p>

          <Link
            href={`/collections/${collection.slug}`}
            className="mt-1 w-fit border px-5 py-2.5 font-normal font-sans text-[13px] tracking-[0.5px] transition-all hover:bg-white/10"
            style={{ color: "rgba(255,255,255,0.85)", borderColor: "rgba(255,255,255,0.25)" }}
          >
            Explore collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
