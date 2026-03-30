import { ZoomIn } from "lucide-react";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArtworkCard from "../../components/ArtworkCard";
import ArtworkInfoSection from "../../components/ArtworkInfoSection";
import Footer from "../../components/Footer";
import Navigation from "../../components/Navigation";
import PurchaseButton from "../../components/PurchaseButton";
import { resolveFirstImage, resolveImages } from "../../lib/storage";
import { getSupabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/utils";

const SHOP_ENABLED = true;

export default async function ArtworkDetailPage(props: { params: Promise<{ artworkId: string }> }) {
  // const { addItem, isInCart, setIsOpen } = useCart();
  // const [lightboxSrc, setLightboxSrc] = useState(null);t

  const supabase = await getSupabase();

  const { artworkId } = await props.params;

  const { data: artwork, error } = await supabase
    .from("artworks")
    .select("*, collections(id, slug, name, description, process, medium, year, price)")
    .eq("id", artworkId)
    .single();

  console.error(error);

  if (error || !artwork) {
    notFound();
  }

  const { collections: collection, ...artworkData } = artwork;

  artworkData.images = await resolveImages(artworkData.image_url);

  const RELATED_LIMIT = 4;
  const excludeIds = [artworkId];

  let sameCollection = [];

  if (collection?.id) {
    const { data } = await supabase
      .from("artworks")
      .select("id, title, price, image_url, stock, tagline, collections(price)")
      .eq("visible", true)
      .eq("collection_id", collection.id)
      .neq("id", artworkId)
      .gt("stock", 0)
      .limit(RELATED_LIMIT);

    sameCollection = data ?? [];

    excludeIds.push(...sameCollection.map(a => a.id));
  }

  const remaining = RELATED_LIMIT - sameCollection.length;
  let others = [];
  if (remaining > 0) {
    const { data } = await supabase
      .from("artworks")
      .select("id, title, price, image_url, stock, tagline, collections(price)")
      .eq("visible", true)
      .gt("stock", 0)
      .not("id", "in", `(${excludeIds.join(",")})`)
      .limit(remaining * 3);

    const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, remaining);
    others = shuffled;
  }

  const relatedRaw = [...sameCollection, ...others];

  const related = await Promise.all(
    relatedRaw.map(async a => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
      price: a.price || a.collections?.price || null,
    })),
  );

  if (!artwork) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg-main">
        <p className="font-sans text-text-tertiary">Artwork not found.</p>
      </div>
    );
  }

  const isAvailable = artwork.stock > 0;
  // const inCart = isInCart(artwork.id);

  const description = artwork.description || collection?.description || null;
  const process = artwork.process || collection?.process || null;
  const medium = artwork.medium || collection?.medium || null;
  const year = artwork.year || collection?.year || null;
  const price = artwork.price || collection?.price || null;

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

  return (
    <>
      <Head>
        <title>{`${artwork.title} — Ester Batllori`}</title>
        <meta
          name="description"
          content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`}
        />
        <meta property="og:title" content={`${artwork.title} — Ester Batllori`} />
        <meta
          property="og:description"
          content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`}
        />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://esteriicreates.com/${artwork.id}`} />
        {artwork.image_url && <meta property="og:image" content={artwork.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@esterii_creates" />
        <meta name="twitter:creator" content="@esterii_creates" />
        <meta name="twitter:title" content={`${artwork.title} — Ester Batllori`} />
        <meta
          name="twitter:description"
          content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`}
        />
        {artwork.image_url && <meta name="twitter:image" content={artwork.image_url} />}
        <link rel="canonical" href={`https://esteriicreates.com/${artwork.id}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: artwork.title,
              description: artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`,
              image: artwork.image_url,
              url: `https://esteriicreates.com/${artwork.id}`,
              brand: { "@type": "Brand", name: "esterii creates" },
              offers: {
                "@type": "Offer",
                price: (artwork.price / 100).toFixed(2),
                priceCurrency: "EUR",
                availability: isAvailable ? "https://schema.org/InStock" : "https://schema.org/SoldOut",
                url: `https://esteriicreates.com/${artwork.id}`,
              },
            }).replace(/</g, "\\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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
                  item: `https://esteriicreates.com/${artwork.id}`,
                },
              ],
            }).replace(/</g, "\\u003c"),
          }}
        />
      </Head>

      <div className="flex min-h-screen flex-col items-center bg-bg-main">
        {/* ── Navigation ─────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Top divider ────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Two-column content ─────────────────────────────────────── */}
        {/* Mobile: stacked | Desktop: image left · info right          */}
        <div className="flex w-full flex-1 flex-col md:flex-row lg:max-w-[1300px]">
          {/* Left — image */}
          <div className="md:w-1/2 md:max-w-[563px] lg:w-[55%] lg:max-w-none">
            {/* < md: slider */}
            <div className="min-h-[300px] md:hidden">
              {/*<ImageSlider images={artwork.images ?? []} alt={artwork.title} onImageClick={setLightboxSrc} />*/}
            </div>

            {/* md to lg: single column stack */}
            <div className="hidden flex-col gap-[6px] md:flex lg:hidden">
              {(artwork.images ?? []).map((src, i) => (
                <div
                  key={i}
                  className="group relative aspect-3/4 w-full cursor-zoom-in overflow-hidden"
                  // onClick={() => setLightboxSrc(src)}
                >
                  <Image
                    src={src}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="50vw"
                    quality={60}
                    priority={i === 0}
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // setLightboxSrc(src);
                    }}
                    aria-label="View full screen"
                    className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center bg-bg-main/80 opacity-0 transition-colors hover:bg-bg-main group-hover:opacity-100"
                  >
                    <ZoomIn size={15} className="text-text-primary" />
                  </button>
                </div>
              ))}
            </div>

            {/* lg+: 1-over-N×2 image grid */}
            <div className="hidden flex-col gap-[6px] lg:flex">
              {artwork.images?.[0] && (
                <div
                  className="group relative mx-auto aspect-3/4 w-full max-w-[640px] cursor-zoom-in overflow-hidden 2xl:max-w-[670px]"
                  // onClick={() => setLightboxSrc(artwork.images[0])}
                >
                  <Image
                    src={artwork.images[0]}
                    alt={artwork.title}
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 1920px, 100vw"
                    quality={100}
                    priority
                  />
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      // setLightboxSrc(artwork.images[0]);
                    }}
                    aria-label="View full screen"
                    className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center bg-bg-main/80 opacity-0 transition-colors hover:bg-bg-main group-hover:opacity-100"
                  >
                    <ZoomIn size={15} className="text-text-primary" />
                  </button>
                </div>
              )}
              {(artwork.images ?? [])
                .slice(1)
                .reduce((rows, src, i) => {
                  if (i % 2 === 0) {
                    rows.push([]);
                  }
                  rows[rows.length - 1].push(src);
                  return rows;
                }, [])
                .map((pair, rowIdx) => (
                  <div key={rowIdx} className="flex gap-[6px]">
                    {pair.map((src, colIdx) => (
                      <div
                        key={colIdx}
                        className={`group relative aspect-387/500 cursor-zoom-in overflow-hidden ${pair.length === 1 ? "w-1/2" : "flex-1"}`}
                        // onClick={() => setLightboxSrc(src)}
                      >
                        <Image src={src} alt={artwork.title} fill className="object-cover" sizes="25vw" quality={60} />
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            // setLightboxSrc(src);
                          }}
                          aria-label="View full screen"
                          className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center bg-bg-main/80 opacity-0 transition-colors hover:bg-bg-main group-hover:opacity-100"
                        >
                          <ZoomIn size={15} className="text-text-primary" />
                        </button>
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Right — artwork info */}
          <div className="flex flex-col gap-8 p-5 md:sticky md:top-0 md:w-1/2 md:self-start md:p-[56px] lg:w-[45%]">
            {/* Title + meta */}
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

            {/* Price + purchase button */}
            <div className="flex w-full flex-col gap-6">
              <div className="flex flex-col gap-2">
                <p className="font-sans text-[11px] text-text-tertiary uppercase tracking-[2px]">Price</p>
                <p
                  className="font-normal font-sans text-text-primary"
                  style={{ fontSize: "32px", letterSpacing: "-0.5px" }}
                >
                  {formatPrice(price)}
                </p>
                <p className="font-sans text-[12px] text-text-tertiary tracking-[0.3px]">
                  Shipping &amp; taxes included
                </p>
              </div>

              {SHOP_ENABLED && (
                <div className="flex w-full flex-col gap-3">
                  <PurchaseButton artworkId={artwork.id} isAvailable={isAvailable} />

                  {/*{isAvailable && (*/}
                  {/*  <button*/}
                  {/*    onClick={() => {*/}
                  {/*      if (inCart) {*/}
                  {/*        setIsOpen(true);*/}
                  {/*      } else {*/}
                  {/*        addItem({*/}
                  {/*          id: artwork.id,*/}
                  {/*          title: artwork.title,*/}
                  {/*          price: price,*/}
                  {/*          imageUrl: artwork.images?.[0] ?? null,*/}
                  {/*        });*/}
                  {/*      }*/}
                  {/*    }}*/}
                  {/*    className="w-full cursor-pointer border border-accent px-12 py-4 font-normal font-sans text-[14px] text-accent tracking-[0.5px] transition-colors hover:bg-accent hover:text-bg-main"*/}
                  {/*  >*/}
                  {/*    {inCart ? "View Cart" : "Add to Cart"}*/}
                  {/*  </button>*/}
                  {/*)}*/}
                </div>
              )}

              <div className="h-px w-full bg-divider" />
            </div>

            {/* About + Process */}
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

            {/* Divider */}
            <div className="h-px w-full bg-divider" />

            {/* Details grid */}
            <div className="flex flex-col gap-[14px]">
              {details.map(({ label, value, accent }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="font-sans text-[13px] text-text-tertiary">{label}</span>
                  <span className={`font-sans text-[13px] ${accent ? "text-accent" : "text-text-primary"}`}>
                    {value}
                  </span>
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

            {/* Divider */}
            <div className="h-px w-full bg-divider" />

            {/* Info Section */}
            <ArtworkInfoSection />
          </div>
        </div>

        {related.length > 0 && (
          <>
            <div className="h-px w-full bg-divider" />
            <div className="w-full py-10 md:py-[56px] lg:px-[56px]">
              <p className="mb-8 px-5 font-sans text-[11px] text-text-tertiary uppercase tracking-[3px] md:px-[56px] lg:px-0">
                You might also like
              </p>

              <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto pr-5 pb-2 pl-5 lg:hidden">
                {related.map(a => (
                  <div key={a.id} className="w-[50vw] shrink-0 snap-start sm:w-[30vw]">
                    <ArtworkCard artwork={a} imageHeight="h-[230px]" sizes="(max-width: 640px) 50vw, 30vw" />
                  </div>
                ))}
              </div>

              {/* Desktop: grid */}
              <div className="hidden grid-cols-4 gap-[20px] lg:grid">
                {related.map(a => (
                  <ArtworkCard key={a.id} artwork={a} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <Footer />
      </div>

      {/*{lightboxSrc && (*/}
      {/*  <ImageLightbox*/}
      {/*    src={lightboxSrc}*/}
      {/*    images={artwork.images ?? []}*/}
      {/*    alt={artwork.title}*/}
      {/*    onClose={() => setLightboxSrc(null)}*/}
      {/*  />*/}
      {/*)}*/}
    </>
  );
}
