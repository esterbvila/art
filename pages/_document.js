import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect for Google Fonts performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Funnel Sans — the typeface used throughout the design */}
        <link
          href="https://fonts.googleapis.com/css2?family=Funnel+Sans:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#FAF8F5" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
