/**
 * AGB & Widerrufsrecht / Terms & Conditions and Right of Withdrawal — bilingual content.
 * Edit text here; the page renders it automatically.
 */

export const agbContent = {
  de: {
    title: 'AGB & Widerrufsrecht',
    sections: [
      {
        heading: '§ 1 Geltungsbereich',
        body: (
          <>
            <p>
              Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Kaufverträge, die über die
              Website esteriicreates.com zwischen Ester Batllori I Vila (nachfolgend „Verkäuferin") und
              Käuferinnen und Käufern (nachfolgend „Kund:innen") geschlossen werden.
            </p>
            <p>
              Maßgeblich ist die jeweils zum Zeitpunkt der Bestellung gültige Fassung der AGB.
            </p>
          </>
        ),
      },
      {
        heading: '§ 2 Vertragsschluss',
        body: (
          <>
            <p>
              Die Darstellung der Kunstwerke auf dieser Website stellt kein rechtlich bindendes Angebot,
              sondern eine Aufforderung zur Bestellung dar. Durch das Absenden einer Bestellung gibt
              der:die Kund:in ein verbindliches Kaufangebot ab.
            </p>
            <p>
              Der Kaufvertrag kommt nur zustande, wenn die Verkäuferin die Bestellung ausdrücklich per
              E-Mail bestätigt, oder spätestens mit dem Versand der Ware.
            </p>
            <p>
              Sollte ein bestelltes Produkt aus Gründen, die außerhalb des Einflussbereichs der
              Verkäuferin liegen, nicht verfügbar sein, behält sich die Verkäuferin das Recht vor, die
              Bestellung nicht anzunehmen. Der:die Kund:in wird unverzüglich informiert und bereits
              geleistete Zahlungen werden erstattet.
            </p>
          </>
        ),
      },
      {
        heading: '§ 3 Preise und Zahlung',
        body: (
          <>
            <p>
              Alle angegebenen Preise sind Gesamtpreise in Euro (€) und enthalten die gesetzliche
              Umsatzsteuer. Versandkosten sind im Preis enthalten.
            </p>
            <p>Folgende Zahlungsarten stehen zur Verfügung:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Kreditkarte / Debitkarte (über Stripe)</li>
              <li>PayPal</li>
              <li>Klarna (Ratenkauf / Kauf auf Rechnung)</li>
            </ul>
            <p>
              Die Zahlung wird zum Zeitpunkt der Bestellung fällig und sofort verarbeitet.
            </p>
          </>
        ),
      },
      {
        heading: '§ 3a Produktbeschreibung – Rahmung',
        body: (
          <p>
            Sofern nicht ausdrücklich anders angegeben, werden alle Gemälde ohne Rahmen verkauft. Rahmen,
            die auf Produktfotos zu sehen sind, dienen ausschließlich der Darstellung und sind nicht im
            Lieferumfang enthalten.
          </p>
        ),
      },
      {
        heading: '§ 4 Lieferung und Versand',
        body: (
          <>
            <p>Die Lieferung erfolgt weltweit. Die Versandkosten sind im Preis des Kunstwerks enthalten.</p>
            <p>
              Die Lieferzeit beträgt je nach Zielland und Größe der Bestellung zwischen 4 und 20
              Werktagen. Die genaue Lieferzeit wird im Einzelfall kommuniziert. Bei Verzögerungen
              informiere ich Sie per E-Mail.
            </p>
            <p>
              Alle Werke werden sorgfältig und sicher verpackt, um Transportschäden zu vermeiden. Die
              Originalwerke werden als Einzelstücke versendet.
            </p>
            <p>
              Bei Lieferungen außerhalb der EU können zusätzliche Zollgebühren oder Einfuhrsteuern
              anfallen, die von der Empfängerin oder dem Empfänger zu tragen sind.
            </p>
          </>
        ),
      },
      {
        heading: '§ 5 Eigentumsvorbehalt',
        body: (
          <p>Das gekaufte Kunstwerk bleibt bis zur vollständigen Bezahlung Eigentum der Verkäuferin.</p>
        ),
      },
      {
        heading: '§ 6 Mängelhaftung',
        body: (
          <p>
            Es gelten die gesetzlichen Gewährleistungsrechte. Bei einem Mangel haben Kund:innen das
            Recht auf Nacherfüllung, Minderung oder Rücktritt vom Vertrag. Natürliche Materialmerkmale
            (z. B. Farbvariationen, Pinselstruktur) sind kein Mangel, sondern Ausdruck des
            handwerklich-künstlerischen Charakters des Originals.
          </p>
        ),
      },
      {
        heading: '§ 7 Urheberrecht',
        body: (
          <p>
            Mit dem Kauf eines Kunstwerks erwirbt der:die Kund:in das Eigentum am physischen Werk,
            nicht jedoch das Urheberrecht oder Nutzungsrechte für gewerbliche Zwecke. Das Urheberrecht
            verbleibt bei der Künstlerin. Eine Reproduktion, Vervielfältigung oder kommerzielle Nutzung
            der abgebildeten Werke bedarf der ausdrücklichen schriftlichen Zustimmung.
          </p>
        ),
      },
      {
        heading: '§ 8 Anwendbares Recht',
        body: (
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts.
            Gerichtsstand ist Berlin, sofern der:die Kund:in Kaufmann:frau ist oder keinen allgemeinen
            Gerichtsstand in Deutschland hat.
          </p>
        ),
      },

      // ── Divider ──────────────────────────────────────────────────────────
      { divider: true },

      {
        heading: 'Widerrufsbelehrung',
        headingLarge: true,
      },
      {
        heading: 'Widerrufsrecht',
        body: (
          <>
            <p>
              Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu
              widerrufen.
            </p>
            <p>
              Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen
              benannter Dritter, der nicht der Beförderer ist, die Waren in Besitz genommen haben
              bzw. hat.
            </p>
            <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:</p>
            <p className="pl-4 border-l-2 border-divider">
              Ester Batllori I Vila<br />
              Riesestr. 11, 12347 Berlin<br />
              E-Mail:{' '}
              <a href="mailto:ester.batllori@gmail.com" className="text-accent hover:opacity-80 transition-opacity">
                ester.batllori@gmail.com
              </a>
            </p>
            <p>
              mittels einer eindeutigen Erklärung (z. B. ein per Post versandter Brief oder eine
              E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Sie können
              dafür das beigefügte Muster-Widerrufsformular verwenden, das jedoch nicht vorgeschrieben
              ist.
            </p>
            <p>
              Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung
              des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden.
            </p>
          </>
        ),
      },
      {
        heading: 'Folgen des Widerrufs',
        body: (
          <>
            <p>
              Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen
              erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag
              zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns
              eingegangen ist. Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie
              bei der ursprünglichen Transaktion eingesetzt haben.
            </p>
            <p>
              Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab
              dem Tag, an dem Sie uns über den Widerruf dieses Vertrags unterrichten, an uns
              zurückzusenden oder zu übergeben. Die Frist ist gewahrt, wenn Sie die Waren vor Ablauf
              der Frist von vierzehn Tagen absenden. Die Kosten der Rücksendung trägt der:die Kund:in.
            </p>
            <p>
              Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben
              oder bis Sie den Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je
              nachdem, welches der frühere Zeitpunkt ist.
            </p>
          </>
        ),
      },
      {
        heading: 'Ausschluss des Widerrufsrechts',
        body: (
          <p>
            Das Widerrufsrecht besteht nicht bei Waren, die nach Kundenspezifikation angefertigt
            werden oder eindeutig auf die persönlichen Bedürfnisse zugeschnitten sind (§ 312g Abs. 2
            Nr. 1 BGB).{' '}
            <strong className="text-text-primary font-normal">
              Für individuell angefertigte oder auf Bestellung erstellte Kunstwerke ist ein Widerruf
              daher ausgeschlossen.
            </strong>
          </p>
        ),
      },
      {
        heading: 'Muster-Widerrufsformular',
        body: (
          <>
            <p className="text-[13px] text-text-tertiary">
              (Wenn Sie den Vertrag widerrufen wollen, füllen Sie bitte dieses Formular aus und senden
              Sie es zurück.)
            </p>
            <div className="border border-divider p-5 text-[14px] leading-[1.8]">
              <p>
                An:<br />
                Ester Batllori I Vila, Riesestr. 11, 12347 Berlin<br />
                E-Mail: ester.batllori@gmail.com
              </p>
              <p className="mt-3">
                Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über
                den Kauf der folgenden Waren (*):
              </p>
              <p className="mt-3">Bestellt am (*) / erhalten am (*):</p>
              <p className="mt-3">Name des/der Verbraucher(s):</p>
              <p className="mt-3">Anschrift des/der Verbraucher(s):</p>
              <p className="mt-3">
                Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier):
              </p>
              <p className="mt-3">Datum:</p>
              <p className="mt-4 text-text-tertiary text-[12px]">(*) Unzutreffendes streichen.</p>
            </div>
          </>
        ),
      },
      {
        body: <p className="text-text-tertiary text-[13px]">Stand: März 2026</p>,
      },
    ],
  },

  en: {
    title: 'Terms & Conditions and Right of Withdrawal',
    sections: [
      {
        heading: '§ 1 Scope',
        body: (
          <>
            <p>
              These Terms and Conditions (T&Cs) apply to all purchase contracts concluded via the
              website esteriicreates.com between Ester Batllori I Vila (hereinafter "Seller") and
              buyers (hereinafter "Customers").
            </p>
            <p>
              The version of the T&Cs in force at the time of the order shall apply.
            </p>
          </>
        ),
      },
      {
        heading: '§ 2 Formation of contract',
        body: (
          <>
            <p>
              The display of artworks on this website does not constitute a legally binding offer, but
              an invitation to order. By submitting an order, the Customer makes a binding offer to
              purchase.
            </p>
            <p>
              The purchase contract is concluded only when the Seller explicitly accepts the order by
              email or at the latest upon dispatch of the goods.
            </p>
            <p>
              If a product ordered is not available for reasons beyond the Seller's control, the Seller
              reserves the right not to accept the order. The Customer will be informed immediately and
              any payments made will be refunded.
            </p>
          </>
        ),
      },
      {
        heading: '§ 3 Prices and payment',
        body: (
          <>
            <p>
              All prices stated are total prices in euros (€) and include the applicable VAT. Shipping
              costs are included in the price.
            </p>
            <p>The following payment methods are available:</p>
            <ul className="list-disc pl-5 flex flex-col gap-1">
              <li>Credit card / debit card (via Stripe)</li>
              <li>PayPal</li>
              <li>Klarna (instalment / invoice)</li>
            </ul>
            <p>Payment is due at the time of ordering and is processed immediately.</p>
          </>
        ),
      },
      {
        heading: '§ 3a Product description – Framing',
        body: (
          <p>
            Unless expressly stated otherwise, all paintings are sold unframed. Frames visible in
            product photographs are for illustrative purposes only and are not included in the delivery.
          </p>
        ),
      },
      {
        heading: '§ 4 Delivery and shipping',
        body: (
          <>
            <p>Delivery is available worldwide. Shipping costs are included in the price of the artwork.</p>
            <p>
              Delivery times range from 4 to 20 business days depending on the destination country
              and size of the order. The exact delivery time will be communicated individually. In
              the event of delays, I will notify you by email.
            </p>
            <p>
              All works are carefully and securely packaged to prevent damage in transit. Original
              artworks are shipped as individual pieces.
            </p>
            <p>
              For deliveries outside the EU, additional customs duties or import taxes may apply,
              which are the responsibility of the recipient.
            </p>
          </>
        ),
      },
      {
        heading: '§ 5 Retention of title',
        body: (
          <p>
            The purchased artwork remains the property of the Seller until payment has been received
            in full.
          </p>
        ),
      },
      {
        heading: '§ 6 Statutory warranty',
        body: (
          <p>
            The statutory warranty rights apply. In the event of a defect, Customers are entitled to
            remediation, a price reduction or withdrawal from the contract. Natural material
            characteristics (e.g. colour variations, brushwork texture) do not constitute a defect
            but are an expression of the handcrafted and artistic nature of the original work.
          </p>
        ),
      },
      {
        heading: '§ 7 Copyright',
        body: (
          <p>
            By purchasing an artwork, the Customer acquires ownership of the physical work but not
            the copyright or any rights to use the work for commercial purposes. Copyright remains
            with the artist. Reproduction, duplication or commercial use of the depicted works
            requires express written consent.
          </p>
        ),
      },
      {
        heading: '§ 8 Applicable law',
        body: (
          <p>
            The law of the Federal Republic of Germany applies, excluding the UN Convention on
            Contracts for the International Sale of Goods. The place of jurisdiction is Berlin,
            provided that the Customer is a merchant or has no general place of jurisdiction in
            Germany.
          </p>
        ),
      },

      // ── Divider ──────────────────────────────────────────────────────────
      { divider: true },

      {
        heading: 'Right of Withdrawal Notice',
        headingLarge: true,
      },
      {
        heading: 'Right of withdrawal',
        body: (
          <>
            <p>
              You have the right to withdraw from this contract within fourteen days without giving
              any reason.
            </p>
            <p>
              The withdrawal period is fourteen days from the day on which you, or a third party
              designated by you other than the carrier, took possession of the goods.
            </p>
            <p>To exercise your right of withdrawal, you must notify us:</p>
            <p className="pl-4 border-l-2 border-divider">
              Ester Batllori I Vila<br />
              Riesestr. 11, 12347 Berlin<br />
              Email:{' '}
              <a href="mailto:ester.batllori@gmail.com" className="text-accent hover:opacity-80 transition-opacity">
                ester.batllori@gmail.com
              </a>
            </p>
            <p>
              by means of a clear declaration (e.g. a letter sent by post or an email) of your
              decision to withdraw from this contract. You may use the model withdrawal form below,
              although this is not mandatory.
            </p>
            <p>
              To meet the withdrawal deadline, it is sufficient that you send your communication
              concerning your exercise of the right of withdrawal before the withdrawal period has
              expired.
            </p>
          </>
        ),
      },
      {
        heading: 'Consequences of withdrawal',
        body: (
          <>
            <p>
              If you withdraw from this contract, we will reimburse all payments received from you,
              without undue delay and no later than fourteen days from the day on which we receive
              notification of your withdrawal. We will use the same means of payment as you used for
              the initial transaction.
            </p>
            <p>
              You must return the goods without undue delay and in any event no later than fourteen
              days from the day on which you notify us of the withdrawal. The deadline is met if you
              send back the goods before the fourteen-day period has expired. The cost of returning
              the goods is borne by the Customer.
            </p>
            <p>
              We may withhold reimbursement until we have received the goods back, or until you have
              provided evidence that you have returned the goods, whichever is the earlier.
            </p>
          </>
        ),
      },
      {
        heading: 'Exclusion of the right of withdrawal',
        body: (
          <p>
            The right of withdrawal does not apply to goods made to the Customer's specifications or
            clearly personalised (§ 312g (2) no. 1 BGB).{' '}
            <strong className="text-text-primary font-normal">
              The right of withdrawal is therefore excluded for individually made or commissioned
              artworks.
            </strong>
          </p>
        ),
      },
      {
        heading: 'Model withdrawal form',
        body: (
          <>
            <p className="text-[13px] text-text-tertiary">
              (If you wish to withdraw from the contract, please complete and return this form.)
            </p>
            <div className="border border-divider p-5 text-[14px] leading-[1.8]">
              <p>
                To:<br />
                Ester Batllori I Vila, Riesestr. 11, 12347 Berlin<br />
                Email: ester.batllori@gmail.com
              </p>
              <p className="mt-3">
                I/We (*) hereby give notice that I/we (*) withdraw from my/our (*) contract of sale
                for the following goods (*):
              </p>
              <p className="mt-3">Ordered on (*) / received on (*):</p>
              <p className="mt-3">Name of consumer(s):</p>
              <p className="mt-3">Address of consumer(s):</p>
              <p className="mt-3">
                Signature of consumer(s) (only if this form is notified on paper):
              </p>
              <p className="mt-3">Date:</p>
              <p className="mt-4 text-text-tertiary text-[12px]">(*) Delete as appropriate.</p>
            </div>
          </>
        ),
      },
      {
        body: <p className="text-text-tertiary text-[13px]">Last updated: March 2026</p>,
      },
    ],
  },
};
