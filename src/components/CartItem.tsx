"use client";

import Link from "next/link";
import { Trash2 } from "lucide-react";
import QuantitySelector from "./QuantitySelector";
import { toPersianPrice, withBase } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

export default function CartItemRow({
  item,
  onRemove,
  onQuantityChange,
  onNavigate,
}: {
  item: CartItemType;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, qty: number) => void;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex gap-3 py-3 border-b border-line last:border-0">
      <Link
        href={`/products/${item.id}`}
        onClick={onNavigate}
        className="shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-bg-elevated"
      >
        <img
          src={withBase(item.image)}
          alt={item.name}
          className="w-full h-full object-cover"
          width={64}
          height={64}
        />
      </Link>
      <div className="flex-1 min-w-0 flex flex-col gap-1">
        <Link
          href={`/products/${item.id}`}
          onClick={onNavigate}
          className="text-sm font-medium text-fg-primary hover:text-accent-text transition-colors truncate"
        >
          {item.name}
        </Link>
        <span className="text-xs text-fg-secondary tabular">
          {toPersianPrice(item.price)} تومان
        </span>
        <div className="flex items-center justify-between mt-auto">
          <QuantitySelector
            value={item.quantity}
            onChange={(qty) => onQuantityChange(item.id, qty)}
            size="sm"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-accent-text tabular">
              {toPersianPrice(item.price * item.quantity)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label="حذف محصول"
              className="text-fg-muted hover:text-danger transition-colors"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
