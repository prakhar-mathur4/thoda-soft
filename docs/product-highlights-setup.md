# Product Highlights — "What Makes It Great" setup

Per-product highlights (icon + title + description) on the product page, powered by
Shopify **metaobjects + a product metafield**. Do this setup **once**; after that
you manage highlights per product from the product page.

> Prerequisite: upload & publish the latest theme ZIP first (the code that reads
> the metafield must be live).

---

## How it works

- Each product reads its **`custom.highlights`** metafield — a **list** of
  **"Product highlight"** metaobject entries.
- If a product has none set, the product page shows the theme's **shared
  fallback** blocks (edit those in Theme Editor → product section → *Highlight*
  blocks).

---

## Step 1 — Create the metaobject: "Product highlight"

**Shopify admin → Settings → Custom data → Metaobjects → Add definition**

- **Name:** `Product highlight`
- Add these **4 fields** (the *key* must match exactly — see the right column):

| Field name  | Type                     | Key (must be exact) | Notes |
|-------------|--------------------------|---------------------|-------|
| Title       | Single line text         | `title`             | e.g. "The Details" |
| Description | Single line text         | `description`       | e.g. "It has POCKETS!" |
| Icon        | Single line text         | `icon`              | built-in icon name (see list below) |
| Icon image  | File (accept images)     | `icon_image`        | optional — custom line-art icon; overrides Icon |

**Built-in icon names** you can put in the `icon` field:
`sparkle`, `leaf`, `pin`, `clock`, `lock`, `eye`, `bag`

> Tip: when adding a field, Shopify auto-suggests a key from the name. Click the
> key/"Edit" and make sure it is exactly `title`, `description`, `icon`,
> `icon_image` (all lowercase, underscore in `icon_image`).

**Save.**

---

## Step 2 — Create the product metafield: "Highlights"

**Shopify admin → Settings → Custom data → Products → Add definition**

- **Name:** `Highlights`
- **Namespace and key:** `custom.highlights`
- **Type:** `Metaobject` → select **Product highlight** → choose **List of entries**
  (so a product can have several highlights)

**Save.**

---

## Step 3 — Add highlights to a product

1. **Products →** open a product.
2. Scroll to the **Metafields** section → **Highlights**.
3. **Add entry** → create a new *Product highlight*:
   - **Title:** e.g. `The Design`
   - **Description:** e.g. `Pleats, please: thoughtful, flattering tailoring.`
   - **Icon:** e.g. `sparkle` (or upload an **Icon image**)
4. Add as many as you like; reorder by dragging.
5. **Save.**

That product now shows its own highlights. Repeat per product.

---

## Field keys quick reference (used by the theme)

The theme reads these exact keys — do not rename them:

```
product.metafields.custom.highlights   → list of Product highlight
  └─ title         (single line text)
  └─ description   (single line text)
  └─ icon          (single line text: sparkle | leaf | pin | clock | lock | eye | bag)
  └─ icon_image    (file/image, optional — overrides icon)
```

---

## Shared fallback (no metafield needed)

To change what shows on products **without** a metafield:

**Online Store → Themes → Customize → (a product) → Product section →**
edit the **Highlight** blocks (icon, title, description). You can also change the
section heading ("What Makes It Great") and whether it's open by default.

---

## Troubleshooting

- **Highlights are blank / not showing** → check the metaobject field **keys** are
  exactly `title`, `description`, `icon`, `icon_image`.
- **Icon missing** → the `icon` value must be one of the built-in names above, or
  set an **Icon image** instead.
- **Old content still showing** → re-upload & publish the latest theme ZIP, then
  hard-refresh (Cmd/Ctrl + Shift + R).
- **Metafield section not visible on the product** → finish Step 2 (the product
  metafield definition) first; it only appears after the definition exists.
