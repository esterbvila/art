import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Order Received — Ester Batllori",
  robots: { index: false, follow: false },
};

export default function Success() {
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-main px-5 text-center">
        <p className="font-sans text-[13px] text-text-tertiary uppercase tracking-wide3">Thank you for your order</p>
        <h1
          className="font-normal font-sans text-text-primary leading-tight95"
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-1.5px",
          }}
        >
          Your order has been received.
        </h1>
        <p className="max-w-2xl font-sans text-[15px] text-text-secondary leading-[1.7]">
          You will receive an email shortly confirming receipt of your order. I will review your order and contact you
          soon to arrange shipping for your painting.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block bg-accent px-10 py-4 font-sans text-sm text-white transition-opacity hover:opacity-90"
        >
          Back to Gallery
        </Link>
      </div>
    </>
  );
}
