"use client";

import { useState } from "react";
import { Loader2, Check, ChevronLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { submitOrder } from "@/lib/api";
import OrderSuccess from "./OrderSuccess";
import { toPersianPrice, toPersianDigits, withBase } from "@/lib/utils";
import {
  validateFullName,
  validateIranianMobile,
  validateAddress,
  validatePostalCode,
  validateProvince,
  validateCity,
  toEnglishDigits,
} from "@/lib/validation";

const PROVINCES = [
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "مازندران",
  "کرمان",
  "گیلان",
  "خوزستان",
  "سیستان و بلوچستان",
  "مرکزی",
  "هرمزگان",
  "کرمانشاه",
  "گلستان",
  "البرز",
  "همدان",
  "یزد",
  "لرستان",
  "اردبیل",
  "بوشهر",
  "قم",
  "زنجان",
  "کردستان",
  "سمنان",
  "چهارمحال و بختیاری",
  "خراسان شمالی",
  "خراسان جنوبی",
  "ایلام",
  "کهگیلویه و بویراحمد",
  "قزوین",
];

const STEPS = [
  { key: "shipping", label: "اطلاعات ارسال" },
  { key: "payment", label: "روش پرداخت" },
  { key: "review", label: "بررسی نهایی" },
];

type ShippingKey =
  | "fullName"
  | "phone"
  | "address"
  | "postalCode"
  | "province"
  | "city";

export default function CheckoutForm() {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const [shipping, setShipping] = useState({
    fullName: "",
    phone: "",
    address: "",
    postalCode: "",
    province: "",
    city: "",
  });
  const [touched, setTouched] = useState<Record<ShippingKey, boolean>>({
    fullName: false,
    phone: false,
    address: false,
    postalCode: false,
    province: false,
    city: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<"online" | "cod">(
    "online",
  );

  const total = getCartTotal();

  const updateShipping = (key: ShippingKey, val: string) =>
    setShipping((p) => ({ ...p, [key]: val }));

  const markTouched = (key: ShippingKey) =>
    setTouched((p) => ({ ...p, [key]: true }));

  const rawErrors: Record<ShippingKey, string | null> = {
    fullName: validateFullName(shipping.fullName),
    phone: validateIranianMobile(shipping.phone),
    address: validateAddress(shipping.address),
    postalCode: validatePostalCode(shipping.postalCode),
    province: validateProvince(shipping.province),
    city: validateCity(shipping.city),
  };
  const errors: Record<ShippingKey, string | null> = {
    fullName: touched.fullName ? rawErrors.fullName : null,
    phone: touched.phone ? rawErrors.phone : null,
    address: touched.address ? rawErrors.address : null,
    postalCode: touched.postalCode ? rawErrors.postalCode : null,
    province: touched.province ? rawErrors.province : null,
    city: touched.city ? rawErrors.city : null,
  };
  const shippingValid = Object.values(rawErrors).every((e) => e === null);

  const handleContinueShipping = () => {
    if (!shippingValid) {
      // Reveal every error at once when the user tries to advance.
      setTouched({
        fullName: true,
        phone: true,
        address: true,
        postalCode: true,
        province: true,
        city: true,
      });
      return;
    }
    setStep(1);
  };

  const handleSubmitOrder = async () => {
    setLoading(true);
    const result = await submitOrder({ ...shipping, paymentMethod });
    setLoading(false);
    setOrderNumber(result.orderNumber);
    clearCart();
  };

  if (orderNumber) {
    return <OrderSuccess orderNumber={orderNumber} />;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16 text-fg-secondary">
        <p className="text-lg mb-2">سبد خرید شما خالی است</p>
        <a
          href="/products"
          className="text-accent-text hover:underline text-sm"
        >
          مشاهده محصولات
        </a>
      </div>
    );
  }

  // Base + error-state input classes, shared by all shipping fields.
  const baseInput =
    "w-full bg-search border rounded-xl px-4 py-3 text-sm text-fg-primary outline-none transition-colors placeholder:text-fg-muted";
  const inputClass = (err: string | null) =>
    `${baseInput} ${
      err
        ? "border-danger focus:border-danger"
        : "border-line focus:border-accent"
    }`;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            <button
              type="button"
              disabled={i > step}
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                i === step
                  ? "bg-accent text-white"
                  : i < step
                    ? "bg-accent-soft text-accent-text cursor-pointer"
                    : "bg-chip-bg text-fg-muted cursor-default"
              }`}
            >
              {i < step ? (
                <Check size={14} />
              ) : (
                <span className="tabular">{toPersianDigits(i + 1)}</span>
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </button>
            {i < STEPS.length - 1 && (
              <ChevronLeft size={14} className="text-fg-muted" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Shipping */}
      {step === 0 && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-xl font-bold text-fg-primary">اطلاعات ارسال</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={shipping.fullName}
                onChange={(e) => updateShipping("fullName", e.target.value)}
                onBlur={() => markTouched("fullName")}
                aria-invalid={!!errors.fullName}
                maxLength={60}
                className={inputClass(errors.fullName)}
                placeholder="نام کامل"
              />
              {errors.fullName && (
                <p className="text-xs text-danger mt-1.5">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                شماره تلفن
              </label>
              <input
                type="tel"
                value={shipping.phone}
                // Normalize Persian/Arabic digits as the user types so the stored
                // value is always ASCII — simpler to validate and submit.
                onChange={(e) =>
                  updateShipping("phone", toEnglishDigits(e.target.value))
                }
                onBlur={() => markTouched("phone")}
                aria-invalid={!!errors.phone}
                inputMode="tel"
                maxLength={15}
                className={inputClass(errors.phone)}
                placeholder="09123456789"
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-xs text-danger mt-1.5">{errors.phone}</p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm text-fg-secondary mb-1.5">
              آدرس کامل
            </label>
            <textarea
              rows={3}
              value={shipping.address}
              onChange={(e) => updateShipping("address", e.target.value)}
              onBlur={() => markTouched("address")}
              aria-invalid={!!errors.address}
              maxLength={250}
              className={`${inputClass(errors.address)} resize-none`}
              placeholder="آدرس دقیق محل ارسال"
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-danger">{errors.address ?? ""}</p>
              <p className="text-xs text-fg-muted tabular">
                {shipping.address.length}/250
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                استان
              </label>
              <select
                value={shipping.province}
                onChange={(e) => {
                  updateShipping("province", e.target.value);
                  markTouched("province");
                }}
                onBlur={() => markTouched("province")}
                aria-invalid={!!errors.province}
                className={inputClass(errors.province)}
              >
                <option value="">انتخاب استان</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-xs text-danger mt-1.5">{errors.province}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                شهر
              </label>
              <input
                type="text"
                value={shipping.city}
                onChange={(e) => updateShipping("city", e.target.value)}
                onBlur={() => markTouched("city")}
                aria-invalid={!!errors.city}
                maxLength={40}
                className={inputClass(errors.city)}
                placeholder="شهر"
              />
              {errors.city && (
                <p className="text-xs text-danger mt-1.5">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                کد پستی
              </label>
              <input
                type="text"
                value={shipping.postalCode}
                onChange={(e) =>
                  updateShipping("postalCode", toEnglishDigits(e.target.value))
                }
                onBlur={() => markTouched("postalCode")}
                aria-invalid={!!errors.postalCode}
                inputMode="numeric"
                maxLength={10}
                className={inputClass(errors.postalCode)}
                placeholder="کد پستی ۱۰ رقمی"
                dir="ltr"
              />
              {errors.postalCode && (
                <p className="text-xs text-danger mt-1.5">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleContinueShipping}
              className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm"
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-xl font-bold text-fg-primary">روش پرداخت</h2>
          <div className="space-y-3">
            {[
              {
                value: "online" as const,
                label: "پرداخت آنلاین",
                desc: "پرداخت از طریق درگاه بانکی",
              },
              {
                value: "cod" as const,
                label: "پرداخت در محل",
                desc: "پرداخت هنگام تحویل سفارش",
              },
            ].map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                  paymentMethod === opt.value
                    ? "border-accent bg-accent-soft"
                    : "border-line hover:border-line-hover"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={paymentMethod === opt.value}
                  onChange={() => setPaymentMethod(opt.value)}
                  className="accent-[var(--accent)]"
                />
                <div>
                  <span className="font-medium text-fg-primary text-sm">
                    {opt.label}
                  </span>
                  <p className="text-xs text-fg-muted">{opt.desc}</p>
                </div>
              </label>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="px-6 py-3 rounded-xl font-medium text-sm border border-line text-fg-secondary hover:bg-bg-card-hover transition-colors"
            >
              بازگشت
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm"
            >
              ادامه
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 2 && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-fg-primary">بررسی نهایی</h2>

          {/* Items summary */}
          <div className="bg-bg-card border border-line rounded-xl divide-y divide-line">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
                  <img
                    src={withBase(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    width={48}
                    height={48}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-fg-primary truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-fg-muted tabular">
                    {toPersianDigits(item.quantity)} عدد ×{" "}
                    {toPersianPrice(item.price)} تومان
                  </p>
                </div>
                <span className="text-sm font-semibold text-fg-primary tabular whitespace-nowrap">
                  {toPersianPrice(item.price * item.quantity)} تومان
                </span>
              </div>
            ))}
          </div>

          {/* Shipping info */}
          <div className="bg-bg-card border border-line rounded-xl p-4 space-y-2 text-sm">
            <h3 className="font-semibold text-fg-primary">اطلاعات ارسال</h3>
            <p className="text-fg-secondary">
              {shipping.fullName} — {shipping.phone}
            </p>
            <p className="text-fg-secondary">
              {shipping.province}، {shipping.city}، {shipping.address}
            </p>
            <p className="text-fg-muted">کد پستی: {shipping.postalCode}</p>
          </div>

          {/* Payment */}
          <div className="bg-bg-card border border-line rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-fg-primary mb-1">روش پرداخت</h3>
            <p className="text-fg-secondary">
              {paymentMethod === "online" ? "پرداخت آنلاین" : "پرداخت در محل"}
            </p>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-accent-soft rounded-xl p-4">
            <span className="font-bold text-fg-primary">مبلغ قابل پرداخت</span>
            <span className="text-xl font-bold text-accent-text tabular">
              {toPersianPrice(total)} تومان
            </span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3 rounded-xl font-medium text-sm border border-line text-fg-secondary hover:bg-bg-card-hover transition-colors"
            >
              بازگشت
            </button>
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              ثبت سفارش
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
