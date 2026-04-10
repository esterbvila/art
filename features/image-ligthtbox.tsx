import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function ImageLightbox({
  src,
  images = [],
  alt,
  onClose,
}: {
  src: string;
  images: string[];
  alt: string;
  onClose: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    if (containerRef.current && selectedRef.current) {
      containerRef.current.scrollTop = selectedRef.current.offsetTop;
    }

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const allImages = images.length > 0 ? images : [src];

  return (
    <div className="fixed inset-0 z-100 bg-black/90">
      <button
        onClick={event => {
          event.stopPropagation();
          onClose();
        }}
        aria-label="Close"
        className="fixed top-4 right-4 z-10 flex h-10 w-10 items-center justify-center text-white/70 transition-colors hover:text-white"
      >
        <X size={24} />
      </button>

      <div ref={containerRef} className="flex h-full flex-col items-center gap-3 overflow-y-auto px-6 py-12">
        {allImages.map((imgSrc, i) => (
          <div
            key={i}
            ref={imgSrc === src ? selectedRef : null}
            className="relative aspect-3/4 w-full max-w-4xl shrink-0 cursor-zoom-out md:h-[90vh]"
            onClick={onClose}
          >
            <Image
              src={imgSrc}
              alt={`${alt} — ${i + 1}`}
              fill
              className="object-contain"
              sizes="100vw"
              onClick={e => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
