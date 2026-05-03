"use client";
import Link from "next/link";
interface BreadcrumbItem {
  label: string;
  href?: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {

  function handleClick(href: string) {
    const hashMatch = href.match(/^\/#(.+)$/);
    if (hashMatch) {
      if (window.location.pathname === "/") {
        document.getElementById(hashMatch[1])?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = href;
      }
    }
  }

  return (
    <nav className="flex w-full items-center gap-2 px-5 py-4 md:px-12">
      <Link href="/" className="font-sans text-[12px] text-text-tertiary transition-colors hover:text-text-secondary">
        Home
      </Link>
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-2">
          <span className="font-sans text-[12px] text-text-tertiary">/</span>
          {item.href ? (
            item.href.startsWith("/#") ? (
              <button
                onClick={() => handleClick(item.href!)}
                className="font-sans text-[12px] text-text-tertiary transition-colors hover:text-text-secondary"
              >
                {item.label}
              </button>
            ) : (
              <Link
                href={item.href}
                className="font-sans text-[12px] text-text-tertiary transition-colors hover:text-text-secondary"
              >
                {item.label}
              </Link>
            )
          ) : (
            <span className="font-sans text-[12px] text-text-secondary">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
