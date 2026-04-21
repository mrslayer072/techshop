"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Authenticated user affordance for the desktop header. The trigger shows
 * the user's first name (cheap visual confirmation of who's signed in) and
 * expands into a small menu. Closes on outside-click and Escape so it feels
 * like every other menu on the web.
 */
export default function UserMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!user) return null;

  // Show just the first token so the trigger stays compact even for long
  // names. The full name lives inside the dropdown.
  const firstName = user.name.split(" ")[0] || user.name;

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    router.push("/");
  };

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 h-10 px-3 rounded-lg border border-line hover:border-line-hover hover:bg-bg-card-hover transition-colors text-fg-secondary hover:text-fg-primary"
      >
        <span className="w-7 h-7 rounded-full bg-accent-soft text-accent-text flex items-center justify-center text-xs font-bold">
          {firstName.charAt(0)}
        </span>
        <span className="text-sm font-medium max-w-[90px] truncate">
          {firstName}
        </span>
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute left-0 top-12 w-56 bg-bg-primary border border-line rounded-xl shadow-lg overflow-hidden animate-fade-in z-50"
        >
          <div className="px-4 py-3 border-b border-line">
            <div className="text-sm font-semibold text-fg-primary truncate">
              {user.name}
            </div>
            <div className="text-xs text-fg-muted truncate" dir="ltr">
              {user.email}
            </div>
          </div>
          <Link
            href="/profile"
            onClick={() => setOpen(false)}
            role="menuitem"
            className="flex items-center gap-2 px-4 py-2.5 text-sm text-fg-secondary hover:bg-bg-card-hover hover:text-fg-primary transition-colors"
          >
            <UserIcon size={15} />
            حساب کاربری من
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            role="menuitem"
            className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-danger hover:bg-danger-soft transition-colors"
          >
            <LogOut size={15} />
            خروج از حساب
          </button>
        </div>
      )}
    </div>
  );
}
