"use client";
import { Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/app/site-config";
import { useCart } from "@/features/cart/cart-provider";

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { items, setIsOpen } = useCart();

  const links = [
    { label: "Works", href: "/#works" },
    { label: "About", href: "/#about" },
  ];

  return (
    <header className="relative w-full">
      <nav className="flex items-center justify-between px-5 py-5 md:px-12 md:py-7">
        <Link
          href="/"
          className="font-normal font-sans text-[15px] text-text-primary tracking-[2px] transition-opacity hover:opacity-80 md:text-[16px]"
        >
          esterii creates
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-normal font-sans text-[13px] text-text-secondary tracking-[0.5px] transition-colors hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className="font-normal font-sans text-[13px] text-accent tracking-[0.5px] transition-opacity hover:opacity-80"
          >
            Inquire
          </Link>
          {siteConfig.shopEnabled && (
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-text-secondary transition-colors hover:text-text-primary"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-sans text-[9px] text-white">
                  {items.length}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          {siteConfig.shopEnabled && (
            <button
              onClick={() => setIsOpen(true)}
              className="relative text-text-secondary transition-colors hover:text-text-primary"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} />
              {items.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent font-sans text-[9px] text-white">
                  {items.length}
                </span>
              )}
            </button>
          )}
          <button className="text-text-primary" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="absolute top-full right-0 left-0 z-50 flex flex-col gap-5 border-divider border-t bg-bg-main px-5 py-6 md:hidden">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="font-normal font-sans text-[15px] text-text-secondary tracking-[0.5px] transition-colors hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="font-normal font-sans text-[15px] text-accent tracking-[0.5px] transition-opacity hover:opacity-80"
          >
            Inquire
          </Link>
        </div>
      )}
    </header>
  );
}
