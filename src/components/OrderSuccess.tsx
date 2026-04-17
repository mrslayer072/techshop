"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function OrderSuccess({ orderNumber }: { orderNumber: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-5 text-center animate-fade-in-up">
      <div className="w-20 h-20 rounded-full bg-success/15 flex items-center justify-center animate-bounce-in">
        <CheckCircle2 size={44} className="text-success" />
      </div>
      <h2 className="text-2xl font-bold text-fg-primary">
        سفارش شما با موفقیت ثبت شد!
      </h2>
      <p className="text-fg-secondary">
        سفارش شماره{" "}
        <span className="font-bold text-accent-text tabular">
          {toPersianDigits(orderNumber)}
        </span>
      </p>
      <p className="text-sm text-fg-muted max-w-sm">
        از خرید شما متشکریم. اطلاعات سفارش به شماره تلفن وارد شده ارسال خواهد
        شد.
      </p>
      <Link
        href="/"
        className="btn-primary px-8 py-3 rounded-xl font-semibold text-sm mt-2"
      >
        بازگشت به صفحه اصلی
      </Link>
    </div>
  );
}
