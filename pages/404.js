import Head from 'next/head';
import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — Ester Batllori</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="bg-bg-main min-h-screen flex flex-col items-center justify-center px-5 text-center gap-6">
        <p className="text-text-tertiary font-sans text-[13px] tracking-[3px] uppercase">
          404
        </p>
        <h1
          className="font-sans font-normal text-text-primary leading-tight95"
          style={{ fontSize: 'clamp(32px, 5vw, 52px)', letterSpacing: '-1.5px' }}
        >
          Page not found.
        </h1>
        <p className="text-text-secondary font-sans text-[15px] leading-[1.7] max-w-md">
          The page you're looking for doesn't exist or has been moved.
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
