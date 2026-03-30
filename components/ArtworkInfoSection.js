import { Globe, PackageCheck, ShieldCheck, RefreshCcw } from "lucide-react";

const items = [
	{
		icon: Globe,
		label: "Free Worldwide Shipping",
		description: "Ships from Berlin within 2–5 business days.",
	},
	{
		icon: PackageCheck,
		label: "Secure Packaging",
		description: "Carefully packed with tracking and insurance included.",
	},
	{
		icon: ShieldCheck,
		label: "1 of 1 Original",
		description: "Signed artwork with certificate of authenticity.",
	},
	{
		icon: RefreshCcw,
		label: "14-Day Returns",
		description:
			"Returns accepted within 14 days, excluding commissioned works.",
	},
];

export default function ArtworkInfoSection() {
	return (
		<div className="flex flex-col gap-7">
			{items.map(({ icon: Icon, label, description }) => (
				<div key={label} className="flex flex-row gap-3">
					<Icon
						size={16}
						className="flex-shrink-0 mt-0.5"
						style={{ color: "#9C9690" }}
					/>
					<div className="flex flex-col gap-[3px]">
						<span
							className="font-sans text-[13px] font-medium"
							style={{ color: "#1A1917" }}
						>
							{label}
						</span>
						<span
							className="font-sans text-[12px] font-normal leading-[1.5]"
							style={{ color: "#6B6660" }}
						>
							{description}
						</span>
					</div>
				</div>
			))}
		</div>
	);
}
