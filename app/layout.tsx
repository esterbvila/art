import { Funnel_Sans } from "next/font/google";
import React from "react";
import CartDrawer from "../features/cart/cart-drawer";
import CartProvider from "../features/cart/cart-provider";
import "./globals.css";
import Footer from "@/features/footer";
import Navigation from "@/features/navigation";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <main className={`${funnelSans.variable}`}>
          <CartProvider>
            <Navigation />
            <div className="flex min-h-screen flex-col bg-bg-main">{children}</div>
            <div className="h-px w-full bg-divider" />
            <Footer />
            <CartDrawer />
          </CartProvider>
        </main>
      </body>
    </html>
  );
}
