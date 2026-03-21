import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

/**
 * ImageSlider — main image + thumbnail strip.
 * If only one image is provided, renders it without any controls.
 *
 * @param {string[]} images  - Array of image URLs/paths
 * @param {string}   alt     - Alt text for the main image
 */
export default function ImageSlider({ images, alt }) {
  const [current, setCurrent] = useState(0);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);

  useEffect(() => {
    const thumb = thumbRefs.current[current];
    if (thumb && stripRef.current) {
      thumb.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }, [current]);

  if (!images || images.length === 0) return null;

  const hasManyImages = images.length > 1;

  function prev() {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setCurrent((i) => (i + 1) % images.length);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ─────────────────────────────────────────────── */}
      <div className="relative w-full h-[380px] sm:h-[550px] md:h-[700px] lg:h-[750px] overflow-hidden group">
        <Image
          key={images[current]}
          src={images[current]}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 768px) 100vw, calc(100vw - 96px)"
          priority={current === 0}
        />

        {/* Prev / Next arrows — only shown when multiple images */}
        {hasManyImages && (
          <>
            <button
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 3L5 8L10 13" stroke="#1A1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="#1A1917" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {/* Dot counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === current ? 'bg-text-primary' : 'bg-text-primary/30'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip — only shown when multiple images ──────── */}
      {hasManyImages && (
        <div ref={stripRef} className="flex gap-2 overflow-x-auto py-1">
          {images.map((src, i) => (
            <button
              key={i}
              ref={el => thumbRefs.current[i] = el}
              onClick={() => setCurrent(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative flex-shrink-0 w-[80px] h-[80px] md:w-[100px] md:h-[100px] transition-opacity ${
                i === current ? 'opacity-100 ring-2 ring-accent ring-offset-1 ring-offset-bg-main' : 'opacity-50 hover:opacity-75'
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={src}
                  alt={`${alt} — view ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
