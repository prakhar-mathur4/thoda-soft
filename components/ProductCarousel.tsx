'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

/**
 * Mobile: horizontal snap-carousel with a small scroll-position slider below.
 * Desktop (sm+): 2-col grid (slider hidden — nothing to scroll).
 */
export default function ProductCarousel({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 100, left: 0 });

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const { scrollWidth, clientWidth, scrollLeft } = el;
    if (scrollWidth <= clientWidth + 1) {
      setThumb({ width: 100, left: 0 });
      return;
    }
    const width = (clientWidth / scrollWidth) * 100;
    const left = (scrollLeft / (scrollWidth - clientWidth)) * (100 - width);
    setThumb({ width, left });
  }, []);

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [update]);

  return (
    <div>
      <div
        ref={ref}
        onScroll={update}
        className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 sm:overflow-visible sm:px-0 sm:pb-0"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[80%] shrink-0 snap-start sm:min-w-0"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Scroll-position slider — mobile only */}
      <div className="mt-6 flex justify-center sm:hidden">
        <div className="relative h-1 w-28 rounded-full bg-charcoal/15">
          <div
            className="absolute top-0 h-full rounded-full bg-charcoal"
            style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
          />
        </div>
      </div>
    </div>
  );
}
