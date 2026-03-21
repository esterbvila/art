import Link from 'next/link';
import { Lock } from 'lucide-react';
import { SiStripe, SiPaypal, SiKlarna } from 'react-icons/si';
import { FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

/**
 * Site footer — three-column layout on desktop, stacked on mobile.
 * Matches the "Footer" frame from both the desktop and mobile prototypes.
 */
export default function Footer() {
  const navLinks = [
    { label: 'Works',     href: '/#works'   },
    { label: 'About',     href: '/#about'   },
    { label: 'Inquire',   href: '/#contact' },
    { label: '@esterii_creates', href: 'https://instagram.com/esterii_creates' },
  ];

  return (
    <footer className="flex flex-col w-full">

      {/* ── Payment & security badges ───────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 px-5 py-4 border-b border-divider">
        <div className="flex items-center gap-1.5 text-text-tertiary">
          <Lock size={12} />
          <span className="font-sans text-[11px] tracking-[0.5px]">Secure Checkout</span>
        </div>
        <div className="w-px h-4 bg-divider" />
        <SiStripe size={20} className="text-text-tertiary" title="Stripe" />
        <SiPaypal size={18} className="text-text-tertiary" title="PayPal" />
        <SiKlarna size={20} className="text-text-tertiary" title="Klarna" />
        <div className="w-px h-4 bg-divider" />
        <FaCcVisa size={24} className="text-text-tertiary" title="Visa" />
        <FaCcMastercard size={24} className="text-text-tertiary" title="Mastercard" />
        <FaCcAmex size={24} className="text-text-tertiary" title="American Express" />
      </div>

      {/* ── Main footer row ─────────────────────────────────────────────── */}
      <div className="flex flex-col items-center md:flex-row md:items-start justify-between gap-5 md:gap-0 px-5 md:px-[48px] pt-8 pb-10 md:pt-[40px] md:pb-[48px]">
      {/* ── Left: brand + tagline ──────────────────────────────────────── */}
      <div className="flex flex-col gap-1.5 text-center md:text-left">
        <Link
          href="/"
          className="font-sans font-normal text-text-primary text-[15px] md:text-[16px] tracking-[2px] hover:opacity-80 transition-opacity"
        >
          esterii creates
        </Link>
        <p className="font-sans font-normal text-text-tertiary text-[13px]">
          Original abstract paintings exploring emotion, intuition
          <br className="hidden md:block" /> and subconscious landscapes.
        </p>
      </div>

      {/* ── Center: nav links ──────────────────────────────────────────── */}
      <nav className="flex items-center gap-6 md:gap-8">
        {navLinks.map(({ label, href }) => (
          <Link
            key={label}
            href={href}
            {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            className="font-sans font-normal text-text-secondary text-[13px] hover:text-text-primary transition-colors"
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* ── Right: legal links + copyright ─────────────────────────────── */}
      <div className="flex flex-col items-center md:items-end gap-2">
        <div className="flex items-center gap-4">
          <Link href="/impressum" className="font-sans font-normal text-text-tertiary text-[11px] md:text-[12px] hover:text-text-secondary transition-colors">Impressum</Link>
          <Link href="/datenschutz" className="font-sans font-normal text-text-tertiary text-[11px] md:text-[12px] hover:text-text-secondary transition-colors">Datenschutz</Link>
          <Link href="/agb" className="font-sans font-normal text-text-tertiary text-[11px] md:text-[12px] hover:text-text-secondary transition-colors">AGB</Link>
        </div>
        <p className="font-sans font-normal text-text-tertiary text-[11px] md:text-[12px]">
          © 2026
        </p>
      </div>
      </div>
    </footer>
  );
}
