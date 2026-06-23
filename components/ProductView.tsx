'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@shopify/hydrogen-react';
import type { ProductDetail } from '@/lib/types';
import { useCartUI } from './cart-ui-context';
import Reveal from './Reveal';
import SizeGuideModal from './SizeGuideModal';
import { sanitizeHtml } from '@/lib/sanitize';

function formatPrice(amount: string, currencyCode: string) {
  const value = Number(amount);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currencyCode} ${value.toFixed(0)}`;
  }
}

function Accordion({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group border-b border-charcoal/15 py-4"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between text-sm uppercase tracking-[0.12em] text-charcoal marker:hidden">
        {title}
        <span className="ml-4 text-lg leading-none text-charcoal-muted transition-transform duration-300 ease-soft group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="prose-editorial mt-3 text-sm leading-relaxed text-charcoal/75 [&_p]:mb-3">
        {children}
      </div>
    </details>
  );
}

export default function ProductView({ product }: { product: ProductDetail }) {
  const { linesAdd, status } = useCart();
  const { open } = useCartUI();

  const initialVariant =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];

  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    initialVariant?.selectedOptions.forEach((o) => {
      map[o.name] = o.value;
    });
    return map;
  });
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const sizeOption = product.options[0] ?? null;

  const variantByValue = (value: string) =>
    product.variants.find((v) =>
      v.selectedOptions.some(
        (o) => o.name === sizeOption?.name && o.value === value,
      ),
    );

  const selectedVariant = useMemo(() => {
    if (product.options.length === 0) return product.variants[0];
    return product.variants.find((v) =>
      v.selectedOptions.every((o) => selected[o.name] === o.value),
    );
  }, [product, selected]);

  const price = selectedVariant
    ? formatPrice(selectedVariant.price.amount, selectedVariant.price.currencyCode)
    : formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      );

  const canAdd = Boolean(selectedVariant?.availableForSale);
  const images = product.images.length
    ? product.images
    : selectedVariant?.image
      ? [selectedVariant.image]
      : [];

  const handleAdd = () => {
    if (!selectedVariant?.id || !canAdd) return;
    linesAdd([{ merchandiseId: selectedVariant.id, quantity: 1 }]);
    setAdded(true);
    open();
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="container-editorial pb-24 pt-8 sm:pt-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-xs tracking-wide text-charcoal-muted">
        <Link href="/" className="transition hover:text-charcoal">
          Home
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-[1.15fr_0.85fr] md:gap-16">
        {/* Gallery — large stacked images that scroll */}
        <Reveal stagger className="grid grid-cols-1 gap-3 sm:gap-4">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={img.url}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl bg-blush"
              >
                <Image
                  src={img.url}
                  alt={img.altText ?? `${product.title} — view ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 768px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            ))
          ) : (
            <div className="aspect-[4/5] w-full rounded-3xl bg-blush" />
          )}
        </Reveal>

        {/* Info — sticky on desktop */}
        <div className="md:sticky md:top-24 md:self-start">
          <Reveal>
          <p className="mb-3 text-xs uppercase tracking-[0.25em] text-charcoal-muted">
            The Debut Capsule
          </p>
          <h1 className="font-serif text-3xl uppercase leading-tight tracking-[0.02em] sm:text-4xl">
            {product.title}
          </h1>
          <p className="mt-4 text-lg text-charcoal">{price}</p>
          <p className="mt-2 text-xs uppercase tracking-[0.12em] text-sage-deep">
            Free shipping on all orders
          </p>

          {/* Size selector */}
          {sizeOption && sizeOption.values.length > 0 && (
            <fieldset className="mt-8">
              <legend className="mb-3 flex w-full items-center justify-between text-xs uppercase tracking-[0.12em] text-charcoal">
                <span className="flex items-center gap-2">
                  {sizeOption.name}
                  {selectedVariant && !canAdd && (
                    <span className="normal-case tracking-normal text-charcoal-muted">
                      · Sold out
                    </span>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="normal-case tracking-normal text-charcoal-muted underline underline-offset-2 transition hover:text-charcoal"
                >
                  Size chart
                </button>
              </legend>
              <div className="flex flex-wrap gap-2">
                {sizeOption.values.map((value) => {
                  const variant = variantByValue(value);
                  const soldOut = !variant?.availableForSale;
                  const isSelected = selected[sizeOption.name] === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        setSelected((s) => ({ ...s, [sizeOption.name]: value }))
                      }
                      aria-pressed={isSelected}
                      className={`min-w-12 rounded-full border px-4 py-2.5 text-sm uppercase tracking-wide transition ease-soft ${
                        isSelected
                          ? 'border-charcoal bg-charcoal text-cream'
                          : 'border-charcoal/25 text-charcoal hover:border-charcoal'
                      } ${
                        soldOut
                          ? 'cursor-not-allowed text-charcoal/30 line-through hover:border-charcoal/25'
                          : ''
                      }`}
                    >
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          )}

          {/* Add to cart */}
          <button
            type="button"
            onClick={handleAdd}
            disabled={!canAdd || status === 'updating'}
            className="mt-8 w-full bg-charcoal py-4 text-xs uppercase tracking-[0.2em] text-cream transition duration-300 ease-soft hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {!canAdd
              ? 'Sold Out'
              : added
                ? 'Added to Cart ✓'
                : status === 'updating'
                  ? 'Adding…'
                  : 'Add to Cart'}
          </button>

          {/* Accordions */}
          <div className="mt-10">
            {product.descriptionHtml && (
              <Accordion title="Details" defaultOpen>
                <div
                  dangerouslySetInnerHTML={{
                    __html: sanitizeHtml(product.descriptionHtml),
                  }}
                />
              </Accordion>
            )}
            <Accordion title="Size & Fit">
              <p>
                True to size with a relaxed, feminine drape. Inclusive sizing
                from S–XXL. Between sizes? Size down for a closer fit, up for
                extra ease.
              </p>
            </Accordion>
            <Accordion title="Materials & Care">
              <p>
                Premium ultra-soft cotton. Machine wash cold on a gentle cycle,
                line dry, warm iron if needed.
              </p>
            </Accordion>
            <Accordion title="Shipping & Returns">
              <p>
                Free shipping on all orders. 7-day size exchanges. Secure
                checkout, every time.
              </p>
            </Accordion>
          </div>
          </Reveal>
        </div>
      </div>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
