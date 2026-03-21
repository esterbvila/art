/**
 * Info section shown on artwork detail pages.
 * Matches the "Info Section" frame from "Artwork Detail - Desktop" prototype:
 * Two groups stacked vertically, 32px gap between groups, 40px gap between blocks,
 * 12px gap between label and body lines. No icons, purely typographic.
 */
export default function ArtworkInfoSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 pt-8 border-t border-divider">

      {/* ── Col 1: Shipping + Authenticity ────────────────────────────── */}
      <div className="flex flex-col gap-10">

        <div className="flex flex-col gap-3">
          <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
            Shipping
          </p>
          <div className="flex flex-col gap-0 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
            <p>Free worldwide shipping on all originals</p>
            <p>Ships from Berlin within 2–5 business days</p>
            <p>All shipments include tracking and insurance for complete peace of mind</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
            Authenticity
          </p>
          <div className="flex flex-col gap-0 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
            <p>Original artworks — only 1 piece exists</p>
            <p>Signed by the artist</p>
            <p>Certificate of authenticity included</p>
          </div>
        </div>

      </div>

      {/* ── Col 2: Packaging & Security + Satisfaction Guarantee ──────── */}
      <div className="flex flex-col gap-10">

        <div className="flex flex-col gap-3">
          <p className="font-sans font-normal text-text-tertiary text-[11px] tracking-[2px] uppercase">
            Packaging &amp; Security
          </p>
          <div className="flex flex-col gap-0 font-sans font-normal text-text-secondary text-[13px] leading-[1.6]">
            <p>Each painting is carefully packaged to ensure it arrives in perfect condition</p>
            <p>All payments are securely processed through trusted providers using encrypted connections</p>
          </div>
          <p className="font-sans font-normal text-text-tertiary text-[12px] leading-[1.6]">
            *Unless otherwise stated, all paintings are sold without a frame. Frames shown in some photos are for display purposes only.
          </p>
        </div>

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

    </div>
  );
}
