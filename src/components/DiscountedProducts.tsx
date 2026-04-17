"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Flame, ArrowLeft } from "lucide-react";
import { getDiscountedProducts } from "@/lib/api";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function DiscountedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDiscountedProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Flame size={22} className="text-danger" />
          <h2 className="text-xl md:text-2xl font-bold text-fg-primary">
            پیشنهادهای ویژه
          </h2>
        </div>
        <Link
          href="/products?discount=true"
          className="hidden sm:flex items-center gap-1 text-sm text-accent-text hover:underline"
        >
          مشاهده همه تخفیف‌ها
          <ArrowLeft size={14} />
        </Link>
      </div>

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="min-w-[260px] h-[380px] rounded-2xl shimmer shrink-0"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x snap-mandatory">
          {products.map((p) => (
            <div
              key={p.id}
              className="min-w-[260px] max-w-[260px] snap-start shrink-0"
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}

      <Link
        href="/products?discount=true"
        className="sm:hidden flex items-center justify-center gap-1 text-sm text-accent-text hover:underline mt-4"
      >
        مشاهده همه تخفیف‌ها
        <ArrowLeft size={14} />
      </Link>
    </section>
  );
}
