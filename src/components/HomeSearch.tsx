"use client";

import { Search } from "lucide-react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { searchProducts } from "@/lib/api";
import SearchDropdown from "./SearchDropdown";
import type { Product } from "@/types";

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const router = useRouter();

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const data = await searchProducts(q, 5);
    setResults(data);
    setShowDropdown(true);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(query), 300);
    return () => clearTimeout(debounceRef.current);
  }, [query, doSearch]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim()) {
      setShowDropdown(false);
      router.push(`/products?search=${encodeURIComponent(query)}`);
    }
    if (e.key === "Escape") setShowDropdown(false);
  };

  return (
    <section className="bg-bg-card/50 border-b border-line">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div ref={wrapRef} className="relative">
          <div className="flex items-center gap-3 px-4 bg-search border border-line rounded-2xl focus-within:border-accent transition-colors">
            <Search size={20} className="text-fg-muted shrink-0" />
            <input
              type="text"
              placeholder="جستجوی محصولات..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setShowDropdown(true)}
              onKeyDown={handleKeyDown}
              className="flex-1 bg-transparent py-3.5 text-fg-primary placeholder:text-fg-muted outline-none text-base min-w-0"
              aria-label="جستجوی محصولات"
            />
          </div>
          {showDropdown && (
            <SearchDropdown
              results={results}
              query={query}
              onClose={() => setShowDropdown(false)}
            />
          )}
        </div>
      </div>
    </section>
  );
}
