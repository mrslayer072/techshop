import HomeSearch from "@/components/HomeSearch";
import Hero from "@/components/Hero";
import DiscountedProducts from "@/components/DiscountedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";
import CategoryDiscountRow from "@/components/CategoryDiscountRow";
import type { CategorySlug } from "@/types";

const CATEGORY_ROWS: { slug: CategorySlug; label: string }[] = [
  { slug: "mobiles", label: "موبایل" },
  { slug: "laptops", label: "لپ‌تاپ" },
  { slug: "tablets", label: "تبلت" },
  { slug: "headphones", label: "هدفون" },
  { slug: "accessories", label: "لوازم جانبی" },
];

export default function HomePage() {
  return (
    <>
      <HomeSearch />
      <Hero />

      {/* All-category hot deals */}
      <DiscountedProducts />

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <hr className="border-line" />
      </div>

      {/* Per-category discount rows */}
      {CATEGORY_ROWS.map((cat, i) => (
        <div key={cat.slug}>
          <CategoryDiscountRow slug={cat.slug} label={cat.label} />
          {i < CATEGORY_ROWS.length - 1 && (
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
              <hr className="border-line" />
            </div>
          )}
        </div>
      ))}

      <CategoryShowcase />
    </>
  );
}
