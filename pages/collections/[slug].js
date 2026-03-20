import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { resolveFirstImage } from '../../lib/storage';
import Navigation from '../../components/Navigation';
import Footer from '../../components/Footer';
import ArtworkCard from '../../components/ArtworkCard';
import { formatPrice } from '../../lib/utils';

/**
 * Collection detail page.
 * Route: /collections/[slug]
 *
 * Layout (matches "Collection Page v2" prototypes):
 *   1. Navigation
 *   2. Back link
 *   3. Full-width hero image (cover_image_url or first artwork)
 *   4. Two-column header: title/tagline/meta (left) + description (right)
 *   5. 3-column artwork grid (1-col on mobile)
 *   6. Footer
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
  const heroImage = collection.hero_image || collection.cover_image_url || (artworks[0]?.image_url ?? null);
  const ogImage = heroImage || (artworks[0]?.image_url ?? null);

  return (
    <>
      <Head>
        <title>{collection.name} — Ester Batllori</title>
        <meta name="description" content={collection.description_collection || `${collection.name} — A collection of original abstract paintings by Ester Batllori.`} />
        <meta property="og:title" content={`${collection.name} — Ester Batllori`} />
        <meta property="og:description" content={collection.description_collection || `${collection.name} — A collection of original abstract paintings by Ester Batllori.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://esteriicreates.com/collections/${collection.slug}`} />
        {ogImage && <meta property="og:image" content={ogImage} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${collection.name} — Ester Batllori`} />
        <meta name="twitter:description" content={collection.description_collection || `${collection.name} — A collection of original abstract paintings by Ester Batllori.`} />
        {ogImage && <meta name="twitter:image" content={ogImage} />}
        <link rel="canonical" href={`https://esteriicreates.com/collections/${collection.slug}`} />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">

        {/* ── Navigation ─────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Back link ──────────────────────────────────────────────── */}
        <div className="px-5 md:px-[48px] py-5">
          <Link
            href="/#works"
            className="text-text-tertiary font-sans text-[13px] tracking-[0.5px] hover:text-text-secondary transition-colors"
          >
            ← Back to works
          </Link>
        </div>

        {/* ── Top divider ────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Hero image ─────────────────────────────────────────────── */}
        {heroImage && (
          <div className="relative w-full h-[280px] md:h-[480px] overflow-hidden">
            <Image
              src={heroImage}
              alt={collection.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        )}

        {/* ── Collection header ──────────────────────────────────────── */}
        <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end md:gap-20 px-5 md:px-[48px] py-10 md:py-16">

          {/* Left: label + title + tagline + meta */}
          <div className="flex flex-col gap-4 md:gap-5">
            <p className="font-sans font-normal text-text-tertiary text-[12px] tracking-[3px] uppercase">
              Collection
            </p>
            <h1
              className="font-sans font-normal text-text-primary"
              style={{ fontSize: 'clamp(36px, 4vw, 52px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}
            >
              {collection.name}
            </h1>
            {collection.tagline && (
              <p className="font-sans font-normal text-text-secondary text-[14px] md:text-[15px] leading-[1.7] italic">
                {collection.tagline}
              </p>
            )}
            <p className="font-sans font-normal text-text-tertiary text-[12px] md:text-[13px] tracking-[0.5px]">
              {artworks.length} work{artworks.length !== 1 ? 's' : ''}
              {minPrice ? ` · Prices from ${formatPrice(minPrice)}` : ''}
            </p>
          </div>

          {/* Right: description (desktop beside, mobile below) */}
          {collection.description_collection && (
            <p className="font-sans font-normal text-text-secondary text-[14px] md:text-[15px] leading-[1.7] md:max-w-[420px] md:flex-shrink-0">
              {collection.description_collection}
            </p>
          )}

        </div>

        {/* ── Divider ────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Artwork grid ───────────────────────────────────────────── */}
        <div className="px-5 md:px-[48px] py-10 md:py-[48px] md:pb-[80px]">
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
    .select('id, slug, name, description_collection, tagline, cover_image_url, hero_image, price')
    .eq('slug', slug)
    .single();

  if (colError || !collection) {
    return { notFound: true };
  }

  // Fetch artworks belonging to this collection
  const { data: artworksRaw } = await supabase
    .from('artworks')
    .select('id, title, medium, dimensions, price, image_url, stock, tagline')
    .eq('collection_id', collection.id)
    .eq('visible', true)
    .order('created_at', { ascending: true });

  const artworks = await Promise.all(
    (artworksRaw ?? []).map(async (a) => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
      price: a.price || collection.price || null,
    }))
  );

  // Resolve the collection cover and hero images
  const cover_image_url = collection.cover_image_url
    ? (await resolveFirstImage(collection.cover_image_url)) ?? collection.cover_image_url
    : null;

  const hero_image = collection.hero_image
    ? (await resolveFirstImage(collection.hero_image)) ?? collection.hero_image
    : null;

  return {
    props: {
      collection: { ...collection, cover_image_url, hero_image },
      artworks,
    },
  };
}
