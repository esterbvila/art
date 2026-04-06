import { Navigation } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { siteConfig } from "@/app/site-config";
import { getArtworksByCollection } from "@/features/artwork/artwork-actions";
import ArtworkCard from "@/features/artwork/artwork-card";
import Footer from "@/features/footer";
import { resolveFirstImage } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const supabase = await getSupabase();
  const { data } = await supabase.from("collections").select("slug").eq("visible", true);

  return (data ?? []).map(({ slug }) => ({ slug }));
}

async function getCollection(slug: string) {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("collections")
    .select("id, slug, name, description_collection, tagline, cover_image_url, hero_image, price")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollection(slug);
  if (!collection) {
    return {};
  }

  const supabase = await getSupabase();
  const { data: firstArtwork } = await supabase
    .from("artworks")
    .select("image_url")
    .eq("collection_id", collection.id)
    .eq("visible", true)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  const ogImage =
    collection.hero_image ||
    collection.cover_image_url ||
    (firstArtwork ? ((await resolveFirstImage(firstArtwork.image_url)) ?? null) : null);

  const description =
    collection.description_collection ||
    `${collection.name} — A collection of original abstract paintings by ${siteConfig.name}.`;

  return {
    title: `${collection.name} — ${siteConfig.name}`,
    description,
    alternates: {
      canonical: `https://esteriicreates.com/collections/${collection.slug}`,
    },
    openGraph: {
      title: `${collection.name} — ${siteConfig.name}`,
      description,
      type: "website",
      url: `https://esteriicreates.com/collections/${collection.slug}`,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@esterii_creates",
      creator: "@esterii_creates",
      title: `${collection.name} — Ester Batllori`,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const collection = await getCollection(slug);

  if (!collection) {
    notFound();
  }

  const artworksRaw = await getArtworksByCollection(collection.id);

  const artworks = await Promise.all(
    (artworksRaw ?? []).map(async a => ({
      ...a,
      imageUrl: (await resolveFirstImage(a.imageUrl)) ?? a.imageUrl,
    })),
  );

  const minPrice = artworks.length > 0 ? Math.min(...artworks.map(a => a.price)) : null;
  const heroImage = collection.hero_image || collection.cover_image_url || (artworks[0]?.imageUrl ?? null);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://esteriicreates.com" },
      {
        "@type": "ListItem",
        position: 2,
        name: collection.name,
        item: `https://esteriicreates.com/collections/${collection.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="flex min-h-screen flex-col bg-bg-main">
        <Navigation />

        <div className="h-px w-full bg-divider" />

        {heroImage && (
          <div className="relative h-70 w-full overflow-hidden md:h-120">
            <Image
              src={heroImage}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="100vw"
              quality={60}
              priority
            />
          </div>
        )}

        <div className="flex flex-col gap-4 px-5 py-10 md:flex-row md:items-end md:justify-between md:gap-20 md:px-12 md:py-16">
          <div className="flex flex-col gap-4 md:gap-5">
            <p className="font-normal font-sans text-[12px] text-text-tertiary uppercase tracking-wide3">Collection</p>
            <h1
              className="font-normal font-sans text-text-primary"
              style={{ fontSize: "clamp(36px, 4vw, 52px)", letterSpacing: "-1.5px", lineHeight: 0.95 }}
            >
              {collection.name}
            </h1>
            {collection.tagline && (
              <p className="font-normal font-sans text-[14px] text-text-secondary italic leading-[1.7] md:text-[15px]">
                {collection.tagline}
              </p>
            )}
            <p className="font-normal font-sans text-[12px] text-text-tertiary tracking-[0.5px] md:text-[13px]">
              {artworks.length} work{artworks.length !== 1 ? "s" : ""}
              {minPrice ? ` · Prices from ${formatPrice(minPrice)}` : ""}
            </p>
          </div>

          {collection.description_collection && (
            <p className="font-normal font-sans text-[14px] text-text-secondary leading-[1.7] md:max-w-105 md:shrink-0 md:text-[15px]">
              {collection.description_collection}
            </p>
          )}
        </div>

        <div className="h-px w-full bg-divider" />

        <div className="px-5 py-10 md:px-12 md:py-12 md:pb-20">
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 gap-x-9.5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map(artwork => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <p className="font-sans text-sm text-text-tertiary">No artworks in this collection yet.</p>
          )}
        </div>

        <div className="h-px w-full bg-divider" />

        <Footer />
      </div>
    </>
  );
}
