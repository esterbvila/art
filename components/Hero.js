import Image from 'next/image';

/**
 * Hero section — matches the prototype's large headline + sub-headline layout
 * with the full-width painting image below.
 *
 * Desktop: 80px headline (left), 15px sub-headline (right-aligned).
 * Mobile:  44px headline + 14px sub-headline stacked, 400px image.
 */
export default function Hero() {
  return (
    <section className="flex flex-col gap-8 md:gap-[56px] px-5 md:px-[48px] pt-10 md:pt-[60px] pb-0">
      {/* ── Text row ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 md:gap-0 w-full">
        {/* Main headline */}
        <h1
          className="font-sans font-normal text-text-primary leading-tight95 w-full md:max-w-[66%]"
          style={{
            fontSize:      'clamp(44px, 5.5vw, 80px)',
            letterSpacing: 'clamp(-1px, -0.15vw, -2px)',
            lineHeight:    0.95,
          }}
        >
          Abstract paintings exploring subconscious landscapes.
        </h1>

        {/* Sub-headline — right-aligned on desktop */}
        <p
          className="font-sans font-normal text-text-secondary leading-[1.7] md:text-right md:max-w-[296px]"
          style={{ fontSize: 'clamp(14px, 1.2vw, 15px)' }}
        >
          Each piece emerges through an intuitive process where color,
          movement and texture reveal forms that cannot be planned.
        </p>
      </div>

      {/* ── Hero image ───────────────────────────────────────────────── */}
      <div className="relative w-full h-[400px] md:h-[625px] overflow-hidden">
        <Image
          src="/artworks/egipte-editada-retallada.png"
          alt="Abstract painting by Ester Batllori"
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
      </div>
    </section>
  );
}
