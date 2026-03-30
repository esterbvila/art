import Head from "next/head";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Head>
        <title>Page Not Found — Ester Batllori</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg-main px-5 text-center">
        <p className="font-sans text-[13px] text-text-tertiary uppercase tracking-[3px]">404</p>
        <h1
          className="font-normal font-sans text-text-primary leading-tight95"
          style={{
            fontSize: "clamp(32px, 5vw, 52px)",
            letterSpacing: "-1.5px",
          }}
        >
          Page not found.
        </h1>
        <p className="max-w-md font-sans text-[15px] text-text-secondary leading-[1.7]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/public"
          className="mt-4 inline-block bg-accent px-10 py-4 font-sans text-sm text-white transition-opacity hover:opacity-90"
        >
          Back to Gallery
        </Link>
      </div>
    </>
  );
}
