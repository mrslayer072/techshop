"use client";

import { X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/context/CartContext";
import CartItemRow from "./CartItem";
import { toPersianPrice, toPersianDigits } from "@/lib/utils";

export default function CartDrawer() {
  const {
    items,
    isDrawerOpen,
    closeDrawer,
    removeItem,
    updateQuantity,
    getCartTotal,
    getCartCount,
  } = useCart();

  useEffect(() => {
    document.body.style.overflow = isDrawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  // Trap focus: close on Escape
  useEffect(() => {
    if (!isDrawerOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isDrawerOpen, closeDrawer]);

  const count = getCartCount();
  const total = getCartTotal();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      {/* Drawer – from LEFT (RTL) */}
      <div
        role="dialog"
        aria-label="سبد خرید"
        className={`fixed top-0 left-0 h-full w-[400px] max-w-[90vw] bg-bg-elevated z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent-text" />
            <span className="font-bold text-fg-primary">سبد خرید</span>
            {count > 0 && (
              <span className="text-xs bg-accent-soft text-accent-text rounded-full px-2 py-0.5 tabular">
                {toPersianDigits(count)} محصول
              </span>
            )}
          </div>
          <button
            onClick={closeDrawer}
            aria-label="بستن سبد خرید"
            className="w-9 h-9 rounded-lg hover:bg-bg-card-hover flex items-center justify-center text-fg-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={48} className="text-fg-muted" />
              <p className="text-fg-secondary">سبد خرید شما خالی است</p>
              <Link
                href="/products"
                onClick={closeDrawer}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium"
              >
                مشاهده محصولات
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onRemove={removeItem}
                onQuantityChange={updateQuantity}
                onNavigate={closeDrawer}
              />
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-line px-5 py-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-fg-secondary">جمع کل:</span>
              <span className="font-bold text-lg text-accent-text tabular">
                {toPersianPrice(total)} تومان
              </span>
            </div>
            <div className="flex gap-2">
              <Link
                href="/cart"
                onClick={closeDrawer}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium border border-line hover:bg-bg-card-hover text-fg-primary transition-colors"
              >
                مشاهده سبد خرید
              </Link>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="flex-1 text-center py-2.5 rounded-xl text-sm font-medium btn-primary"
              >
                تکمیل خرید
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
