import { createAdminClient } from './supabase';

const BUCKET = 'artworks';

/**
 * Given an image_url value, returns an array of resolved public URLs.
 * - If it already starts with http or /, returns it wrapped in an array.
 * - Otherwise treats it as a Storage folder name and lists all files inside.
 */
export async function resolveImages(imageUrl) {
  if (!imageUrl) return [];
  if (imageUrl.startsWith('http') || imageUrl.startsWith('/')) {
    return [imageUrl];
  }
  const admin = createAdminClient();
  const { data: files, error } = await admin.storage.from(BUCKET).list(imageUrl);
  if (error) console.error(`[storage] failed to list folder "${imageUrl}":`, error.message);
  if (!files || files.length === 0) return [];
  return files
    .filter(f => f.name !== '.emptyFolderPlaceholder')
    .map(f => {
      const { data } = admin.storage.from(BUCKET).getPublicUrl(`${imageUrl}/${f.name}`);
      return data.publicUrl;
    });
}

/**
 * Returns only the first resolved image URL (for cards, featured sections, etc.)
 */
export async function resolveFirstImage(imageUrl) {
  const images = await resolveImages(imageUrl);
  return images[0] ?? null;
}
