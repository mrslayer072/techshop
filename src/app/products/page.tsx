"use client";

import { Suspense, useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { getProducts } from "@/lib/api";
import ProductGrid from "@/components/ProductGrid";
import ProductFilters from "@/components/ProductFilters";
import ProductSort from "@/components/ProductSort";
import { toPersianDigits } from "@/lib/utils";
import type { Product, SortBy } from "@/types";

function ProductsInner() {
  const params = useSearchParams();
  const router = useRouter();

  const categoryParam = params.get("category") ?? "";
  const searchParam = params.get("search") ?? "";
  const discountParam = params.get("discount") === "true";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(searchParam);
  const [sort, setSort] = useState<SortBy>("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync search input when URL param changes
  useEffect(() => {
    setSearchInput(searchParam);
  }, [searchParam]);

  useEffect(() => {
    setLoading(true);
    getProducts({
      category: categoryParam || undefined,
      search: searchParam || undefined,
      discountOnly: discountParam || undefined,
      sortBy: sort,
    }).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [categoryParam, searchParam, discountParam, sort]);

  const updateQuery = useCallback(
    (updates: Record<string, string | null>) => {
      const current = new URLSearchParams(params.toString());
      Object.entries(updates).forEach(([k, v]) => {
        if (v === null || v === "") current.delete(k);
        else current.set(k, v);
      });
      const q = current.toString();
      router.push(q ? `/products?${q}` : "/products");
    },
    [params, router],
  );

  const handleCategoryChange = (slug: string) =>
    updateQuery({ category: slug || null });
  const handleDiscountChange = (val: boolean) =>
    updateQuery({ discount: val ? "true" : null });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateQuery({ search: searchInput.trim() || null });
  };

  const titleParts: string[] = [];
  if (categoryParam) {
    const map: Record<string, string> = {
      mobiles: "موبایل",
      laptops: "لپ‌تاپ",
      headphones: "هدفون",
      tablets: "تبلت",
      accessories: "لوازم جانبی",
    };
    titleParts.push(map[categoryParam] ?? "محصولات");
  }
  if (discountParam) titleParts.push("تخفیف‌دار");
  if (searchParam) titleParts.push(`"${searchParam}"`);
  const pageTitle =
    titleParts.length > 0 ? titleParts.join(" • ") : "همه محصولات";

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar filters */}
        <ProductFilters
          activeCategory={categoryParam}
          discountOnly={discountParam}
          onCategoryChange={handleCategoryChange}
          onDiscountChange={handleDiscountChange}
          isMobileOpen={filtersOpen}
          onMobileClose={() => setFiltersOpen(false)}
        />

        {/* Main */}
        <div className="flex-1 min-w-0">
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-fg-primary mb-1">
              {pageTitle}
            </h1>
            <p className="text-sm text-fg-muted tabular">
              {toPersianDigits(products.length)} محصول یافت شد
            </p>
          </div>

          {/* Top bar: search + sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <Search
                size={16}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none"
              />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="جستجو در محصولات..."
                className="w-full bg-search border border-line rounded-xl pr-10 pl-4 py-2.5 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted"
              />
            </form>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setFiltersOpen(true)}
                className="lg:hidden flex items-center gap-1.5 border border-line rounded-xl px-3 py-2.5 text-sm text-fg-primary hover:bg-bg-card-hover transition-colors"
              >
                <SlidersHorizontal size={15} />
                فیلترها
              </button>
              <ProductSort value={sort} onChange={setSort} />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl h-[380px] shimmer" />
              ))}
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="rounded-2xl h-[400px] shimmer" />
        </div>
      }
    >
      <ProductsInner />
    </Suspense>
  );
}
