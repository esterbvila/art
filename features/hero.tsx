import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col gap-8 px-5 pt-10 pb-0 md:gap-14 md:px-12 md:pt-15">
      <div className="flex w-full flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h1
          className="w-full font-normal font-heading text-text-primary leading-tight95 md:max-w-[66%]"
          style={{
            fontSize: "clamp(37px, 5.5vw, 80px)",
            letterSpacing: "clamp(-px, -0.15vw, -2px)",
            lineHeight: 1,
          }}
        >
          Painting the Language of the Subconscious.
        </h1>

        <p
          className="font-normal font-sans text-text-secondary leading-[1.6] md:max-w-70 md:text-right lg:max-w-75 2xl:max-w-97.5"
          style={{ fontSize: "clamp(15px, 1.2vw, 16px)" }}
        >
          It flows naturally — like a code being painted. Shapes become symbols, meanings begin to surface, and hidden
          forms reveal fragments of an inner world.
        </p>
      </div>

      <div className="relative h-62.5 w-full overflow-hidden md:h-87.5 lg:h-125 xl:h-137.5 2xl:h-175">
        <Image
          src="/hero-img.webp"
          alt="Abstract painting by Ester Batllori"
          fill
          className="object-cover"
          sizes="(min-width: 1536px) 2235px, (min-width: 1024px) 1920px, (min-width: 641px) 100vw, 640px"
          quality={85}
          priority
          fetchPriority="high"
        />
      </div>
    </section>
  );
}
