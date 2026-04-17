"use client";

import Link from "next/link";
import {
  X,
  ChevronDown,
  Smartphone,
  Laptop,
  Headphones,
  Tablet,
  Plug,
} from "lucide-react";
import { useState, useEffect } from "react";

const CATEGORIES = [
  { slug: "mobiles", name: "موبایل", Icon: Smartphone },
  { slug: "laptops", name: "لپ‌تاپ", Icon: Laptop },
  { slug: "headphones", name: "هدفون", Icon: Headphones },
  { slug: "tablets", name: "تبلت", Icon: Tablet },
  { slug: "accessories", name: "لوازم جانبی", Icon: Plug },
];

export default function MobileMenu({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [catOpen, setCatOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      />
      {/* drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[300px] max-w-[85vw] bg-bg-elevated z-50 shadow-2xl transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-line">
          <span className="font-bold text-lg text-fg-primary">منو</span>
          <button
            onClick={onClose}
            aria-label="بستن منو"
            className="w-9 h-9 rounded-lg hover:bg-bg-card-hover flex items-center justify-center text-fg-secondary"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          <Link
            href="/"
            onClick={onClose}
            className="flex items-center px-5 py-3.5 text-fg-primary hover:bg-bg-card-hover transition-colors font-medium"
          >
            خانه
          </Link>
          <div>
            <button
              type="button"
              onClick={() => setCatOpen(!catOpen)}
              className="flex items-center justify-between w-full px-5 py-3.5 text-fg-primary hover:bg-bg-card-hover transition-colors font-medium"
            >
              <span>محصولات</span>
              <ChevronDown
                size={16}
                className={`text-fg-muted transition-transform ${catOpen ? "rotate-180" : ""}`}
              />
            </button>
            {catOpen && (
              <div className="pb-1">
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/products?category=${cat.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 px-8 py-2.5 text-sm text-fg-secondary hover:bg-bg-card-hover hover:text-fg-primary transition-colors"
                  >
                    <cat.Icon size={15} className="text-accent-text" />
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/products"
                  onClick={onClose}
                  className="flex items-center gap-3 px-8 py-2.5 text-sm text-accent-text font-semibold hover:bg-bg-card-hover transition-colors"
                >
                  همه محصولات
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/about"
            onClick={onClose}
            className="flex items-center px-5 py-3.5 text-fg-primary hover:bg-bg-card-hover transition-colors font-medium"
          >
            درباره ما
          </Link>
          <Link
            href="/contact"
            onClick={onClose}
            className="flex items-center px-5 py-3.5 text-fg-primary hover:bg-bg-card-hover transition-colors font-medium"
          >
            تماس با ما
          </Link>
        </nav>
      </div>
    </>
  );
}
