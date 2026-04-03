import { resolveFirstImage } from "@/lib/storage";
import { getSupabase } from "@/lib/supabase";

export async function getUniqueArtworks() {
  const supabase = await getSupabase();
  const { data: uniqueArtworksRaw } = await supabase
    .from("artworks")
    .select("id, title, medium, dimensions, price, image_url, stock, tagline, slug")
    .is("collection_id", null)
    .eq("visible", true)
    .order("stock", { ascending: false })
    .order("created_at", { ascending: false });

  return Promise.all(
    (uniqueArtworksRaw ?? []).map(async a => ({
      ...a,
      image_url: (await resolveFirstImage(a.image_url)) ?? a.image_url,
    })),
  );
}

export async function getFeaturedArtwork() {
  const supabase = await getSupabase();
  const { data: featuredRaw } = await supabase
    .from("artworks")
    .select("id, title, description, price, image_url, stock, slug, year, dimensions, medium")
    .eq("featured", true)
    .single();

  if (!featuredRaw) {
    return null;
  }

  return {
    ...featuredRaw,
    image_url: (await resolveFirstImage(featuredRaw.image_url)) ?? featuredRaw.image_url,
  };
}
