export const datenschutzContent = {
  de: {
    title: "Datenschutzerklärung",
    sections: [
      {
        heading: "1. Verantwortliche Person",
        body: (
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist:
            <br />
            <br />
            Ester Batllori I Vila
            <br />
            Riesestr. 11, 12347 Berlin
            <br />
            E-Mail:{" "}
            <a href="mailto:ester.batllori@gmail.com" className="text-accent transition-opacity hover:opacity-80">
              ester.batllori@gmail.com
            </a>
          </p>
        ),
      },
      {
        heading: "2. Erhebung und Verarbeitung personenbezogener Daten",
        body: (
          <>
            <p>
              Ich erhebe personenbezogene Daten nur, soweit dies zur Vertragserfüllung oder auf Grundlage Ihrer
              ausdrücklichen Einwilligung erforderlich ist. Die Rechtsgrundlagen ergeben sich aus Art. 6 DSGVO.
            </p>
            <p>Beim Kauf eines Kunstwerks verarbeite ich folgende Daten:</p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>Name und Vorname</li>
              <li>Lieferadresse</li>
              <li>E-Mail-Adresse</li>
              <li>Telefonnummer</li>
              <li>Zahlungsinformationen (werden direkt von den Zahlungsdienstleistern verarbeitet)</li>
            </ul>
            <p>
              Diese Daten werden ausschließlich zur Abwicklung des Kaufvertrags und zur Versandorganisation verwendet
              (Art. 6 Abs. 1 lit. b DSGVO).
            </p>
          </>
        ),
      },
      {
        heading: "3. Kontaktformular",
        body: (
          <p>
            Wenn Sie das Kontaktformular nutzen, werden die von Ihnen eingegebenen Daten (Name, E-Mail-Adresse,
            Nachricht) zur Bearbeitung Ihrer Anfrage gespeichert. Diese Daten gebe ich nicht ohne Ihre Einwilligung
            weiter. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (vertragsbezogene Anfragen) sowie Art. 6 Abs. 1 lit.
            f DSGVO (berechtigtes Interesse an der Beantwortung von Anfragen).
          </p>
        ),
      },
      {
        heading: "4. Drittanbieter und Auftragsverarbeiter",
        body: (
          <>
            <p className="font-medium text-text-primary">Vercel (Hosting)</p>
            <p>
              Diese Website wird auf Servern von Vercel Inc., 340 Pine Street, Suite 801, San Francisco, CA 94104, USA
              gehostet. Beim Besuch der Website werden automatisch IP-Adresse und technische Zugriffsdaten an Vercel
              übermittelt. Dabei können Daten in die USA übermittelt werden. Die Übermittlung erfolgt auf Grundlage des
              EU-US Data Privacy Frameworks, dem Vercel zertifiziert ist. Weitere Informationen:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com/legal/privacy-policy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Supabase (Datenbank)</p>
            <p>
              Bestelldaten werden in einer Datenbank von Supabase Inc. gespeichert. Supabase verarbeitet Daten gemäß
              DSGVO mit Servern in der EU. Weitere Informationen:{" "}
              <a
                href="https://supabase.com/privacy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                supabase.com/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Stripe (Zahlungsabwicklung)</p>
            <p>
              Für Kartenzahlungen nutze ich Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock,
              Dublin, D02 H210, Irland. Ihre Zahlungsdaten werden direkt und verschlüsselt an Stripe übermittelt. Ich
              habe zu keinem Zeitpunkt Zugriff auf vollständige Kartendaten. Weitere Informationen:{" "}
              <a
                href="https://stripe.com/de/privacy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                stripe.com/de/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">PayPal</p>
            <p>
              Bei Zahlung per PayPal werden die für die Transaktion erforderlichen Daten an PayPal (Europe) S.à r.l. et
              Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg übermittelt. Datenschutzerklärung:{" "}
              <a
                href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                paypal.com/de/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Klarna</p>
            <p>
              Bei Zahlung per Klarna werden Ihre Daten an Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm,
              Schweden übermittelt. Klarna kann eine Bonitätsprüfung durchführen. Datenschutzerklärung:{" "}
              <a
                href="https://www.klarna.com/de/datenschutz/"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                klarna.com/de/datenschutz
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Resend (E-Mail-Versand)</p>
            <p>
              Für den Versand von Bestellbestätigungen nutze ich Resend Inc., 2261 Market Street #5039, San Francisco,
              CA 94114, USA. Dabei wird Ihre E-Mail-Adresse und Ihr Name übermittelt. Resend verarbeitet Daten gemäß
              DSGVO. Weitere Informationen:{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                resend.com/legal/privacy-policy
              </a>
            </p>
          </>
        ),
      },
      {
        heading: "5. Cookies und lokaler Speicher",
        body: (
          <>
            <p>
              Diese Website verwendet ausschließlich technisch notwendige Speichermechanismen (z. B. Browser Local
              Storage), um die Funktionalität der Website sicherzustellen, etwa zur Speicherung des Warenkorbs. Es
              werden keine Tracking- oder Analysetechnologien eingesetzt.
            </p>
            <p>
              Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an der Bereitstellung einer
              funktionsfähigen Website).
            </p>
          </>
        ),
      },
      {
        heading: "6. Speicherdauer",
        body: (
          <p>
            Personenbezogene Daten werden nur so lange gespeichert, wie dies für die jeweiligen Zwecke erforderlich ist
            oder gesetzliche Aufbewahrungspflichten bestehen. Bestelldaten werden gemäß den handels- und
            steuerrechtlichen Aufbewahrungsfristen (bis zu 10 Jahre) gespeichert.
          </p>
        ),
      },
      {
        heading: "7. Ihre Rechte (Art. 15–21 DSGVO)",
        body: (
          <>
            <p>Sie haben das Recht auf:</p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>
                <strong className="font-normal text-text-primary">Auskunft</strong> über die zu Ihrer Person
                gespeicherten Daten (Art. 15 DSGVO)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Berichtigung</strong> unrichtiger Daten (Art. 16
                DSGVO)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Löschung</strong> Ihrer Daten (Art. 17 DSGVO)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Einschränkung</strong> der Verarbeitung (Art. 18
                DSGVO)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Datenübertragbarkeit</strong> (Art. 20 DSGVO)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Widerspruch</strong> gegen die Verarbeitung (Art. 21
                DSGVO)
              </li>
            </ul>
            <p>
              Zur Ausübung dieser Rechte wenden Sie sich bitte per E-Mail an:{" "}
              <a href="mailto:ester.batllori@gmail.com" className="text-accent transition-opacity hover:opacity-80">
                ester.batllori@gmail.com
              </a>
            </p>
          </>
        ),
      },
      {
        heading: "8. Beschwerderecht",
        body: (
          <p>
            Sie haben das Recht, sich bei der zuständigen Datenschutzaufsichtsbehörde zu beschweren. Zuständig für
            Berlin ist die Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969
            Berlin,{" "}
            <a href="mailto:mailbox@datenschutz-berlin.de" className="text-accent transition-opacity hover:opacity-80">
              mailbox@datenschutz-berlin.de
            </a>
            .
          </p>
        ),
      },
      {
        heading: "9. Datensicherheit",
        body: (
          <p>
            Diese Website verwendet aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie z.
            B. Bestellungen oder Anfragen, eine SSL-Verschlüsselung. Eine verschlüsselte Verbindung erkennen Sie daran,
            dass die Adresszeile des Browsers „https://" anzeigt.
          </p>
        ),
      },
      {
        heading: "10. Server-Logdateien",
        body: (
          <>
            <p>
              Beim Besuch dieser Website werden vom Hosting-Anbieter automatisch Informationen in sogenannten
              Server-Logdateien erfasst und gespeichert. Dies kann folgende Daten umfassen:
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>IP-Adresse</li>
              <li>Browsertyp und -version</li>
              <li>Betriebssystem</li>
              <li>Referrer-URL</li>
              <li>Uhrzeit der Serveranfrage</li>
            </ul>
            <p>
              Diese Daten werden nicht mit anderen Datenquellen zusammengeführt und dienen ausschließlich der
              technischen Stabilität und Sicherheit der Website.
            </p>
            <p>Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO.</p>
          </>
        ),
      },
      {
        body: <p className="text-[13px] text-text-tertiary">Stand: März 2026</p>,
      },
    ],
  },

  en: {
    title: "Privacy Policy",
    sections: [
      {
        heading: "1. Controller",
        body: (
          <p>
            The controller responsible for data processing on this website is:
            <br />
            <br />
            Ester Batllori I Vila
            <br />
            Riesestr. 11, 12347 Berlin
            <br />
            Email:{" "}
            <a href="mailto:ester.batllori@gmail.com" className="text-accent transition-opacity hover:opacity-80">
              ester.batllori@gmail.com
            </a>
          </p>
        ),
      },
      {
        heading: "2. Collection and processing of personal data",
        body: (
          <>
            <p>
              I only collect personal data to the extent necessary for the performance of a contract or on the basis of
              your explicit consent. The legal bases are set out in Art. 6 GDPR.
            </p>
            <p>When purchasing an artwork, I process the following data:</p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>First and last name</li>
              <li>Delivery address</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Payment information (processed directly by the payment service providers)</li>
            </ul>
            <p>
              This data is used solely for processing the purchase contract and organising delivery (Art. 6 (1)(b)
              GDPR).
            </p>
          </>
        ),
      },
      {
        heading: "3. Contact form",
        body: (
          <p>
            If you use the contact form, the data you enter (name, email address, message) will be stored to process
            your enquiry. I will not share this data without your consent. The legal basis is Art. 6 (1)(b) GDPR
            (contract-related enquiries) and Art. 6 (1)(f) GDPR (legitimate interest in responding to enquiries).
          </p>
        ),
      },
      {
        heading: "4. Third-party providers and processors",
        body: (
          <>
            <p className="font-medium text-text-primary">Vercel (Hosting)</p>
            <p>
              This website is hosted on servers operated by Vercel Inc., 340 Pine Street, Suite 801, San Francisco, CA
              94104, USA. When you visit the website, your IP address and technical access data are automatically
              transmitted to Vercel. Data may be transferred to servers in the United States. The transfer is based on
              the EU-US Data Privacy Framework, under which Vercel is certified. More information:{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                vercel.com/legal/privacy-policy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Supabase (Database)</p>
            <p>
              Order data is stored in a database operated by Supabase Inc. Supabase processes data in accordance with
              GDPR using servers in the EU. More information:{" "}
              <a
                href="https://supabase.com/privacy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                supabase.com/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Stripe (Payment processing)</p>
            <p>
              For card payments I use Stripe Payments Europe Ltd., 1 Grand Canal Street Lower, Grand Canal Dock, Dublin,
              D02 H210, Ireland. Your payment data is transmitted directly and encrypted to Stripe. I do not have access
              to full card details at any time. More information:{" "}
              <a
                href="https://stripe.com/privacy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                stripe.com/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">PayPal</p>
            <p>
              When paying via PayPal, the data required for the transaction is transmitted to PayPal (Europe) S.à r.l.
              et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg. Privacy policy:{" "}
              <a
                href="https://www.paypal.com/webapps/mpp/ua/privacy-full"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                paypal.com/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Klarna</p>
            <p>
              When paying via Klarna, your data is transmitted to Klarna Bank AB (publ), Sveavägen 46, 111 34 Stockholm,
              Sweden. Klarna may perform a credit check. Privacy policy:{" "}
              <a
                href="https://www.klarna.com/international/privacy-policy/"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                klarna.com/privacy
              </a>
            </p>

            <p className="mt-4 font-medium text-text-primary">Resend (Email delivery)</p>
            <p>
              For sending order confirmations I use Resend Inc., 2261 Market Street #5039, San Francisco, CA 94114, USA.
              Your email address and name are transmitted. Resend processes data in accordance with GDPR. More
              information:{" "}
              <a
                href="https://resend.com/legal/privacy-policy"
                className="text-accent transition-opacity hover:opacity-80"
                target="_blank"
                rel="noopener noreferrer"
              >
                resend.com/legal/privacy-policy
              </a>
            </p>
          </>
        ),
      },
      {
        heading: "5. Cookies and local storage",
        body: (
          <>
            <p>
              This website uses only technically necessary storage mechanisms (such as browser local storage) to ensure
              the functionality of the website, for example to store the shopping cart. No tracking or analytics
              technologies are used.
            </p>
            <p>
              These technologies are used on the basis of Art. 6 (1)(f) GDPR (legitimate interest in providing a
              functional website).
            </p>
          </>
        ),
      },
      {
        heading: "6. Data retention",
        body: (
          <p>
            Personal data is stored only for as long as necessary for the respective purposes or as required by
            statutory retention obligations. Order data is retained in accordance with commercial and tax law retention
            periods (up to 10 years).
          </p>
        ),
      },
      {
        heading: "7. Your rights (Art. 15–21 GDPR)",
        body: (
          <>
            <p>You have the right to:</p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>
                <strong className="font-normal text-text-primary">Access</strong> the personal data stored about you
                (Art. 15 GDPR)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Rectification</strong> of inaccurate data (Art. 16
                GDPR)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Erasure</strong> of your data (Art. 17 GDPR)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Restriction</strong> of processing (Art. 18 GDPR)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Data portability</strong> (Art. 20 GDPR)
              </li>
              <li>
                <strong className="font-normal text-text-primary">Object</strong> to processing (Art. 21 GDPR)
              </li>
            </ul>
            <p>
              To exercise these rights, please contact me by email:{" "}
              <a href="mailto:ester.batllori@gmail.com" className="text-accent transition-opacity hover:opacity-80">
                ester.batllori@gmail.com
              </a>
            </p>
          </>
        ),
      },
      {
        heading: "8. Right to lodge a complaint",
        body: (
          <p>
            You have the right to lodge a complaint with the competent data protection supervisory authority. For
            Berlin, this is the Berlin Commissioner for Data Protection and Freedom of Information, Friedrichstr. 219,
            10969 Berlin,{" "}
            <a href="mailto:mailbox@datenschutz-berlin.de" className="text-accent transition-opacity hover:opacity-80">
              mailbox@datenschutz-berlin.de
            </a>
            .
          </p>
        ),
      },
      {
        heading: "9. Data security",
        body: (
          <p>
            This website uses SSL encryption for security reasons and to protect the transmission of confidential
            content, such as orders or enquiries. You can recognise an encrypted connection by the "https://" in your
            browser's address bar.
          </p>
        ),
      },
      {
        heading: "10. Server log files",
        body: (
          <>
            <p>
              When you visit this website, the hosting provider automatically collects and stores information in
              so-called server log files. This may include:
            </p>
            <ul className="flex list-disc flex-col gap-1 pl-5">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Referrer URL</li>
              <li>Time of the server request</li>
            </ul>
            <p>
              This data is not merged with other data sources and is used to ensure the technical stability and security
              of the website.
            </p>
            <p>The legal basis is Art. 6 (1)(f) GDPR.</p>
          </>
        ),
      },
      {
        body: <p className="text-[13px] text-text-tertiary">Last updated: March 2026</p>,
      },
    ],
  },
};
