'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

/**
 * Mobile: horizontal snap-carousel with pagination dots below.
 * Desktop (sm+): 2-col grid (dots hidden — nothing to scroll).
 */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    let best = 0;
    let bestDist = Infinity;
    Array.from(el.children).forEach((c, i) => {
      const d = Math.abs((c as HTMLElement).offsetLeft - pad - el.scrollLeft);
      if (d < bestDist) {
        bestDist = d;
        best = i;
      }
    });
    setActive(best);
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  const goTo = (i: number) => {
    const el = ref.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (!child) return;
    const pad = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    el.scrollTo({ left: child.offsetLeft - pad, behavior: 'smooth' });
  };

  return (
    <div>
      <div
        ref={ref}
        onScroll={update}
        className="-mr-5 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mr-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:pr-0 sm:pb-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-[80%] shrink-0 snap-start sm:w-full"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Pagination dots — mobile only */}
      {products.length > 1 && (
        <div className="mt-6 flex justify-center gap-2 sm:hidden">
          {products.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to item ${i + 1}`}
              aria-current={i === active}
              className={`h-1.5 rounded-full transition-all duration-300 ease-soft ${
                i === active ? 'w-5 bg-charcoal' : 'w-1.5 bg-charcoal/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
