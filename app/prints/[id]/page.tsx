import { Globe, PackageCheck, RefreshCcw } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ArtworkImage from "@/features/artwork/artwork-image";
import ImageSlider from "@/features/image-slider";
import { getPrintById } from "@/features/prints/print-actions";
import PrintQuantitySelector from "@/features/prints/print-quantity-selector";
import RelatedPrints from "@/features/prints/related-prints";

const printInfoItems = [
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
    icon: RefreshCcw,
    label: "14-Day Returns",
    description: "Returns accepted within 14 days, excluding commissioned works.",
  },
];

export default async function PrintDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const print = await getPrintById(id);
  if (!print) {
    notFound();
  }

  const details = [
    { label: "Material", value: print.material },
    { label: "Size", value: print.size },
    { label: "Availability", value: print.stock > 0 ? "Available" : "Sold out", accent: print.stock > 0 },
  ];

  return (
    <>
    <div className="flex flex-col items-center justify-center">
      <div className="h-px w-full bg-divider" />

      <div className="flex w-full flex-1 flex-col md:flex-row lg:max-w-325">
        <div className="md:w-1/2 md:max-w-140.75 lg:w-[55%] lg:max-w-none">
          <div className="min-h-75 md:hidden">
            <ImageSlider images={print.images} alt={print.title ?? ""} />
          </div>
          <div className="hidden flex-col gap-1.5 md:flex">
            {print.images.map((src, i) => (
              <ArtworkImage
                key={i}
                src={src}
                alt={print.title ?? ""}
                sizes="50vw"
                quality={60}
                priority={i === 0}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8 p-5 md:sticky md:top-0 md:w-1/2 md:self-start md:p-14 lg:w-[45%]">
          <h1
            className="font-normal font-sans text-text-primary"
            style={{ fontSize: "clamp(26px, 3vw, 42px)", letterSpacing: "-1px", lineHeight: 1.05 }}
          >
            {print.title}
          </h1>

          <PrintQuantitySelector
            printId={print.id}
            title={print.title ?? ""}
            price={print.price}
            stock={print.stock}
            imageUrl={print.images[0] ?? ""}
            size={print.size}
            material={print.material}
          />

          <div className="h-px w-full bg-divider" />

          <div className="flex flex-col gap-3.5">
            {details.map(({ label, value, accent }) => (
              <div key={label} className="flex items-center justify-between">
                <span className="font-sans text-[13px] text-text-tertiary">{label}</span>
                <span className={`font-sans text-[13px] ${accent ? "text-accent" : "text-text-primary"}`}>{value}</span>
              </div>
            ))}
          </div>

          <div className="h-px w-full bg-divider" />

          <div className="flex flex-col gap-7">
            {printInfoItems.map(({ icon: Icon, label, description }) => (
              <div key={label} className="flex flex-row gap-3">
                <Icon size={16} className="mt-0.5 shrink-0" style={{ color: "#9C9690" }} />
                <div className="flex flex-col gap-0.75">
                  <span className="font-medium font-sans text-[13px]" style={{ color: "#1A1917" }}>{label}</span>
                  <span className="font-normal font-sans text-[12px] leading-normal" style={{ color: "#6B6660" }}>{description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <Suspense>
      <RelatedPrints printId={id} />
    </Suspense>
    </>
  );
}
