"use client";
import { ZoomIn } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import ImageLightbox from "@/features/image-ligthtbox";

export default function ArtworkImage({
  src,
  alt,
  sizes,
  quality,
  priority,
  artworkImages,
}: {
  src: string;
  alt: string;
  sizes: string;
  quality?: number;
  priority?: boolean;
  artworkImages?: string[];
}) {
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  return (
    <div
      className="group relative aspect-3/4 w-full cursor-zoom-in overflow-hidden"
      onClick={e => {
        e.stopPropagation();
        setLightboxSrc(src);
      }}
    >
      <Image src={src} alt={alt} fill className="object-cover" sizes={sizes} quality={quality} priority={priority} />
      <button
        onClick={e => {
          e.stopPropagation();
          setLightboxSrc(src);
        }}
        aria-label="View full screen"
        className="absolute top-3 left-3 z-10 flex h-8 w-8 items-center justify-center bg-bg-main/80 opacity-0 transition-colors hover:bg-bg-main group-hover:opacity-100"
      >
        <ZoomIn size={15} className="text-text-primary" />
      </button>

      {lightboxSrc && (
        <ImageLightbox src={lightboxSrc} images={artworkImages ?? []} alt={alt} onClose={() => setLightboxSrc(null)} />
      )}
    </div>
  );
}
