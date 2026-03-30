import { Funnel_Sans } from "next/font/google";
import React from "react";
import CartDrawer from "../components/CartDrawer";
import CartProvider from "../context/CartContext";
import "./globals.css";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <main className={`${funnelSans.variable}`}>
          <CartProvider>
            {children}
            <CartDrawer />
          </CartProvider>
        </main>
      </body>
    </html>
  );
}
