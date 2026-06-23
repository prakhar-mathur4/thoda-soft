'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart, Money } from '@shopify/hydrogen-react';
import { useCartUI } from './cart-ui-context';
import { useOptimisticCart, useAddToCart } from './optimistic-cart-context';
import { CloseIcon, BagIcon } from './icons';

// Free-shipping threshold (INR). Set to 0 to effectively disable the bar.
const FREE_SHIPPING_THRESHOLD = 1999;

type Reco = {
  id: string;
  handle: string;
  title: string;
  price: string;
  currency: string;
  image: string | null;
  imageAlt: string;
  variantId: string | null;
};

function formatPrice(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(0)}`;
  }
}

export default function CartDrawer() {
  const { isOpen, close } = useCartUI();
  const {
    lines,
    cost,
    checkoutUrl,
    linesRemove,
    linesUpdate,
    discountCodesUpdate,
    discountCodes,
    status,
  } = useCart();
  const { pending } = useOptimisticCart();
  const addToCart = useAddToCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const cartLines = (lines ?? []).filter(Boolean);
  const isEmpty = cartLines.length === 0 && pending.length === 0;
  const updating = status === 'updating' || status === 'creating';

  const [code, setCode] = useState('');
  const [recos, setRecos] = useState<Reco[]>([]);
  // Optimistic quantity overrides (cleared once the server settles).
  const [qtyOverride, setQtyOverride] = useState<Record<string, number>>({});
  const wasBusyRef = useRef(false);
  useEffect(() => {
    if (status === 'updating' || status === 'creating' || status === 'fetching') {
      wasBusyRef.current = true;
    } else if (status === 'idle' && wasBusyRef.current) {
      wasBusyRef.current = false;
      setQtyOverride({});
    }
  }, [status]);

  const setLineQty = (id: string, quantity: number) => {
    setQtyOverride((o) => ({ ...o, [id]: quantity }));
    linesUpdate([{ id, quantity }]);
  };

  // Close on Escape + lock body scroll while open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, close]);

  // Fetch upsell recommendations once when the drawer opens with items.
  useEffect(() => {
    if (!isOpen || recos.length > 0) return;
    let cancelled = false;
    fetch('/api/recommendations')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setRecos(d.products ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [isOpen, recos.length]);

  // Free-shipping progress.
  const currency = cost?.subtotalAmount?.currencyCode ?? 'INR';
  const subtotal = Number(cost?.subtotalAmount?.amount ?? 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifies = remaining === 0;

  // Upsell: hide products already in the cart.
  const cartHandles = new Set(
    cartLines.map((l) => l?.merchandise?.product?.handle).filter(Boolean),
  );
  const upsells = recos
    .filter((p) => p.variantId && !cartHandles.has(p.handle))
    .slice(0, 3);

  const appliedCodes = (discountCodes ?? []).filter(
    (d): d is { code: string; applicable: boolean } => Boolean(d?.code),
  );

  const applyCode = () => {
    const c = code.trim();
    if (!c) return;
    discountCodesUpdate([c]);
    setCode('');
  };

  return (
    <div
      className={`fixed inset-0 z-[60] ${isOpen ? '' : 'pointer-events-none'}`}
      aria-hidden={!isOpen}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-charcoal/30 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        tabIndex={-1}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-xl transition-transform duration-400 ease-soft ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
          <h2 className="font-serif text-lg">Your Cart</h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-2 transition hover:bg-charcoal/5"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <BagIcon className="h-10 w-10 text-charcoal/30" />
            <p className="font-serif text-xl">Your cart is feeling soft &amp; empty</p>
            <p className="max-w-xs text-sm text-charcoal-muted">
              Add a piece from the debut capsule and it will appear here.
            </p>
            <button onClick={close} className="btn-primary mt-2">
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            {/* 1. Free-shipping progress bar */}
            {FREE_SHIPPING_THRESHOLD > 0 && (
              <div className="border-b border-charcoal/10 px-6 py-3">
                <p className="text-xs text-charcoal-muted">
                  {qualifies ? (
                    <span className="text-sage-deep">
                      🎉 You&apos;ve unlocked <strong>free shipping</strong>!
                    </span>
                  ) : (
                    <>
                      You&apos;re{' '}
                      <strong className="text-charcoal">
                        {formatPrice(remaining, currency)}
                      </strong>{' '}
                      away from free shipping
                    </>
                  )}
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-charcoal/10">
                  <div
                    className="h-full rounded-full bg-sage-deep transition-all duration-500 ease-soft"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Lines + upsell (scrollable) */}
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-charcoal/10 px-6">
                {cartLines.map((line) => {
                  if (!line) return null;
                  const merch = line.merchandise;
                  const img = merch?.image;
                  const qty =
                    (line.id ? qtyOverride[line.id] : undefined) ??
                    line.quantity ??
                    1;
                  return (
                    <li key={line.id} className="flex gap-4 py-5">
                      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-blush">
                        {img?.url && (
                          <Image
                            src={img.url}
                            alt={img.altText ?? merch?.product?.title ?? ''}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <p className="font-serif text-sm">
                          {merch?.product?.title}
                        </p>
                        <p className="text-xs text-charcoal-muted">
                          {merch?.title}
                        </p>

                        {/* 2. Quantity stepper */}
                        <div className="mt-2 flex items-center gap-3">
                          <div className="inline-flex items-center rounded-full border border-charcoal/20">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={qty <= 1}
                              onClick={() => line.id && setLineQty(line.id, qty - 1)}
                              className="px-2.5 py-1 text-base leading-none transition hover:text-charcoal-muted disabled:opacity-30"
                            >
                              −
                            </button>
                            <span className="w-7 text-center text-sm" aria-live="polite">
                              {qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => line.id && setLineQty(line.id, qty + 1)}
                              className="px-2.5 py-1 text-base leading-none transition hover:text-charcoal-muted"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-2">
                          {line.cost?.totalAmount && (
                            <Money data={line.cost.totalAmount} className="text-sm" />
                          )}
                          <button
                            type="button"
                            onClick={() => line.id && linesRemove([line.id])}
                            className="text-xs text-charcoal-muted underline-offset-2 transition hover:text-charcoal hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  );
                })}

                {/* Optimistic pending lines (instant feedback) */}
                {pending.map((p) => (
                  <li key={p.tempId} className="flex gap-4 py-5 opacity-60">
                    <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl bg-blush">
                      {p.image && (
                        <Image
                          src={p.image}
                          alt={p.imageAlt}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <p className="font-serif text-sm">{p.title}</p>
                      {p.variantTitle && (
                        <p className="text-xs text-charcoal-muted">
                          {p.variantTitle}
                        </p>
                      )}
                      <p className="mt-1 text-xs text-charcoal-muted">Adding…</p>
                      <div className="mt-auto pt-2 text-sm">
                        {formatPrice(Number(p.price) * p.qty, p.currency)}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* 4. Upsell — You may also like */}
              {upsells.length > 0 && (
                <div className="border-t border-charcoal/10 px-6 py-5">
                  <p className="mb-3 text-xs uppercase tracking-[0.14em] text-charcoal-muted">
                    You may also like
                  </p>
                  <ul className="space-y-3">
                    {upsells.map((p) => (
                      <li key={p.id} className="flex items-center gap-3">
                        <Link
                          href={`/products/${p.handle}`}
                          onClick={close}
                          className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-blush"
                        >
                          {p.image && (
                            <Image
                              src={p.image}
                              alt={p.imageAlt}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </Link>
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${p.handle}`}
                            onClick={close}
                            className="block truncate font-serif text-sm transition hover:text-charcoal-muted"
                          >
                            {p.title}
                          </Link>
                          <span className="text-xs text-charcoal-muted">
                            {formatPrice(Number(p.price), p.currency)}
                          </span>
                        </div>
                        <button
                          type="button"
                          aria-label={`Add ${p.title} to cart`}
                          disabled={!p.variantId}
                          onClick={() =>
                            p.variantId &&
                            addToCart({
                              variantId: p.variantId,
                              title: p.title,
                              image: p.image,
                              imageAlt: p.imageAlt,
                              price: p.price,
                              currency: p.currency,
                            })
                          }
                          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-charcoal/25 text-lg leading-none transition hover:border-charcoal hover:bg-charcoal hover:text-cream disabled:opacity-40"
                        >
                          +
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Footer: discount + subtotal + checkout */}
            <div className="border-t border-charcoal/10 px-6 py-5">
              {/* 3. Discount code */}
              <div className="mb-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && applyCode()}
                    placeholder="Discount code"
                    aria-label="Discount code"
                    className="w-full rounded-full border border-charcoal/20 bg-white px-4 py-2 text-sm placeholder:text-charcoal-muted focus:border-charcoal focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    disabled={updating || !code.trim()}
                    className="shrink-0 rounded-full border border-charcoal px-4 py-2 text-xs uppercase tracking-[0.1em] transition hover:bg-charcoal hover:text-cream disabled:opacity-40"
                  >
                    Apply
                  </button>
                </div>
                {appliedCodes.map((dc) => (
                  <div
                    key={dc.code}
                    className="mt-2 flex items-center justify-between text-xs"
                  >
                    <span className={dc.applicable ? 'text-sage-deep' : 'text-charcoal-muted'}>
                      {dc.applicable ? `✓ ${dc.code} applied` : `“${dc.code}” isn’t applicable`}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        discountCodesUpdate(
                          appliedCodes.filter((c) => c.code !== dc.code).map((c) => c.code),
                        )
                      }
                      className="text-charcoal-muted underline-offset-2 hover:text-charcoal hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-charcoal-muted">Subtotal</span>
                {cost?.subtotalAmount && (
                  <Money data={cost.subtotalAmount} className="font-serif text-lg" />
                )}
              </div>
              <a
                href={checkoutUrl ?? '#'}
                aria-disabled={!checkoutUrl}
                className="btn-primary w-full"
              >
                {updating ? 'Updating…' : 'Secure Checkout'}
              </a>
              <p className="mt-3 text-center text-xs text-charcoal-muted">
                Shipping &amp; taxes calculated at checkout
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
