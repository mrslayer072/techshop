import { SearchX } from "lucide-react";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
        <div className="w-14 h-14 rounded-2xl bg-accent-soft flex items-center justify-center mb-2">
          <SearchX size={26} className="text-accent-text" />
        </div>
        <p className="text-fg-secondary text-lg">محصولی یافت نشد</p>
        <p className="text-fg-muted text-sm">
          فیلترها را تغییر دهید یا عبارت دیگری را جستجو کنید
        </p>
      </div>
    );
  }

  return (
    <div className="stagger grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
