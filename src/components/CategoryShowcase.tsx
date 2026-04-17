"use client";

import Link from "next/link";
import { Smartphone, Laptop, Headphones, Tablet, Plug } from "lucide-react";
import { useEffect, useState } from "react";
import { getCategories } from "@/lib/api";
import { toPersianDigits } from "@/lib/utils";

const ICONS: Record<string, typeof Smartphone> = {
  mobiles: Smartphone,
  laptops: Laptop,
  headphones: Headphones,
  tablets: Tablet,
  accessories: Plug,
};

export default function CategoryShowcase() {
  const [categories, setCategories] = useState<
    { slug: string; name: string; count: number }[]
  >([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
      <h2 className="text-xl md:text-2xl font-bold text-fg-primary mb-6">
        دسته‌بندی‌ها
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {categories.map((cat) => {
          const Icon = ICONS[cat.slug] ?? Plug;
          return (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-bg-card border border-line hover:border-accent/40 hover:shadow-card transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-xl bg-accent-soft flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Icon size={26} className="text-accent-text" />
              </div>
              <span className="font-semibold text-fg-primary text-sm">
                {cat.name}
              </span>
              <span className="text-xs text-fg-muted">
                {toPersianDigits(cat.count)} محصول
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
