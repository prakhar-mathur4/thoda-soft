'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useQuickView } from './quickview-context';
import Reveal from './Reveal';

function formatPrice(amount: string, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(Number(amount));
  } catch {
    return `${currency} ${Number(amount).toFixed(0)}`;
  }
}

export default function Lookbook({ products }: { products: Product[] }) {
  const { open: openQuickView } = useQuickView();
  const heroImage = products[0]?.featuredImage?.url ?? '/images/hero_banner.png';

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[78svh] min-h-[480px] w-full overflow-hidden">
        <Image
          src={heroImage}
          alt="Thoda Soft — the debut capsule lookbook"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/25" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
          <p className="mb-3 text-xs uppercase tracking-[0.3em]">The Debut Capsule</p>
          <h1 className="font-serif text-5xl leading-tight drop-shadow-sm sm:text-6xl">
            Lookbook
          </h1>
          <p className="mt-4 max-w-xl text-pretty text-sm text-white/90 sm:text-base">
            Soft-aesthetic dressing for slow mornings and golden hours — styled
            for real life.
          </p>
        </div>
      </section>

      {/* Looks — alternating editorial blocks */}
      {products.map((product, i) => {
        const reverse = i % 2 === 1;
        const img = product.featuredImage;
        return (
          <section
            key={product.id}
            className="grid grid-cols-1 items-stretch md:grid-cols-2"
          >
            <div
              className={`relative aspect-[4/5] w-full md:aspect-auto md:min-h-[620px] ${
                reverse ? 'md:order-2' : ''
              }`}
            >
              {img?.url && (
                <Image
                  src={img.url}
                  alt={img.altText ?? product.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              )}
            </div>

            <Reveal
              className={`flex items-center justify-center px-6 py-16 sm:px-12 md:px-16 ${
                reverse ? 'md:order-1' : ''
              }`}
            >
              <div className="max-w-sm">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
                  Look {String(i + 1).padStart(2, '0')}
                </p>
                <h2 className="font-serif text-3xl uppercase leading-tight tracking-[0.02em] sm:text-4xl">
                  {product.title}
                </h2>
                {product.description && (
                  <p className="mt-4 text-pretty text-sm leading-relaxed text-charcoal/75">
                    {product.description}
                  </p>
                )}
                <p className="mt-4 text-lg text-charcoal">
                  {formatPrice(
                    product.priceRange.minVariantPrice.amount,
                    product.priceRange.minVariantPrice.currencyCode,
                  )}
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-5">
                  <button
                    type="button"
                    onClick={() => openQuickView(product)}
                    className="btn-primary"
                  >
                    Shop This Look
                  </button>
                  <Link
                    href={`/products/${product.handle}`}
                    className="text-xs uppercase tracking-[0.14em] text-charcoal underline underline-offset-4 transition hover:opacity-70"
                  >
                    View details
                  </Link>
                </div>
              </div>
            </Reveal>
          </section>
        );
      })}

      {/* Closing CTA */}
      <section className="container-editorial py-20 text-center sm:py-28">
        <h2 className="font-serif text-3xl sm:text-4xl">Shop the full capsule</h2>
        <p className="mx-auto mt-4 max-w-md text-sm text-charcoal-muted">
          Limited pieces, endlessly wearable — made to be lived in.
        </p>
        <Link href="/shop" className="btn-primary mt-8">
          Explore All
        </Link>
      </section>
    </div>
  );
}
