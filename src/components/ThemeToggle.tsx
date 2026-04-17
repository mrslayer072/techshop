"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="تغییر تم"
      className="w-10 h-10 rounded-lg border border-line hover:border-line-hover hover:bg-bg-card-hover flex items-center justify-center transition-colors text-fg-secondary hover:text-fg-primary"
    >
      {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
