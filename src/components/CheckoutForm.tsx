"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Check, ChevronLeft, MapPin, Plus, Star } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import OrderSuccess from "./OrderSuccess";
import AddressFormDialog from "./profile/AddressFormDialog";
import type { Address } from "./profile/ProfileAddressesTab";
import { toPersianPrice, toPersianDigits, withBase } from "@/lib/utils";

const STEPS = [
  { key: "shipping", label: "آدرس ارسال" },
  { key: "payment", label: "روش پرداخت" },
  { key: "review", label: "بررسی نهایی" },
];

interface CreateOrderResponse {
  id: string;
  orderNumber: string;
}

/**
 * Checkout is now authenticated + address-book-driven:
 *   1. Pick a saved address (or add a new one via the reusable dialog).
 *   2. Pick payment method.
 *   3. Review and submit to POST /orders.
 *
 * The backend is the source of truth for stock + total + order number.
 * We send `{ items, addressId, paymentMethod, notes? }`; the server
 * re-prices, snapshots the address, decrements stock transactionally,
 * and returns the canonical order.
 */
export default function CheckoutForm() {
  const { items, getCartTotal, clearCart } = useCart();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Address book state — fetched on mount, refetched after a new address
  // is added via the inline dialog.
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addrError, setAddrError] = useState<string | null>(null);
  const [selectedAddrId, setSelectedAddrId] = useState<string | null>(null);
  const [addrDialogOpen, setAddrDialogOpen] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<"ONLINE" | "COD">(
    "ONLINE",
  );

  const total = getCartTotal();

  const loadAddresses = useCallback(async () => {
    setAddrLoading(true);
    setAddrError(null);
    try {
      const data = await apiClient.get<Address[]>("/user/addresses");
      setAddresses(data);
      // Auto-select: prefer the default, otherwise the first one. Only do
      // this if nothing is selected yet so we don't override a user pick
      // after a refetch.
      setSelectedAddrId((prev) => {
        if (prev && data.some((a) => a.id === prev)) return prev;
        const def = data.find((a) => a.isDefault);
        return def?.id ?? data[0]?.id ?? null;
      });
    } catch (err) {
      setAddrError(
        err instanceof ApiRequestError ? err.message : "خطا در دریافت آدرس‌ها",
      );
    } finally {
      setAddrLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const selectedAddr = addresses.find((a) => a.id === selectedAddrId) ?? null;

  const handleContinueShipping = () => {
    if (!selectedAddr) return;
    setStep(1);
  };

  const handleSubmitOrder = async () => {
    if (!selectedAddr) return;
    setSubmitError(null);
    setLoading(true);
    try {
      const res = await apiClient.post<CreateOrderResponse>("/orders", {
        items: items.map((it) => ({
          productId: it.id,
          quantity: it.quantity,
        })),
        addressId: selectedAddr.id,
        paymentMethod,
      });
      setOrderNumber(res.orderNumber);
      clearCart();
    } catch (err) {
      setSubmitError(
        err instanceof ApiRequestError ? err.message : "ثبت سفارش انجام نشد.",
      );
    } finally {
      setLoading(false);
    }
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

      {/* Step 1: Address picker */}
      {step === 0 && (
        <div className="space-y-5 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-fg-primary">آدرس ارسال</h2>
            <button
              type="button"
              onClick={() => setAddrDialogOpen(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-accent-text hover:opacity-80"
            >
              <Plus size={15} />
              آدرس جدید
            </button>
          </div>

          {addrLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={24} className="animate-spin text-fg-muted" />
            </div>
          ) : addrError ? (
            <div
              role="alert"
              className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
            >
              {addrError}
            </div>
          ) : addresses.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-line rounded-xl">
              <MapPin
                size={28}
                className="mx-auto mb-3 text-fg-muted opacity-70"
              />
              <p className="text-sm text-fg-secondary mb-3">
                هنوز آدرسی ثبت نکرده‌اید.
              </p>
              <button
                type="button"
                onClick={() => setAddrDialogOpen(true)}
                className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
              >
                <Plus size={15} />
                افزودن آدرس
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {addresses.map((a) => {
                const active = a.id === selectedAddrId;
                return (
                  <label
                    key={a.id}
                    className={`block p-4 rounded-xl border cursor-pointer transition-colors ${
                      active
                        ? "border-accent bg-accent-soft"
                        : "border-line hover:border-line-hover"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        name="address"
                        value={a.id}
                        checked={active}
                        onChange={() => setSelectedAddrId(a.id)}
                        className="accent-[var(--accent)] mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-fg-primary text-sm">
                            {a.fullName}
                          </span>
                          {a.isDefault && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-accent-text bg-accent-soft px-2 py-0.5 rounded-full border border-accent/30">
                              <Star size={10} />
                              پیش‌فرض
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-fg-secondary leading-5">
                          {a.province}، {a.city}، {a.address}
                        </p>
                        <p className="text-xs text-fg-muted mt-1">
                          کد پستی: {a.postalCode} • {a.phone}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>
          )}

          {addresses.length > 0 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={handleContinueShipping}
                disabled={!selectedAddr}
                className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ادامه
              </button>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 1 && (
        <div className="space-y-5 animate-fade-in">
          <h2 className="text-xl font-bold text-fg-primary">روش پرداخت</h2>
          <div className="space-y-3">
            {[
              {
                value: "ONLINE" as const,
                label: "پرداخت آنلاین",
                desc: "پرداخت از طریق درگاه بانکی",
              },
              {
                value: "COD" as const,
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
      {step === 2 && selectedAddr && (
        <div className="space-y-6 animate-fade-in">
          <h2 className="text-xl font-bold text-fg-primary">بررسی نهایی</h2>

          {/* Items summary */}
          <div className="bg-bg-card border border-line rounded-xl divide-y divide-line">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
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
              {selectedAddr.fullName} — {selectedAddr.phone}
            </p>
            <p className="text-fg-secondary">
              {selectedAddr.province}، {selectedAddr.city}،{" "}
              {selectedAddr.address}
            </p>
            <p className="text-fg-muted">کد پستی: {selectedAddr.postalCode}</p>
          </div>

          {/* Payment */}
          <div className="bg-bg-card border border-line rounded-xl p-4 text-sm">
            <h3 className="font-semibold text-fg-primary mb-1">روش پرداخت</h3>
            <p className="text-fg-secondary">
              {paymentMethod === "ONLINE" ? "پرداخت آنلاین" : "پرداخت در محل"}
            </p>
          </div>

          {/* Total — still shown from local cart for instant feedback; the
              server re-prices on submit and is authoritative. */}
          <div className="flex items-center justify-between bg-accent-soft rounded-xl p-4">
            <span className="font-bold text-fg-primary">مبلغ قابل پرداخت</span>
            <span className="text-xl font-bold text-accent-text tabular">
              {toPersianPrice(total)} تومان
            </span>
          </div>

          {submitError && (
            <div
              role="alert"
              className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
            >
              {submitError}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              disabled={loading}
              className="px-6 py-3 rounded-xl font-medium text-sm border border-line text-fg-secondary hover:bg-bg-card-hover transition-colors disabled:opacity-50"
            >
              بازگشت
            </button>
            <button
              type="button"
              onClick={handleSubmitOrder}
              disabled={loading}
              className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm disabled:opacity-60"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              ثبت سفارش
            </button>
          </div>
        </div>
      )}

      {addrDialogOpen && (
        <AddressFormDialog
          onClose={() => setAddrDialogOpen(false)}
          onSaved={async () => {
            setAddrDialogOpen(false);
            // Refetch so the new address (and any isDefault reshuffle) shows up.
            // We can't easily pick out the new id here without racing a refetch,
            // so we clear the selection and let the loader reapply the default.
            setSelectedAddrId(null);
            await loadAddresses();
          }}
        />
      )}
    </div>
  );
}
