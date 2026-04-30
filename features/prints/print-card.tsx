import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";

type Print = {
  id: string;
  title: string | null;
  imageUrl: string;
  slug: string | null;
  size: string;
  material: string;
  price: number;
  stock: number;
};

export default function PrintCard({ print, imageHeight }: { print: Print; imageHeight?: string }) {
  const isAvailable = print.stock > 0;

  return (
    <Link
      href={`/prints/${print.id}`}
      className="group flex w-full cursor-pointer flex-col"
      aria-label={`View ${print.title}`}
    >
      <div className={`relative max-h-102.5 w-full overflow-hidden ${imageHeight ?? "aspect-3/4"}`}>
        <Image
          src={print.imageUrl}
          alt={print.title ?? ""}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          sizes="640px"
          quality={60}
        />
        {!isAvailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-deep/50">
            <span className="font-sans text-text-light text-xs uppercase tracking-[2px]">Sold out</span>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1 pt-3">
        <span className="font-sans font-semibold text-[17px] text-text-primary leading-[1.3]">{print.title}</span>
<span className="font-normal font-sans text-[15px] text-text-secondary leading-[1.3]">
          {formatPrice(print.price)}
        </span>
      </div>
    </Link>
  );
}
