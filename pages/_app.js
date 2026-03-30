import { Funnel_Sans } from "next/font/google";
import CartDrawer from "../components/CartDrawer";
import CartProvider from "../context/CartContext";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
});

export default function App({ Component, pageProps }) {
  return (
    <main className={`${funnelSans.variable}`}>
      <CartProvider>
        <Component {...pageProps} />
        <CartDrawer />
      </CartProvider>
    </main>
  );
}
