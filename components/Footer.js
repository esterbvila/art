import Link from 'next/link';

/**
 * Site footer — three-column layout on desktop, stacked on mobile.
 * Matches the "Footer" frame from both the desktop and mobile prototypes.
 */
export default function Footer() {
  const navLinks = [
    { label: 'Works',     href: '/#works'   },
    { label: 'About',     href: '/#about'   },
    { label: 'Contact',   href: '/#contact' },
    { label: 'Instagram', href: '#'         },
  ];

  return (
    <footer className="flex flex-col items-center md:flex-row md:items-start justify-between gap-5 md:gap-0 px-5 md:px-[48px] pt-8 pb-10 md:pt-[40px] md:pb-[48px]">
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
    </footer>
  );
}
