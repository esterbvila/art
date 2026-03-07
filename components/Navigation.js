import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

/**
 * Site-wide navigation.
 * Desktop: horizontal links right-aligned.
 * Mobile: hamburger menu that slides in from the top.
 * Matches the nav from the prototype (Ester Batllori brand + Works/About/Contact/Inquire).
 */
export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { label: 'Works',   href: '/#works'   },
    { label: 'About',   href: '/#about'   },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <header className="w-full relative">
      <nav className="flex items-center justify-between px-5 py-5 md:px-[48px] md:py-[28px]">
        {/* Brand */}
        <Link
          href="/"
          className="font-sans font-normal text-text-primary tracking-[2px] text-[15px] md:text-[16px] hover:opacity-80 transition-opacity"
        >
          Ester Batllori
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-10">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="font-sans font-normal text-text-secondary text-[13px] tracking-[0.5px] hover:text-text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          {/* Inquire — accent colour */}
          <Link
            href="/#contact"
            className="font-sans font-normal text-accent text-[13px] tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            Inquire
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-bg-main border-t border-divider z-50 px-5 py-6 flex flex-col gap-5">
          {links.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="font-sans font-normal text-text-secondary text-[15px] tracking-[0.5px] hover:text-text-primary transition-colors"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setMobileOpen(false)}
            className="font-sans font-normal text-accent text-[15px] tracking-[0.5px] hover:opacity-80 transition-opacity"
          >
            Inquire
          </Link>
        </div>
      )}
    </header>
  );
}
