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
 * Inserts Cloudinary transformation parameters into a secure_url.
 * e.g. cloudinaryUrl(src, 'q_auto:best,w_1300')
 * Passes non-Cloudinary URLs through unchanged.
 */
export function cloudinaryUrl(src, transforms) {
  if (!src || !src.includes('res.cloudinary.com')) return src;
  return src.replace('/image/upload/', `/image/upload/${transforms}/`);
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
