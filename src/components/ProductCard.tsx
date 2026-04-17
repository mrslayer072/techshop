"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
import {
  toPersianPrice,
  discountPercent,
  toPersianDigits,
  withBase,
} from "@/lib/utils";
import type { Product } from "@/types";
import { useState } from "react";

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [imgLoaded, setImgLoaded] = useState(false);
  const discount = discountPercent(product.price, product.originalPrice);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-bg-card border border-line rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card hover:border-line-hover h-full"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-bg-elevated">
        {!imgLoaded && <div className="absolute inset-0 shimmer" />}
        <img
          src={withBase(product.image)}
          alt={product.name}
          width={400}
          height={400}
          loading="lazy"
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setImgLoaded(true)}
        />
        {/* Category badge */}
        <span className="absolute top-3 right-3 bg-accent-soft text-accent-text text-xs font-semibold px-2.5 py-1 rounded-full">
          {product.category}
        </span>
        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-danger text-white text-xs font-bold px-2 py-1 rounded-full">
            ٪{toPersianDigits(discount)}
          </span>
        )}
        {/* Out of stock overlay */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-bg-elevated/90 text-fg-primary px-4 py-2 rounded-lg text-sm font-semibold">
              ناموجود
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-fg-primary text-sm leading-tight line-clamp-1">
          {product.name}
        </h3>
        <p className="text-xs text-fg-secondary line-clamp-1">
          {product.description}
        </p>
        <StarRating
          rating={product.rating}
          reviewCount={product.reviewCount}
          size={12}
        />
        {/* Price */}
        <div className="mt-auto pt-2 flex items-end justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-accent-text tabular">
              {toPersianPrice(product.price)}{" "}
              <span className="text-xs font-normal text-fg-secondary">
                تومان
              </span>
            </span>
            {product.originalPrice && (
              <span className="text-xs text-fg-muted line-through tabular">
                {toPersianPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            aria-label="افزودن به سبد خرید"
            disabled={!product.inStock}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addItem(product);
            }}
            className="btn-primary w-9 h-9 rounded-xl flex items-center justify-center shrink-0 active:animate-pulse-scale disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </Link>
  );
}
