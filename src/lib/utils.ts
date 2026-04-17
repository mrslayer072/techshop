export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

const PERSIAN_DIGITS = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(input: string | number): string {
  return String(input).replace(/\d/g, (d) => PERSIAN_DIGITS[parseInt(d, 10)]);
}

export function toPersianPrice(num: number): string {
  const withSeparator = num.toLocaleString("en-US");
  return toPersianDigits(withSeparator);
}

export function discountPercent(
  price: number,
  originalPrice?: number,
): number | null {
  if (!originalPrice || originalPrice <= price) return null;
  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function slugify(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Prefix an absolute public asset path with the configured basePath.
 * Next.js does this automatically for <Link> and next/image, but raw <img>
 * tags and background-image URLs need it applied manually.
 */
export function withBase(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  if (!base) return path;
  if (!path.startsWith("/")) return path;
  return `${base}${path}`;
}
