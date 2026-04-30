import { getRelatedPrints } from "@/features/prints/print-actions";
import PrintCard from "@/features/prints/print-card";

export default async function RelatedPrints({ printId }: { printId: string }) {
  const prints = await getRelatedPrints(printId);

  if (prints.length === 0) {
    return null;
  }

  return (
    <div className="w-full py-10 md:py-14 lg:px-14">
      <p className="mb-8 px-5 font-sans text-[11px] text-text-tertiary uppercase tracking-wide3 md:px-[56px] lg:px-0">
        You might also like
      </p>

      <div className="scrollbar-hide flex snap-x snap-mandatory scroll-pl-5 gap-3 overflow-x-auto pr-5 pb-2 pl-5 lg:hidden">
        {prints.map(print => (
          <div key={print.id} className="w-[50vw] shrink-0 snap-start sm:w-[30vw]">
            <PrintCard print={print} imageHeight="h-[230px]" />
          </div>
        ))}
      </div>

      <div className="hidden grid-cols-4 gap-5 lg:grid">
        {prints.map(print => (
          <PrintCard key={print.id} print={print} />
        ))}
      </div>
    </div>
  );
}
