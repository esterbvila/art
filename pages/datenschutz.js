import Head from 'next/head';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function Datenschutz() {
  return (
    <>
      <Head>
        <title>Datenschutzerklärung — esterii creates</title>
      </Head>
      <div className="bg-bg-main min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 px-5 md:px-[48px] py-[56px] max-w-[720px]">
          <p className="font-sans text-text-tertiary text-[13px] tracking-[3px] uppercase mb-5">Legal</p>
          <h1 className="font-sans font-normal text-text-primary mb-[48px]" style={{ fontSize: 'clamp(32px, 4vw, 48px)', letterSpacing: '-1.5px', lineHeight: 0.95 }}>
            Datenschutzerklärung
          </h1>

          <div className="flex flex-col gap-10 font-sans text-[15px] leading-[1.8] text-text-secondary">

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">1. Verantwortliche Person</h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website ist:<br /><br />
                Ester Batllori I Vila<br />
                Riesestr. 11, 12347 Berlin<br />
                E-Mail: <a href="mailto:hello@esteriicreates.art" className="text-accent hover:opacity-80 transition-opacity">hello@esteriicreates.art</a><br />
                Telefon: +49 176 22650968
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">2. Erhebung und Verarbeitung personenbezogener Daten</h2>
              <p>
                Ich erhebe personenbezogene Daten nur, soweit dies zur Vertragserfüllung oder auf Grundlage Ihrer ausdrücklichen Einwilligung erforderlich ist. Die Rechtsgrundlagen ergeben sich aus Art. 6 DSGVO.
              </p>
              <p>
                Beim Kauf eines Kunstwerks verarbeite ich folgende Daten:
              </p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li>Name und Vorname</li>
                <li>Lieferadresse</li>
                <li>E-Mail-Adresse</li>
                <li>Telefonnummer (optional)</li>
                <li>Zahlungsinformationen (werden direkt von den Zahlungsdienstleistern verarbeitet)</li>
              </ul>
              <p>
                Diese Daten werden ausschließlich zur Abwicklung des Kaufvertrags und zur Versandorganisation verwendet (Art. 6 Abs. 1 lit. b DSGVO).
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">3. Kontaktformular</h2>
              <p>
                Wenn Sie das Kontaktformular nutzen, werden die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse, Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten gebe ich nicht ohne Ihre Einwilligung weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">4. Drittanbieter und Auftragsverarbeiter</h2>

              <p className="font-medium text-text-primary">Vercel (Hosting)</p>
              <p>
                Diese Website wird auf Servern von Vercel Inc., 340 Pine Street, Suite 801, San Francisco, CA 94104, USA gehostet. Beim Besuch der Website werden automatisch IP-Adresse und technische Zugriffsdaten an Vercel übermittelt. Vercel ist zertifiziert nach dem EU-US Data Privacy Framework. Weitere Informationen: <a href="https://vercel.com/legal/privacy-policy" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">vercel.com/legal/privacy-policy</a>
              </p>

              <p className="font-medium text-text-primary mt-4">Supabase (Datenbank)</p>
              <p>
                Bestelldaten werden in einer Datenbank von Supabase Inc. gespeichert. Supabase verarbeitet Daten gemäß DSGVO mit Servern in der EU. Weitere Informationen: <a href="https://supabase.com/privacy" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">supabase.com/privacy</a>
              </p>

              <p className="font-medium text-text-primary mt-4">Stripe (Zahlungsabwicklung)</p>
              <p>
                Für Kartenzahlungen nutze ich Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin, D02 H210, Irland. Ihre Zahlungsdaten werden direkt und verschlüsselt an Stripe übermittelt. Ich habe zu keinem Zeitpunkt Zugriff auf vollständige Kartendaten. Weitere Informationen: <a href="https://stripe.com/de/privacy" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">stripe.com/de/privacy</a>
              </p>

              <p className="font-medium text-text-primary mt-4">PayPal</p>
              <p>
                Bei Zahlung per PayPal werden die für die Transaktion erforderlichen Daten an PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg übermittelt. Datenschutzerklärung: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">paypal.com/de/privacy</a>
              </p>

              <p className="font-medium text-text-primary mt-4">Klarna</p>
              <p>
                Bei Zahlung per Klarna werden Ihre Daten an Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm, Schweden übermittelt. Klarna kann eine Bonitätsprüfung durchführen. Datenschutzerklärung: <a href="https://www.klarna.com/de/datenschutz/" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">klarna.com/de/datenschutz</a>
              </p>

              <p className="font-medium text-text-primary mt-4">Resend (E-Mail-Versand)</p>
              <p>
                Für den Versand von Bestellbestätigungen nutze ich Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA. Dabei wird Ihre E-Mail-Adresse und Ihr Name übermittelt. Resend verarbeitet Daten gemäß DSGVO. Weitere Informationen: <a href="https://resend.com/legal/privacy-policy" className="text-accent hover:opacity-80 transition-opacity" target="_blank" rel="noopener noreferrer">resend.com/legal/privacy-policy</a>
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">5. Cookies</h2>
              <p>
                Diese Website verwendet nur technisch notwendige Cookies (z. B. zur Speicherung des Warenkorbs im Browser-Speicher). Es werden keine Tracking- oder Analyse-Cookies eingesetzt. Eine Einwilligung ist daher nicht erforderlich.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">6. Speicherdauer</h2>
              <p>
                Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist oder gesetzliche Aufbewahrungspflichten bestehen. Bestelldaten werden gemäß den handels- und steuerrechtlichen Aufbewahrungsfristen (bis zu 10 Jahre) gespeichert.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">7. Ihre Rechte (Art. 15–21 DSGVO)</h2>
              <p>Sie haben das Recht auf:</p>
              <ul className="list-disc pl-5 flex flex-col gap-1">
                <li><strong className="text-text-primary font-normal">Auskunft</strong> über die zu Ihrer Person gespeicherten Daten (Art. 15 DSGVO)</li>
                <li><strong className="text-text-primary font-normal">Berichtigung</strong> unrichtiger Daten (Art. 16 DSGVO)</li>
                <li><strong className="text-text-primary font-normal">Löschung</strong> Ihrer Daten (Art. 17 DSGVO)</li>
                <li><strong className="text-text-primary font-normal">Einschränkung</strong> der Verarbeitung (Art. 18 DSGVO)</li>
                <li><strong className="text-text-primary font-normal">Datenübertragbarkeit</strong> (Art. 20 DSGVO)</li>
                <li><strong className="text-text-primary font-normal">Widerspruch</strong> gegen die Verarbeitung (Art. 21 DSGVO)</li>
              </ul>
              <p>
                Zur Ausübung dieser Rechte wenden Sie sich bitte per E-Mail an: <a href="mailto:hello@esteriicreates.art" className="text-accent hover:opacity-80 transition-opacity">hello@esteriicreates.art</a>
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-text-primary text-[13px] tracking-[2px] uppercase font-normal">8. Beschwerderecht</h2>
              <p>
                Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Zuständig für Berlin ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin, <a href="mailto:mailbox@datenschutz-berlin.de" className="text-accent hover:opacity-80 transition-opacity">mailbox@datenschutz-berlin.de</a>.
              </p>
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
