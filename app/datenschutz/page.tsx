import LegalPage from "@/features/legal-page";
import { datenschutzContent } from "@/lib/legal/datenschutz";

export default function DataPrivacyPage() {
  return <LegalPage content={datenschutzContent} metaTitleDe="Datenschutzerklärung" metaTitleEn="Privacy Policy" />;
}
