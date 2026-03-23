import LegalPage from '../components/LegalPage';
import { agbContent } from '../lib/legal/agb';

export default function AGB() {
  return (
    <LegalPage
      content={agbContent}
      metaTitleDe="AGB & Widerrufsrecht"
      metaTitleEn="Terms & Right of Withdrawal"
    />
  );
}
