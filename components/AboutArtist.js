import Image from 'next/image';

/**
 * About the Artist section.
 * Desktop: side-by-side (portrait image | text block).
 * Mobile: image on top, text below.
 * Matches the "About the Artist" frame from the prototype.
 */
export default function AboutArtist() {
  return (
    <section className="flex flex-col md:flex-row bg-bg-warm w-full md:h-[600px]">
      {/* ── Portrait image ────────────────────────────────────────────── */}
      <div className="relative w-full md:w-[560px] flex-shrink-0 h-[360px] md:h-full overflow-hidden">
        <Image
          src="/artworks/egipte-editada.png"
          alt="Portrait of Ester Batllori in her studio"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 560px"
        />
      </div>

      {/* ── About text ────────────────────────────────────────────────── */}
      <div className="flex flex-col justify-center gap-6 px-5 pt-0 pb-10 md:p-[72px]">
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

        {/* Bio paragraphs */}
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          I paint intuitively, allowing color and movement to guide the process.
          My work explores emotions, memories and inner landscapes that are
          difficult to describe with words.
        </p>
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          Each painting develops without a fixed plan. Through layers of color
          and spontaneous gestures, abstract forms emerge that reflect a
          dialogue between intuition and composition.
        </p>
        <p className="font-sans font-normal text-text-secondary text-[15px] leading-[1.7]">
          Inspired by nature, everyday moments and subconscious imagery, I work
          primarily with acrylics and mixed media on canvas.
        </p>
      </div>
    </section>
  );
}
