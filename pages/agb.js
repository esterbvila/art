import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function AGB() {
  return (
    <>
      <Head>
        <title>AGB & Widerrufsrecht — esterii creates</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="bg-bg-main min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 px-5 md:px-[48px] py-[56px] max-w-[720px]">
          <p className="font-sans text-text-tertiary text-[13px] tracking-[3px] uppercase mb-5">Legal</p>
          <h1 className="font-sans font-normal text-text-primary mb-[48px]" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}>
            AGB & Widerrufsrecht
          </h1>

          <div className="flex flex-col gap-10 font-sans text-[15px] leading-[1.8] text-text-secondary">

            {/* ── AGB ─────────────────────────────────────────────────────────── */}
            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 1 Geltungsbereich</h2>
              <p>
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Kaufverträge, die über die Website esteriicreates.art zwischen Ester Batllori I Vila (nachfolgend „Verkäuferin") und Käuferinnen und Käufern (nachfolgend „Kund:innen") geschlossen werden.
              </p>
              <p>
                Maßgeblich ist die jeweils zum Zeitpunkt der Bestellung gültige Fassung der AGB.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 2 Vertragsschluss</h2>
              <p>
                Die Darstellung der Kunstwerke auf dieser Website stellt kein rechtlich bindendes Angebot, sondern eine Aufforderung zur Bestellung dar. Durch das Absenden einer Bestellung gibt der:die Kund:in ein verbindliches Kaufangebot ab.
              </p>
              <p>
                Der Kaufvertrag kommt mit dem Eingang der Bestellbestätigung per E-Mail oder spätestens mit dem Versand der Ware zustande.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 3 Preise und Zahlung</h2>
              <p>
                Alle angegebenen Preise sind Gesamtpreise in Euro (€) und enthalten die gesetzliche Umsatzsteuer. Versandkosten sind im Preis enthalten.
              </p>
              <p>
                Folgende Zahlungsarten stehen zur Verfügung:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Kreditkarte / Debitkarte (über Stripe)</li>
                <li>PayPal</li>
                <li>Klarna (Ratenkauf / Kauf auf Rechnung)</li>
              </ul>
              <p>
                Die Zahlung wird zum Zeitpunkt der Bestellung fällig und sofort verarbeitet.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 3a Produktbeschreibung – Rahmung</h2>
              <p>
                Sofern nicht ausdrücklich anders angegeben, werden alle Gemälde ohne Rahmen verkauft. Rahmen, die auf Produktfotos zu sehen sind, dienen ausschließlich der Darstellung und sind nicht im Lieferumfang enthalten.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 4 Lieferung und Versand</h2>
              <p>
                Die Lieferung erfolgt weltweit. Die Versandkosten sind im Preis des Kunstwerks enthalten.
              </p>
              <p>
                Die Lieferzeit beträgt je nach Zielland und Größe der Bestellung zwischen 4 und 20 Werktagen. Die genaue Lieferzeit wird im Einzelfall kommuniziert. Bei Verzögerungen informiere ich Sie per E-Mail.
              </p>
              <p>
                Alle Werke werden sorgfältig und sicher verpackt, um Transportschäden zu vermeiden. Die Originalwerke werden als Einzelstücke versendet.
              </p>
              <p>
                Bei Lieferungen außerhalb der EU können zusätzliche Zollgebühren oder Einfuhrsteuern anfallen, die von der Empfängerin oder dem Empfänger zu tragen sind.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 5 Eigentumsvorbehalt</h2>
              <p>
                Das gekaufte Kunstwerk bleibt bis zur vollständigen Bezahlung Eigentum der Verkäuferin.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 6 Mängelhaftung</h2>
              <p>
                Es gelten die gesetzlichen Gewährleistungsrechte. Bei einem Mangel haben Kund:innen das Recht auf Nacherfüllung, Minderung oder Rücktritt vom Vertrag. Natürliche Materialmerkmale (z. B. Farbvariationen, Pinselstruktur) sind kein Mangel, sondern Ausdruck des handwerklich-künstlerischen Charakters des Originals.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 7 Urheberrecht</h2>
              <p>
                Mit dem Kauf eines Kunstwerks erwirbt der:die Kund:in das Eigentum am physischen Werk, nicht jedoch das Urheberrecht oder Nutzungsrechte für gewerbliche Zwecke. Das Urheberrecht verbleibt bei der Künstlerin. Eine Reproduktion, Vervielfältigung oder kommerzielle Nutzung der abgebildeten Werke bedarf der ausdrücklichen schriftlichen Zustimmung.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">§ 8 Anwendbares Recht</h2>
              <p>
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist Berlin, sofern der:die Kund:in Kaufmann:frau ist oder keinen allgemeinen Gerichtsstand in Deutschland hat.
              </p>
            </section>

            {/* ── Widerrufsrecht ──────────────────────────────────────────────── */}
            <div className="w-full h-px bg-divider" />

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[18px] font-normal mb-2">Widerrufsbelehrung</h2>
              <h3 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Widerrufsrecht</h3>
              <p>
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p>
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
              </p>
              <p>
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
              </p>
              <p className="pl-4 border-l-2 border-divider">
                Ester Batllori I Vila<br />
                Riesestr. 11, 12347 Berlin<br />
                E-Mail: <a href="mailto:hello@esteriicreates.art" className="text-accent hover:opacity-80 transition-opacity">hello@esteriicreates.art</a>
              </p>
              <p>
                mittels einer eindeutigen Erklärung (z. B. ein per Post versandter Brief oder eine E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben ist.
              </p>
              <p>
                Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Folgen des Widerrufs</h3>
              <p>
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben.
              </p>
              <p>
                Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden. Die Kosten der Rücksendung trägt der:die Kund:in.
              </p>
              <p>
                Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere Zeitpunkt ist.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Ausschluss des Widerrufsrechts</h3>
              <p>
                Das Widerrufsrecht besteht nicht bei Waren, die nach Kundenspezifikation angefertigt werden oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind (§ 312g Abs. 2 Nr. 1 BGB). <strong className="text-text-primary font-normal">Für individuell angefertigte oder auf Bestellung erstellte Kunstwerke ist ein Widerruf daher ausgeschlossen.</strong>
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h3 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">Muster-Widerrufsformular</h3>
              <p className="text-[13px] text-text-tertiary">
                (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden Sie es zurück.)
              </p>
              <div className="border border-divider p-5 text-[14px] leading-[1.8]">
                <p>An:<br />
                Ester Batllori I Vila, Riesestr. 11, 12347 Berlin<br />
                E-Mail: hello@esteriicreates.art</p>
                <p className="mt-3">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*):</p>
                <p className="mt-3">Bestellt am (*) / erhalten am (*):</p>
                <p className="mt-3">Name des/der Verbraucher(s):</p>
                <p className="mt-3">Anschrift des/der Verbraucher(s):</p>
                <p className="mt-3">Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):</p>
                <p className="mt-3">Datum:</p>
                <p className="mt-4 text-text-tertiary text-[12px]">(*) Unzutreffendes streichen.</p>
              </div>
            </section>

            <p className="text-text-tertiary text-[13px]">Stand: März 2026</p>
          </div>
        </main>
        <div className="w-full h-px bg-divider" />
        <Footer />
      </div>
    </>
  );
}
