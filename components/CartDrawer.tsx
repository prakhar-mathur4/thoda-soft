'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useCart, Money } from '@shopify/hydrogen-react';
import { useCartUI } from './cart-ui-context';
import { CloseIcon, BagIcon } from './icons';

export default function CartDrawer() {
  const { isOpen, close } = useCartUI();
  const { lines, cost, checkoutUrl, linesRemove, status } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);
  const cartLines = (lines ?? []).filter(Boolean);
  const isEmpty = cartLines.length === 0;

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
            <p className="font-serif text-xl">Your cart is feeling soft & empty</p>
            <p className="max-w-xs text-sm text-charcoal-muted">
              Add a piece from the debut capsule and it will appear here.
            </p>
            <button onClick={close} className="btn-primary mt-2">
              Continue browsing
            </button>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-charcoal/10 overflow-y-auto px-6">
              {cartLines.map((line) => {
                if (!line) return null;
                const merch = line.merchandise;
                const img = merch?.image;
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
                      <p className="mt-1 text-sm">Qty {line.quantity}</p>
                      <div className="mt-auto flex items-center justify-between">
                        {line.cost?.totalAmount && (
                          <Money
                            data={line.cost.totalAmount}
                            className="text-sm"
                          />
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
            </ul>

            <div className="border-t border-charcoal/10 px-6 py-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm text-charcoal-muted">Subtotal</span>
                {cost?.subtotalAmount && (
                  <Money
                    data={cost.subtotalAmount}
                    className="font-serif text-lg"
                  />
                )}
              </div>
              <a
                href={checkoutUrl ?? '#'}
                aria-disabled={!checkoutUrl}
                className="btn-primary w-full"
              >
                {status === 'updating' ? 'Updating…' : 'Secure Checkout'}
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
