"use client";

import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Toast() {
  const { toast } = useCart();
  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        toast
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {toast && (
        <div className="flex items-center gap-2 bg-bg-elevated border border-line shadow-card rounded-full px-5 py-3 text-sm text-fg-primary">
          <CheckCircle2 size={18} className="text-success" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
