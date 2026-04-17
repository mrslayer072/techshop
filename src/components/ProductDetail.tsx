"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, Check, XCircle } from "lucide-react";
import { useCart } from "@/context/CartContext";
import StarRating from "./StarRating";
import QuantitySelector from "./QuantitySelector";
import SpecsTable from "./SpecsTable";
import Breadcrumb from "./Breadcrumb";
import SimilarProducts from "./SimilarProducts";
import {
  toPersianPrice,
  discountPercent,
  toPersianDigits,
  withBase,
} from "@/lib/utils";
import type { Product } from "@/types";

export default function ProductDetail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [wishlist, setWishlist] = useState(false);
  const discount = discountPercent(product.price, product.originalPrice);

  const breadcrumbItems = [
    { label: "خانه", href: "/" },
    { label: "محصولات", href: "/products" },
    {
      label: product.category,
      href: `/products?category=${product.categorySlug}`,
    },
    { label: product.name },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
      <Breadcrumb items={breadcrumbItems} />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image — right side in RTL */}
        <div className="order-1 md:order-2">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-bg-card border border-line">
            {!imgLoaded && <div className="absolute inset-0 shimmer" />}
            <img
              src={withBase(product.image)}
              alt={product.name}
              width={600}
              height={600}
              className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
              onLoad={() => setImgLoaded(true)}
            />
            {discount && (
              <span className="absolute top-4 left-4 bg-danger text-white text-sm font-bold px-3 py-1.5 rounded-full">
                ٪{toPersianDigits(discount)} تخفیف
              </span>
            )}
          </div>
        </div>

        {/* Info — left side in RTL */}
        <div className="order-2 md:order-1 space-y-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-fg-primary mb-2">
              {product.name}
            </h1>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="inline-block bg-accent-soft text-accent-text text-xs font-semibold px-3 py-1 rounded-full hover:bg-accent/20 transition-colors"
            >
              {product.category}
            </Link>
          </div>

          <StarRating
            rating={product.rating}
            reviewCount={product.reviewCount}
            size={16}
          />

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-accent-text tabular">
              {toPersianPrice(product.price)}
            </span>
            <span className="text-base text-fg-secondary">تومان</span>
            {product.originalPrice && (
              <span className="text-lg text-fg-muted line-through tabular mr-2">
                {toPersianPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          {product.inStock ? (
            <div className="flex items-center gap-1.5 text-success text-sm">
              <Check size={16} />
              <span>موجود در انبار</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-danger text-sm">
              <XCircle size={16} />
              <span>ناموجود</span>
            </div>
          )}

          {/* Description */}
          <p className="text-fg-secondary leading-relaxed">
            {product.description}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex items-center gap-3">
              <QuantitySelector value={qty} onChange={setQty} />
              <button
                type="button"
                disabled={!product.inStock}
                onClick={() => addItem(product, qty)}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm flex-1 sm:flex-none justify-center active:animate-pulse-scale disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={18} />
                {product.inStock ? "افزودن به سبد خرید" : "ناموجود"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setWishlist(!wishlist)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-colors ${
                wishlist
                  ? "border-danger text-danger bg-danger/10"
                  : "border-line text-fg-secondary hover:border-line-hover hover:text-fg-primary"
              }`}
            >
              <Heart size={18} className={wishlist ? "fill-danger" : ""} />
              افزودن به علاقه‌مندی‌ها
            </button>
          </div>
        </div>
      </div>

      {/* Specs Table */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-fg-primary mb-5">مشخصات فنی</h2>
        <SpecsTable specs={product.specs} categorySlug={product.categorySlug} />
      </section>

      {/* Full Description */}
      {product.fullDescription && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-fg-primary mb-4">
            توضیحات کامل
          </h2>
          <div className="bg-bg-card border border-line rounded-xl p-6 text-fg-secondary leading-relaxed whitespace-pre-line">
            {product.fullDescription}
          </div>
        </section>
      )}

      {/* Similar Products */}
      <SimilarProducts
        productId={product.id}
        categorySlug={product.categorySlug}
      />
    </div>
  );
}
