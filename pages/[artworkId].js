import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import PurchaseButton from '../components/PurchaseButton';
import ImageSlider from '../components/ImageSlider';
import { formatPrice } from '../lib/utils';

/**
 * Artwork detail page.
 * Route: /[artworkId] where artworkId is the Supabase UUID.
 * Two-column desktop layout: image left, info right — matching the prototype.
 */
export default function ArtworkDetail({ artwork }) {
  if (!artwork) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center">
        <p className="text-text-tertiary font-sans">Artwork not found.</p>
      </div>
    );
  }

  const isAvailable = artwork.stock > 0;

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
        <div className="pl-6 pr-5 md:px-[80px] py-5">
          <Link
            href="/#works"
            className="text-text-tertiary font-sans text-[13px] tracking-[0.5px] hover:text-text-secondary transition-colors"
          >
            ← Back to works
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
              images={artwork.images?.length > 0 ? artwork.images : [artwork.image_url]}
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

            <div className="flex flex-wrap items-center gap-4">
              <span className="text-text-secondary font-sans text-[13px] tracking-[0.5px]">
                {artwork.medium}
              </span>
              {artwork.dimensions && (
                <>
                  <span className="text-text-tertiary font-sans text-[13px]">·</span>
                  <span className="text-text-secondary font-sans text-[13px] tracking-[0.5px]">
                    {artwork.dimensions}
                  </span>
                </>
              )}
              {artwork.year && (
                <>
                  <span className="text-text-tertiary font-sans text-[13px]">·</span>
                  <span className="text-text-secondary font-sans text-[13px] tracking-[0.5px]">
                    {artwork.year}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Price + purchase button */}
          <div className="flex flex-col gap-6 w-full max-w-[360px]">
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

            <PurchaseButton artworkId={artwork.id} isAvailable={isAvailable} />

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
          </div>

          </div>
        </div>

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
    .select('*')
    .eq('id', artworkId)
    .single();

  if (error || !artwork) {
    return { notFound: true };
  }

  return { props: { artwork } };
}
