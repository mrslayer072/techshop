"use client";

import {
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Plug,
  Filter,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { slug: "mobiles", name: "موبایل", Icon: Smartphone },
  { slug: "laptops", name: "لپ‌تاپ", Icon: Laptop },
  { slug: "headphones", name: "هدفون", Icon: Headphones },
  { slug: "tablets", name: "تبلت", Icon: Tablet },
  { slug: "accessories", name: "لوازم جانبی", Icon: Plug },
];

export default function ProductFilters({
  activeCategory,
  discountOnly,
  onCategoryChange,
  onDiscountChange,
  isMobileOpen,
  onMobileClose,
}: {
  activeCategory: string;
  discountOnly: boolean;
  onCategoryChange: (slug: string) => void;
  onDiscountChange: (val: boolean) => void;
  isMobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const content = (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold text-fg-primary text-sm mb-3 flex items-center gap-2">
          <Filter size={15} className="text-accent-text" />
          دسته‌بندی
        </h3>
        <div className="space-y-1">
          <button
            type="button"
            onClick={() => onCategoryChange("")}
            className={cn(
              "w-full text-right px-3 py-2 rounded-lg text-sm transition-colors",
              !activeCategory
                ? "bg-accent-soft text-accent-text font-semibold"
                : "text-fg-secondary hover:bg-bg-card-hover hover:text-fg-primary",
            )}
          >
            همه محصولات
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => onCategoryChange(cat.slug)}
              className={cn(
                "w-full flex items-center gap-2 text-right px-3 py-2 rounded-lg text-sm transition-colors",
                activeCategory === cat.slug
                  ? "bg-accent-soft text-accent-text font-semibold"
                  : "text-fg-secondary hover:bg-bg-card-hover hover:text-fg-primary",
              )}
            >
              <cat.Icon size={15} />
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line pt-4">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-fg-primary">فقط تخفیف‌دار</span>
          <button
            type="button"
            role="switch"
            aria-checked={discountOnly}
            onClick={() => onDiscountChange(!discountOnly)}
            className={cn(
              "relative w-11 h-6 rounded-full transition-colors",
              discountOnly ? "bg-accent" : "bg-bg-elevated border border-line",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform",
                discountOnly ? "left-0.5" : "left-[22px]",
              )}
            />
          </button>
        </label>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20 bg-bg-card border border-line rounded-2xl p-5">
          {content}
        </div>
      </aside>

      {/* Mobile bottom sheet */}
      <div
        onClick={onMobileClose}
        className={cn(
          "fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300",
          isMobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-bg-elevated border-t border-line rounded-t-2xl transition-transform duration-300 max-h-[70vh] overflow-y-auto",
          isMobileOpen ? "translate-y-0" : "translate-y-full",
        )}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <span className="font-bold text-fg-primary">فیلترها</span>
          <button
            onClick={onMobileClose}
            className="w-8 h-8 rounded-lg hover:bg-bg-card-hover flex items-center justify-center text-fg-secondary"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{content}</div>
      </div>
    </>
  );
}
