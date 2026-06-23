'use client';

import { ReactNode } from 'react';
import {
  ShopifyProvider,
  CartProvider,
} from '@shopify/hydrogen-react';
import { CartUIProvider } from './cart-ui-context';
import { QuickViewProvider } from './quickview-context';

const storeDomain =
  process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN ?? 'thoda-soft.myshopify.com';
const token =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN ?? 'unconfigured';
const apiVersion =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_API_VERSION ?? '2024-10';

/**
 * Client providers. `CartProvider` from hydrogen-react owns cart state, persists
 * the cart id in a cookie, and exposes hooks (useCart, useCartLine, etc.).
 * `CartUIProvider` is our own tiny context for open/close of the cart drawer.
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
        <CartUIProvider>
          <QuickViewProvider>{children}</QuickViewProvider>
        </CartUIProvider>
      </CartProvider>
    </ShopifyProvider>
  );
}
