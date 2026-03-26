import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PurchaseButton from '../components/PurchaseButton';
import ImageSlider from '../components/ImageSlider';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import { formatPrice } from '../lib/utils';
import { resolveImages, resolveFirstImage } from '../lib/storage';
import useCart from '../context/useCart';
import ArtworkInfoSection from '../components/ArtworkInfoSection';
import ArtworkCard from '../components/ArtworkCard';
import ImageLightbox from '../components/ImageLightbox';

// Set to true to re-enable purchasing
const SHOP_ENABLED = true;

/**
 * Artwork detail page.
 * Route: /[artworkId] where artworkId is the Supabase UUID.
 * Two-column desktop layout: image left, info right — matching the prototype.
 */
export default function ArtworkDetail({ artwork, collection, related = [] }) {
  const { addItem, isInCart, setIsOpen } = useCart();
  const [lightboxSrc, setLightboxSrc] = useState(null);

  if (!artwork) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center">
        <p className="text-text-tertiary font-sans">Artwork not found.</p>
      </div>
    );
  }

  const isAvailable = artwork.stock > 0;
  const inCart = isInCart(artwork.id);

  // Fall back to collection-level values if artwork fields are empty
  const description = artwork.description || collection?.description || null;
  const process     = artwork.process     || collection?.process     || null;
  const medium      = artwork.medium      || collection?.medium      || null;
  const year        = artwork.year        || collection?.year        || null;
  const price       = artwork.price       || collection?.price       || null;

  const details = [
    { label: 'Medium',       value: medium },
    { label: 'Dimensions',   value: artwork.dimensions },
    { label: 'Framing',      value: 'Not included' },
    { label: 'Year',         value: year },
    { label: 'Availability', value: isAvailable ? 'Available' : 'Sold', accent: isAvailable },
  ].filter((d) => d.value);

  return (
    <>
      <Head>
        <title>{`${artwork.title} — Ester Batllori`}</title>
        <meta name="description" content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`} />
        <meta property="og:title" content={`${artwork.title} — Ester Batllori`} />
        <meta property="og:description" content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://esteriicreates.com/${artwork.id}`} />
        {artwork.image_url && <meta property="og:image" content={artwork.image_url} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@esterii_creates" />
        <meta name="twitter:creator" content="@esterii_creates" />
        <meta name="twitter:title" content={`${artwork.title} — Ester Batllori`} />
        <meta name="twitter:description" content={artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`} />
        {artwork.image_url && <meta name="twitter:image" content={artwork.image_url} />}
        <link rel="canonical" href={`https://esteriicreates.com/${artwork.id}`} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: artwork.title,
            description: artwork.description || `${artwork.title} — Original abstract painting by Ester Batllori.`,
            image: artwork.image_url,
            url: `https://esteriicreates.com/${artwork.id}`,
            brand: { '@type': 'Brand', name: 'esterii creates' },
            offers: {
              '@type': 'Offer',
              price: (artwork.price / 100).toFixed(2),
              priceCurrency: 'EUR',
              availability: isAvailable ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
              url: `https://esteriicreates.com/${artwork.id}`,
            },
          }).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://esteriicreates.com' },
              ...(collection ? [{ '@type': 'ListItem', position: 2, name: collection.name, item: `https://esteriicreates.com/collections/${collection.slug}` }] : []),
              { '@type': 'ListItem', position: collection ? 3 : 2, name: artwork.title, item: `https://esteriicreates.com/${artwork.id}` },
            ],
          }).replace(/</g, '\\u003c') }}
        />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col items-center">

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Top divider ────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Two-column content ─────────────────────────────────────── */}
        {/* Mobile: stacked | Desktop: image left · info right          */}
        <div className="flex flex-col md:flex-row flex-1 w-full lg:max-w-[1300px]">

          {/* Left — image */}
          <div className="md:w-1/2 lg:w-[55%] md:max-w-[563px] lg:max-w-none">

            {/* < md: slider */}
            <div className="md:hidden min-h-[300px]">
              <ImageSlider images={artwork.images ?? []} alt={artwork.title} onImageClick={setLightboxSrc} />
            </div>

            {/* md to lg: single column stack */}
            <div className="hidden md:flex lg:hidden flex-col gap-[6px]">
              {(artwork.images ?? []).map((src, i) => (
                <div key={i} className="relative w-full aspect-square overflow-hidden group cursor-zoom-in" onClick={() => setLightboxSrc(src)}>
                  <Image src={src} alt={artwork.title} fill className="object-cover" sizes="50vw" quality={60} priority={i === 0} />
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxSrc(src); }}
                    aria-label="View full screen"
                    className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <ZoomIn size={15} className="text-text-primary" />
                  </button>
                </div>
              ))}
            </div>

            {/* lg+: 1-over-N×2 image grid */}
            <div className="hidden lg:flex flex-col gap-[6px]">
              {artwork.images?.[0] && (
                <div className="relative w-full max-w-[650px] 2xl:max-w-[670px] mx-auto aspect-[2/3] overflow-hidden group cursor-zoom-in" onClick={() => setLightboxSrc(artwork.images[0])}>
                  <Image src={artwork.images[0]} alt={artwork.title} fill className="object-cover" sizes="650px" quality={100} priority />
                  <button
                    onClick={(e) => { e.stopPropagation(); setLightboxSrc(artwork.images[0]); }}
                    aria-label="View full screen"
                    className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-0 group-hover:opacity-100 z-10"
                  >
                    <ZoomIn size={15} className="text-text-primary" />
                  </button>
                </div>
              )}
              {(artwork.images ?? []).slice(1).reduce((rows, src, i) => {
                if (i % 2 === 0) rows.push([]);
                rows[rows.length - 1].push(src);
                return rows;
              }, []).map((pair, rowIdx) => (
                <div key={rowIdx} className="flex gap-[6px]">
                  {pair.map((src, colIdx) => (
                    <div key={colIdx} className={`relative aspect-[387/500] overflow-hidden group cursor-zoom-in ${pair.length === 1 ? 'w-1/2' : 'flex-1'}`} onClick={() => setLightboxSrc(src)}>
                      <Image src={src} alt={artwork.title} fill className="object-cover" sizes="25vw" quality={60} />
                      <button
                        onClick={(e) => { e.stopPropagation(); setLightboxSrc(src); }}
                        aria-label="View full screen"
                        className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-0 group-hover:opacity-100 z-10"
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
          <div className="md:w-1/2 lg:w-[45%] flex flex-col gap-8 p-5 md:p-[56px] md:sticky md:top-0 md:self-start">

          {/* Title + meta */}
          <div className="flex flex-col gap-5">
            <h1
              className="font-sans font-normal text-text-primary"
              style={{ fontSize: 'clamp(26px, 3vw, 42px)', letterSpacing: '-1px', lineHeight: 1.05 }}
            >
              {artwork.title}
            </h1>

            {artwork.tagline && (
              <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.6] italic">
                {artwork.tagline}
              </p>
            )}
          </div>

          {/* Price + purchase button */}
          <div className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                Price
              </p>
              <p
                className="font-sans font-normal text-text-primary"
                style={{ fontSize: '32px', letterSpacing: '-0.5px' }}
              >
                {formatPrice(price)}
              </p>
              <p className="font-sans text-text-tertiary text-[12px] tracking-[0.3px]">
                Shipping &amp; taxes included
              </p>

            </div>

            {SHOP_ENABLED && (
              <div className="flex flex-col gap-3 w-full">
                <PurchaseButton artworkId={artwork.id} isAvailable={isAvailable} />

                {isAvailable && (
                  <button
                    onClick={() => {
                      if (inCart) {
                        setIsOpen(true);
                      } else {
                        addItem({
                          id:       artwork.id,
                          title:    artwork.title,
                          price:    price,
                          imageUrl: artwork.images?.[0] ?? null,
                        });
                      }
                    }}
                    className="w-full font-sans font-normal text-[14px] tracking-[0.5px] px-12 py-4 border border-accent text-accent hover:bg-accent hover:text-bg-main transition-colors cursor-pointer"
                  >
                    {inCart ? 'View Cart' : 'Add to Cart'}
                  </button>
                )}
              </div>
            )}

            <div className="w-full h-px bg-divider" />
          </div>

          {/* About + Process */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                About
              </p>
              <p className="text-text-secondary font-sans text-[15px] leading-[1.8] whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="w-full h-px bg-divider" />

            <div className="flex flex-col gap-4">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                Process
              </p>
              <p className="text-text-secondary font-sans text-[15px] leading-[1.8]">
                {process}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-divider" />

          {/* Details grid */}
          <div className="flex flex-col gap-[14px]">
            {details.map(({ label, value, accent }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-text-tertiary font-sans text-[13px]">{label}</span>
                <span className={`font-sans text-[13px] ${accent ? 'text-accent' : 'text-text-primary'}`}>
                  {value}
                </span>
              </div>
            ))}
            {collection && (
              <div className="flex justify-between items-center">
                <span className="text-text-tertiary font-sans text-[13px]">Collection</span>
                <Link
                  href={`/collections/${collection.slug}`}
                  className="font-sans text-[13px] text-accent hover:opacity-80 transition-opacity"
                >
                  {collection.name}
                </Link>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-divider" />

          {/* Info Section */}
          <ArtworkInfoSection />

          </div>
        </div>

        {/* ── You might also like ────────────────────────────────────── */}
        {related.length > 0 && (
          <>
            <div className="w-full h-px bg-divider" />
            <div className="py-10 md:py-[56px] lg:px-[56px] w-full">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[3px] uppercase mb-8 px-5 md:px-[56px] lg:px-0">
                You might also like
              </p>

              {/* Mobile/tablet: horizontal scroll slider */}
              <div className="flex lg:hidden gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide scroll-pl-5 pl-5 pr-5">
                {related.map((a) => (
                  <div key={a.id} className="flex-shrink-0 w-[50vw] sm:w-[30vw] snap-start">
                    <ArtworkCard artwork={a} imageHeight="h-[230px]" sizes="(max-width: 640px) 50vw, 30vw" />
                  </div>
                ))}
              </div>

              {/* Desktop: grid */}
              <div className="hidden lg:grid grid-cols-4 gap-[20px] ">
                {related.map((a) => (
                  <ArtworkCard key={a.id} artwork={a} />
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <Footer />
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────── */}
      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} images={artwork.images ?? []} alt={artwork.title} onClose={() => setLightboxSrc(null)} />
      )}
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { artworkId } = params;

  const { data: artwork, error } = await supabase
    .from('artworks')
    .select('*, collections(id, slug, name, description, process, medium, year, price)')
    .eq('id', artworkId)
    .single();

  if (error || !artwork) {
    return { notFound: true };
  }

  const { collections: collection, ...artworkData } = artwork;

  // Resolve folder name to array of public URLs for the carousel
  artworkData.images = await resolveImages(artworkData.image_url);

  // Fetch related artworks: same collection first, then random others — all available (stock > 0)
  const RELATED_LIMIT = 4;
  const excludeIds = [artworkId];

  // 1. Same collection (if applicable)
  let sameCollection = [];
  if (collection?.id) {
    const { data } = await supabase
      .from('artworks')
      .select('id, title, price, image_url, stock, tagline, collections(price)')
      .eq('visible', true)
      .eq('collection_id', collection.id)
      .neq('id', artworkId)
      .gt('stock', 0)
      .limit(RELATED_LIMIT);
    sameCollection = data ?? [];
    excludeIds.push(...sameCollection.map(a => a.id));
  }

  // 2. Fill remaining slots with random other artworks
  const remaining = RELATED_LIMIT - sameCollection.length;
  let others = [];
  if (remaining > 0) {
    const { data } = await supabase
      .from('artworks')
      .select('id, title, price, image_url, stock, tagline, collections(price)')
      .eq('visible', true)
      .gt('stock', 0)
      .not('id', 'in', `(${excludeIds.join(',')})`)
      .limit(remaining * 3); // fetch more to shuffle
    // Shuffle and take what we need
    const shuffled = (data ?? []).sort(() => Math.random() - 0.5).slice(0, remaining);
    others = shuffled;
  }

  const relatedRaw = [...sameCollection, ...others];

  const related = await Promise.all(
    relatedRaw.map(async (a) => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
      price: a.price || a.collections?.price || null,
    }))
  );

  return { props: { artwork: artworkData, collection: collection ?? null, related } };
}
