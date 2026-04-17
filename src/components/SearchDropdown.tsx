"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { toPersianPrice, withBase } from "@/lib/utils";

export default function SearchDropdown({
  results,
  query,
  onClose,
}: {
  results: Product[];
  query: string;
  onClose: () => void;
}) {
  if (!query.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-bg-elevated border border-line rounded-xl shadow-card z-50 overflow-hidden animate-fade-in max-h-[420px] overflow-y-auto">
      {results.length === 0 ? (
        <div className="px-5 py-6 text-center text-sm text-fg-muted">
          محصولی یافت نشد
        </div>
      ) : (
        <>
          {results.map((p) => {
            const idx = p.name.toLowerCase().indexOf(query.toLowerCase());
            const before = p.name.slice(0, idx);
            const match = p.name.slice(idx, idx + query.length);
            const after = p.name.slice(idx + query.length);

            return (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-3 hover:bg-bg-card-hover transition-colors"
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-bg-card shrink-0">
                  <img
                    src={withBase(p.image)}
                    alt={p.name}
                    className="w-full h-full object-cover"
                    width={44}
                    height={44}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-fg-primary truncate">
                    {idx >= 0 ? (
                      <>
                        {before}
                        <span className="text-accent-text font-bold">
                          {match}
                        </span>
                        {after}
                      </>
                    ) : (
                      p.name
                    )}
                  </p>
                  <span className="text-xs text-fg-muted">{p.category}</span>
                </div>
                <span className="text-xs font-semibold text-accent-text tabular whitespace-nowrap">
                  {toPersianPrice(p.price)} تومان
                </span>
              </Link>
            );
          })}
          <Link
            href={`/products?search=${encodeURIComponent(query)}`}
            onClick={onClose}
            className="block text-center text-sm text-accent-text font-semibold py-3 border-t border-line hover:bg-bg-card-hover transition-colors"
          >
            مشاهده همه نتایج
          </Link>
        </>
      )}
    </div>
  );
}
