# TechShop (تک‌شاپ)

A Persian-language, RTL e-commerce storefront for consumer electronics — mobiles, laptops, tablets, headphones, and accessories.

Built as a fully static Next.js site. Product catalog, search, cart, and checkout all run client-side with no backend; orders are stubbed for demo purposes. Deployed to GitHub Pages.

**Live:** https://mrslayer072.github.io/techshop/

---

## Stack

| Layer     | Choice                                                   |
| --------- | -------------------------------------------------------- |
| Framework | Next.js 14 (App Router) with `output: export`            |
| Language  | TypeScript 5 (strict)                                    |
| Styling   | Tailwind CSS 3 + CSS custom properties                   |
| Icons     | lucide-react                                             |
| State     | React Context (cart, theme) + `localStorage` persistence |
| Fonts     | Vazirmatn (Persian)                                      |
| Hosting   | GitHub Pages via GitHub Actions                          |

No database, no API server, no runtime image optimization — everything ships as pre-rendered HTML + static assets.

---

## Quickstart

```bash
# Install
npm install

# Dev server (http://localhost:3000)
npm run dev

# Production build → ./out
npm run build
```

Requires **Node 20+**. The CI pipeline pins to Node 20 via `actions/setup-node`.

---

## Project layout

```
src/
├── app/                  # App Router routes + layout
│   ├── layout.tsx        # <html dir="rtl">, providers, global chrome
│   ├── page.tsx          # Home
│   ├── products/         # Catalog + PDP
│   ├── cart/             # Cart page
│   ├── checkout/         # 3-step checkout
│   ├── about/ contact/
│   └── globals.css       # Tailwind entry + design tokens
├── components/           # UI components (all presentational / client)
├── context/              # CartContext, ThemeContext
├── data/products.ts      # Static product catalog
├── lib/
│   ├── api.ts            # Async facade over src/data — swap for real API later
│   ├── validation.ts     # Form validators (Persian error strings)
│   └── utils.ts          # cn, digit conversion, withBase, slugify
└── types/index.ts        # Shared types (Product, CartItem, …)

public/                   # Product imagery (WebP), logos, hero art
.github/workflows/        # Pages deployment
```

---

## Key design decisions

- **Static export (`output: "export"`).** The catalog is small and rarely changes; SSG gives zero runtime cost and fits GitHub Pages. There is no `/api` route — that would require a server.
- **`src/lib/api.ts` is an async facade.** All data reads look like `await getProducts()` even though they resolve synchronously from `src/data/products.ts`. Replacing the backing store with a real API later is a one-file change.
- **Theme tokens as RGB triplets.** `--bg-primary: 9 9 11` (space-separated, no `rgb(...)`) so Tailwind's `bg-bg-primary/60` alpha-modifier syntax works. See `src/app/globals.css` and `tailwind.config.ts`.
- **`basePath` is environment-driven.** Local dev runs at `/`; GitHub Pages builds with `NEXT_PUBLIC_BASE_PATH=/techshop`. Raw `<img>` tags use `withBase()` because Next only auto-prefixes `<Link>` and `next/image`.
- **Cart persists in `localStorage`.** Hydration is gated on a `hydrated` flag so the first render matches the server and we only start writing after reading.
- **RTL is the default, not a mode.** `<html dir="rtl" lang="fa">` is set in the root layout. All spacing and flex ordering is written assuming RTL reading direction.

---

## Documentation

Deeper dives live in [`docs/`](./docs):

- [`architecture.md`](./docs/architecture.md) — module boundaries and rendering model
- [`development.md`](./docs/development.md) — local setup, scripts, coding conventions
- [`deployment.md`](./docs/deployment.md) — how GitHub Pages + `basePath` fits together
- [`data-model.md`](./docs/data-model.md) — product catalog shape and how to add products
- [`forms.md`](./docs/forms.md) — validation patterns for contact and checkout

---

## Scripts

| Script          | Purpose                                              |
| --------------- | ---------------------------------------------------- |
| `npm run dev`   | Next dev server with hot reload                      |
| `npm run build` | Static export to `./out`                             |
| `npm run start` | Serve a prebuilt `./out` (rarely needed — use Pages) |
| `npm run lint`  | ESLint via `next lint`                               |

---

## License

No public license is granted. All rights reserved by the repository owner.
