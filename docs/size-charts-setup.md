# Size Charts — admin setup (Metaobjects)

Manage every size chart from the Shopify admin (no code). The theme reads a
`size_chart` **metaobject**; the Size Guide page shows all charts, and the
product popup shows the chart(s) matching the product's **tag**.

Measurements are entered in **inches** — the theme shows an **Inches / cm**
toggle and converts to cm automatically.

> Until you create any metaobject entries, the theme uses 5 built-in fallback
> charts, so nothing breaks before setup.

---

## Step 1 — Create the metaobject definition: "Size chart"

**Shopify admin → Settings → Custom data → Metaobjects → Add definition**

- **Name:** `Size chart`  (this creates the type key `size_chart`)
- Under **Options**, enable **"Storefronts"** access (so the theme can read it).
- Add these **fields** (keys must match exactly):

| Field name | Type | Key | Notes |
|-----------|------|-----|-------|
| Title | Single line text | `title` | e.g. "Shirt Dress" — shows as heading + button |
| Tag | Single line text | `tag` | product tag(s) that show this chart, e.g. `chart-shirt-dress` (comma-separate for more) |
| Headers | Single line text | `headers` | column labels, comma-separated, first must be `Size` |
| Rows | Multi-line text | `rows` | one size per line, values comma-separated, **in inches** |

**Save.**

---

## Step 2 — Add a chart entry

**Settings → Custom data → Metaobjects → Size chart → Add entry**

Example — **Shirt Dress**:

- **Title:** `Shirt Dress`
- **Tag:** `chart-shirt-dress`
- **Headers:** `Size, Chest, Waist, Hip, Sleeve Opening, Length`
- **Rows:**
  ```
  XS, 38, 30, 50, 15.5, 34
  S, 40, 32, 52, 16, 34.25
  M, 42, 34, 54, 16.5, 34.5
  L, 44, 36, 56, 17, 35
  XL, 46, 38, 58, 17.5, 35.5
  2XL, 48, 40, 60, 18, 36
  3XL, 50, 42, 62, 18.5, 36.5
  ```

Repeat for each category. Every category can have **different columns** — just
change the Headers line and the values.

---

## Step 3 — Tag your products

On each product (Products → a product → **Tags**), add the matching tag:

| Product | Tag |
|---------|-----|
| Shirt dresses | `chart-shirt-dress` |
| Lace tops | `chart-lace-top` |
| Long co-ord set tops | `chart-long-coord-top` |
| Short co-ord set (both pieces) | `chart-short-coord-top` **and** `chart-short-coord-skirt` |

A product with two chart tags shows **both** charts in its popup.

---

## Current chart data (copy-paste into entries)

**Short Co-ord Set — Top** · tag `chart-short-coord-top`
Headers: `Size, Chest, Waist, Bottom Hem, Shoulder, Arm Hole`
```
XS, 34, 30, 38, 14.25, 17
S, 36, 32, 40, 15.25, 17.5
M, 38, 34, 42, 16.25, 18.5
L, 40, 36, 44, 16.75, 19.5
XL, 42, 38, 46, 17.25, 20.5
2XL, 44, 40, 48, 17.5, 22
3XL, 46, 42, 50, 18.25, 22.5
```

**Short Co-ord Set — Skirt** · tag `chart-short-coord-skirt`
Headers: `Size, Waist, Hip, Bottom Flare, Length`
```
XS, 27, 38, 41, 15.5
S, 29, 40, 43, 15.75
M, 31, 42, 45, 16
L, 33, 44, 47, 16.5
XL, 35, 46, 49, 17
2XL, 37, 48, 51, 17.5
3XL, 39, 50, 53, 18
```

**Shirt Dress** · tag `chart-shirt-dress`
Headers: `Size, Chest, Waist, Hip, Sleeve Opening, Length`
```
XS, 38, 30, 50, 15.5, 34
S, 40, 32, 52, 16, 34.25
M, 42, 34, 54, 16.5, 34.5
L, 44, 36, 56, 17, 35
XL, 46, 38, 58, 17.5, 35.5
2XL, 48, 40, 60, 18, 36
3XL, 50, 42, 62, 18.5, 36.5
```

**Lace Top** · tag `chart-lace-top`
Headers: `Size, Chest, Waist, Shoulder, Arm Hole, Length`
```
XS, 34, 30, 14.25, 17, 20
S, 36, 32, 15.25, 17.5, 20.5
M, 38, 34, 16.25, 18.5, 21
L, 40, 36, 16.75, 19.5, 21.5
XL, 42, 38, 17.25, 20.5, 22
2XL, 44, 40, 17.5, 22, 22.5
3XL, 46, 42, 18.25, 22.5, 23
```

**Long Co-ord Set — Top** · tag `chart-long-coord-top`
Headers: `Size, Chest, Waist, Shoulder, Arm Hole, Length`
```
XS, 34, 30, 14.25, 17, 20
S, 36, 32, 15.25, 17.5, 20.5
M, 38, 34, 16.25, 18.5, 21
L, 40, 36, 16.75, 19.5, 21.5
XL, 42, 38, 17.25, 20.5, 22
2XL, 44, 40, 17.5, 22, 22.5
3XL, 46, 42, 18.25, 22.5, 23
```

---

## Notes

- **Inches only** — enter inches; the theme's cm toggle converts (× 2.54).
- **Order** — charts appear in the order the metaobject lists entries.
- **No entries?** — the 5 built-in charts above are used automatically.
- **Field keys** must be exactly `title`, `tag`, `headers`, `rows`.
- After creating entries, re-check `/pages/size-guide` and a product's size-chart
  popup.
