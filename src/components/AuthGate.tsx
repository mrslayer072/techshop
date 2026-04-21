"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

/**
 * Wrap any protected page/component with this to bounce anonymous users
 * to /login?next=<current-path>. While we're deciding what to do
 * (storage not yet read, or mid-redirect), we render a centered spinner
 * rather than flashing the real content for a frame.
 */
export default function AuthGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated } = useAuth();

  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      const next = encodeURIComponent(pathname || "/profile");
      router.replace(`/login?next=${next}`);
    }
  }, [hydrated, user, pathname, router]);

  if (!hydrated || !user) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-fg-muted" size={28} />
      </div>
    );
  }

  return <>{children}</>;
}
