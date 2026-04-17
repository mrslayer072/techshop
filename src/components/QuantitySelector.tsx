"use client";

import { Minus, Plus } from "lucide-react";
import { toPersianDigits } from "@/lib/utils";

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 10,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
}) {
  const btn = size === "sm" ? "w-7 h-7 text-sm" : "w-9 h-9";
  const wrap = size === "sm" ? "text-sm" : "text-base";
  return (
    <div
      className={`inline-flex items-center gap-1 border border-line rounded-lg bg-bg-card ${wrap}`}
    >
      <button
        type="button"
        aria-label="کاهش تعداد"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={`${btn} flex items-center justify-center text-fg-secondary hover:text-accent-text disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Minus size={14} />
      </button>
      <span className="min-w-[28px] text-center tabular font-semibold text-fg-primary">
        {toPersianDigits(value)}
      </span>
      <button
        type="button"
        aria-label="افزایش تعداد"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={`${btn} flex items-center justify-center text-fg-secondary hover:text-accent-text disabled:opacity-40 disabled:cursor-not-allowed`}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
