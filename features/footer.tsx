import { Lock } from "lucide-react";
import Link from "next/link";
import { FaCcAmex, FaCcMastercard, FaCcVisa } from "react-icons/fa";
import { SiKlarna, SiPaypal, SiStripe } from "react-icons/si";
import { siteConfig } from "@/app/site-config";

export default function Footer() {
  const navLinks = [
    { label: "Works", href: "/#works" },
    { label: "About", href: "/#about" },
    { label: "Inquire", href: "/#contact" },
    {
      label: "@esterii_creates",
      href: "https://instagram.com/esterii_creates",
    },
  ];

  return (
    <footer className="flex w-full flex-col">
      <div className="flex flex-wrap items-center justify-center gap-3 border-divider border-b px-5 py-4 sm:gap-4">
        <div className="flex items-center gap-1.5 text-text-tertiary">
          <Lock size={12} />
          <span className="font-sans text-[11px] tracking-[0.5px]">Secure Checkout</span>
        </div>
        <div className="h-4 w-px bg-divider" />
        <SiStripe size={20} className="text-text-tertiary" title="Stripe" />
        <SiPaypal size={18} className="text-text-tertiary" title="PayPal" />
        <SiKlarna size={20} className="text-text-tertiary" title="Klarna" />
        <div className="h-4 w-px bg-divider" />
        <FaCcVisa size={24} className="text-text-tertiary" title="Visa" />
        <FaCcMastercard size={24} className="text-text-tertiary" title="Mastercard" />
        <FaCcAmex size={24} className="text-text-tertiary" title="American Express" />
      </div>

      <div className="flex flex-col items-center justify-between gap-5 px-5 pt-8 pb-9 md:flex-row md:items-start md:gap-0 md:px-12 md:pt-10 md:pb-12">
        <div className="flex flex-col gap-1.5 text-center md:text-left">
          <Link
            href="/"
            className="font-normal font-sans text-[15px] text-text-primary tracking-[2px] transition-opacity hover:opacity-80 md:text-[16px]"
          >
            {siteConfig.name}
          </Link>
          <p className="font-normal font-sans text-[13px] text-text-tertiary">
            Abstract paintings exploring emotion, intuition
            <br className="hidden md:block" /> and subconscious landscapes.
          </p>
        </div>

        <nav className="flex items-center gap-6 md:gap-8">
          {navLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="font-normal font-sans text-[13px] text-text-secondary transition-colors hover:text-text-primary"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col items-center gap-2 md:items-end">
          <div className="flex items-center gap-4">
            <Link
              href="/impressum"
              className="font-normal font-sans text-[11px] text-text-tertiary transition-colors hover:text-text-secondary md:text-[12px]"
            >
              Impressum
            </Link>
            <Link
              href="/datenschutz"
              className="font-normal font-sans text-[11px] text-text-tertiary transition-colors hover:text-text-secondary md:text-[12px]"
            >
              Datenschutz
            </Link>
            <Link
              href="/agb"
              className="font-normal font-sans text-[11px] text-text-tertiary transition-colors hover:text-text-secondary md:text-[12px]"
            >
              AGB
            </Link>
          </div>
          <p className="font-normal font-sans text-[11px] text-text-tertiary md:text-[12px]">
            © {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
