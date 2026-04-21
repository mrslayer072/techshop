"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Package } from "lucide-react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { toPersianDigits, toPersianPrice, withBase } from "@/lib/utils";

type Status = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  status: Status;
  paymentMethod: "ONLINE" | "CASH_ON_DELIVERY";
  total: number;
  notes?: string | null;
  shipFullName: string;
  shipPhone: string;
  shipProvince: string;
  shipCity: string;
  shipAddress: string;
  shipPostalCode: string;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// Keep the label map in one place so the badge and the filter stay in sync.
const STATUS_LABEL: Record<Status, string> = {
  PENDING: "در انتظار تایید",
  CONFIRMED: "تایید شده",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
};

// Tailwind classes per status — chosen for contrast, not brand color.
const STATUS_TONE: Record<Status, string> = {
  PENDING: "bg-chip-bg text-fg-secondary",
  CONFIRMED: "bg-accent-soft text-accent-text",
  SHIPPED: "bg-accent-soft text-accent-text",
  DELIVERED: "bg-accent-soft text-accent-text",
  CANCELLED: "bg-danger-soft text-danger",
};

function formatDate(iso: string): string {
  // Persian locale + Tehran tz so dates match what the user sees elsewhere
  // in the app. Falls back to the raw ISO string on exotic platforms.
  try {
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

export default function ProfileOrdersTab() {
  const [items, setItems] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Order[]>("/orders?limit=50");
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "خطا در دریافت سفارش‌ها",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-fg-primary">سفارش‌های من</h2>
        <p className="text-sm text-fg-secondary mt-1">
          سفارش‌های ثبت‌شده و وضعیت فعلی آن‌ها را مشاهده کنید.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-fg-muted" />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
        >
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-fg-secondary">
          <Package size={32} className="mx-auto mb-3 opacity-60" />
          <p className="text-sm">هنوز سفارشی ثبت نکرده‌اید.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {items.map((order) => (
            <li
              key={order.id}
              className="border border-line rounded-xl overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-bg-elevated">
                <div>
                  <div className="text-sm font-semibold text-fg-primary tabular">
                    {order.orderNumber}
                  </div>
                  <div className="text-xs text-fg-muted">
                    {formatDate(order.createdAt)}
                  </div>
                </div>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_TONE[order.status]}`}
                >
                  {STATUS_LABEL[order.status]}
                </span>
              </div>

              <div className="divide-y divide-line">
                {order.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-bg-elevated shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={withBase(it.productImage)}
                        alt={it.productName}
                        className="w-full h-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-fg-primary truncate">
                        {it.productName}
                      </p>
                      <p className="text-xs text-fg-muted tabular">
                        {toPersianDigits(it.quantity)} عدد ×{" "}
                        {toPersianPrice(it.unitPrice)} تومان
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-fg-primary tabular whitespace-nowrap">
                      {toPersianPrice(it.unitPrice * it.quantity)} تومان
                    </span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-line">
                <div className="text-xs text-fg-muted">
                  {order.paymentMethod === "ONLINE"
                    ? "پرداخت آنلاین"
                    : "پرداخت در محل"}{" "}
                  • {order.shipCity}
                </div>
                <div className="text-sm font-bold text-fg-primary tabular">
                  جمع کل: {toPersianPrice(order.total)} تومان
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
