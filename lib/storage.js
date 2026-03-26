import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Given an image_url value, returns an array of resolved public URLs.
 * - If it already starts with http or /, returns it wrapped in an array.
 * - Otherwise treats it as a Cloudinary folder path and lists all images inside.
 */
export async function resolveImages(imageUrl) {
  if (!imageUrl) return [];
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) return [imageUrl];

  const folder = imageUrl.startsWith('artworks/') ? imageUrl : `artworks/${imageUrl}`;
  const { resources } = await cloudinary.api.resources_by_asset_folder(folder, {
    resource_type: 'image',
    max_results: 20,
  });
  return resources
    .sort((a, b) => a.public_id.localeCompare(b.public_id))
    .map(r => r.secure_url);
}

/**
 * Returns only the first resolved image URL (for cards, featured sections, etc.)
 */
export async function resolveFirstImage(imageUrl) {
  const images = await resolveImages(imageUrl);
  return images[0] ?? null;
}

