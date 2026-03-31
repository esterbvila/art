import LegalPage from "../../components/legal-page";
import { agbContent } from "../../lib/legal/agb";

export default function AGBPage() {
  return (
    <LegalPage content={agbContent} metaTitleDe="AGB & Widerrufsrecht" metaTitleEn="Terms & Right of Withdrawal" />
  );
}
