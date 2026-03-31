import LegalPage from "../../components/legal-page";
import { impressumContent } from "../../lib/legal/impressum";

export default function ImpressumPage() {
  return <LegalPage content={impressumContent} metaTitleDe="Impressum" metaTitleEn="Legal Notice" />;
}
