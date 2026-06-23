import type { Metadata } from 'next';
import { searchProducts } from '@/lib/shopify';
import ShopGrid from '@/components/ShopGrid';

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}): Promise<Metadata> {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? '').trim();
  return {
    title: q ? `Search: ${q} — Thoda Soft` : 'Search — Thoda Soft',
    robots: { index: false },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = (rawQ ?? '').trim();
  const products = q ? await searchProducts(q, 24) : [];

  return (
    <div className="container-editorial py-12 sm:py-16">
      <header className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
          Search
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl">
          {q ? <>Results for &ldquo;{q}&rdquo;</> : 'Search'}
        </h1>
        {!q && (
          <p className="mt-4 text-sm text-charcoal-muted">
            Use the search icon in the header to find your piece.
          </p>
        )}
      </header>

      {q && products.length > 0 && <ShopGrid products={products} />}

      {q && products.length === 0 && (
        <p className="py-16 text-charcoal-muted">
          No pieces match &ldquo;{q}&rdquo;. Try a different word.
        </p>
      )}
    </div>
  );
}
