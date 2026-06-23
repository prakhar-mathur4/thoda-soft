'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import type { Product } from '@/lib/types';

type QuickViewCtx = {
  product: Product | null;
  isOpen: boolean;
  open: (product: Product) => void;
  close: () => void;
};

const Ctx = createContext<QuickViewCtx | null>(null);

export function QuickViewProvider({ children }: { children: ReactNode }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback((p: Product) => {
    setProduct(p);
    setIsOpen(true);
  }, []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <Ctx.Provider value={{ product, isOpen, open, close }}>
      {children}
    </Ctx.Provider>
  );
}

export function useQuickView() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useQuickView must be used within QuickViewProvider');
  return ctx;
}
