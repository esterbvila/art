import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PurchaseButton from '../components/PurchaseButton';
import ImageSlider from '../components/ImageSlider';
import { formatPrice } from '../lib/utils';
import { resolveImages } from '../lib/storage';
import useCart from '../context/useCart';
import ArtworkInfoSection from '../components/ArtworkInfoSection';

/**
 * Artwork detail page.
 * Route: /[artworkId] where artworkId is the Supabase UUID.
 * Two-column desktop layout: image left, info right — matching the prototype.
 */
export default function ArtworkDetail({ artwork, collection }) {
  const { addItem, isInCart, setIsOpen } = useCart();

  if (!artwork) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center">
        <p className="text-text-tertiary font-sans">Artwork not found.</p>
      </div>
    );
  }

  const isAvailable = artwork.stock > 0;
  const inCart = isInCart(artwork.id);
  const details = [
    { label: 'Medium',       value: artwork.medium },
    { label: 'Dimensions',   value: artwork.dimensions },
    { label: 'Year',         value: artwork.year },
    { label: 'Availability', value: isAvailable ? 'Available' : 'Sold', accent: isAvailable },
  ].filter((d) => d.value);

  return (
    <>
      <Head>
        <title>{artwork.title} — Ester Batllori</title>
        <meta name="description" content={artwork.description} />
        <meta property="og:title" content={`${artwork.title} — Ester Batllori`} />
        <meta property="og:description" content={artwork.description} />
        {artwork.image_url && <meta property="og:image" content={artwork.image_url} />}
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Back link ──────────────────────────────────────────────── */}
        <div className="px-5 md:px-[48px] py-5">
          <Link
            href={collection ? `/collections/${collection.slug}` : '/'}
            className="text-text-tertiary font-sans text-[13px] tracking-[0.5px] hover:text-text-secondary transition-colors"
          >
            ← {collection ? 'Back to collection' : 'Back to home'}
          </Link>
        </div>

        {/* ── Top divider ────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Two-column content ─────────────────────────────────────── */}
        {/* Mobile: stacked | Desktop: image left · info right          */}
        <div className="flex flex-col md:flex-row flex-1">

          {/* Left — image */}
          <div className="md:w-1/2 min-h-[300px] md:min-h-[620px]">
            <ImageSlider
              images={artwork.images ?? []}
              alt={artwork.title}
              fullHeight
            />
          </div>

          {/* Right — artwork info */}
          <div className="md:w-1/2 flex flex-col gap-8 p-5 md:p-[56px]">

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
          <div className="flex flex-col gap-6 w-full md:max-w-[360px]">
            <div className="flex flex-col gap-2">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                Price
              </p>
              <p
                className="font-sans font-normal text-text-primary"
                style={{ fontSize: '32px', letterSpacing: '-0.5px' }}
              >
                {formatPrice(artwork.price)}
              </p>

            </div>

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
                        price:    artwork.price,
                        imageUrl: artwork.images?.[0] ?? null,
                      });
                    }
                  }}
                  className="w-full font-sans font-normal text-[14px] tracking-[0.5px] px-12 py-4 border border-text-primary text-text-primary hover:bg-text-primary hover:text-bg-main transition-colors cursor-pointer"
                >
                  {inCart ? 'View Cart' : 'Add to Cart'}
                </button>
              )}
            </div>

            <div className="w-full h-px bg-divider" />
          </div>

          {/* About + Process */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                About
              </p>
              <p className="text-text-secondary font-sans text-[15px] leading-[1.8]">
                {artwork.description}
              </p>
            </div>

            <div className="w-full h-px bg-divider" />

            <div className="flex flex-col gap-4">
              <p className="font-sans text-text-tertiary text-[11px] tracking-[2px] uppercase">
                Process
              </p>
              <p className="text-text-secondary font-sans text-[15px] leading-[1.8]">
                {artwork.process}
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

          </div>
        </div>

        {/* ── Info Section ───────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />
        <ArtworkInfoSection />

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps({ params }) {
  const { artworkId } = params;

  const { data: artwork, error } = await supabase
    .from('artworks')
    .select('*, collections(id, slug, name)')
    .eq('id', artworkId)
    .single();

  if (error || !artwork) {
    return { notFound: true };
  }

  const { collections: collection, ...artworkData } = artwork;

  // Resolve folder name to array of public URLs for the carousel
  artworkData.images = await resolveImages(artworkData.image_url);

  return { props: { artwork: artworkData, collection: collection ?? null } };
}
