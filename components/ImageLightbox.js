import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';

/**
 * Full-screen image lightbox.
 * On md+: all images stacked vertically, scrolled to the selected one.
 * On mobile: single selected image only.
 */
export default function ImageLightbox({ src, images = [], alt, onClose }) {
  const containerRef = useRef(null);
  const selectedRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';

    // Immediately jump to the selected image (no smooth scroll)
    if (containerRef.current && selectedRef.current) {
      containerRef.current.scrollTop = selectedRef.current.offsetTop;
    }

    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const allImages = images.length > 0 ? images : [src];

  return (
    <div className="fixed inset-0 z-[100] bg-black/90">
      {/* Close button */}
      <button
        onClick={onClose}
        aria-label="Close"
        className="fixed top-4 right-4 w-10 h-10 flex items-center justify-center text-white/70 hover:text-white transition-colors z-10"
      >
        <X size={24} />
      </button>

      {/* Mobile (< md): single image */}
      <div
        className="md:hidden h-full flex items-center justify-center px-4 cursor-zoom-out"
        onClick={onClose}
      >
        <div
          className="relative w-full max-h-[90vh]"
          style={{ height: '90vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          <Image src={src} alt={alt} fill className="object-contain" sizes="100vw" />
        </div>
      </div>

      {/* md+: all images stacked, scrollable */}
      <div
        ref={containerRef}
        className="hidden md:flex md:flex-col h-full overflow-y-auto items-center py-12 gap-3 px-6"
      >
        {allImages.map((imgSrc, i) => (
          <div
            key={i}
            ref={imgSrc === src ? selectedRef : null}
            className="relative w-full max-w-4xl flex-shrink-0 cursor-zoom-out"
            style={{ height: '100vh' }}
            onClick={onClose}
          >
            <Image
              src={imgSrc}
              alt={`${alt} — ${i + 1}`}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 896px"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
