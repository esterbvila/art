import { Suspense } from "react";
import AboutArtist from "@/features/about-artist";
import FeaturedArtwork from "@/features/artwork/featured-artwork";
import UniqueArtworks from "@/features/artwork/unique-artworks";
import ContactForm from "@/features/contact/contact-form";
import Footer from "@/features/footer";
import Gallery from "@/features/gallery";
import Hero from "@/features/hero";

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

export default async function Home() {
  return (
    <>
      <PersonJsonLd />
      <OrganizationJsonLd />

      <Hero />

      <div className="h-px w-full bg-divider" />

      <section id="works">
        <Suspense>
          <UniqueArtworks />
        </Suspense>
      </section>

      <div className="h-px w-full bg-divider" />

      <Gallery />

      <section id="about">
        <AboutArtist />
      </section>

      <Suspense>
        <FeaturedArtwork />
      </Suspense>

      <div className="h-px w-full bg-divider" />

      <section id="contact">
        <ContactForm />
      </section>

      <div className="h-px w-full bg-divider" />

      <Footer />
    </>
  );
}
