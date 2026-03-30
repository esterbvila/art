import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../lib/utils";

/**
 * Featured Painting section.
 * Dark background (bg-deep) with a large image on the left and
 * editorial text on the right.
 * Desktop: side-by-side, 560px height.
 * Mobile:  stacked — image first, content below.
 * Matches the "Featured Painting" frame from the prototype.
 */
export default function FeaturedPainting({ artwork }) {
	if (!artwork) return null;

	return (
		<section className="flex flex-col md:flex-row bg-bg-deep w-full md:h-[560px]">
			{/* ── Featured image ────────────────────────────────────────────── */}
			<div className="relative w-full md:flex-1 h-[340px] md:h-full overflow-hidden flex-shrink-0">
				<Image
					src={artwork.image_url}
					alt={artwork.title}
					fill
					className="object-cover"
					sizes="(max-width: 768px) 100vw, 60vw"
				/>
			</div>

			{/* ── Content panel ─────────────────────────────────────────────── */}
			<div className="flex flex-col justify-center gap-5 px-5 py-8 md:px-[56px] md:py-[64px] md:w-[500px] md:flex-shrink-0">
				{/* Label */}
				<p className="font-sans font-normal text-text-light-muted text-[13px] tracking-[3px] uppercase">
					Featured Work
				</p>

				{/* Title */}
				<h2
					className="font-sans font-normal text-text-light leading-tight95"
					style={{
						fontSize: "clamp(36px, 3.3vw, 48px)",
						letterSpacing: "-1.5px",
					}}
				>
					{artwork.title}
				</h2>

				{/* Meta */}
				<p className="font-sans font-normal text-text-light-muted text-[13px]">
					{[artwork.medium, artwork.dimensions, artwork.year]
						.filter(Boolean)
						.join(" · ")}
				</p>

				{/* Story excerpt */}
				<p className="font-sans font-normal text-text-light-muted text-[15px] leading-[1.7]">
					{artwork.description}
				</p>

				{/* Price + CTA row */}
				<div className="flex items-center gap-8 pt-3">
					<span className="font-sans font-normal text-text-light text-[24px]">
						{formatPrice(artwork.price)}
					</span>
					<Link
						href={`/${artwork.id}`}
						className="font-sans font-normal text-accent text-[14px] hover:opacity-80 transition-opacity"
					>
						Purchase this painting →
					</Link>
				</div>
			</div>
		</section>
	);
}
