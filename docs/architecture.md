# Architecture

TechShop is a fully static, client-hydrated Next.js site. This document explains how the pieces fit together and why the boundaries are drawn where they are.

---

## Rendering model

The project uses `output: "export"` in `next.config.js`, which means every page is pre-rendered to HTML at build time. There is no Node server in production — GitHub Pages serves the contents of `./out` directly.

Consequences that shape the codebase:

- **No `/api` routes.** Anything that looks like an API call goes through `src/lib/api.ts`, which resolves against the static catalog in `src/data/products.ts`.
- **No runtime image optimization.** `images: { unoptimized: true }` is set and every image in `public/` is served as-is (pre-converted to WebP).
- **Product detail pages use `generateStaticParams`.** The PDP route in `src/app/products/[id]/` enumerates every product ID at build time so each one becomes its own HTML file.
- **Every interactive component is a Client Component.** Theme switching, cart state, dropdowns, form validation — all `"use client"`. The App Router's server-component default is still used for the route shell (layout, page) to keep bundles small.

---

## Module boundaries

```
┌──────────────────────────────────────────────────────────┐
│  src/app/*              Server components (route shells) │
│  └── render Client components, pass serializable props   │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│  src/components/*       Client components (UI)           │
│  └── call src/lib/api.ts, read contexts                  │
└──────────────────────────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│  src/lib/api.ts         Async facade                     │
│  └── reads from src/data/products.ts                     │
└──────────────────────────────────────────────────────────┘
```

The **async facade** in `src/lib/api.ts` is deliberate. Every function returns a `Promise` even though the data is in-memory, so:

- UI components already handle loading states and async data flow
- Swapping the catalog for a real REST/GraphQL backend later means editing one file, not rewriting every consumer

---

## State

Two React Contexts, both in `src/context/`:

### `CartContext`

- `items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`
- `isDrawerOpen`, `openDrawer`, `closeDrawer` (the slide-in cart drawer)
- `toast`, `showToast` (ephemeral "added to cart" toast)
- Persists `items` to `localStorage` under the key `techshop_cart_v1`
- Uses a `hydrated` flag to avoid writing before the first read — prevents clobbering saved carts during SSR hydration

### `ThemeContext`

- Reads `localStorage` for the user's preference, falls back to `prefers-color-scheme`
- Sets `data-theme="dark"` or `"light"` on `<html>`
- A `mounted` flag defers rendering the toggle icon until after hydration to avoid SSR mismatch

Both providers live in `src/app/layout.tsx`, wrapping `{children}`.

---

## Styling

Tailwind with a custom token layer. Tokens are defined as **space-separated RGB triplets** in `globals.css`:

```css
:root,
[data-theme="dark"] {
  --bg-primary: 9 9 11;
  --accent: 30 86 208;
  /* … */
}
```

and mapped in `tailwind.config.ts`:

```ts
colors: {
  "bg-primary": "rgb(var(--bg-primary) / <alpha-value>)",
  accent: "rgb(var(--accent) / <alpha-value>)",
  // …
}
```

This keeps `bg-bg-primary/60` working for alpha modifiers while still allowing theme swaps via a single attribute on `<html>`.

A handful of tokens (`--accent-soft`, `--border`) bake their alpha into `rgba()` directly because they're only ever used at that one opacity.

---

## Routing

App Router, flat where possible:

| Route                | File                                   |
| -------------------- | -------------------------------------- |
| `/`                  | `src/app/page.tsx`                     |
| `/products`          | `src/app/products/page.tsx`            |
| `/products/[id]`     | `src/app/products/[id]/page.tsx`       |
| `/cart`              | `src/app/cart/page.tsx`                |
| `/checkout`          | `src/app/checkout/page.tsx`            |
| `/about`, `/contact` | `src/app/about/page.tsx`, `…/contact/` |

Category filtering on `/products` uses a query string (`?category=mobiles`) rather than a dynamic segment, so there's only one HTML file to ship.

---

## basePath and static assets

On GitHub Pages the site lives under `/techshop/`. The build is configured via `NEXT_PUBLIC_BASE_PATH`:

```js
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
```

Next prefixes `<Link>` hrefs and `next/image` sources automatically. Raw `<img src="/foo.webp">` tags do **not** get prefixed, so the codebase uses a helper:

```ts
import { withBase } from "@/lib/utils";
<img src={withBase("/Mobiles/iphone-15.webp")} />;
```

See `src/lib/utils.ts`.

---

## Known limitations

- **Checkout is a demo.** `submitOrder()` returns a fake order number after a 1.2s delay. There is no payment integration.
- **Catalog is hardcoded.** Every product lives in `src/data/products.ts`. A real build would fetch from a CMS or commerce backend.
- **No i18n framework.** Persian strings are inlined in components. If a second locale is ever needed, this becomes the single largest refactor.
- **Cart item cap of 10 per SKU.** Enforced in `CartContext.addItem` / `updateQuantity`. This is a UX guard, not a business rule.
