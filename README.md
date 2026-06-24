# Thoda Soft — Headless Storefront

A clean, editorial, mobile-first headless storefront for the women's apparel brand
**Thoda Soft**. Next.js 14 (App Router) on Vercel + Shopify (Storefront API for
products/cart, hosted checkout for payments).

## Stack

- **Next.js 14 (App Router)** — Server Components for product data with ISR.
- **Tailwind CSS** — custom brand theme (no default palette). See `tailwind.config.ts`.
- **@shopify/hydrogen-react** — `CartProvider` owns cart state (cookie-persisted),
  drives the optimistic add-to-cart and the slide-out cart drawer.
- **next/font** — Playfair Display (serif headings) + Jost (sans body), zero CLS.
- **next/image** — Shopify CDN images optimized; hero uses `priority`.

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in Shopify creds (optional for preview)
npm run dev                  # http://localhost:3000
```

Without Shopify credentials the homepage renders against the **mock catalogue**
(`lib/mock-products.ts`) using the local images, so design review works offline.
Add-to-cart / checkout become live once real Storefront credentials are set.

## Environment variables

See `.env.example`. Key ones:

| Var | Purpose |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN`, `SHOPIFY_STOREFRONT_ACCESS_TOKEN` | Server-side product fetch |
| `NEXT_PUBLIC_SHOPIFY_*` | hydrogen-react `CartProvider` (Storefront token is public by design) |
| `SHOPIFY_DEBUT_COLLECTION_HANDLE` | Collection shown in the grid (default `debut-capsule`) |
| `SHOPIFY_REVALIDATE_SECRET` | Auth for the webhook revalidation endpoint |
| `KLAVIYO_PRIVATE_API_KEY`, `KLAVIYO_LIST_ID` | Newsletter capture (optional) |

## ISR + webhooks

Product data is cached with the `products` tag and `revalidate: 3600`. Configure
Shopify webhooks for **Product update** and **Inventory level update** to POST to:

```
https://<your-domain>/api/revalidate?secret=<SHOPIFY_REVALIDATE_SECRET>
```

This busts the `products` tag on demand — no rebuild, no per-request fetching.
(For production, also verify the `X-Shopify-Hmac-Sha256` header.)

## Structure

```
app/
  layout.tsx            # fonts, providers, skip link, metadata
  page.tsx              # homepage section composition
  globals.css           # brand base styles + button/utility components
  api/newsletter        # Klaviyo subscribe (graceful no-op if unconfigured)
  api/revalidate        # Shopify webhook → revalidateTag('products')
components/
  Header.tsx            # sticky, transparent→solid on scroll, live cart badge
  Hero.tsx              # "Living Editorial" layered hero — masked headline,
                        #   floating photo collage, shoppable look card (GSAP)
  TrustBar.tsx          # USP bar
  ProductGrid.tsx       # Server Component, fetches collection
  ProductCard.tsx       # hover image swap + optimistic add-to-cart
  BrandStory.tsx        # split-screen storytelling
  Footer.tsx            # newsletter + links + trust badges
  CartDrawer.tsx        # keyboard-navigable drawer, empty state
  Providers.tsx         # ShopifyProvider + CartProvider + cart UI context
lib/
  shopify.ts            # Storefront GraphQL client + ISR + mock fallback
  mock-products.ts      # offline catalogue
  fonts.ts, types.ts
```

## Notes

- Checkout redirects to Shopify-hosted checkout via `cart.checkoutUrl`. Brand the
  checkout (logo/colors) in Shopify admin → Settings → Checkout.
- "Track Order" deep-links to the Shopify hosted account page; swap for the
  Customer Account API when a custom login UI is built.
- a11y: skip link, focus-visible rings, `aria-modal` drawer with Esc-to-close,
  body-scroll lock, and alt text sourced from Shopify image `altText`.
- `npm audit` flags issues whose full fix lands in Next 16 (a breaking major).
  This project pins the latest stable **Next 14.2.x**; the flagged DoS vectors are
  mitigated on Vercel. Revisit when migrating to Next 15/16.
