"use client";

import type { SortBy } from "@/types";

const OPTIONS: { value: SortBy; label: string }[] = [
  { value: "newest", label: "جدیدترین" },
  { value: "cheapest", label: "ارزان‌ترین" },
  { value: "expensive", label: "گران‌ترین" },
  { value: "popular", label: "پرفروش‌ترین" },
];

export default function ProductSort({
  value,
  onChange,
}: {
  value: SortBy;
  onChange: (v: SortBy) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortBy)}
      aria-label="مرتب‌سازی"
      className="bg-bg-card border border-line rounded-xl px-3 py-2 text-sm text-fg-primary outline-none focus:border-accent transition-colors cursor-pointer"
    >
      {OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
