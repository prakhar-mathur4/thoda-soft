'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
} from 'react';
import { useCart } from '@shopify/hydrogen-react';

export type PendingLine = {
  tempId: string;
  variantId: string;
  title: string;
  variantTitle?: string;
  image: string | null;
  imageAlt: string;
  price: string;
  currency: string;
  qty: number;
};

type Ctx = {
  pending: PendingLine[];
  pendingQty: number;
  addPending: (line: Omit<PendingLine, 'tempId'>) => void;
};

const C = createContext<Ctx | null>(null);

let counter = 0;

/**
 * Optimistic overlay on top of hydrogen-react's cart. Add-to-cart shows the
 * line + count instantly; once the (slow ~0.6–1.2s) Shopify cart mutation
 * settles, the server cart becomes authoritative and pending items clear.
 * Mirrors the optimistic-cart pattern Shopify Hydrogen uses.
 */
export function OptimisticCartProvider({ children }: { children: ReactNode }) {
  const [pending, setPending] = useState<PendingLine[]>([]);
  const { status } = useCart();
  const wasBusy = useRef(false);

  const addPending = useCallback((line: Omit<PendingLine, 'tempId'>) => {
    counter += 1;
    setPending((p) => [...p, { ...line, tempId: `tmp-${counter}` }]);
  }, []);

  // Clear optimistic items only after a full mutation cycle completes.
  useEffect(() => {
    if (status === 'updating' || status === 'creating' || status === 'fetching') {
      wasBusy.current = true;
    } else if (status === 'idle' && wasBusy.current) {
      wasBusy.current = false;
      setPending([]);
    }
  }, [status]);

  const pendingQty = pending.reduce((s, p) => s + p.qty, 0);

  return (
    <C.Provider value={{ pending, pendingQty, addPending }}>
      {children}
    </C.Provider>
  );
}

export function useOptimisticCart() {
  const ctx = useContext(C);
  if (!ctx)
    throw new Error('useOptimisticCart must be used within OptimisticCartProvider');
  return ctx;
}

export type AddToCartInput = {
  variantId: string;
  quantity?: number;
  title: string;
  variantTitle?: string;
  image: string | null;
  imageAlt: string;
  price: string;
  currency: string;
};

/** Add to cart with instant optimistic feedback. */
export function useAddToCart() {
  const { linesAdd } = useCart();
  const { addPending } = useOptimisticCart();

  return useCallback(
    (item: AddToCartInput) => {
      const qty = item.quantity ?? 1;
      addPending({
        variantId: item.variantId,
        title: item.title,
        variantTitle: item.variantTitle,
        image: item.image,
        imageAlt: item.imageAlt,
        price: item.price,
        currency: item.currency,
        qty,
      });
      linesAdd([{ merchandiseId: item.variantId, quantity: qty }]);
    },
    [linesAdd, addPending],
  );
}
