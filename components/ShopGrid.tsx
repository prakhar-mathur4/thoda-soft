'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';
import Reveal from './Reveal';

const SORTS = [
  { key: 'featured', label: 'Featured' },
  { key: 'price-asc', label: 'Price: Low to High' },
  { key: 'price-desc', label: 'Price: High to Low' },
  { key: 'title', label: 'Alphabetical' },
] as const;

type SortKey = (typeof SORTS)[number]['key'];

export default function ShopGrid({ products }: { products: Product[] }) {
  const [sort, setSort] = useState<SortKey>('featured');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sizes, setSizes] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Union of all size values across the catalogue.
  const allSizes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) =>
      p.options.forEach((o) => {
        if (/size/i.test(o.name)) o.values.forEach((v) => set.add(v));
      }),
    );
    return Array.from(set);
  }, [products]);

  const toggleSize = (v: string) =>
    setSizes((cur) => (cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]));

  const view = useMemo(() => {
    let list = products.slice();

    if (inStockOnly) {
      list = list.filter(
        (p) => p.variants.some((v) => v.availableForSale) || p.defaultVariantId,
      );
    }
    if (sizes.length) {
      list = list.filter((p) =>
        p.options.some(
          (o) => /size/i.test(o.name) && o.values.some((v) => sizes.includes(v)),
        ),
      );
    }

    const price = (p: Product) => Number(p.priceRange.minVariantPrice.amount);
    if (sort === 'price-asc') list.sort((a, b) => price(a) - price(b));
    else if (sort === 'price-desc') list.sort((a, b) => price(b) - price(a));
    else if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));

    return list;
  }, [products, inStockOnly, sizes, sort]);

  const hasActiveFilters = sizes.length > 0 || inStockOnly;

  return (
    <>
      {/* Filter & sort bar */}
      <div className="flex items-center justify-between border-y border-charcoal/15 py-3">
        <p className="text-sm text-charcoal-muted">
          {view.length} {view.length === 1 ? 'piece' : 'pieces'}
        </p>
        <div className="flex items-center gap-5">
          {allSizes.length > 0 && (
            <button
              type="button"
              onClick={() => setFiltersOpen((o) => !o)}
              aria-expanded={filtersOpen}
              className="text-xs uppercase tracking-[0.12em] text-charcoal transition hover:opacity-70"
            >
              Filter{hasActiveFilters ? ` (${sizes.length + (inStockOnly ? 1 : 0)})` : ''}
            </button>
          )}
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.12em]">
            <span className="text-charcoal-muted">Sort</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="border-0 bg-transparent pr-1 text-charcoal focus:outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && allSizes.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4 border-b border-charcoal/15 py-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-1 text-xs uppercase tracking-[0.12em] text-charcoal-muted">
              Size
            </span>
            {allSizes.map((v) => {
              const active = sizes.includes(v);
              return (
                <button
                  key={v}
                  type="button"
                  onClick={() => toggleSize(v)}
                  aria-pressed={active}
                  className={`min-w-10 border px-3 py-1.5 text-sm uppercase transition ${
                    active
                      ? 'border-charcoal bg-charcoal text-cream'
                      : 'border-charcoal/25 text-charcoal hover:border-charcoal'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-charcoal">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="h-4 w-4 accent-charcoal"
            />
            In stock only
          </label>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setSizes([]);
                setInStockOnly(false);
              }}
              className="text-sm text-charcoal-muted underline-offset-2 transition hover:text-charcoal hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {view.length > 0 ? (
        <Reveal
          stagger
          className="grid grid-cols-2 gap-x-5 gap-y-12 pt-10 lg:grid-cols-3 lg:gap-x-7"
        >
          {view.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Reveal>
      ) : (
        <p className="py-24 text-center text-charcoal-muted">
          No pieces match your filters.
        </p>
      )}
    </>
  );
}
