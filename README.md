# Thoda Soft — Shopify Theme

A native **Shopify Online Store 2.0** theme (Liquid + HTML + CSS + vanilla JS).
No Next.js, no React, no external runtime — it installs directly on the Shopify store.

## Structure

```
assets/        theme.css (compiled), global.js
config/        settings_schema.json, settings_data.json
layout/        theme.liquid, password.liquid
locales/       en.default.json
sections/      hero, trust-bar, featured-products, brand-story, header, footer,
               main-product, main-collection, main-cart, main-search, main-page,
               main-contact, quick-view, predictive-search, cart-drawer, …
snippets/      product-card, icon, cart-drawer, search-overlay, quick-view,
               chat-widget, size-guide-modal, …
templates/     *.json (OS 2.0 JSON templates) + customers/*.liquid + policy.liquid
src/           theme.css  ← Tailwind input (build source, NOT uploaded)
```

## Styling — Tailwind as a build step

The design is authored with Tailwind utility classes directly in `.liquid`
files (identical to the original design system). Tailwind compiles them to a
single committed stylesheet, `assets/theme.css`. The brand palette lives in
`tailwind.config.js`; fonts (Playfair Display + Jost) are loaded in
`layout/theme.liquid`.

```bash
npm install          # tailwindcss, postcss, autoprefixer (build-only)
npm run build:css    # one-off compile → assets/theme.css
npm run watch:css    # recompile on change while developing
```

`assets/theme.css` is committed so the theme is self-contained and pushes with
the Shopify CLI without any build step on Shopify's side. **Re-run `build:css`
after editing classes in any `.liquid` file**, then commit the result.

## Develop & deploy (Shopify CLI)

```bash
npm i -g @shopify/cli @shopify/theme
shopify theme dev      # local preview against your store
shopify theme check    # lint
shopify theme push     # upload to the store
```

## Editor / merchant controls

- **Theme settings** (`config/settings_schema.json`): logo, brand colors,
  account URL, WhatsApp number, free-shipping bar.
- **Sections & blocks**: every homepage section (hero, trust bar, featured
  products, brand story) plus header/footer are fully editable in the Theme
  Editor, including images, text, menus, and ordering.
- **Native data**: products, collections, cart, customer accounts, search
  (predictive + Search & Discovery filters), and blog use Shopify objects —
  no custom APIs.

## Notes for apps (GoKwik / Razorpay / KwikPass)

Because this is a standard theme (not headless), Shopify checkout apps install
normally. Configure Razorpay as the payment provider in Shopify admin, and add
GoKwik / KwikPass from the App Store — they hook into the theme cart/checkout.
