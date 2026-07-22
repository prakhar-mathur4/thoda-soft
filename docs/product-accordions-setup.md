# Per-product accordions — setup (Metafields)

Each product page has three accordions — **Size & Fit**, **Materials & Care**,
**Shipping & Returns**. Their content is per-product: the theme reads a product
**metafield** for each. If a product hasn't filled a metafield, the accordion
shows the shared default text (fallback). If both are empty, the accordion hides.

No theme code needed — just create the metafield definitions once, then fill
them per product.

| Accordion | Metafield (namespace.key) | Type |
|-----------|---------------------------|------|
| Size & Fit | `custom.size_fit` | Rich text |
| Materials & Care | `custom.materials_care` | Rich text |
| Shipping & Returns | `custom.shipping_returns` | Rich text |

---

## Step 1 — Create the metafield definitions (once)

**Shopify admin → Settings → Custom data → Products → Add definition**

Create three definitions. For each:

1. **Name:** e.g. `Size & Fit`
2. **Namespace and key:** click "Select namespace and key" → set exactly:
   - `custom.size_fit`
   - `custom.materials_care`
   - `custom.shipping_returns`
3. **Type:** choose **Rich text** (gives bold, bullet lists, links)
4. **Save**

> Use the **`custom`** namespace and the **exact keys** above — the theme looks
> for these. Rich text is recommended so you can format (lists, bold, links).

---

## Step 2 — Fill them per product

**Products → open a product →** scroll to the **Metafields** section at the
bottom → fill the three fields for that product, e.g.:

- **Size & Fit:** "Model is 5'6" and wears size M. True to size — size down for a
  closer fit. Full bust support with adjustable straps."
- **Materials & Care:** "100% breathable cotton. Machine wash cold, line dry,
  warm iron. Wash with like colours."
- **Shipping & Returns:** "Ships in 1–2 days. Free shipping across India. 7-day
  size exchange."

Leave any field blank to use the shared default text for that accordion.

---

## How it behaves

- **Metafield filled** → shows that product's content.
- **Metafield empty** → shows the shared fallback (set in the product template's
  accordion block).
- **Both empty** → the accordion is hidden for that product.

## Changing the shared fallback / titles

Theme editor → a **product** → **Product information** section → the **Size &
Fit / Materials & Care / Shipping & Returns** blocks. Each block has:
- **Title** — the accordion heading.
- **Content (shared fallback)** — shown when the metafield is empty.
- **Per-product metafield** — the metafield key it reads (already set).

## Notes

- Keys must be exactly `custom.size_fit`, `custom.materials_care`,
  `custom.shipping_returns`.
- Rich text renders formatting (paragraphs, lists, links) automatically.
- This is the same pattern as the product **Highlights** (`custom.highlights`)
  and **size charts** — admin-managed, no code.
