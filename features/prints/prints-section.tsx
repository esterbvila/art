import { getPrints } from "@/features/prints/print-actions";
import PrintCard from "@/features/prints/print-card";

export default async function PrintsSection() {
  const prints = await getPrints().catch(() => []);

  if (prints.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col gap-8 px-5 py-15 pb-20 md:gap-10 md:px-12">
      <div className="flex flex-col gap-1.5">
        <div className="flex w-full items-center justify-between">
          <span className="font-normal font-sans text-[16px] text-text-tertiary uppercase tracking-wide3">
            Prints
          </span>
          <span className="font-normal font-sans text-[13px] text-text-tertiary tracking-[0.5px]">
            {prints.length} work{prints.length !== 1 ? "s" : ""}
          </span>
        </div>
        <p className="font-normal font-sans text-[12px] text-text-tertiary">
          High-quality reproductions of original artworks, available in different sizes and materials.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {prints.map(print => (
          <PrintCard key={print.id} print={print} />
        ))}
      </div>
    </div>
  );
}
