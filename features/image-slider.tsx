"use client";

import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { type TouchEvent as ReactTouchEvent, useEffect, useRef, useState } from "react";
import ImageLightbox from "@/features/image-ligthtbox";

const SWIPE_THRESHOLD = 50;

type SwipeDirection = "h" | "v" | null;

type SwipeStartPoint = {
  x: number;
  y: number;
};

type ImageSliderProps = {
  images: string[];
  alt: string;
};

export default function ImageSlider({ images, alt }: ImageSliderProps) {
  const [current, setCurrent] = useState(0);
  const [isLg, setIsLg] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [lightboxSource, setLightboxSource] = useState<string | null>(null);

  const stripRef = useRef<HTMLDivElement | null>(null);
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const swipeStart = useRef<SwipeStartPoint | null>(null);
  const swipeDir = useRef<SwipeDirection>(null);
  const didDrag = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsLg(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsLg(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const thumb = thumbRefs.current[current];
    if (thumb && stripRef.current) {
      thumb.scrollIntoView({ behavior: "smooth", inline: "nearest", block: "nearest" });
    }
  }, [current]);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || images.length <= 1) {
      return;
    }

    function onTouchMove(e: TouchEvent) {
      if (!swipeStart.current) {
        return;
      }
      const dx = e.touches[0].clientX - swipeStart.current.x;
      const dy = e.touches[0].clientY - swipeStart.current.y;

      if (swipeDir.current === null && (Math.abs(dx) > 5 || Math.abs(dy) > 5)) {
        swipeDir.current = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }

      if (swipeDir.current === "h") {
        e.preventDefault();
        didDrag.current = true;
        setDragX(dx);
      }
    }

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [images]);

  if (images.length === 0) {
    return null;
  }

  const hasManyImages = images.length > 1;

  function goTo(i: number) {
    setCurrent(Math.max(0, Math.min(images.length - 1, i)));
    setDragX(0);
    setDragging(false);
  }

  function handleTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    if (!hasManyImages) {
      return;
    }
    swipeStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    swipeDir.current = null;
    didDrag.current = false;
    setDragging(true);
  }

  function handleTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (!swipeStart.current) {
      setDragging(false);
      return;
    }
    const dx = e.changedTouches[0].clientX - swipeStart.current.x;

    if (swipeDir.current === "h") {
      if (dx < -SWIPE_THRESHOLD && current < images.length - 1) {
        goTo(current + 1);
      } else if (dx > SWIPE_THRESHOLD && current > 0) {
        goTo(current - 1);
      } else {
        setDragX(0);
        setDragging(false);
      }
    } else {
      setDragX(0);
      setDragging(false);
    }

    swipeStart.current = null;
    swipeDir.current = null;
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        ref={trackRef}
        className="group relative aspect-3/4 max-h-150 w-full overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="absolute inset-0 flex"
          style={{
            transform: `translateX(calc(${-current * 100}% + ${dragX}px))`,
            transition: dragging ? "none" : "transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            willChange: "transform",
          }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-full min-w-full"
              onClick={() => {
                if (!didDrag.current) {
                  setLightboxSource(src);
                }
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="cursor-zoom-in object-cover"
                sizes="(max-width: 768px) 100vw, calc(100vw - 96px)"
                quality={i === 0 && isLg ? 85 : 60}
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setLightboxSource(images[current])}
          aria-label="View full screen"
          className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center bg-bg-main/80 opacity-100 transition-colors hover:bg-bg-main"
        >
          <ZoomIn size={15} className="text-text-primary" />
        </button>

        {hasManyImages && (
          <>
            <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Go to image ${i + 1}`}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === current ? "bg-text-primary" : "bg-text-primary/30"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {hasManyImages && (
        <div ref={stripRef} className="flex gap-2 overflow-x-auto py-1">
          {images.map((src, i) => (
            <button
              key={i}
              ref={el => {
                thumbRefs.current[i] = el;
              }}
              onClick={() => goTo(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative h-20 w-20 shrink-0 transition-opacity md:h-25 md:w-25 ${
                i === current
                  ? "opacity-100 ring-2 ring-accent ring-offset-1 ring-offset-bg-main"
                  : "opacity-50 hover:opacity-75"
              }`}
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image src={src} alt={`${alt} — view ${i + 1}`} fill className="object-cover" sizes="100px" />
              </div>
            </button>
          ))}
        </div>
      )}

      {lightboxSource && (
        <ImageLightbox src={lightboxSource} images={images} alt={alt} onClose={() => setLightboxSource(null)} />
      )}
    </div>
  );
}
