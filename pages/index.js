import Head from 'next/head';
import { supabase } from '../lib/supabase';
import { resolveFirstImage } from '../lib/storage';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import AboutArtist from '../components/AboutArtist';
import FeaturedPainting from '../components/FeaturedPainting';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';
import UniquePieces from '../components/UniquePieces';
import Gallery from '../components/Gallery';

/**
 * Landing page — fetches all artworks server-side so the gallery
 * is always up to date with Supabase on every request.
 */
export default function Home({ collections, uniqueArtworks, featuredArtwork }) {
  return (
    <>
      <Head>
        <title>Ester Batllori — Abstract Paintings</title>
        <meta
          name="description"
          content="Original abstract paintings exploring emotion, intuition and subconscious landscapes. Each piece is a one-of-a-kind original."
        />
        <meta property="og:title" content="Ester Batllori — Abstract Paintings" />
        <meta property="og:description" content="Original abstract paintings exploring emotion, intuition and subconscious landscapes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://esteriicreates.com" />
        <meta property="og:image" content="https://esteriicreates.com/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Ester Batllori — Abstract Paintings" />
        <meta name="twitter:description" content="Original abstract paintings exploring emotion, intuition and subconscious landscapes." />
        <meta name="twitter:image" content="https://esteriicreates.com/og-image.png" />
        <link rel="canonical" href="https://esteriicreates.com" />
        <link
          rel="preload"
          as="image"
          href="/_next/image?url=%2Fhero-img.webp&w=1080&q=50"
          imageSrcSet="/_next/image?url=%2Fhero-img.webp&w=640&q=50 640w, /_next/image?url=%2Fhero-img.webp&w=750&q=50 750w, /_next/image?url=%2Fhero-img.webp&w=828&q=50 828w, /_next/image?url=%2Fhero-img.webp&w=1080&q=50 1080w, /_next/image?url=%2Fhero-img.webp&w=1280&q=50 1280w, /_next/image?url=%2Fhero-img.webp&w=1440&q=50 1440w"
          imageSizes="100vw"
        />
        <link rel="icon" href="/favicon.png" type="image/png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: 'Ester Batllori',
            url: 'https://esteriicreates.com',
            sameAs: ['https://instagram.com/esterii_creates'],
            jobTitle: 'Abstract Painter',
            description: 'Original abstract paintings exploring emotion, intuition and subconscious landscapes.',
          }) }}
        />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">
        {/* ── Navigation ───────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Unique Pieces ─────────────────────────────────────────────── */}
        <section id="works">
          <UniquePieces artworks={uniqueArtworks} />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Gallery ──────────────────────────────────────────────────── */}
        <Gallery collections={collections} />

        {/* ── About the Artist ─────────────────────────────────────────── */}
        <section id="about">
          <AboutArtist />
        </section>

        {/* ── Featured Painting ────────────────────────────────────────── */}
        {featuredArtwork && <FeaturedPainting artwork={featuredArtwork} />}

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section id="contact">
          <ContactForm />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}

/**
 * Fetch all artworks from Supabase on every request.
 * ISR (revalidate) would also work but SSR ensures stock is always fresh.
 */
export async function getServerSideProps() {
  // Fetch collections with their artworks to compute count + min price
  const { data: collectionsRaw, error: colError } = await supabase
    .from('collections')
    .select('id, slug, name, tagline, cover_image_url, sort_order, artworks(id, price)')
    .eq('visible', true)
    .order('sort_order', { ascending: true });

  if (colError) {
    console.error('Error fetching collections:', colError.message);
  }

  // Compute artwork_count and min_price for each collection
  const collections = (collectionsRaw ?? []).map(({ artworks, ...col }) => ({
    ...col,
    artwork_count: artworks?.length ?? 0,
    min_price:     artworks?.length > 0 ? Math.min(...artworks.map((a) => a.price)) : null,
  }));

  // Fetch artworks not assigned to any collection
  const { data: uniqueArtworksRaw } = await supabase
    .from('artworks')
    .select('id, title, medium, dimensions, price, image_url, stock, tagline')
    .is('collection_id', null)
    .eq('visible', true)
    .order('created_at', { ascending: false });

  const uniqueArtworks = await Promise.all(
    (uniqueArtworksRaw ?? []).map(async (a) => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
    }))
  );

  // Fetch featured artwork separately for the FeaturedPainting section
  const { data: featuredRaw } = await supabase
    .from('artworks')
    .select('id, title, description, price, image_url, stock')
    .eq('featured', true)
    .single();

  const featuredArtwork = featuredRaw
    ? { ...featuredRaw, image_url: (await resolveFirstImage(featuredRaw.image_url)) ?? featuredRaw.image_url }
    : null;

  return {
    props: {
      collections,
      uniqueArtworks,
      featuredArtwork,
    },
  };
}
