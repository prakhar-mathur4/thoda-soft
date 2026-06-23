import type { Metadata } from 'next';
import { getCollectionProducts } from '@/lib/shopify';
import ShopGrid from '@/components/ShopGrid';
import Reveal from '@/components/Reveal';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Shop Dresses — Thoda Soft',
  description:
    'The Thoda Soft capsule of soft-aesthetic dresses — premium cotton, inclusive sizing, designed in India.',
  alternates: { canonical: '/shop' },
};

export default async function ShopPage() {
  // Empty query = all published products. Bump the count for a full listing.
  const products = await getCollectionProducts('', 24);

  return (
    <div className="container-editorial py-12 sm:py-16">
      <Reveal as="header" className="mb-10 max-w-2xl">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
          Collection
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">Dresses</h1>
        <p className="mt-4 text-pretty text-sm leading-relaxed text-charcoal/75 sm:text-base">
          Our capsule of soft-aesthetic dresses — floaty midis, weightless slips,
          and adjustable wraps, crafted in premium, breathable cotton with
          inclusive sizing from S–XXL.
        </p>
      </Reveal>

      <ShopGrid products={products} />
    </div>
  );
}
