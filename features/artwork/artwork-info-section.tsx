import { Globe, Layers, PackageCheck, RefreshCcw, ShieldCheck } from "lucide-react";

const sharedItems = [
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
];

const originalItem = {
  icon: ShieldCheck,
  label: "Original",
  description: "Signed artwork with certificate of authenticity.",
};

const printItem = {
  icon: Layers,
  label: "Archival-quality print, signed by the artist",
  description: "Printed on radiant white watercolor paper.",
};

const returnsItem = {
  icon: RefreshCcw,
  label: "14-Day Returns",
  description: "Returns accepted within 14 days, excluding commissioned works.",
};

export default function ArtworkInfoSection({ type }: { type?: string | null }) {
  const typeItem = type === "print" ? printItem : originalItem;
  const items = type === "print" ? [...sharedItems, typeItem, returnsItem] : [...sharedItems, typeItem, returnsItem];

  return (
    <div className="flex flex-col gap-7">
      {items.map(({ icon: Icon, label, description }) => (
        <div key={label} className="flex flex-row gap-3">
          <Icon size={16} className="mt-0.5 shrink-0" style={{ color: "#9C9690" }} />
          <div className="flex flex-col gap-0.75">
            <span className="font-medium font-sans text-[13px]" style={{ color: "#1A1917" }}>
              {label}
            </span>
            <span className="font-normal font-sans text-[12px] leading-normal" style={{ color: "#6B6660" }}>
              {description}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
