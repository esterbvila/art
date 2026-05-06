"use client";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";

export default function LegalPage({ content, metaTitleDe, metaTitleEn }) {
  const [lang, setLang] = useState("en");
  const { title, sections } = content[lang];

  return (
    <>
      <Head>
        <title>{`${lang === "de" ? metaTitleDe : metaTitleEn} — esterii creates`}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="flex min-h-screen flex-col bg-bg-main">
        <nav className="flex items-center gap-2 px-5 py-4 md:px-12">
          <Link
            href="/"
            className="font-sans text-[12px] text-text-tertiary transition-colors hover:text-text-secondary"
          >
            Home
          </Link>
          <span className="font-sans text-[12px] text-text-tertiary">/</span>
          <span className="font-sans text-[12px] text-text-secondary">{lang === "de" ? metaTitleDe : metaTitleEn}</span>
        </nav>
        <main className="max-w-180 flex-1 px-5 py-14 md:px-12">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-sans text-[13px] text-text-tertiary uppercase tracking-wide3">Legal</p>
            <div className="flex font-sans text-[12px] tracking-[1px]">
              <button
                onClick={() => setLang("en")}
                className={`border border-divider px-3 py-1 transition-colors ${
                  lang === "en" ? "bg-accent text-text-light" : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("de")}
                className={`border border-divider border-l-0 px-3 py-1 transition-colors ${
                  lang === "de" ? "bg-accent text-text-light" : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                DE
              </button>
            </div>
          </div>

          <h1
            className="mb-12 font-heading font-normal text-text-primary"
            style={{
              fontSize: "clamp(32px, 4vw, 48px)",
              letterSpacing: "-1.5px",
              lineHeight: 0.95,
            }}
          >
            {title}
          </h1>

          <div className="flex flex-col gap-10 font-sans text-[15px] text-text-secondary leading-[1.8]">
            {sections.map((section, i) => {
              if (section.divider) {
                return <div key={i} className="h-px w-full bg-divider" />;
              }
              return (
                <section key={i} className="flex flex-col gap-2">
                  {section.heading &&
                    (section.headingLarge ? (
                      <h2 className="mb-2 font-normal text-[18px] text-text-primary">{section.heading}</h2>
                    ) : (
                      <h2 className="font-normal text-[13px] text-text-primary uppercase tracking-[2px]">
                        {section.heading}
                      </h2>
                    ))}
                  {section.body}
                </section>
              );
            })}
          </div>
        </main>
      </div>
    </>
  );
}
