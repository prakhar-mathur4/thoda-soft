# Thoda Soft — Roadmap & Launch Checklist

Status of the headless Shopify storefront as an e-commerce business.
Legend: 🔴 launch blocker · 🟡 important · 🟢 done · 🟠 polish/debt

---

## ✅ Already in place
- [x] Editorial, mobile-first storefront (home, shop, PDP, lookbook, our-story, FAQ, size guide)
- [x] Live Shopify Storefront API (products, cart) + ISR
- [x] Cart drawer + Quick View + size popups (touch & desktop)
- [x] Predictive search + `/search` results page
- [x] GSAP scroll animations (reduced-motion safe)
- [x] Technical SEO: sitemap, robots, JSON-LD (Product/FAQ/Org), canonicals, `llms.txt`
- [x] Security: CSP + headers, rate limiting, HMAC webhooks, sanitized HTML, JSON-LD escaping
- [x] Modern stack: Next 16, React 19, 0 npm vulnerabilities
- [x] Accessibility basics: focus states, aria, skip link, keyboard modals
- [x] Logo + brand theme (ivory `#FEF9EB`, brown `#895B3A`, sage, blush)
- [x] Pushed to GitHub (`prakhar-mathur4/thoda-soft`)
- [x] Custom **404 page** (branded, correct 404 status) — merged to `main`
- [x] **Cart UX** (quantity stepper, discount code, free-shipping bar, upsell) — merged to `main`
- [x] **Cart performance** (optimistic add-to-cart + cart pre-warm) — merged to `main`
- [x] **Chat support widget** (quick-reply canned answers + WhatsApp escalation) — merged to `main`

---

## 🚀 Phase 1 — Make it sellable (LAUNCH BLOCKERS)

### Catalog 🔴
- [ ] Create the **4 real products** (incl. The Meadow Breeze Wrap Dress)
- [ ] Real **prices** (₹1,500–₹2,500), not ₹100 placeholders
- [ ] Real **product descriptions** (fabric, fit, styling, care) — unique & keyword-natural
- [ ] **Multiple product images** per product (enables gallery + hover swap + lookbook)
- [ ] Size variants (S–XXL) on **all** products (only Golden Hour has them)
- [ ] Set inventory + mark **active / in stock**
- [ ] Publish all to the **Headless** sales channel

### Checkout & Payments 🔴
- [ ] Confirm **GoKwik headless integration** mechanics (cart handoff, on-domain overlay)
- [ ] Integrate **GoKwik checkout** (Buy Now + cart → GoKwik)
- [ ] Configure payments: **UPI / cards / wallets / COD**
- [ ] Confirm GoKwik attaches **phone to a Shopify customer record** (needed for accounts)
- [ ] Thank-you / order-confirmation page

### Legal & Trust pages 🔴
- [ ] **Privacy Policy** (required — data + Klaviyo collection)
- [ ] **Terms & Conditions**
- [ ] **Refund / Returns & Exchanges** policy (footer link is dead `#`)
- [ ] **Shipping Policy** (footer link is dead `#`)
- [ ] **Contact** page (+ business name, address, GST for India compliance)
- [ ] Wire footer links to the above

### Analytics & Tracking 🔴
- [ ] **GA4**
- [ ] **Meta Pixel** (+ Conversions API ideally)
- [ ] **GoKwik event tracking** (note: Shopify may not fire all order webhooks for GoKwik)
- [ ] Conversion / purchase events end-to-end

### Deployment & Ops 🔴
- [ ] Deploy to **Vercel**
- [ ] Real **domain** + HTTPS
- [ ] Set all **env vars** on host (`NEXT_PUBLIC_SITE_URL`, Shopify, Klaviyo, webhook secret)
- [ ] **Sentry** (error monitoring)
- [ ] Configure Shopify **webhooks → /api/revalidate** (Product/Inventory)
- [ ] Submit sitemap to **Google Search Console + Bing**

---

## 💛 Phase 2 — Make it convert (IMPORTANT)

### Accounts 🟡
- [ ] **Phone + OTP login** (MSG91 / VerifyNow) — Option B
- [ ] **My Orders** (order list + detail) from Shopify Admin API by phone
- [ ] **Order tracking** (GoKwik tracking page / Shopify fulfillment URLs)
- [ ] **Progressive email capture** post-login → save to Shopify customer
- [ ] Secure session (httpOnly cookie), OTP rate limiting, E.164 phone normalization

### Cart UX 🟢 (done — merged to `main`)
- [x] **Quantity stepper** in cart drawer (`cartLinesUpdate`)
- [x] **Discount / promo code** field
- [x] **Free-shipping progress bar** (configurable threshold)
- [x] **Cart upsell** ("you may also like") in drawer
- [x] **Optimistic add-to-cart** (instant count + line) + **cart pre-warm** (perf)

### Merchandising & social proof 🟡
- [ ] **Product reviews + ratings** (+ Review/AggregateRating schema) — conversion + SEO
- [ ] **Related products / "complete the look"** on PDP
- [ ] **Wishlist / save for later**
- [ ] Curated rows: **bestsellers / new arrivals**

### Retention & support 🟡
- [ ] Configure **Klaviyo** (welcome flow, abandoned cart)
- [x] ~~**WhatsApp / chat support**~~ — Phase 1 done (browser widget + WhatsApp escalation); Phase 2 (WhatsApp Business API: order/abandoned-cart automation) pending
- [x] ~~Custom **404 page**~~ — done (merged via `feat/custom-404`)

---

## 🌱 Phase 3 — Grow

- [ ] **Journal / blog** (organic search + LLM citations — biggest content lever)
- [ ] Real **product descriptions at scale** as catalog grows
- [ ] **Loyalty / referral** program
- [ ] **A/B testing** (PDP, checkout entry)
- [ ] **Multi-currency / i18n** (if expanding beyond India)
- [ ] Build backlinks / PR / brand mentions (authority for SEO + LLMs)

---

## 🛠️ Polish & tech debt (ongoing)

- [ ] 🟠 Optimize **hero image** (3 MB PNG → compressed/responsive) for LCP
- [ ] 🟠 **Rotate the Shopify Admin token** (was shared in plaintext)
- [ ] 🟠 Move rate limiter from in-memory → **Upstash / Vercel KV** (serverless-safe)
- [ ] 🟠 Run **Lighthouse / Core Web Vitals** on the deployed build
- [ ] 🟠 Add **tests** (unit + e2e/Playwright) + **CI** (GitHub Actions)
- [ ] 🟠 Full **accessibility audit** (screen reader pass)
- [ ] 🟠 Lean **cart fragment** (trim hydrogen-react default) — deferred; needs browser e2e to verify safely
- [ ] 🟠 Free-shipping bar vs "free shipping on all orders" copy — align messaging or set threshold to 0
- [ ] 🟠 Plan note: legacy Shopify customer accounts deprecated — accounts go via phone-OTP/GoKwik

---

## 🔑 Top open dependencies
1. **Real catalog** — nothing matters until products are real.
2. **GoKwik headless integration** — confirm cart handoff + that phone attaches to a Shopify customer (decides the account architecture).
3. **Domain + deploy** — required for SEO, analytics, payments onboarding.
