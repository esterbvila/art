import '../styles/globals.css';

/**
 * Global App wrapper.
 * Imports global styles (Tailwind + Funnel Sans font + base resets).
 */
export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
