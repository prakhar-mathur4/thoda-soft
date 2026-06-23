import Hero from '@/components/Hero';
import TrustBar from '@/components/TrustBar';
import ProductGrid from '@/components/ProductGrid';
import BrandStory from '@/components/BrandStory';

// Revalidated on demand via Shopify webhooks → /api/revalidate (tag: products).
export const revalidate = 3600;

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      {/* Server Component fetches live products */}
      <ProductGrid />
      <BrandStory />
    </>
  );
}
