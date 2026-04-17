/** @type {import('next').NextConfig} */

// When building for GitHub Pages, the site lives under /<repo-name>/,
// so we need basePath + assetPrefix. Locally we want them empty.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

module.exports = nextConfig;
