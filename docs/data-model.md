# Data model

The entire product catalog lives in `src/data/products.ts` as a typed array. There is no database. This document describes the shape and how to add or change products safely.

---

## Types

Defined in `src/types/index.ts`:

```ts
export type CategorySlug =
  | "mobiles"
  | "laptops"
  | "headphones"
  | "tablets"
  | "accessories";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: CategorySlug;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: ProductSpecs;
}

export interface ProductSpecs {
  brand?: string;
  model?: string;
  color?: string;
  warranty?: string;
  weight?: string;
  dimensions?: string;
  screenSize?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  os?: string;
  connectionType?: string;
  driverSize?: string;
  frequency?: string;
  impedance?: string;
  material?: string;
}
```

### Field notes

| Field           | Constraints                                                                                  |
| --------------- | -------------------------------------------------------------------------------------------- |
| `id`            | Must be globally unique. Used as the route segment in `/products/[id]/` and as the cart key. |
| `name`          | Persian. Shown everywhere — cart, PDP, header in OG tags.                                    |
| `price`         | Toman, integer. No decimals; prices in Iran are whole numbers.                               |
| `originalPrice` | Optional. If present **and** greater than `price`, the product is considered discounted.     |
| `category`      | Persian display label (e.g. `"موبایل"`).                                                     |
| `categorySlug`  | Must match one of the 5 literal types. Drives filtering and `/products?category=…`.          |
| `image`         | Absolute path under `public/` (e.g. `/Mobiles/iphone-15.webp`). Always WebP.                 |
| `rating`        | 0–5, fractional allowed (e.g. 4.5). Rendered via `StarRating`.                               |
| `reviewCount`   | Integer. Also drives `sortBy: "popular"`.                                                    |
| `inStock`       | Boolean. Renders a disabled "Add to cart" and a badge when false.                            |
| `specs`         | All keys optional — render logic uses whichever keys are present.                            |

---

## Where the data is read

All reads go through `src/lib/api.ts`. Consumers never import `src/data/products.ts` directly.

| Function                                                  | Where used                                       |
| --------------------------------------------------------- | ------------------------------------------------ |
| `getProducts({ category, search, discountOnly, sortBy })` | `/products` catalog page                         |
| `searchProducts(query, limit)`                            | Header/home search dropdown                      |
| `getDiscountedProducts()`                                 | Home "special offers" rail                       |
| `getDiscountedByCategory(slug, limit)`                    | Per-category discount rows on home (shuffled)    |
| `getProductById(id)`                                      | PDP                                              |
| `getCategories()`                                         | Nav dropdown, category showcase                  |
| `getRelatedProducts(id, slug, limit)`                     | "Similar products" rail on PDP                   |
| `getAllProductIds()`                                      | `generateStaticParams` for PDP static generation |

Every function is `async` even though it resolves synchronously. See [`architecture.md`](./architecture.md) for the rationale.

---

## Adding a product

1. Add the image file to the matching folder in `public/` (e.g. `public/Mobiles/pixel-9.webp`). Must be WebP.
2. Append an entry to `src/data/products.ts`:

   ```ts
   {
     id: "pixel-9",
     name: "پیکسل ۹",
     description: "گوشی پرچم‌دار گوگل با دوربین بی‌نظیر",
     price: 48000000,
     originalPrice: 52000000,
     category: "موبایل",
     categorySlug: "mobiles",
     image: "/Mobiles/pixel-9.webp",
     rating: 4.7,
     reviewCount: 214,
     inStock: true,
     specs: {
       brand: "گوگل",
       screenSize: "۶.۳ اینچ",
       ram: "۱۲ گیگابایت",
       storage: "۲۵۶ گیگابایت",
       battery: "۴۷۰۰ میلی‌آمپر",
       os: "اندروید ۱۵",
     },
   },
   ```

3. If the ID is new, `getAllProductIds()` will automatically generate a new static route on the next build — no other change needed.

### Checklist

- [ ] `id` is unique and URL-safe
- [ ] Image exists at the path referenced by `image`
- [ ] Image is WebP
- [ ] `categorySlug` matches one of the five enum values
- [ ] `price` and `originalPrice` (if set) are integers in Toman
- [ ] Persian text uses the correct characters (`ی` U+06CC, `ک` U+06A9 — not the Arabic equivalents)

---

## Renaming or deleting a product

- **Renaming.** Prefer changing `name` only and keeping the `id`. Changing `id` breaks any bookmark pointing at `/products/<old-id>/` and silently drops it from carts that persisted the old ID in `localStorage`.
- **Deleting.** Remove the entry and the image. Existing cart sessions that still reference the ID will throw on PDP; `getProductById` returns `null`, which the page handles by redirecting home.

---

## Evolving to a real backend

Replace the body of each function in `src/lib/api.ts` with a `fetch` call. The Client Components calling these functions don't need to change — they already `await`. The hard parts:

- Product images will need to move to a CDN, and `image` becomes an absolute URL. `withBase()` no longer applies.
- PDP's `generateStaticParams` stops making sense — switch to `dynamic = "force-dynamic"` and drop `output: "export"`, which also means leaving GitHub Pages.
- Search probably belongs in the backend at that point; the in-memory filter in `searchProducts` doesn't scale.
