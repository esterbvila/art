import '../styles/globals.css';
import { CartProvider } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      <Component {...pageProps} />
      <CartDrawer />
    </CartProvider>
  );
}
