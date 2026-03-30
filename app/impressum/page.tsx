import LegalPage from "../../components/LegalPage";
import { impressumContent } from "../../lib/legal/impressum";

export default function ImpressumPage() {
  return <LegalPage content={impressumContent} metaTitleDe="Impressum" metaTitleEn="Legal Notice" />;
}
