'use client';

import { ReactNode, useEffect, useRef } from 'react';
import {
  ShopifyProvider,
  CartProvider,
  useCart,
} from '@shopify/hydrogen-react';
import { CartUIProvider } from './cart-ui-context';
import { QuickViewProvider } from './quickview-context';
import { OptimisticCartProvider } from './optimistic-cart-context';

const storeDomain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'thoda-soft.myshopify.com';
const token =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? 'unconfigured';
const apiVersion =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION ?? '2024-10';

/**
 * Pre-warm the cart: if a new visitor has no cart yet, create an empty cart in
 * the background so their FIRST add-to-cart is a fast `cartLinesAdd` instead of
 * the slow `cartCreate` (~1.2s). Waits briefly first so a returning visitor's
 * cookie cart loads — we never clobber an existing cart (guarded by `!id`).
 */
function CartPrewarm() {
  const { status, id, cartCreate } = useCart();
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    const t = setTimeout(() => {
      if (done.current) return;
      if (!id && status === 'idle') {
        done.current = true;
        cartCreate({});
      }
    }, 1500);
    return () => clearTimeout(t);
  }, [status, id, cartCreate]);

  return null;
}

/**
 * Client providers. `CartProvider` owns Shopify cart state (cookie-persisted);
 * `OptimisticCartProvider` adds instant add-to-cart feedback; `CartUIProvider`
 * and `QuickViewProvider` are our small UI contexts.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ShopifyProvider
      storeDomain={storeDomain}
      storefrontToken={token}
      storefrontApiVersion={apiVersion}
      countryIsoCode="IN"
      languageIsoCode="EN"
    >
      <CartProvider>
        <CartPrewarm />
        <OptimisticCartProvider>
          <CartUIProvider>
            <QuickViewProvider>{children}</QuickViewProvider>
          </CartUIProvider>
        </OptimisticCartProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}
