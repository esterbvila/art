"use client";
import { createContext, useContext, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string | null;
  type: "original" | "print";
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  isInCart: (id: string) => boolean;
}

export const CartContext = createContext<CartContextValue | null>(null);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(items));
  }, [items]);

  function addItem(item: CartItem) {
    setItems(prev => {
      if (item.type === "print") {
        const existing = prev.find(i => i.id === item.id);
        if (existing) {
          return prev.map(i => (i.id === item.id ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) } : i));
        }
        return [...prev, item];
      }
      return prev.some(i => i.id === item.id) ? prev : [...prev, item];
    });
    setIsOpen(true);
  }

  function removeItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  const isInCart = (id: string) => items.some(i => i.id === id);

  return (
    <CartContext.Provider value={{ items, isOpen, setIsOpen, addItem, removeItem, clearCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
