import { supabase } from '../../lib/supabase';

const BASE_URL = 'https://esteriicreates.com';

export default async function handler(req, res) {
  const { data: artworks } = await supabase
    .from('artworks')
    .select('id, updated_at')
    .eq('visible', true);

  const { data: collections } = await supabase
    .from('collections')
    .select('slug, updated_at')
    .eq('visible', true);

  const staticPages = [
    { url: BASE_URL, priority: '1.0', changefreq: 'weekly' },
  ];

  const artworkPages = (artworks ?? []).map((a) => ({
    url: `${BASE_URL}/${a.id}`,
    lastmod: a.updated_at?.split('T')[0],
    priority: '0.8',
    changefreq: 'monthly',
  }));

  const collectionPages = (collections ?? []).map((c) => ({
    url: `${BASE_URL}/collections/${c.slug}`,
    lastmod: c.updated_at?.split('T')[0],
    priority: '0.7',
    changefreq: 'monthly',
  }));

  const allPages = [...staticPages, ...artworkPages, ...collectionPages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allPages.map((p) => `  <url>
    <loc>${p.url}</loc>
    ${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ''}
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
  res.status(200).send(xml);
}
