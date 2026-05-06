import { Funnel_Sans, Sora } from "next/font/google";
import React from "react";
import CartDrawer from "../features/cart/cart-drawer";
import CartProvider from "../features/cart/cart-provider";
import "./globals.css";
import AnnouncementBanner from "@/features/announcement-banner";
import Footer from "@/features/footer";
import Navigation from "@/features/navigation";

const funnelSans = Funnel_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <main className={`${funnelSans.variable} ${sora.variable}`}>
          <CartProvider>
            <AnnouncementBanner />
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
