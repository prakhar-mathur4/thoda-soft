# KwikCheckout (GoKwik) — Setup Guide for Thoda Soft

One-click checkout with COD control, OTP address prefill, prepaid discounts, and
RTO reduction — installed as a **Shopify app**. GoKwik's team **embeds the
checkout plugin for you**, so **no theme code changes are required**. It runs on
top of your existing flow without disrupting the theme.

> App listing: **Kwik COD & Checkout** — https://apps.shopify.com/kwikcheckout
> Pairs with **KwikPass** (same GoKwik login/identity) — see `kwikpass-setup.md`.

---

## What KwikCheckout does

- **One-click / fast checkout** with **OTP-based address prefill**
- **COD management** — COD verification, COD blocking, COD fees, partial COD
- **RTO reduction** — risk scoring to cut Return-to-Origin losses
- **Prepaid nudges** — discounts to push prepaid over COD
- **Upsells / offers** at checkout
- Replaces the theme's checkout button with GoKwik's checkout layer

## Important: how it affects payments & Shopify checkout

- KwikCheckout **replaces Shopify's native checkout** with its own layer.
- **Payment gateways (e.g. Razorpay) are configured INSIDE GoKwik/KwikCheckout**,
  not in Shopify → Settings → Payments. So if you go with KwikCheckout, plug
  Razorpay (and/or UPI, cards, wallets, COD) into the **GoKwik dashboard**.
- Decide one path:
  - **KwikCheckout** (one-click + COD + RTO, with Razorpay inside it), **or**
  - **Shopify checkout + Razorpay** as the gateway (simpler, no one-click layer).
  Running both is redundant — pick KwikCheckout if COD/RTO/one-click is the goal.

---

## Prerequisites

- Shopify store on a paid plan, admin access.
- A **GoKwik merchant account** (contract + KYC). Onboarding is done with GoKwik's
  team — this is a business step, not code.
- Business/bank/GST details for payments + COD remittance.
- The Thoda Soft theme **published** (the plugin embeds on the live theme).

---

## Step 1 — Install the app

1. Shopify App Store → search **"Kwik COD & Checkout"** (by GoKwik Commerce
   Solutions), or open https://apps.shopify.com/kwikcheckout
2. **Install** → approve permissions.
3. You're taken to the **GoKwik dashboard** to start onboarding.

## Step 2 — Complete GoKwik onboarding (with their team)

- Sign the merchant agreement / complete **KYC**.
- Provide **bank + GST + business** details (for payments and COD settlement).
- GoKwik's integration team will **embed the KwikCheckout plugin** on your store.
  This is done by them — **you don't edit theme code**.

## Step 3 — Configure checkout in the GoKwik dashboard

- **Payment methods**: connect **Razorpay** (and/or other gateways), UPI, cards,
  wallets, and **COD** rules.
- **COD controls**: COD fee, COD blocking by pincode/risk, partial COD.
- **Prepaid discounts**: incentives to choose prepaid.
- **Address prefill / OTP**: enable (ties in with KwikPass if installed).
- **Branding**: logo, colors, brand name on the checkout.
- **Shipping/serviceability**: pincode rules, shipping charges (mirror your
  Shipping Policy).
- **Discounts**: make sure Shopify discount codes flow through (configure in GoKwik).

## Step 4 — Enable the theme app embed (if prompted)

Some KwikCheckout components load via a **Theme App Extension**:

1. Theme Editor (**Online Store → Themes → Customize**) → **Theme settings →
   App embeds**.
2. Toggle any **KwikCheckout / GoKwik** embeds **ON** → **Save**.

> If GoKwik's team fully embeds it, this may already be handled. Verify the
> checkout button opens KwikCheckout after go-live.

## Step 5 — Test end-to-end (staging/test mode first)

1. Add a product → open the **cart drawer** → click **Secure Checkout**.
2. Confirm it opens **KwikCheckout** (not Shopify's default), with **address
   prefill** and your enabled payment methods incl. **COD**.
3. Place a **test order** (prepaid + COD) → verify the order lands in **Shopify
   admin → Orders** with correct payment status.
4. Verify **discount codes**, **shipping**, and **RTO/COD rules** behave.
5. Only then switch to **live**.

---

## Theme side — what (if anything) is needed

- **Checkout buttons already exist** in this theme and use Shopify's standard
  checkout submit:
  - Cart drawer: `snippets/cart-drawer-contents.liquid` → `<button name="checkout">`
  - Cart page: `sections/main-cart.liquid` → `<button name="checkout">`
  - Product/quick view "Add to Cart" → cart drawer → checkout
- KwikCheckout's layer **detects and takes over** these standard checkout buttons.
  **No code change expected.**
- **Only if** GoKwik's team asks for a specific button hook/attribute that isn't
  auto-detected, send us their requirement and we'll add it (a small, targeted
  change to the checkout button). This is rare.

---

## Coexistence with KwikPass

- Install **KwikPass** for login/identity and **KwikCheckout** for checkout — same
  GoKwik account. A shopper logged in via KwikPass gets **address prefill + no
  repeat OTP** at KwikCheckout. They're designed to work together.

---

## Troubleshooting

- **Checkout still opens Shopify's default** → plugin not embedded/live yet, or
  the embed is on a different theme. Confirm with GoKwik + check App embeds on the
  **live** theme.
- **COD not showing / wrong rules** → configure COD in the GoKwik dashboard.
- **Payments failing** → gateway (Razorpay) not connected/KYC pending inside
  GoKwik.
- **Discounts not applying** → enable/flow Shopify discounts in GoKwik settings.
- **Orders missing in Shopify** → check the GoKwik ↔ Shopify order sync in the
  dashboard.

---

## Summary

| Task | Where | Code? |
|------|-------|-------|
| Install Kwik COD & Checkout | Shopify App Store | ❌ |
| Merchant onboarding / KYC | GoKwik dashboard (with their team) | ❌ |
| Plugin embed on store | GoKwik team | ❌ |
| Configure payments (Razorpay), COD, discounts | GoKwik dashboard | ❌ |
| App embed toggle (if prompted) | Theme Editor → App embeds | ❌ |
| Test prepaid + COD orders | Storefront (test mode) | ❌ |
| Custom checkout-button hook (only if GoKwik requires) | `snippets/cart-drawer-contents.liquid` / `sections/main-cart.liquid` | ✅ rare |

**Bottom line:** KwikCheckout needs **no theme code changes** — GoKwik embeds it.
Razorpay (and COD) are configured **inside GoKwik**, and it pairs with KwikPass.
Only a rare, GoKwik-requested button hook would touch code.
