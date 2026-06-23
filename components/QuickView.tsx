'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@shopify/hydrogen-react';
import type { ProductImage } from '@/lib/types';
import { useQuickView } from './quickview-context';
import { useCartUI } from './cart-ui-context';
import { useAddToCart } from './optimistic-cart-context';
import { CloseIcon } from './icons';
import SizeGuideModal from './SizeGuideModal';
import { lockScroll, unlockScroll } from '@/lib/scroll-lock';

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

export default function QuickView() {
  const { product, isOpen, close } = useQuickView();
  const { status } = useCart();
  const addToCart = useAddToCart();
  const { open: openCart } = useCartUI();
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [images, setImages] = useState<ProductImage[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const sizeOption = product?.options[0] ?? null;
  const hasSizes = Boolean(sizeOption && sizeOption.values.length > 0);

  const variantByValue = (value: string) =>
    product?.variants.find((v) =>
      v.selectedOptions.some(
        (o) => o.name === sizeOption?.name && o.value === value,
      ),
    );

  // Reset / default the selected size whenever a new product opens.
  useEffect(() => {
    if (!product) return;
    if (!hasSizes) {
      setSelectedSize(null);
    } else {
      const firstAvailable = sizeOption!.values.find(
        (v) => variantByValue(v)?.availableForSale,
      );
      setSelectedSize(firstAvailable ?? sizeOption!.values[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  // Load the full gallery when a product opens — start with the card's images
  // for an instant first paint, then replace with all images from the API.
  useEffect(() => {
    if (!product) return;
    const initial = [product.featuredImage, product.hoverImage].filter(
      (i): i is ProductImage => Boolean(i),
    );
    setImages(initial);
    setActiveImage(0);
    if (scrollerRef.current) scrollerRef.current.scrollLeft = 0;

    let cancelled = false;
    fetch(`/api/quickview?handle=${encodeURIComponent(product.handle)}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && Array.isArray(d.images) && d.images.length) {
          setImages(d.images);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [product]);

  // Esc + scroll lock. A nested size-guide modal intercepts Esc in the capture
  // phase (and stops propagation), so this only fires when Quick View is top-most.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    lockScroll();
    return () => {
      document.removeEventListener('keydown', onKey);
      unlockScroll();
    };
  }, [isOpen, close]);

  const selectedVariantId = useMemo(() => {
    if (!product) return undefined;
    if (!hasSizes) return product.defaultVariantId ?? undefined;
    return selectedSize ? variantByValue(selectedSize)?.id : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, hasSizes, selectedSize]);

  const handleAdd = () => {
    if (!product || !selectedVariantId) return;
    addToCart({
      variantId: selectedVariantId,
      title: product.title,
      variantTitle: selectedSize ?? undefined,
      image: images[0]?.url ?? null,
      imageAlt: images[0]?.altText ?? product.title,
      price: product.priceRange.minVariantPrice.amount,
      currency: product.priceRange.minVariantPrice.currencyCode,
    });
    close();
    openCart();
  };

  const onScroll = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setActiveImage(Math.round(el.scrollLeft / el.clientWidth));
  };
  const goTo = (i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
  };

  const price = product
    ? formatPrice(
        product.priceRange.minVariantPrice.amount,
        product.priceRange.minVariantPrice.currencyCode,
      )
    : '';

  return (
    <div
      className={`fixed inset-0 z-[70] flex items-center justify-center p-4 ${
        isOpen ? '' : 'pointer-events-none'
      }`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-charcoal/40 backdrop-blur-[2px] transition-opacity duration-[600ms] ease-soft ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product?.title ?? 'Quick view'}
        className={`relative grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl bg-cream shadow-[0_24px_70px_rgba(46,43,41,0.25)] transition-all duration-[600ms] ease-soft sm:grid-cols-2 sm:min-h-[560px] ${
          isOpen ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.98] opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close quick view"
          className="absolute right-3 top-3 z-10 rounded-full bg-cream/80 p-2 text-charcoal backdrop-blur transition hover:bg-white"
        >
          <CloseIcon className="h-5 w-5" />
        </button>

        {product && (
          <>
            {/* Image gallery — horizontal snap carousel */}
            <div className="relative bg-blush">
              <div
                ref={scrollerRef}
                onScroll={onScroll}
                className="flex h-full snap-x snap-mandatory overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {images.map((image, i) => (
                  <div
                    key={`${image.url}-${i}`}
                    className="relative aspect-[4/5] w-full shrink-0 snap-center sm:aspect-auto sm:min-h-[560px]"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText ?? `${product.title} — view ${i + 1}`}
                      fill
                      sizes="(min-width: 640px) 512px, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>

              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`View image ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === activeImage ? 'w-5 bg-charcoal' : 'w-1.5 bg-charcoal/30'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col p-6 sm:p-10">
              <p className="mb-2 text-xs uppercase tracking-[0.2em] text-charcoal-muted">
                The Debut Capsule
              </p>
              <h2 className="font-serif text-2xl uppercase leading-tight tracking-[0.02em]">
                {product.title}
              </h2>
              <p className="mt-3 text-lg text-charcoal">{price}</p>

              {product.description && (
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-charcoal/70">
                  {product.description}
                </p>
              )}

              {hasSizes && (
                <fieldset className="mt-6">
                  <legend className="mb-2 flex w-full items-center justify-between text-xs uppercase tracking-[0.12em] text-charcoal-muted">
                    <span>{sizeOption!.name}</span>
                    <button
                      type="button"
                      onClick={() => setSizeGuideOpen(true)}
                      className="normal-case tracking-normal underline underline-offset-2 transition hover:text-charcoal"
                    >
                      Size chart
                    </button>
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {sizeOption!.values.map((value) => {
                      const soldOut = !variantByValue(value)?.availableForSale;
                      const active = selectedSize === value;
                      return (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setSelectedSize(value)}
                          disabled={soldOut}
                          aria-pressed={active}
                          className={`min-w-11 rounded-full border px-3 py-2 text-sm uppercase transition ${
                            active
                              ? 'border-charcoal bg-charcoal text-cream'
                              : 'border-charcoal/25 text-charcoal hover:border-charcoal'
                          } ${soldOut ? 'cursor-not-allowed text-charcoal/30 line-through' : ''}`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              <div className="mt-auto pt-7">
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={!selectedVariantId || status === 'updating'}
                  className="w-full bg-charcoal py-3.5 text-xs uppercase tracking-[0.2em] text-cream transition hover:bg-charcoal/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {selectedVariantId ? 'Add to Cart' : 'Sold Out'}
                </button>
                <Link
                  href={`/products/${product.handle}`}
                  onClick={close}
                  className="mt-3 block text-center text-xs uppercase tracking-[0.14em] text-charcoal-muted transition hover:text-charcoal"
                >
                  View full details →
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <SizeGuideModal
        open={sizeGuideOpen}
        onClose={() => setSizeGuideOpen(false)}
      />
    </div>
  );
}
