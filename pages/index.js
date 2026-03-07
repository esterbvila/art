import Head from 'next/head';
import { supabase } from '../lib/supabase';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Gallery from '../components/Gallery';
import AboutArtist from '../components/AboutArtist';
import FeaturedPainting from '../components/FeaturedPainting';
import ContactForm from '../components/ContactForm';
import Footer from '../components/Footer';

/**
 * Landing page — fetches all artworks server-side so the gallery
 * is always up to date with Supabase on every request.
 */
export default function Home({ artworks, featuredArtwork }) {
  return (
    <>
      <Head>
        <title>Ester Batllori — Abstract Paintings</title>
        <meta
          name="description"
          content="Original abstract paintings exploring emotion, intuition and subconscious landscapes. Each piece is a one-of-a-kind original."
        />
        <meta property="og:title" content="Ester Batllori — Abstract Paintings" />
        <meta
          property="og:description"
          content="Original abstract paintings exploring emotion, intuition and subconscious landscapes."
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">
        {/* ── Navigation ───────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="w-full h-px bg-divider" />

        {/* ── Gallery ──────────────────────────────────────────────────── */}
        <section id="works">
          <Gallery artworks={artworks} />
        </section>

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
  const { data: artworks, error } = await supabase
    .from('artworks')
    .select('id, title, medium, dimensions, price, image_url, stock, featured')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching artworks:', error.message);
    return { props: { artworks: [], featuredArtwork: null } };
  }

  const featuredArtwork = artworks?.find((a) => a.featured) ?? null;

  return {
    props: {
      artworks: artworks ?? [],
      featuredArtwork,
    },
  };
}
