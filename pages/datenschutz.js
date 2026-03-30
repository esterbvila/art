import LegalPage from "../components/LegalPage";
import { datenschutzContent } from "../lib/legal/datenschutz";

export default function Datenschutz() {
	return (
		<LegalPage
			content={datenschutzContent}
			metaTitleDe="Datenschutzerklärung"
			metaTitleEn="Privacy Policy"
		/>
	);
}
