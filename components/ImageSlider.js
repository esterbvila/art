import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';

/**
 * ImageSlider — main image + thumbnail strip.
 * If only one image is provided, renders it without any controls.
 *
 * @param {string[]} images  - Array of image URLs/paths
 * @param {string}   alt     - Alt text for the main image
 */
const SWIPE_THRESHOLD = 50; // px needed to count as a swipe

export default function ImageSlider({ images, alt, onImageClick }) {
  const [current, setCurrent] = useState(0);
  const [isLg, setIsLg] = useState(false);
  const stripRef = useRef(null);
  const thumbRefs = useRef([]);
  const imageContainerRef = useRef(null);
  const swipeStart = useRef(null); // { x, y }
  const swipeDir  = useRef(null);  // null | 'h' | 'v'

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsLg(mq.matches);
    const handler = (e) => setIsLg(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const thumb = thumbRefs.current[current];
    if (thumb && stripRef.current) {
      thumb.scrollIntoView({ behavior: 'smooth', inline: 'nearest', block: 'nearest' });
    }
  }, [current]);

  // Non-passive touchmove listener so we can preventDefault on horizontal swipes
  // without blocking vertical page scroll when the user is scrolling up/down.
  useEffect(() => {
    const el = imageContainerRef.current;
    if (!el || !images || images.length <= 1) return;

    function onTouchMove(e) {
      if (!swipeStart.current) return;
      const dx = e.touches[0].clientX - swipeStart.current.x;
      const dy = e.touches[0].clientY - swipeStart.current.y;
      if (swipeDir.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        swipeDir.current = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }
      if (swipeDir.current === 'h') e.preventDefault();
    }

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, [images]);

  if (!images || images.length === 0) return null;

  const hasManyImages = images.length > 1;

  function prev() {
    setCurrent((i) => (i - 1 + images.length) % images.length);
  }

  function next() {
    setCurrent((i) => (i + 1) % images.length);
  }

  function handleTouchStart(e) {
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipeDir.current = null;
  }

  function handleTouchEnd(e) {
    if (!swipeStart.current || swipeDir.current !== 'h') {
      swipeStart.current = null;
      swipeDir.current = null;
      return;
    }
    const dx = e.changedTouches[0].clientX - swipeStart.current.x;
    if (dx < -SWIPE_THRESHOLD) next();
    else if (dx > SWIPE_THRESHOLD) prev();
    swipeStart.current = null;
    swipeDir.current = null;
  }

  return (
    <div className="flex flex-col gap-3">
      {/* ── Main image ─────────────────────────────────────────────── */}
      <div
        ref={imageContainerRef}
        className="relative w-full aspect-[3/4] overflow-hidden group"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          key={images[current]}
          src={images[current]}
          alt={alt}
          fill
          className="object-cover transition-opacity duration-300 cursor-zoom-in"
          sizes="(max-width: 768px) 100vw, calc(100vw - 96px)"
          quality={current === 0 && isLg ? 85 : 60}
          priority={current === 0}
          onClick={() => onImageClick?.(images[current])}
        />

        {/* Magnifier button — always visible on mobile, hover-only on lg+ */}
        {onImageClick && (
          <button
            onClick={() => onImageClick(images[current])}
            aria-label="View full screen"
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center bg-bg-main/80 hover:bg-bg-main transition-colors opacity-100 z-10"
          >
            <ZoomIn size={15} className="text-text-primary" />
          </button>
        )}

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
