/**
 * Info section shown on artwork detail pages.
 * Desktop: 2-column grid (Shipping + Authenticity | Packaging & Security + Satisfaction Guarantee).
 * Mobile: stacked vertically.
 * Matches the "Info Section" frame from the prototype.
 */
export default function ArtworkInfoSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-5 md:px-[56px] py-8 md:py-[56px]">

      {/* ── Shipping ──────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
          Shipping
        </p>
        <ul className="flex flex-col gap-1.5 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
          <li>Free worldwide shipping on all originals</li>
          <li>Ships from Berlin within 2–5 business days</li>
          <li>All shipments include tracking and insurance for complete peace of mind</li>
        </ul>
      </div>

      {/* ── Packaging & Security ──────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
          Packaging &amp; Security
        </p>
        <ul className="flex flex-col gap-1.5 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
          <li>Each painting is carefully packaged to ensure it arrives in perfect condition</li>
          <li>All payments are securely processed through trusted providers using encrypted connections</li>
        </ul>
      </div>

      {/* ── Authenticity ──────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
          Authenticity
        </p>
        <ul className="flex flex-col gap-1.5 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
          <li>Original artwork — only 1 piece exists</li>
          <li>Signed by the artist</li>
          <li>Certificate of authenticity included</li>
        </ul>
      </div>

      {/* ── Satisfaction Guarantee ────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
          Satisfaction Guarantee
        </p>
        <p className="font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
          If you are not completely satisfied with your artwork, you may request a return within 14 days of delivery. The artwork must be returned in its original condition and packaging. Return shipping costs are the responsibility of the buyer.
        </p>
        <p className="font-sans font-normal text-text-tertiary text-[12px] leading-[1.6]">
          *Custom and commissioned artworks are excluded from this guarantee.
        </p>
      </div>

    </div>
  );
}
