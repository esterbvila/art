import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "../lib/utils";

/**
 * CollectionCard — shown in the Gallery section on the homepage.
 * Matches the Collection 1/2/3 cards in the "Abstract Art - Desktop" prototype.
 *
 * Layout:
 *   - Cover image (380px tall)
 *   - Info: name, description, count + min price, "View Collection →" CTA
 */
export default function CollectionCard({ collection }) {
	const { slug, name, tagline, cover_image_url, artwork_count, min_price } =
		collection;

	return (
		<Link
			href={`/collections/${slug}`}
			className="group flex flex-col w-full cursor-pointer"
			aria-label={`View ${name} collection`}
		>
			{/* ── Cover image ──────────────────────────────────────────────── */}
			<div className="relative w-full aspect-3/4 overflow-hidden max-h-[410px]">
				{cover_image_url ? (
					<Image
						src={cover_image_url}
						alt={name}
						fill
						className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
						sizes="640px"
						quality={60}
					/>
				) : (
					<div className="w-full h-full bg-divider" />
				)}
			</div>

			{/* ── Info ─────────────────────────────────────────────────────── */}
			<div className="flex flex-col gap-1.5 pt-3">
				<p
					className="font-sans font-semibold text-text-primary"
					style={{ fontSize: "22px", letterSpacing: "-0.5px" }}
				>
					{name}
				</p>

				{tagline && (
					<p className="font-sans font-normal text-text-secondary text-[14px] leading-[1.6]">
						{tagline}
					</p>
				)}

				<p className="font-sans font-normal text-text-tertiary text-[12px] tracking-[0.5px]">
					{artwork_count ?? 0} work{artwork_count !== 1 ? "s" : ""}
					{min_price ? ` · From ${formatPrice(min_price)}` : ""}
				</p>
			</div>
		</Link>
	);
}
