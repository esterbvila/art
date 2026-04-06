import { eq } from "drizzle-orm";
import { getRLSDb } from "@/drizzle/client";
import { artworkSchema, collectionSchema } from "@/drizzle/schema";

const BASE_URL = "https://esteriicreates.com";

export async function GET() {
  const runTransaction = await getRLSDb();

  const { artworks, collections } = await runTransaction(async tx => {
    const artworks = await tx
      .select({ id: artworkSchema.id, createdAt: artworkSchema.createdAt })
      .from(artworkSchema)
      .where(eq(artworkSchema.visible, true));

    const collections = await tx
      .select({ slug: collectionSchema.slug, createdAt: collectionSchema.createdAt })
      .from(collectionSchema)
      .where(eq(collectionSchema.visible, true));

    return { artworks, collections };
  });

  const staticPages = [{ url: BASE_URL, lastmod: undefined, priority: "1.0", changefreq: "weekly" }];

  const artworkPages = artworks.map(a => ({
    url: `${BASE_URL}/${a.id}`,
    lastmod: a.createdAt?.split("T")[0],
    priority: "0.8",
    changefreq: "monthly",
  }));

  const collectionPages = collections.map(c => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastmod: c.createdAt?.split("T")[0],
    priority: "0.7",
    changefreq: "monthly",
  }));

  const allPages = [...staticPages, ...artworkPages, ...collectionPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages
  .map(
    p => `  <url>
    <loc>${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate",
    },
  });
}
