import { useContext } from "react";
import { CartContext } from "./card-provider";

export default function useCart() {
  return useContext(CartContext);
}
