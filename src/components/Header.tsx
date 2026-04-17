"use client";

import Link from "next/link";
import { ShoppingCart, Menu, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import CategoryDropdown from "./CategoryDropdown";
import MobileMenu from "./MobileMenu";
import { useCart } from "@/context/CartContext";
import { toPersianDigits } from "@/lib/utils";

export default function Header() {
  const { getCartCount, openDrawer } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [catHover, setCatHover] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const hoverTimeout = useRef<ReturnType<typeof setTimeout>>();
  const count = getCartCount();
  const [prevCount, setPrevCount] = useState(count);
  const [badgeBounce, setBadgeBounce] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (count > prevCount) {
      setBadgeBounce(true);
      setTimeout(() => setBadgeBounce(false), 400);
    }
    setPrevCount(count);
  }, [count, prevCount]);

  return (
    <header
      className={`sticky top-0 z-50 backdrop-blur-lg transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/85 dark:border-b dark:border-line shadow-sm dark:shadow-none"
          : "bg-bg-primary/60"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Right side: Logo + Nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="shrink-0">
            <Logo size={36} />
          </Link>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link
              href="/"
              className="text-fg-secondary hover:text-fg-primary transition-colors"
            >
              خانه
            </Link>
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(hoverTimeout.current);
                setCatHover(true);
              }}
              onMouseLeave={() => {
                hoverTimeout.current = setTimeout(
                  () => setCatHover(false),
                  200,
                );
              }}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-fg-secondary hover:text-fg-primary transition-colors"
              >
                محصولات
                <ChevronDown
                  size={14}
                  className={`transition-transform ${catHover ? "rotate-180" : ""}`}
                />
              </button>
              {catHover && <CategoryDropdown />}
            </div>
            <Link
              href="/about"
              className="text-fg-secondary hover:text-fg-primary transition-colors"
            >
              درباره ما
            </Link>
            <Link
              href="/contact"
              className="text-fg-secondary hover:text-fg-primary transition-colors"
            >
              تماس با ما
            </Link>
          </nav>
        </div>

        {/* Left side: actions */}
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={openDrawer}
            aria-label="سبد خرید"
            className="relative w-10 h-10 rounded-lg border border-line hover:border-line-hover hover:bg-bg-card-hover flex items-center justify-center transition-colors text-fg-secondary hover:text-fg-primary"
          >
            <ShoppingCart size={18} />
            {count > 0 && (
              <span
                className={`absolute -top-1.5 -left-1.5 bg-accent text-white text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full tabular ${badgeBounce ? "animate-bounce-in" : ""}`}
              >
                {toPersianDigits(count)}
              </span>
            )}
          </button>
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="منو"
            className="md:hidden w-10 h-10 rounded-lg border border-line hover:border-line-hover hover:bg-bg-card-hover flex items-center justify-center transition-colors text-fg-secondary"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>
      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
