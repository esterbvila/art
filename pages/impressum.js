import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Impressum() {
  return (
    <>
      <Head>
        <title>Impressum — esterii creates</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="bg-bg-main min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 px-5 md:px-[48px] py-[56px] max-w-[720px]">
          <p className="font-sans text-text-tertiary text-[13px] tracking-[3px] uppercase mb-5">Legal</p>
          <h1 className="font-sans font-normal text-text-primary mb-[48px]" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}>
            Impressum
          </h1>

          <div className="flex flex-col gap-10 font-sans text-[15px] leading-[1.8] text-text-secondary">

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Angaben gemäß § 5 TMG</h2>
              <p>
                Ester Batllori I Vila<br />
                Riesestr. 11<br />
                12347 Berlin<br />
                Deutschland
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Kontakt</h2>
              <p>
                E-Mail: <a href="mailto:ester.batllori@gmail.com" className="text-accent hover:opacity-80 transition-opacity">ester.batllori@gmail.com</a>
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Steuerliche Angaben</h2>
              <p>
                Steuernummer: 16/217/10332<br />
                Umsatzsteuer-Identifikationsnummer gemäß § 27a UStG: DE369468465
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Berufsbezeichnung</h2>
              <p>
                Freischaffende bildende Künstlerin (Einzelunternehmerin) mit Sitz in Berlin, Deutschland.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Inhaltlich verantwortlich gemäß § 18 Abs. 2 MStV</h2>
              <p>
                Ester Batllori I Vila<br />
                Riesestr. 11, 12347 Berlin
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Haftungsausschluss</h2>
              <p>
                Die Inhalte dieser Website wurden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden. Als Diensteanbieter bin ich gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Als Diensteanbieter bin ich jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt (§§ 8–10 TMG).
              </p>
              <p>
                Trotz sorgfältiger inhaltlicher Kontrolle übernehme ich keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Verbraucherstreitbeilegung</h2>
              <p>
                Ich bin nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Urheberrecht</h2>
              <p>
                Die durch mich erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Sämtliche abgebildeten Kunstwerke sind urheberrechtlich geschützt. Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen meiner schriftlichen Zustimmung.
              </p>
            </section>

          </div>
        </main>
        <div className="w-full h-px bg-divider" />
        <Footer />
      </div>
    </>
  );
}
