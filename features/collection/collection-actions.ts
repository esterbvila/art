import { getSupabase } from "@/lib/supabase";

export async function getCollections() {
  const supabase = await getSupabase();
  const { data: collectionsRaw, error } = await supabase
    .from("collections")
    .select("id, slug, name, tagline, cover_image_url, sort_order, artworks(id, price)")
    .eq("visible", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching collections:", error.message);
  }

  return (collectionsRaw ?? []).map(({ artworks, ...col }) => ({
    ...col,
    artwork_count: artworks?.length ?? 0,
    min_price: artworks?.length > 0 ? Math.min(...artworks.map(a => a.price)) : null,
  }));
}
