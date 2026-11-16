# AGENTS.md

Thoda Soft — a Shopify Online Store 2.0 theme (Liquid + vanilla JS, Tailwind as a
build step). `README.md` covers structure and commands. This file covers only what
the repo does **not** tell you, and what has bitten us before.

## The live theme is connected to GitHub — `git push` deploys

Since 2026-11-16 the published theme is `thoda-soft/shopify-theam`: Shopify's
GitHub integration on branch **`shopify-theam`** (the other branches hold the old
Next.js app, not a theme). Two consequences:

- **Pushing to `shopify-theam` ships to the live store** within seconds. There is
  no staging step — build CSS, run theme check, then push.
- **The theme editor and apps commit back** to the branch ("Update from Shopify
  for theme …"). **`git pull` before any work**, or you will conflict with the
  merchant's edits to `templates/*.json` / `config/settings_data.json`.

Zip uploads and `shopify theme push` are no longer the way to ship. If you ever
do need the CLI against a theme, look the ID up first — IDs written down go
stale (pushing to a stale ID "succeeds" against a theme nobody sees; that has
happened):

```bash
shopify theme list --store zvinc6-7z.myshopify.com   # the row marked [live]
```

Store: permanent domain `zvinc6-7z.myshopify.com` (the CLI rejects the
`thoda-soft.myshopify.com` alias for `store` commands); custom domain
`thodasoft.com`.

## Never run a bare `shopify theme push`

Apps and the theme editor write directly to the live theme. A full push
overwrites their files with whatever the repo last saw. Push explicitly:

```bash
shopify theme push --theme <LIVE_ID> \
  --only sections/some-section.liquid \
  --only assets/global.js
```

`--only` is a whitelist — unlisted files are left alone, not deleted.

**Pull before you push.** Apps inject between sessions:

```bash
shopify theme pull --theme <LIVE_ID> --path /tmp/live
diff -rq . /tmp/live -x node_modules -x .git -x '*.zip' -x src -x docs
```

Anything new on live gets vendored into the repo *before* pushing.

### Files that are app- or merchant-owned — never push from source blindly

- `config/settings_data.json` — holds **app embed blocks**. Currently: GST Pro
  (enabled), Razorpay `sso-script` and `magicx-script` (disabled). A stale push
  deletes all three.
- `templates/*.json` — hold editor-set content, including the homepage hero image
  and brand-story image. A stale push blanks them.
- `sections/*-group.json` — header/footer group config.

These are committed in Shopify's own expanded format, generated header comment
included, so future pulls diff cleanly. Don't reformat them.

## Magic Checkout is load-bearing and easy to delete by accident

`snippets/razorpay-magic-checkout.liquid` plus its `{% render %}` call in
`layout/theme.liquid` were injected by the app and are now **vendored in source**.
Deleting either kills one-click checkout on the live store.

The snippet is only a loader — config lives in `shop.metafields.magic_checkout.*`,
which is shop-scoped and survives theme changes.

Verify after any push or theme publish:

```bash
curl -s https://thodasoft.com/ | grep -c magic-checkout-data-container   # want 1
```

## The header group is pinned, and that breaks with >1 section

`layout/theme.liquid` pins `.shopify-section-group-header-group` to
`position: fixed; top: 0`. Shopify emits **one wrapper div per section**, and every
wrapper gets that class — so two sections stack at the same origin and overlap.

`sections/announcement-bar.liquid` handles this: it offsets every following
header-group wrapper via a sibling combinator, and grows the `#MainContent`
spacer. A single `bar_h` variable drives the bar height, the offset and the
spacer so they can't drift.

**`<main>` carries `pt-14 sm:pt-16` purely as a spacer** for the fixed header
(`h-14 sm:h-16`). Change the header's height and that padding must change too.
Any new header-group section must offset the wrappers after it.

## Tailwind: `assets/theme.css` is a committed build artifact

Classes are authored in `.liquid`; `src/theme.css` compiles to `assets/theme.css`.
**Run `npm run build:css` after changing classes in any `.liquid` file**, then
commit the result. There is no CI check — forgetting it ships broken styling.

Note the palette is baked in twice: Tailwind hex values at build time, and CSS
variables from theme settings in `theme.liquid`. Changing a colour in the Theme
Editor only affects things using `var(--color-*)`.

## `assets/global.js` is the whole client runtime

One IIFE, no dependencies. Two patterns hold it together:

- `makeOverlay()` — a generic open/close controller parameterised by element refs
  and the Tailwind classes to toggle. Cart, mobile menu, search, quick view, size
  guide and size sheet are all instances.
- **Delegated `document`-level listeners keyed on `data-*` attributes.** Liquid
  emits `data-cart-open`, `data-variant-option`, `data-card-add` etc.; JS never
  queries by class. This is what makes AJAX-replaced HTML work without rebinding.

Follow both when adding behaviour. The cart uses the Section Rendering API
(`sections: 'cart-drawer'`) and swaps innerHTML.

## Razorpay offers on the product page — pick one route, not both

`sections/main-product.liquid` renders two block types between the share button
and the accordions:

- `razorpay_offers` — theme-owned embed, needs a Key ID
- `@app` — Razorpay's own Shopify app block

**Enabling both shows the widget twice.** The store is on the app-block route, so
the `razorpay_offers` Key ID stays empty.

The widget has no documented update method, so a variant change constructs a new
`RazorpayAffordabilitySuite`. `variant-picker.liquid` exposes raw `price_amount`
(paise) alongside the formatted money string for this; `resolveVariant()` fires a
`variant:change` event.

## Product content has three layers

Metaobjects → product metafields → section blocks (shared fallback). Highlights
check `custom.highlights` then fall back to `highlight` blocks; accordions name a
metafield then fall back to richtext; size charts read the `size_chart` metaobject
then fall back to built-in tables. Setup guides live in `docs/`.

## Product tags the theme reads

- `badge-<text>` — pill badge on the product card image (`badge-bestseller` →
  "Bestseller"). Max two per product. `snippets/product-card.liquid`.
- `featured` — homepage featured-products section (tag is a section setting).
- `chart-<name>` — which size chart the product popup shows.

## Reviews are Judge.me

Widgets are app blocks/embeds placed in the theme editor. App blocks inside the
`main-product` section always render between the share button and the
accordions, wherever they sit in the sidebar; full-width widgets belong in the
template's **Apps** section. `snippets/rating-badge.liquid` (under the product
title) reads the standard `reviews.rating` / `reviews.rating_count` metafields
and renders nothing until a product has a review.

## Tracking pixels are not in the theme

Searched and confirmed: no `fbq`, `gtag`, `dataLayer`, TikTok, Clarity or GoKwik
anywhere in theme code. The only external script in any `.liquid` is Razorpay's
`magic-shopify.js`. Any Meta/Google pixels are Web Pixel extensions or sales
channel injections via `content_for_header` — admin-side, not versionable here,
and unaffected by theme pushes.

## Conventions

- **No `Co-Authored-By` trailer on commits.** Plain commit messages.
- Conventional commit prefixes (`feat(scope):`, `fix(scope):`, `chore(scope):`).
- Run `shopify theme check` before pushing. Baseline is ~11 `RemoteAsset`
  warnings (Google Fonts, Razorpay CDN) — those are expected and unavoidable.
- `thoda-soft-theme.zip` is a gitignored build artifact, rebuilt on demand from
  `assets blocks config layout locales sections snippets templates`.
- Uploading that zip in admin creates a **new theme**; it does not update the live
  one. Prefer `--only` push when the goal is shipping to live.
