# Development

## Prerequisites

- **Node 20+** (CI pins Node 20)
- npm (the lockfile is `package-lock.json`)

## Setup

```bash
git clone https://github.com/mrslayer072/techshop.git
cd techshop
npm install
npm run dev
```

The dev server runs at `http://localhost:3000`. No `basePath` is applied locally — that only kicks in when `NEXT_PUBLIC_BASE_PATH` is set (which CI does for production builds).

## Scripts

| Command         | What it does                     |
| --------------- | -------------------------------- |
| `npm run dev`   | Next dev server with hot reload  |
| `npm run build` | Static export to `./out`         |
| `npm run start` | Serve a prebuilt `./out` locally |
| `npm run lint`  | ESLint via `next lint`           |

## Reproducing a production build locally

```bash
NEXT_PUBLIC_BASE_PATH=/techshop npm run build
npx serve out -l 3000
# then visit http://localhost:3000/techshop/
```

The trailing slash matters — `trailingSlash: true` is set in `next.config.js` so every route is a directory with an `index.html`.

---

## Coding conventions

### Client vs server components

- Route files (`src/app/**/page.tsx`, `layout.tsx`) are **Server Components** by default. Keep them thin — fetch data via `src/lib/api.ts` and pass serializable props into Client Components.
- Any file in `src/components/` that uses hooks, event handlers, or browser APIs starts with `"use client"`.
- Never pass a function, class, or lucide icon component from a Server Component to a Client Component. That crashes the build. If a Client Component needs an icon keyed by a slug, do the lookup inside the Client Component (see `CategoryDiscountRow.tsx`).

### Paths and assets

- Import with the `@/` alias (configured in `tsconfig.json`): `import { cn } from "@/lib/utils"`.
- For raw `<img>` tags pointing at `public/`, wrap the path in `withBase()` from `src/lib/utils.ts` so it survives deployment under a `basePath`.
- Every product image in `public/` is WebP. New imagery should be converted before committing (`sharp` is available as a one-off script if you need it).

### Styling

- Use Tailwind utility classes plus the token colors defined in `tailwind.config.ts` (`bg-bg-primary`, `text-fg-secondary`, `border-line`, `text-danger`, etc.). Don't hardcode hex values.
- Dark mode uses the `[data-theme="dark"]` attribute set on `<html>`, not Tailwind's default `class` strategy with `.dark`. Theme variants are expressed through CSS variables, so in most cases components don't need `dark:` prefixes at all — the tokens already swap.
- Persian digits render through `toPersianDigits()` / `toPersianPrice()` from `src/lib/utils.ts`. Prices should always flow through `toPersianPrice()` so separators and digits are consistent.

### Forms

- All validation lives in `src/lib/validation.ts`. Don't inline `required` or regex checks in components.
- Validators return `string | null` — the Persian error message, or `null` for valid. Apply the `touched` pattern documented in [`forms.md`](./forms.md).
- Inputs that accept digits (phone, postal code) should normalize Persian/Arabic numerals to ASCII via `toEnglishDigits()` on change.

### Accessibility

- Every interactive element has an `aria-label` where the visible label is iconographic.
- Invalid form fields get `aria-invalid={true}` alongside the red border.
- The mobile drawer locks `document.body.style.overflow` while open. Anything else that takes over the viewport should do the same.

### Commits

- Present-tense imperative, short subject line ("Add form validation and fix mobile menu drawer"). No conventional-commits prefix — the project doesn't use one.
- Group related changes. A formatter pass on unrelated files doesn't belong in a feature commit.

---

## Hot spots to know about

- `src/data/products.ts` — the catalog. Large file; see [`data-model.md`](./data-model.md).
- `src/app/layout.tsx` — global chrome and providers. Editing this rebuilds every page.
- `next.config.js` — `basePath` logic. If images 404 in production, start here.
- `.github/workflows/deploy.yml` — only place the Pages URL is hardcoded (`/techshop`).

---

## Troubleshooting

**"Functions cannot be passed directly to Client Components."**
A Server Component is passing something non-serializable (a function, a component reference) down. Move that work inside a Client Component.

**Images 404 in production but work locally.**
You used a raw `<img>` tag without `withBase()`, or hardcoded `/techshop/...` in a `<Link>`. Use `withBase()` for `<img>`; use plain root paths for `<Link>` and let Next prefix them.

**Dark-mode flash on first paint.**
The theme script in `layout.tsx` runs before React hydrates to set `data-theme` synchronously. If you add a new themed surface, make sure it reads from CSS variables, not JS state.

**Persian text rendering as boxes.**
Vazirmatn is loaded via `next/font` in `layout.tsx`. If you build a standalone HTML preview (e.g., for an email template), re-link the font manually.
