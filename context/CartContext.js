import { useState, useEffect } from 'react';
import { CartContext } from './cartContextDef';

export default function CartProvider({ children }) {
  const [items, setItems]   = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) setItems(JSON.parse(saved));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(artwork) {
    setItems(prev => prev.some(i => i.id === artwork.id) ? prev : [...prev, artwork]);
    setIsOpen(true);
  }

  function removeItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const isInCart = (id) => items.some(i => i.id === id);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}
