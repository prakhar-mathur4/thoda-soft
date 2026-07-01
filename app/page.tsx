import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';
import { getHeroImages } from '@/lib/shopify';

// Revalidated on demand via Shopify webhooks → /api/revalidate (tag: products).
export const revalidate = 3600;

export default async function HomePage() {
  // Hero art comes from Shopify products tagged `hero` (falls back to the
  // bundled stills inside <Hero /> when nothing is tagged).
  const hero = await getHeroImages();

  return (
    <>
      <Hero primaryImage={hero.primary} secondaryImage={hero.secondary} />
      <TrustBar />
      {/* Server Component fetches live products */}
      <ProductGrid />
      <BrandStory />
    </>
  );
}
