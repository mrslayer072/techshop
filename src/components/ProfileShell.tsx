"use client";

import { useState } from "react";
import { User, Lock, MapPin, Package, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import ProfileInfoTab from "./profile/ProfileInfoTab";
import ProfilePasswordTab from "./profile/ProfilePasswordTab";
import ProfileAddressesTab from "./profile/ProfileAddressesTab";
import ProfileOrdersTab from "./profile/ProfileOrdersTab";

type Tab = "info" | "password" | "addresses" | "orders";

const TABS: {
  key: Tab;
  label: string;
  icon: React.ComponentType<{ size?: number }>;
}[] = [
  { key: "info", label: "اطلاعات من", icon: User },
  { key: "password", label: "تغییر رمز عبور", icon: Lock },
  { key: "addresses", label: "آدرس‌ها", icon: MapPin },
  { key: "orders", label: "سفارش‌ها", icon: Package },
];

/**
 * Tabbed profile hub. Tabs are client-side only (no URL state) — the
 * typical user flow is in one session, and a shareable /profile/addresses
 * path would leak intent without buying much UX. Easy to promote to
 * nested routes later if the spec asks for it.
 */
export default function ProfileShell() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>("info");

  if (!user) return null; // AuthGate ensures this, but narrow for TS.

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8 md:py-10">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-fg-primary">
          حساب کاربری
        </h1>
        <p className="text-sm text-fg-secondary mt-1">
          {user.name} • {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-text"
                    : "text-fg-secondary hover:bg-bg-card-hover"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-danger hover:bg-danger-soft transition-colors mt-2"
          >
            <LogOut size={16} />
            خروج از حساب
          </button>
        </aside>

        {/* Panel */}
        <section className="bg-bg-card border border-line rounded-2xl p-6">
          {tab === "info" && <ProfileInfoTab />}
          {tab === "password" && <ProfilePasswordTab />}
          {tab === "addresses" && <ProfileAddressesTab />}
          {tab === "orders" && <ProfileOrdersTab />}
        </section>
      </div>
    </div>
  );
}
