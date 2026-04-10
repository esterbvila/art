import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@/app/site-config";
import { db } from "@/drizzle/client";
import { artworkSchema } from "@/drizzle/schema";
import { getArtworkBySlug } from "@/features/artwork/artwork-actions";
import ArtworkImage from "@/features/artwork/artwork-image";
import ArtworkInfoSection from "@/features/artwork/artwork-info-section";
import RelatedArtworks from "@/features/artwork/related-artworks";
import { AddArtworkToCart } from "@/features/cart/add-artwork-to-cart";
import Footer from "@/features/footer";
import ImageSlider from "@/features/image-slider";
import PurchaseButton from "@/features/purchase-button";
import { resolveImages } from "@/lib/storage";
import { formatPrice } from "@/lib/utils";

export async function generateStaticParams() {
  const rows = await db.select({ slug: artworkSchema.slug }).from(artworkSchema).where(eq(artworkSchema.visible, true));

  return rows.filter((row): row is { slug: string } => Boolean(row.slug)).map(({ slug }) => ({ slug }));
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;

  const artwork = await getArtworkBySlug(slug);

  if (!artwork) {
    return {};
  }

  const description = artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`;
  const imageUrl = artwork.imageUrl ?? null;

  return {
    title: `${artwork.title} — Ester Batllori`,
    description,
    alternates: {
      canonical: `https://esteriicreates.com/${slug}`,
    },
    openGraph: {
      title: `${artwork.title} — Ester Batllori`,
      description,
      type: "website",
      url: `https://esteriicreates.com/${slug}`,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      site: "@esterii_creates",
      creator: "@esterii_creates",
      title: `${artwork.title} — Ester Batllori`,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArtworkDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;

  const artworkWithCollection = await getArtworkBySlug(slug);
  if (!artworkWithCollection) {
    notFound();
  }

  const { collection, ...artwork } = artworkWithCollection;

  const artworkImages = (await resolveImages(artwork.imageUrl)) ?? [];

  const isAvailable = artwork.stock > 0;

  const description = artwork.description || collection?.description || null;
  const process = artwork.process || collection?.process || null;
  const medium = artwork.medium || collection?.medium || null;
  const year = artwork.year || collection?.year || null;
  const details = [
    { label: "Medium", value: medium },
    { label: "Dimensions", value: artwork.dimensions },
    { label: "Framing", value: "Not included" },
    { label: "Year", value: year },
    {
      label: "Availability",
      value: isAvailable ? "Available" : "Sold",
      accent: isAvailable,
    },
  ].filter(d => d.value);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: artwork.title,
    description: artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`,
    image: artwork.imageUrl,
    url: `https://esteriicreates.com/${slug}`,
    brand: { "@type": "Brand", name: "esterii creates" },
    offers: {
      "@type": "Offer",
      price: (artwork.price / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
      url: `https://esteriicreates.com/${slug}`,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://esteriicreates.com",
      },
      ...(collection
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: collection.name,
              item: `https://esteriicreates.com/collections/${collection.slug}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: collection ? 3 : 2,
        name: artwork.title,
        item: `https://esteriicreates.com/${slug}`,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="h-px w-full bg-divider" />

      <div className="flex w-full flex-1 flex-col md:flex-row lg:max-w-325">
        <div className="md:w-1/2 md:max-w-140.75 lg:w-[55%] lg:max-w-none">
          <div className="min-h-75 md:hidden">
            <ImageSlider images={artworkImages} alt={artwork.title} />
          </div>
          <div className="hidden flex-col gap-1.5 md:flex lg:hidden">
            {artworkImages.map((src, i) => (
              <ArtworkImage
                artworkImages={artworkImages}
                key={i}
                src={src}
                alt={artwork.title}
                sizes="50vw"
                quality={60}
                priority={i === 0}
              />
            ))}
          </div>

          <div className="hidden flex-col gap-1.5 lg:flex">
            {artworkImages?.[0] && (
              <div className="group relative mx-auto aspect-3/4 w-full max-w-160 cursor-zoom-in overflow-hidden 2xl:max-w-167.5">
                <ArtworkImage src={artworkImages[0]} alt={artwork.title} sizes="(min-width: 1024px) 1920px, 100vw" />
              </div>
            )}

            {artworkImages
              .slice(1)
              .reduce<string[][]>((rows, src, i) => {
                if (i % 2 === 0) {
                  rows.push([]);
                }
                rows[rows.length - 1].push(src);
                return rows;
              }, [])
              .map((pair, rowIdx) => (
                <div key={rowIdx} className="flex gap-1.5">
                  {pair.map((src, colIdx) => (
                    <div
                      key={colIdx}
                      className={`relative aspect-387/500 overflow-hidden ${pair.length === 1 ? "w-1/2" : "flex-1"}`}
                    >
                      <ArtworkImage
                        src={src}
                        alt={artwork.title}
                        sizes="25vw"
                        quality={60}
                        artworkImages={artworkImages}
                      />
                    </div>
                  ))}
                </div>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 p-5 md:sticky md:top-0 md:w-1/2 md:self-start md:p-14 lg:w-[45%]">
          <div className="flex flex-col gap-5">
            <h1
              className="font-normal font-sans text-text-primary"
              style={{
                fontSize: "clamp(26px, 3vw, 42px)",
                letterSpacing: "-1px",
                lineHeight: 1.05,
              }}
            >
              {artwork.title}
            </h1>

            {artwork.tagline && (
              <p className="font-normal font-sans text-[15px] text-text-secondary italic leading-[1.6]">
                {artwork.tagline}
              </p>
            )}
          </div>

          <div className="flex w-full flex-col gap-6">
            <div className="flex flex-col gap-2">
              <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Price</p>
              <p
                className="font-normal font-sans text-text-primary"
                style={{ fontSize: "32px", letterSpacing: "-0.5px" }}
              >
                {formatPrice(artwork.price)}
              </p>
              <p className="font-sans text-[12px] text-text-tertiary tracking-[0.3px]">Shipping &amp; taxes included</p>
            </div>

            {siteConfig.shopEnabled && (
              <div className="flex w-full flex-col gap-3">
                <PurchaseButton artworkId={artworkWithCollection.id} isAvailable={isAvailable} />
                <AddArtworkToCart artwork={{ ...artwork, imageUrl: artworkImages[0] }} />
              </div>
            )}

            <div className="h-px w-full bg-divider" />
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">About</p>
              <p className="whitespace-pre-line font-sans text-[15px] text-text-secondary leading-[1.8]">
                {description}
              </p>
            </div>

            <div className="h-px w-full bg-divider" />

            <div className="flex flex-col gap-4">
              <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Process</p>
              <p className="font-sans text-[15px] text-text-secondary leading-[1.8]">{process}</p>
            </div>
          </div>

          <div className="h-px w-full bg-divider" />

          <div className="flex flex-col gap-3.5">
            {details.map(({ label, value, accent }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="font-sans text-[13px] text-text-tertiary">{label}</span>
                <span className={`font-sans text-[13px] ${accent ? "text-accent" : "text-text-primary"}`}>{value}</span>
              </div>
            ))}
            {collection && (
              <div className="flex items-center justify-between">
                <span className="font-sans text-[13px] text-text-tertiary">Collection</span>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="font-sans text-[13px] text-accent transition-opacity hover:opacity-80"
                >
                  {collection.name}
                </Link>
              </div>
            )}
          </div>

          <div className="h-px w-full bg-divider" />

          <ArtworkInfoSection />
        </div>
      </div>
      <RelatedArtworks artwork={artwork} />
      <div className="h-px w-full bg-divider" />
      <Footer />
    </div>
  );
}
