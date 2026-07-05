# KwikPass (GoKwik) — Setup Guide for Thoda Soft

Phone + OTP login (SSO), shopper identification, address prefill, and marketing
popups — installed as a **Shopify app** on this theme. **No theme code changes
are required** to get it working; everything below is done in the Shopify admin
and Theme Editor. An optional account-icon tweak is covered at the end.

> App listing: **KwikPass: OTP-login & Popups** — https://apps.shopify.com/kwikpass

---

## What KwikPass does (and doesn't)

**Does**
- Phone-first **OTP login** (no passwords) with SSO across the GoKwik network
- **Identifies** returning shoppers as they land on the store
- **Skips the OTP at Shopify checkout** for KwikPass-logged-in users
- **Address prefill** to speed up checkout
- Marketing **popups** (OTP capture, Spin the Wheel, newsletter)

**Doesn't**
- It is **not** a full "My Account" portal. Order history, addresses, and profile
  still come from **Shopify customer accounts** (or your `/account` pages).
  KwikPass = login + identity + checkout speed. The two **coexist**.

---

## Prerequisites

- A Shopify store on a plan that allows apps (all paid plans do).
- Admin access to the store.
- A mobile number + business details for GoKwik onboarding/KYC.
- The Thoda Soft theme **published** (or the theme you want it on set as live for
  the app embed to attach).

---

## Step 1 — Install the app

1. Go to the **Shopify App Store** → search **"KwikPass: OTP-login & Popups"**
   (by GoKwik Commerce Solutions), or open https://apps.shopify.com/kwikpass
2. Click **Install** → approve the permissions.
3. You'll be taken to the **KwikPass / GoKwik dashboard** to create/link your
   GoKwik merchant account. Complete phone verification and onboarding.

---

## Step 2 — Enable the theme app embed

KwikPass injects itself via a **Theme App Extension** (no code):

1. Shopify admin → **Online Store → Themes**.
2. On the **Thoda Soft** theme → **Customize**.
3. Top-left, open **Theme settings** (the gear) → **App embeds**.
4. Toggle **KwikPass** (and any KwikPass sub-embeds) **ON**.
5. **Save**.

> If KwikPass doesn't appear under App embeds, open the app once from
> **Apps → KwikPass**; it registers the embed on first run. Re-check App embeds.

---

## Step 3 — Configure login & popups (in the KwikPass dashboard)

From **Apps → KwikPass** (or the GoKwik dashboard):

- **Login / OTP**: enable phone-OTP login; set where the login prompt appears
  (on landing, on account click, on checkout, etc.).
- **Merchant branding**: logo, colors, brand name on the OTP screen.
- **Popups** (optional): OTP capture, Spin the Wheel, newsletter — set triggers
  (exit intent, time on page, scroll).
- **Address prefill**: enable so checkout auto-fills known addresses.
- **Consent / DLT**: ensure SMS sender + templates are compliant (GoKwik handles
  the OTP SMS; confirm your account is set up for India DLT if prompted).

Save/publish inside the KwikPass dashboard.

---

## Step 4 — Test the flow

1. Open the store in an **incognito** window (so you're logged out).
2. Trigger login (landing prompt, or click the **account icon** in the header).
3. Enter a phone number → receive OTP → verify → you're logged in.
4. Add a product → go to **checkout** → confirm you're **not** asked for OTP
   again and the **address is prefilled**.
5. In Shopify admin → **Customers**, confirm the shopper record was created/linked.

---

## Step 5 (optional) — Wire the header account icon to KwikPass

By default the header **account icon** links to Shopify customer accounts
(`/account`). Most KwikPass setups **auto-attach** their login, so this usually
needs nothing. Do this only if KwikPass's docs tell you to trigger login from a
specific element:

Two easy options (no rebuild of logic needed):

**Option A — point the account link at KwikPass's login URL/route**
- Theme Editor → **Theme settings → Brand → Account URL**
- Set it to the login URL/route KwikPass provides (from their dashboard/docs).
- This is a pure setting change — no code.

**Option B — trigger KwikPass via the account icon (needs their trigger method)**
- KwikPass usually exposes a JS trigger or a CSS class/attribute to open the
  login modal. Send us that method (e.g. `window.kwikpass.open()` or a required
  class) and we'll attach it to the header account button in `sections/header.liquid`.
- This is a ~2-line change; the account button already carries an
  `aria-label="Account"` and is easy to target.

> Until you confirm KwikPass's method, leave the account icon as-is — it keeps
> working with Shopify accounts, and KwikPass's own prompt still appears.

---

## Coexistence with Shopify customer accounts

- Keep Shopify **customer accounts** enabled (Settings → Customer accounts) for
  order history / addresses pages (`/account/*`), which this theme already styles.
- KwikPass logs the shopper in and links them to their Shopify customer record,
  so both stay in sync.
- The theme's footer/menu **Account** links continue to work.

---

## Troubleshooting

- **Login prompt not showing** → App embed not enabled (Step 2), or the app
  wasn't opened once after install. Re-check **App embeds** and hard-refresh.
- **OTP SMS not arriving** → GoKwik onboarding/DLT not complete; check the
  KwikPass dashboard for sender/template status.
- **Works on old theme, not the new one** → App embeds are per-theme; enable the
  embed on the **Thoda Soft** theme specifically, and make sure it's the live/
  previewed theme.
- **Checkout still asks for OTP** → confirm KwikPass "skip checkout OTP" /
  SSO-to-checkout is enabled in the dashboard.
- **Account icon doesn't open KwikPass** → expected if not wired; see Step 5.

---

## Related (future)

- **KwikCheckout** (COD, one-click, RTO reduction) is the same GoKwik ecosystem
  and installs similarly as a Shopify app if you want it later.
- If you add **Razorpay** as the payment gateway, configure it in
  **Settings → Payments** (separate from KwikPass).

---

## Summary

| Task | Where | Code? |
|------|-------|-------|
| Install KwikPass | Shopify App Store | ❌ |
| Enable app embed | Theme Editor → App embeds | ❌ |
| Configure login/popups | KwikPass dashboard | ❌ |
| Test login + checkout | Storefront (incognito) | ❌ |
| Point account icon at KwikPass (optional) | Theme settings → Account URL | ❌ (setting) |
| Custom trigger on account icon (only if required) | `sections/header.liquid` | ✅ ~2 lines |

**Bottom line:** installing and running KwikPass needs **no theme code changes**.
Only the optional custom trigger (Step 5B) touches code, and only if KwikPass's
docs require it.
