import ArtworkCard from "./ArtworkCard";

/**
 * Unique Pieces section — artworks that don't belong to any collection.
 * Matches the "Unique Artworks Section" from the prototype.
 */
export default function UniquePieces({ artworks = [] }) {
	if (artworks.length === 0) return null;

	const sorted = [...artworks].sort(
		(a, b) => (a.stock > 0 ? 0 : 1) - (b.stock > 0 ? 0 : 1),
	);

	return (
		<div className="flex flex-col gap-8 md:gap-[40px] px-5 md:px-[48px] py-[60px] pb-[80px]">
			{/* ── Header ─────────────────────────────────────────────────────── */}
			<div className="flex flex-col gap-1.5">
				<div className="flex items-center justify-between w-full">
					<span className="font-sans font-normal text-text-tertiary text-[16px] tracking-[3px] uppercase">
						Unique Pieces
					</span>
					<span className="font-sans font-normal text-text-tertiary text-[13px] tracking-[0.5px]">
						{artworks.length} work{artworks.length !== 1 ? "s" : ""}
					</span>
				</div>
				<p className="font-sans font-normal text-text-tertiary text-[12px]">
					Original works that stand on their own — not part of any collection.
				</p>
			</div>

			{/* ── Grid ───────────────────────────────────────────────────────── */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-9">
				{sorted.map((artwork) => (
					<ArtworkCard key={artwork.id} artwork={artwork} />
				))}
			</div>
		</div>
	);
}
