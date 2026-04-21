"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import Logo from "./Logo";

/**
 * Shared shell for /login and /register so the two pages feel like one
 * family. Keeps the branding / centering / responsive behavior in one
 * place — the page files supply only the form body.
 */
export default function AuthCard({
  title,
  subtitle,
  footer,
  children,
}: {
  title: string;
  subtitle?: string;
  footer?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" aria-label="خانه">
            <Logo size={48} />
          </Link>
        </div>
        <div className="bg-bg-card border border-line rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-fg-primary">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-fg-secondary mt-1.5">{subtitle}</p>
            ) : null}
          </div>
          {children}
        </div>
        {footer ? (
          <div className="text-center text-sm text-fg-secondary mt-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
