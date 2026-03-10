import Head from 'next/head';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ArtworkCard from '../../components/ArtworkCard';
import { formatPrice } from '../../lib/utils';

/**
 * Collection detail page.
 * Route: /collections/[slug]
 * Shows the collection header (label, title, description, meta)
 * followed by a 3-column grid of artwork cards.
 * Matches "Collection Page - Desktop" and "Collection Page - Mobile" prototypes.
 */
export default function CollectionPage({ collection, artworks }) {
  if (!collection) {
    return (
      <div className="bg-bg-main min-h-screen flex items-center justify-center">
        <p className="text-text-tertiary font-sans">Collection not found.</p>
      </div>
    );
  }

  const minPrice = artworks.length > 0 ? Math.min(...artworks.map((a) => a.price)) : null;

  return (
    <>
      <Head>
        <title>{collection.name} — Ester Batllori</title>
        <meta name="description" content={collection.description} />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Back link ──────────────────────────────────────────────── */}
        <div className="px-5 md:px-[80px] py-5">
          <Link
            href="/#works"
            className="text-text-tertiary font-sans text-[13px] tracking-[0.5px] hover:text-text-secondary transition-colors"
          >
            ← Back to collections
          </Link>
        </div>

        {/* ── Top divider ────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Collection header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-5 px-5 md:px-[48px] pt-[56px] pb-0">
          <p className="font-sans font-normal text-text-tertiary text-[13px] tracking-[3px] uppercase">
            Collection
          </p>
          <h1
            className="font-sans font-normal text-text-primary"
            style={{ fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}
          >
            {collection.name}
          </h1>
          {collection.description && (
            <p
              className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7] max-w-[640px]"
            >
              {collection.description}
            </p>
          )}
          <p className="font-sans font-normal text-text-tertiary text-[13px] tracking-[0.5px]">
            {artworks.length} work{artworks.length !== 1 ? 's' : ''}
            {minPrice ? ` · Prices from ${formatPrice(minPrice)}` : ''}
          </p>
        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider mt-[48px]" />

        {/* ── Artwork grid ───────────────────────────────────────────── */}
        <div className="px-5 md:px-[48px] py-[48px] pb-[80px]">
          {artworks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-[38px]">
              {artworks.map((artwork) => (
                <ArtworkCard key={artwork.id} artwork={artwork} />
              ))}
            </div>
          ) : (
            <p className="font-sans text-text-tertiary text-sm">
              No artworks in this collection yet.
            </p>
          )}
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
  const { slug } = params;

  // Fetch the collection
  const { data: collection, error: colError } = await supabase
    .from('collections')
    .select('id, slug, name, description, cover_image_url')
    .eq('slug', slug)
    .single();

  if (colError || !collection) {
    return { notFound: true };
  }

  // Fetch artworks belonging to this collection
  const { data: artworks } = await supabase
    .from('artworks')
    .select('id, title, medium, dimensions, price, image_url, stock')
    .eq('collection_id', collection.id)
    .order('created_at', { ascending: true });

  return {
    props: {
      collection,
      artworks: artworks ?? [],
    },
  };
}
