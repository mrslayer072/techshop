"use client";

import { useEffect, useState } from "react";
import { getRelatedProducts } from "@/lib/api";
import ProductCard from "./ProductCard";
import type { Product } from "@/types";

export default function SimilarProducts({
  productId,
  categorySlug,
}: {
  productId: string;
  categorySlug: string;
}) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    getRelatedProducts(productId, categorySlug, 6).then(setProducts);
  }, [productId, categorySlug]);

  if (products.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-fg-primary mb-5">محصولات مشابه</h2>
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
    </section>
  );
}
