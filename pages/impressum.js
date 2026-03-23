import LegalPage from '../components/LegalPage';
import { impressumContent } from '../lib/legal/impressum';

export default function Impressum() {
  return (
    <LegalPage
      content={impressumContent}
      metaTitleDe="Impressum"
      metaTitleEn="Legal Notice"
    />
  );
}
