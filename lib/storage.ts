import "server-only";

import { createClient } from "@supabase/supabase-js";

const bucket = "artworks";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase Storage env vars. Expected NEXT_PUBLIC_SUPABASE_URL and a Supabase key.");
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

function normalizePath(path: string) {
  return path.trim().replace(/^\/+/, "").replace(/\/+$/, "");
}

function isFilePath(path: string) {
  return /\.[a-z0-9]+$/i.test(path.split("/").pop() ?? "");
}

function toPublicUrl(path: string) {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function resolveImages(imageUrl: string) {
  if (!imageUrl) {
    return [];
  }

  const path = normalizePath(imageUrl);

  if (isFilePath(path)) {
    return [toPublicUrl(path)];
  }

  const { data, error } = await supabase.storage.from(bucket).list(path, {
    limit: 100,
    sortBy: { column: "name", order: "asc" },
  });

  if (error) {
    console.error(`Failed to resolve storage path for ${imageUrl}:`, error.message);
    return [];
  }

  return data
    .filter(item => Boolean(item.name) && Boolean(item.id))
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    .map(item => toPublicUrl(`${path}/${item.name}`));
}

export async function resolveDisplayImage(imageUrl: string) {
  if (!imageUrl) {
    throw new Error("Missing image path.");
  }

  const images = await resolveImages(imageUrl);
  const image = images[0] ?? null;
  if (!image) {
    throw new Error(`Unable to resolve image path: ${imageUrl}`);
  }

  return image;
}
