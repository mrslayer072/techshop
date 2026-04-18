# Deployment

TechShop deploys to GitHub Pages. Every push to `main` triggers a build-and-deploy workflow; there are no preview environments.

**Live URL:** https://mrslayer072.github.io/techshop/

---

## Pipeline

`.github/workflows/deploy.yml` defines two sequential jobs:

### `build`

1. `actions/checkout@v4`
2. `actions/setup-node@v4` pinned to Node 20, with npm cache
3. `npm ci` — reproducible install from `package-lock.json`
4. `npm run build` with `NEXT_PUBLIC_BASE_PATH=/techshop`
5. `touch out/.nojekyll` — keeps Pages from running Jekyll, which would eat files whose names start with `_`
6. `actions/upload-pages-artifact@v3` uploads `./out`

### `deploy`

1. `actions/deploy-pages@v4` picks up the artifact and publishes it to the `github-pages` environment

Concurrency is set to `group: pages` with `cancel-in-progress: false` so a mid-deploy push queues behind the current deploy instead of canceling it (avoids half-deployed states).

Permissions required on the workflow: `contents: read`, `pages: write`, `id-token: write`.

---

## basePath explained

GitHub Pages serves the site from `https://<user>.github.io/<repo>/`, i.e. under a path prefix. Without extra configuration, every absolute link in the app would 404.

`next.config.js` reads `NEXT_PUBLIC_BASE_PATH` at build time:

```js
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};
```

Effects:

| Element                          | Prefixed automatically? | Why                                     |
| -------------------------------- | ----------------------- | --------------------------------------- |
| `next/link` hrefs                | Yes                     | Next handles via `basePath`             |
| `next/image` sources             | Yes                     | Next handles via `assetPrefix`          |
| `<script>`, `<link>` in `<head>` | Yes                     | Emitted by Next's build                 |
| Raw `<img src="/…">`             | **No**                  | Wrap in `withBase()` from `@/lib/utils` |
| Raw `<a href="/…">`              | **No**                  | Use `<Link>` instead                    |
| CSS `url(...)` in globals.css    | **No**                  | Avoid — use component-scoped classes    |

The env var is re-exported so `withBase()` can read it in the browser at runtime.

---

## Local production smoke test

```bash
NEXT_PUBLIC_BASE_PATH=/techshop npm run build
npx serve out -l 3000
open http://localhost:3000/techshop/
```

If `/techshop/` serves the home page and product imagery loads, the deploy will too.

---

## Moving to a custom domain or a different path

- **Custom domain (e.g. `techshop.example.com`):** unset the env var so `basePath=""`. Then add `out/CNAME` and the DNS record. Update `deploy.yml` to drop the `NEXT_PUBLIC_BASE_PATH` env.
- **Different repo name:** update `NEXT_PUBLIC_BASE_PATH` in the workflow to match `/<new-repo-name>`.
- **User/org site (`<user>.github.io` with no suffix):** set `NEXT_PUBLIC_BASE_PATH=""` and publish from the `main` branch of a repo named `<user>.github.io`.

---

## First-time setup (for a fresh fork)

1. In **Settings → Pages**, set **Source** to "GitHub Actions".
2. In **Settings → Actions → General**, allow workflows to run and allow read/write on the `GITHUB_TOKEN`.
3. Push to `main`. The first workflow run creates the environment and the URL is printed in the deploy job's output.

---

## Failure modes to recognize

| Symptom                                         | Likely cause                                                      |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| Everything 404s at `/techshop/`                 | `basePath` missing from build → index.html was emitted at `/`     |
| Only some images 404                            | Raw `<img>` tag without `withBase()`                              |
| Files starting with `_next/` appear broken      | `.nojekyll` step didn't run; add `touch out/.nojekyll`            |
| Deploy runs but URL shows old content           | Pages CDN cache; hard refresh, or wait ~1 minute                  |
| `Error: Resource not accessible by integration` | Workflow permissions are too narrow — check the three perms above |
