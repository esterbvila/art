import { useContext } from 'react';
import { CartContext } from './cartContextDef';

export default function useCart() {
  return useContext(CartContext);
}
