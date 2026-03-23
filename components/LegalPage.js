import { useState } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

/**
 * Shared wrapper for all legal pages.
 * Renders a DE/EN language toggle and maps over the content sections.
 *
 * Section shape:
 *   { heading?, headingLarge?, body?, divider? }
 *
 * - divider: true         → renders a full-width horizontal rule
 * - headingLarge: true    → renders a larger h2 (used for Widerrufsbelehrung)
 * - heading               → small caps h2 (default)
 * - body                  → any JSX
 */
export default function LegalPage({ content, metaTitleDe, metaTitleEn }) {
  const [lang, setLang] = useState('en');
  const { title, sections } = content[lang];

  return (
    <>
      <Head>
        <title>{lang === 'de' ? metaTitleDe : metaTitleEn} — esterii creates</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="bg-bg-main min-h-screen flex flex-col">
        <Navigation />

        <main className="flex-1 px-5 md:px-[48px] py-[56px] max-w-[720px]">

          {/* ── Header row: label + language toggle ───────────────────── */}
          <div className="flex items-center justify-between mb-5">
            <p className="font-sans text-text-tertiary text-[13px] tracking-[3px] uppercase">Legal</p>
            <div className="flex font-sans text-[12px] tracking-[1px]">
              <button
                onClick={() => setLang('en')}
                className={`px-3 py-1 border border-divider transition-colors ${
                  lang === 'en' ? 'bg-accent text-text-light' : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang('de')}
                className={`px-3 py-1 border border-divider border-l-0 transition-colors ${
                  lang === 'de' ? 'bg-accent text-text-light' : 'text-text-tertiary hover:text-text-primary'
                }`}
              >
                DE
              </button>
            </div>
          </div>

          {/* ── Page title ────────────────────────────────────────────── */}
          <h1
            className="font-sans font-normal text-text-primary mb-[48px]"
            style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}
          >
            {title}
          </h1>

          {/* ── Sections ──────────────────────────────────────────────── */}
          <div className="flex flex-col gap-10 font-sans text-[15px] leading-[1.8] text-text-secondary">
            {sections.map((section, i) => {
              if (section.divider) {
                return <div key={i} className="w-full h-px bg-divider" />;
              }
              return (
                <section key={i} className="flex flex-col gap-2">
                  {section.heading && (
                    section.headingLarge
                      ? (
                        <h2 className="text-text-primary text-[18px] font-normal mb-2">
                          {section.heading}
                        </h2>
                      ) : (
                        <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">
                          {section.heading}
                        </h2>
                      )
                  )}
                  {section.body}
                </section>
              );
            })}
          </div>

        </main>

        <div className="w-full h-px bg-divider" />
        <Footer />
      </div>
    </>
  );
}
