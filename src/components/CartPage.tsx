"use client";

import Link from "next/link";
import { ShoppingBag, Trash2, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import QuantitySelector from "./QuantitySelector";
import { toPersianPrice, withBase } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } =
    useCart();
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState("");
  const total = getCartTotal();

  const handleApplyDiscount = () => {
    setDiscountError("کد نامعتبر است");
    setTimeout(() => setDiscountError(""), 3000);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <ShoppingBag size={56} className="mx-auto text-fg-muted" />
        <h2 className="text-xl font-bold text-fg-primary">
          سبد خرید شما خالی است
        </h2>
        <p className="text-fg-secondary text-sm">
          محصولات مورد علاقه خود را به سبد خرید اضافه کنید
        </p>
        <Link
          href="/products"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm"
        >
          مشاهده محصولات
          <ArrowLeft size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-fg-primary mb-6">سبد خرید</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 bg-bg-card border border-line rounded-xl p-4"
            >
              <Link
                href={`/products/${item.id}`}
                className="w-20 h-20 rounded-lg overflow-hidden bg-bg-elevated shrink-0"
              >
                <img
                  src={withBase(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  width={80}
                  height={80}
                />
              </Link>
              <div className="flex-1 min-w-0 flex flex-col gap-2">
                <Link
                  href={`/products/${item.id}`}
                  className="font-semibold text-fg-primary hover:text-accent-text transition-colors truncate"
                >
                  {item.name}
                </Link>
                <span className="text-sm text-fg-secondary tabular">
                  {toPersianPrice(item.price)} تومان
                </span>
                <div className="flex items-center justify-between mt-auto">
                  <QuantitySelector
                    value={item.quantity}
                    onChange={(qty) => updateQuantity(item.id, qty)}
                  />
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-accent-text tabular">
                      {toPersianPrice(item.price * item.quantity)} تومان
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label="حذف محصول"
                      className="text-fg-muted hover:text-danger transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={clearCart}
            className="text-sm text-danger hover:underline"
          >
            حذف همه محصولات
          </button>
        </div>

        {/* Order summary sidebar */}
        <div>
          <div className="sticky top-20 bg-bg-card border border-line rounded-2xl p-5 space-y-5">
            <h3 className="font-bold text-fg-primary">خلاصه سفارش</h3>

            {/* Discount code */}
            <div>
              <label className="text-sm text-fg-secondary mb-1.5 block">
                کد تخفیف
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className="flex-1 bg-search border border-line rounded-lg px-3 py-2 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted"
                  placeholder="کد تخفیف"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={handleApplyDiscount}
                  className="btn-primary px-4 py-2 rounded-lg text-sm font-medium"
                >
                  اعمال
                </button>
              </div>
              {discountError && (
                <p className="text-xs text-danger mt-1.5">{discountError}</p>
              )}
            </div>

            <div className="space-y-3 text-sm border-t border-line pt-4">
              <div className="flex justify-between text-fg-secondary">
                <span>جمع کل</span>
                <span className="tabular">{toPersianPrice(total)} تومان</span>
              </div>
              <div className="flex justify-between text-fg-secondary">
                <span>تخفیف</span>
                <span className="tabular">۰ تومان</span>
              </div>
              <div className="flex justify-between text-fg-secondary">
                <span>هزینه ارسال</span>
                <span className="text-success font-medium">رایگان</span>
              </div>
              <div className="flex justify-between font-bold text-fg-primary text-lg border-t border-line pt-3">
                <span>مبلغ قابل پرداخت</span>
                <span className="text-accent-text tabular">
                  {toPersianPrice(total)} تومان
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="btn-primary block text-center w-full py-3.5 rounded-xl font-semibold text-sm"
            >
              تکمیل خرید
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
