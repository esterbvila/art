import AboutArtist from "../components/AboutArtist";
import ContactForm from "../components/ContactForm";
import FeaturedPainting from "../components/FeaturedPainting";
import Footer from "../components/Footer";
import Gallery from "../components/Gallery";
import Hero from "../components/Hero";
import Navigation from "../components/Navigation";
import UniquePieces from "../components/UniquePieces";
import { resolveFirstImage } from "../lib/storage";
import { supabase } from "../lib/supabase";

// ── Metadata (replaces <Head>) ────────────────────────────────────────────────
export const metadata = {
  title: "Ester Batllori — Abstract Paintings",
  description:
    "Original abstract paintings exploring emotion, intuition and subconscious landscapes. Each piece is a one-of-a-kind original.",
  alternates: {
    canonical: "https://esteriicreates.com",
  },
  openGraph: {
    title: "Ester Batllori — Abstract Paintings",
    description: "Original abstract paintings exploring emotion, intuition and subconscious landscapes.",
    type: "website",
    url: "https://esteriicreates.com",
    images: [
      {
        url: "https://esteriicreates.com/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@esterii_creates",
    creator: "@esterii_creates",
    title: "Ester Batllori — Abstract Paintings",
    description: "Original abstract paintings exploring emotion, intuition and subconscious landscapes.",
    images: ["https://esteriicreates.com/og-image.png"],
  },
  icons: {
    icon: "/favicon.png",
  },
};

// ── Structured data helpers ───────────────────────────────────────────────────
function PersonJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ester Batllori",
    url: "https://esteriicreates.com",
    sameAs: ["https://instagram.com/esterii_creates"],
    jobTitle: "Abstract Painter",
    description: "Original abstract paintings exploring emotion, intuition and subconscious landscapes.",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "esterii creates",
    url: "https://esteriicreates.com",
    logo: "https://esteriicreates.com/favicon.png",
    sameAs: ["https://instagram.com/esterii_creates"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Berlin",
      addressCountry: "DE",
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

// ── Data fetching (replaces getServerSideProps) ───────────────────────────────
async function getCollections() {
  const { data: collectionsRaw, error } = await supabase
    .from("collections")
    .select("id, slug, name, tagline, cover_image_url, sort_order, artworks(id, price)")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching collections:", error.message);
  }

  return (collectionsRaw ?? []).map(({ artworks, ...col }) => ({
    ...col,
    artwork_count: artworks?.length ?? 0,
    min_price: artworks?.length > 0 ? Math.min(...artworks.map(a => a.price)) : null,
  }));
}

async function getUniqueArtworks() {
  const { data: uniqueArtworksRaw } = await supabase
    .from("artworks")
    .select("id, title, medium, dimensions, price, image_url, stock, tagline")
    .is("collection_id", null)
    .eq("visible", true)
    .order("created_at", { ascending: false });

  return Promise.all(
    (uniqueArtworksRaw ?? []).map(async a => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
    })),
  );
}

async function getFeaturedArtwork() {
  const { data: featuredRaw } = await supabase
    .from("artworks")
    .select("id, title, description, price, image_url, stock")
    .eq("featured", true)
    .single();

  if (!featuredRaw) {
    return null;
  }

  return {
    ...featuredRaw,
    image_url: (await resolveFirstImage(featuredRaw.image_url)) ?? featuredRaw.image_url,
  };
}

// ── Page component ────────────────────────────────────────────────────────────
// Runs on the server on every request — equivalent to SSR via getServerSideProps.
// To opt into ISR instead, export: export const revalidate = 60;
export const dynamic = "force-dynamic";

export default async function Home() {
  const [collections, uniqueArtworks, featuredArtwork] = await Promise.all([
    getCollections(),
    getUniqueArtworks(),
    getFeaturedArtwork(),
  ]);

  return (
    <>
      <PersonJsonLd />
      <OrganizationJsonLd />

      <div className="flex min-h-screen flex-col bg-bg-main">
        {/* ── Navigation ───────────────────────────────────────────────── */}
        <Navigation />

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <Hero />

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Unique Pieces ─────────────────────────────────────────────── */}
        <section id="works">
          <UniquePieces artworks={uniqueArtworks} />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Gallery ──────────────────────────────────────────────────── */}
        <Gallery collections={collections} />

        {/* ── About the Artist ─────────────────────────────────────────── */}
        <section id="about">
          <AboutArtist />
        </section>

        {/* ── Featured Painting ────────────────────────────────────────── */}
        {featuredArtwork && <FeaturedPainting artwork={featuredArtwork} />}

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Contact ──────────────────────────────────────────────────── */}
        <section id="contact">
          <ContactForm />
        </section>

        {/* ── Divider ──────────────────────────────────────────────────── */}
        <div className="h-px w-full bg-divider" />

        {/* ── Footer ───────────────────────────────────────────────────── */}
        <Footer />
      </div>
    </>
  );
}
