"use client";

import Link from "next/link";
import { Smartphone, Laptop, Headphones, Tablet, Plug } from "lucide-react";

const CATEGORIES = [
  { slug: "mobiles", name: "موبایل", Icon: Smartphone },
  { slug: "laptops", name: "لپ‌تاپ", Icon: Laptop },
  { slug: "headphones", name: "هدفون", Icon: Headphones },
  { slug: "tablets", name: "تبلت", Icon: Tablet },
  { slug: "accessories", name: "لوازم جانبی", Icon: Plug },
];

export default function CategoryDropdown() {
  return (
    <div className="absolute top-full right-0 mt-1 w-56 bg-bg-elevated border border-line rounded-xl shadow-card animate-fade-in z-50 overflow-hidden">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          href={`/products?category=${cat.slug}`}
          className="flex items-center gap-3 px-4 py-3 text-sm text-fg-secondary hover:bg-bg-card-hover hover:text-fg-primary transition-colors"
        >
          <cat.Icon size={16} className="text-accent-text" />
          {cat.name}
        </Link>
      ))}
      <div className="border-t border-line">
        <Link
          href="/products"
          className="flex items-center gap-3 px-4 py-3 text-sm text-accent-text font-semibold hover:bg-bg-card-hover transition-colors"
        >
          همه محصولات
        </Link>
      </div>
    </div>
  );
}
