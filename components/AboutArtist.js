import Image from 'next/image';

/**
 * About the Artist section.
 * Desktop: side-by-side (portrait image | text block).
 * Mobile: image on top, text below.
 * Matches the "About the Artist" frame from the prototype.
 */
export default function AboutArtist() {
  return (
    <section className="flex flex-col md:flex-row bg-bg-warm w-full md:h-[670px] lg:h-[600px]">
      {/* ── Portrait image ────────────────────────────────────────────── */}
      <div className="relative w-full md:w-[30%] xl:w-[38%] 2xl:w-[50%] flex-shrink-0 h-[360px] md:h-full overflow-hidden">
        <Image
          src="/artist-photo.webp"
          alt="Portrait of Ester Batllori in her studio"
          fill
          className="object-cover object-center"
          sizes="(min-width: 1280px) 1080px, 640px"
          quality={60}
        />
      </div>

      {/* ── About text ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center gap-5 lg:gap-6 px-5 pt-8 pb-10 lg:p-[72px] md:p-10">
        {/* Label */}
        <p className="font-sans font-normal text-text-tertiary text-[13px] tracking-[3px] uppercase">
          The Artist
        </p>

        {/* Name */}
        <h2
          className="font-sans font-normal text-text-primary leading-tight95"
          style={{ fontSize: 'clamp(36px, 3.6vw, 52px)', letterSpacing: '-1.5px' }}
        >
          Ester{'\n'}Batllori
        </h2>

        <p className="font-sans italic text-text-tertiary text-[14px]">Based in Berlin</p>

        {/* Bio paragraphs */}
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          My path back to painting was not a straight one. I moved through communication, frontend development, and UX/UI design — years of building, adapting, and working in fields that taught me a great deal, but never felt entirely like home.
        </p>
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          Painting was always there beneath it all. When I returned to it, I recognized something essential: this was the language that came most naturally to me. My work emerges intuitively, through rhythm, repetition, and gesture. Shapes appear like symbols, as if carrying meanings that cannot be fully named. Within them, hidden forms surface — fragments of nature, animals, faces, traces of an inner world.
        </p>
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          What once felt like chaos has become a visual language drawn from the subconscious. Painting is now my way of giving form to that unseen world — with simplicity, freedom, and joy. For a long time, however, perfectionism, self-criticism, and expectation stood in the way, making the act of painting feel more like pressure than instinct. Letting go of that has allowed me to return to the work with greater openness, trust, and pleasure.
        </p>
      </div>
    </section>
  );
}
