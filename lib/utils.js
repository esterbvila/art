import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind class names safely, resolving conflicts.
 * Follows the shadcn/ui convention.
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a price in euro cents to a display string, e.g. 36000 → "360€"
 */
export function formatPrice(cents) {
  const euros = cents / 100;
  return `${euros % 1 === 0 ? euros.toFixed(0) : euros.toFixed(2)}€`;
}

/**
 * Converts a painting title to a URL-friendly slug.
 */
export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
