"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Package,
} from "lucide-react";
import { getDiscountedByCategory } from "@/lib/api";
import ProductCard from "./ProductCard";
import type { CategorySlug, Product } from "@/types";

// Icon lookup lives here (client component) so the server page never passes functions as props
const ICONS: Record<CategorySlug, React.ElementType> = {
  mobiles: Smartphone,
  laptops: Laptop,
  headphones: Headphones,
  tablets: Tablet,
  accessories: Package,
};

interface Props {
  slug: CategorySlug;
  label: string;
}

export default function CategoryDiscountRow({ slug, label }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiscountedByCategory(slug, 10).then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, [slug]);

  // Don't render the row at all if the category has no discounts after loading
  if (!loading && products.length === 0) return null;

  const Icon = ICONS[slug];

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent-soft flex items-center justify-center shrink-0">
            <Icon size={16} className="text-accent-text" />
          </div>
          <h2 className="text-lg md:text-xl font-bold text-fg-primary">
            تخفیف‌های ویژه {label}
          </h2>
        </div>
        <Link
          href={`/products?category=${slug}&discount=true`}
          className="hidden sm:flex items-center gap-1 text-sm text-accent-text hover:underline"
        >
          همه {label}‌ها
          <ArrowLeft size={14} />
        </Link>
      </div>

      {/* Horizontal scroll row */}
      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[240px] h-[360px] rounded-2xl shimmer shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {products.map((p) => (
            <div
              key={p.id}
              className="min-w-[240px] max-w-[240px] snap-start shrink-0"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      <Link
        href={`/products?category=${slug}&discount=true`}
        className="sm:hidden flex items-center justify-center gap-1 text-sm text-accent-text hover:underline mt-4"
      >
        همه {label}‌ها
        <ArrowLeft size={14} />
      </Link>
    </section>
  );
}
