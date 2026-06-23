import type { MetadataRoute } from 'next';
import { getAllProductHandles } from '@/lib/shopify';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths: { path: string; priority: number }[] = [
    { path: '', priority: 1 },
    { path: '/shop', priority: 0.9 },
    { path: '/lookbook', priority: 0.8 },
    { path: '/our-story', priority: 0.6 },
    { path: '/faq', priority: 0.5 },
    { path: '/size-guide', priority: 0.5 },
    { path: '/contact', priority: 0.5 },
    { path: '/shipping', priority: 0.3 },
    { path: '/returns', priority: 0.3 },
    { path: '/privacy-policy', priority: 0.3 },
    { path: '/terms', priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${SITE_URL}${p.path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: p.priority,
  }));

  let productEntries: MetadataRoute.Sitemap = [];
  try {
    const handles = await getAllProductHandles();
    productEntries = handles.map((handle) => ({
      url: `${SITE_URL}/products/${handle}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch {
    // If Shopify is unreachable, still return the static sitemap.
  }

  return [...staticEntries, ...productEntries];
}
