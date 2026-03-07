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
 * Displays full artwork info — title, image, description, process, and purchase CTA.
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
        <div className="px-12 py-4 md:px-[48px]">
          <Link
            href="/#works"
            className="text-text-tertiary font-sans text-[13px] tracking-[0.5px] hover:text-text-secondary transition-colors"
          >
            ← Back to works
          </Link>
        </div>

        {/* ── Hero Image / Slider ─────────────────────────────────────── */}
        <div className="px-5 md:px-[48px]">
          <ImageSlider
            images={artwork.images?.length > 0 ? artwork.images : [artwork.image_url]}
            alt={artwork.title}
          />
        </div>

        {/* ── Artwork Info ────────────────────────────────────────────── */}
        {/* Mobile: stacked layout | Desktop: two-column side-by-side */}
        <div className="flex flex-col md:flex-row gap-10 md:gap-20 px-5 md:px-[48px] py-10 md:py-[64px]">

          {/* Left column — title, meta, description, process */}
          <div className="flex-1 flex flex-col gap-8 md:gap-[32px]">
            {/* Title */}
            <h1
              className="font-sans font-normal text-text-primary leading-tight95"
              style={{ fontSize: 'clamp(36px, 5vw, 52px)', letterSpacing: '-1.5px' }}
            >
              {artwork.title}
            </h1>

            {/* Medium · Dimensions · Year */}
            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              <span className="text-text-secondary font-sans text-sm">{artwork.medium}</span>
              {artwork.dimensions && (
                <>
                  <span className="text-text-tertiary font-sans text-sm">·</span>
                  <span className="text-text-secondary font-sans text-sm">{artwork.dimensions}</span>
                </>
              )}
              {artwork.year && (
                <>
                  <span className="text-text-tertiary font-sans text-sm">·</span>
                  <span className="text-text-secondary font-sans text-sm">{artwork.year}</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary font-sans text-[15px] leading-[1.7]">
              {artwork.description}
            </p>

            {/* Divider */}
            <div className="w-[60px] h-px bg-divider" />

            {/* Process */}
            <p
              className="text-text-tertiary font-sans text-[13px] tracking-[3px] uppercase"
            >
              Process
            </p>
            <p className="text-text-secondary font-sans text-[15px] leading-[1.7]">
              {artwork.process}
            </p>
          </div>

          {/* Right column — price, purchase button, details grid */}
          <div
            className="flex flex-col gap-8 md:gap-[32px] md:w-[360px] w-full"
          >
            {/* Price label + value */}
            <div>
              <p
                className="text-text-tertiary font-sans text-[13px] tracking-[3px] uppercase mb-3"
              >
                Price
              </p>
              <p
                className="text-text-primary font-sans font-normal"
                style={{ fontSize: '36px', letterSpacing: '-1px' }}
              >
                {formatPrice(artwork.price)}
              </p>
            </div>

            {/* Purchase / Inquire button */}
            <PurchaseButton artworkId={artwork.id} isAvailable={isAvailable} />

            {/* Divider */}
            <div className="w-full h-px bg-divider" />

            {/* Details grid */}
            <div className="flex flex-col gap-5">
              {[
                { label: 'Medium',       value: artwork.medium },
                { label: 'Dimensions',   value: artwork.dimensions },
                { label: 'Year',         value: artwork.year },
                {
                  label: 'Availability',
                  value: isAvailable ? 'Available' : 'Sold',
                  accent: isAvailable,
                },
              ].map(({ label, value, accent }) =>
                value ? (
                  <div key={label} className="flex justify-between items-center">
                    <span className="text-text-tertiary font-sans text-[13px]">{label}</span>
                    <span
                      className={`font-sans text-[13px] ${
                        accent ? 'text-accent' : 'text-text-primary'
                      }`}
                    >
                      {value}
                    </span>
                  </div>
                ) : null
              )}
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

/**
 * Fetch the specific artwork by its UUID on every request so stock
 * status is always current.
 */
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
