import Head from 'next/head';
import Link from 'next/link';

/**
 * Post-purchase success page.
 * Stripe redirects here after a completed Checkout session.
 */
export default function Success() {
  return (
    <>
      <Head>
        <title>Order Received — Ester Batllori</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center px-5 text-center gap-6">
        <p className="text-text-tertiary font-sans text-[13px] tracking-[3px] uppercase">
          Thank you for your order
        </p>
        <h1
          className="font-sans font-normal text-text-primary leading-tight95"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px' }}
        >
          Your order has been received.
        </h1>
        <p className="text-text-secondary font-sans text-[15px] leading-[1.7] max-w-2xl">
          You will receive an email shortly confirming receipt of your order. I will review your order and contact you soon to arrange shipping for your original painting.
        </p>
        <Link
          href="/"
          className="mt-4 inline-block bg-accent text-white font-sans text-sm px-10 py-4 hover:opacity-90 transition-opacity"
        >
          Back to Gallery
        </Link>
      </div>
    </>
  );
}
