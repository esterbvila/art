import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(cents) {
  const euros = cents / 100;
  return `${euros % 1 === 0 ? euros.toFixed(0) : euros.toFixed(2)}€`;
}

export function cloudinaryUrl(src, transforms) {
  if (!src || !src.includes("res.cloudinary.com")) {
    return src;
  }
  return src.replace("/image/upload/", `/image/upload/${transforms}/`);
}

export function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
