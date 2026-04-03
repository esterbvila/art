import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: string[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents: number) {
  const euros = cents / 100;
  return `${euros % 1 === 0 ? euros.toFixed(0) : euros.toFixed(2)}€`;
}
