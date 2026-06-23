'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@shopify/hydrogen-react';
import type { Product } from '@/lib/types';
import { useCartUI } from './cart-ui-context';
import { useQuickView } from './quickview-context';
import { EyeIcon, BagIcon, CloseIcon } from './icons';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

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

export default function ProductCard({ product }: { product: Product }) {
  const { linesAdd, status } = useCart();
  const { open } = useCartUI();
  const { open: openQuickView } = useQuickView();
  const [added, setAdded] = useState(false);
  const [showMobileSizes, setShowMobileSizes] = useState(false);

  // First option (typically "Size"); placeholder "Title" option is filtered upstream.
  const sizeOption = product.options[0] ?? null;
  const hasSizes = Boolean(sizeOption && sizeOption.values.length > 0);

  // Map each option value → its variant, so we know availability + variant id.
  const variantByValue = (value: string) =>
    product.variants.find((v) =>
      v.selectedOptions.some(
        (o) => o.name === sizeOption?.name && o.value === value,
      ),
    );

  // Default selection: first in-stock size, else the first size.
  const [selectedSize, setSelectedSize] = useState<string | null>(() => {
    if (!hasSizes) return null;
    const firstAvailable = sizeOption!.values.find(
      (v) => variantByValue(v)?.availableForSale,
    );
    return firstAvailable ?? sizeOption!.values[0];
  });

  const selectedVariantId = hasSizes
    ? (selectedSize ? variantByValue(selectedSize)?.id : undefined)
    : product.defaultVariantId;

  const price = formatPrice(
    product.priceRange.minVariantPrice.amount,
    product.priceRange.minVariantPrice.currencyCode,
  );

  const hasHover = Boolean(product.hoverImage?.url);

  const handleAdd = () => {
    if (!selectedVariantId) return;
    // Optimistic: open the drawer immediately; hydrogen-react reconciles the
    // line once the Cart API mutation resolves.
    linesAdd([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    setAdded(true);
    open();
    setTimeout(() => setAdded(false), 1800);
  };

  // Mobile bag tap: reveal the inline size strip (sized products) or add directly.
  const mobileAdd = () => {
    if (hasSizes) {
      setShowMobileSizes(true);
      return;
    }
    handleAdd();
  };

  // Mobile size popup: tapping a size adds it and closes the popup.
  const addSize = (value: string) => {
    const variant = variantByValue(value);
    if (!variant?.availableForSale) return;
    linesAdd([{ merchandiseId: variant.id, quantity: 1 }]);
    setShowMobileSizes(false);
    open();
  };

  // Lock body scroll + Esc to close while the mobile size sheet is open.
  useEffect(() => {
    if (!showMobileSizes) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowMobileSizes(false);
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [showMobileSizes]);

  const href = `/products/${product.handle}`;

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-4xl bg-blush">
        <Link
          href={href}
          aria-label={product.title}
          className="absolute inset-0 z-10"
        >
          {product.featuredImage?.url && (
            <Image
              src={product.featuredImage.url}
              alt={product.featuredImage.altText ?? product.title}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className={`object-cover transition-all duration-[900ms] ease-soft ${
                hasHover ? 'group-hover:opacity-0' : 'group-hover:scale-105'
              }`}
            />
          )}
          {hasHover && (
            <Image
              src={product.hoverImage!.url}
              alt={product.hoverImage!.altText ?? `${product.title}, styled`}
              fill
              sizes="(min-width: 768px) 45vw, 90vw"
              className="object-cover scale-[1.04] opacity-0 transition-all duration-[900ms] ease-soft group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </Link>

        {/* Pointer (mouse) devices: size pills + Quick Look + Add to Cart, slides up on hover. */}
        <div className="absolute inset-x-3 bottom-3 z-20 hidden translate-y-3 flex-col gap-2 opacity-0 transition-all duration-300 ease-soft can-hover:flex group-hover:translate-y-0 group-hover:opacity-100">
          {hasSizes && (
            <div
              role="radiogroup"
              aria-label={`Select ${sizeOption!.name}`}
              className="flex w-auto max-w-full flex-wrap justify-center gap-1 self-center rounded-full bg-cream/90 px-1.5 py-1.5 shadow-sm backdrop-blur"
            >
              {sizeOption!.values.map((value) => {
                const variant = variantByValue(value);
                const soldOut = !variant?.availableForSale;
                const isSelected = selectedSize === value;
                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={soldOut}
                    onClick={() => setSelectedSize(value)}
                    className={`h-7 min-w-7 rounded-full px-2 text-xs transition ease-soft ${
                      isSelected
                        ? 'bg-charcoal text-cream'
                        : 'text-charcoal hover:bg-charcoal/10'
                    } ${soldOut ? 'cursor-not-allowed text-charcoal/30 line-through hover:bg-transparent' : ''}`}
                    title={soldOut ? `${value} — sold out` : value}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          )}
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => openQuickView(product)}
              className="rounded-full border border-charcoal/15 bg-cream/95 py-2.5 text-[11px] uppercase tracking-[0.1em] text-charcoal shadow-sm backdrop-blur transition hover:bg-white sm:flex-1"
            >
              Quick Look
            </button>
            <button
              type="button"
              onClick={handleAdd}
              disabled={!selectedVariantId || status === 'updating'}
              className="rounded-full bg-charcoal/90 py-2.5 text-[11px] uppercase tracking-[0.1em] text-cream shadow-sm backdrop-blur transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-60 sm:flex-1"
              aria-label={
                hasSizes && selectedSize
                  ? `Add ${product.title}, size ${selectedSize}, to cart`
                  : `Add ${product.title} to cart`
              }
            >
              {added
                ? 'Added ✓'
                : !selectedVariantId
                  ? 'Sold Out'
                  : 'Add to Cart'}
            </button>
          </div>
        </div>

        {/* Touch devices (phones + tablets): eye (quick view) left, bag (add)
            right. Always visible since there is no hover. */}
        <div className="absolute inset-x-3 bottom-3 z-20 flex items-center justify-between can-hover:hidden">
          <button
            type="button"
            onClick={() => openQuickView(product)}
            aria-label={`Quick view ${product.title}`}
            className="rounded-full bg-cream/95 p-2.5 text-charcoal shadow-sm backdrop-blur transition active:scale-95"
          >
            <EyeIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={mobileAdd}
            disabled={!selectedVariantId || status === 'updating'}
            aria-label={`Add ${product.title} to cart`}
            className="rounded-full bg-charcoal/90 p-2.5 text-cream shadow-sm backdrop-blur transition active:scale-95 disabled:opacity-60"
          >
            <BagIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile size popup (opens when the bag is tapped). Portaled to body so
          it escapes the GSAP-transformed ancestor and covers the full viewport. */}
      {showMobileSizes &&
        hasSizes &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-[80] flex items-center justify-center p-6 can-hover:hidden"
            role="dialog"
            aria-modal="true"
            aria-label={`Select size for ${product.title}`}
          >
          <div
            onClick={() => setShowMobileSizes(false)}
            className="absolute inset-0 animate-fadeIn bg-charcoal/40 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-xs animate-fadeUp rounded-3xl bg-cream p-6 text-center shadow-[0_24px_70px_rgba(46,43,41,0.25)]">
            <button
              type="button"
              onClick={() => setShowMobileSizes(false)}
              aria-label="Close"
              className="absolute right-3 top-3 rounded-full p-1.5 text-charcoal-muted transition hover:bg-charcoal/5"
            >
              <CloseIcon className="h-5 w-5" />
            </button>

            <p className="font-serif text-lg text-charcoal">{product.title}</p>
            <p className="mt-0.5 text-sm text-charcoal-muted">{price}</p>

            <p className="mb-3 mt-6 text-xs uppercase tracking-[0.18em] text-charcoal-muted">
              Select a size
            </p>
            <div className="flex flex-wrap justify-center gap-2.5">
              {sizeOption!.values.map((value) => {
                const soldOut = !variantByValue(value)?.availableForSale;
                return (
                  <button
                    key={value}
                    type="button"
                    disabled={soldOut}
                    onClick={() => addSize(value)}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border text-sm uppercase transition ${
                      soldOut
                        ? 'cursor-not-allowed border-charcoal/15 text-charcoal/30 line-through'
                        : 'border-charcoal/25 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream active:scale-95'
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </div>
        </div>,
          document.body,
        )}

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="font-serif text-base text-charcoal sm:text-lg">
          <Link href={href} className="transition hover:text-charcoal-muted">
            {product.title}
          </Link>
        </h3>
        <span className="whitespace-nowrap text-sm text-charcoal-muted">
          {price}
        </span>
      </div>
    </article>
  );
}
