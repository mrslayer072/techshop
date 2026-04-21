"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, Plus, Pencil, Trash2, Star } from "lucide-react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import AddressFormDialog, { type AddressInput } from "./AddressFormDialog";

export interface Address extends AddressInput {
  id: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Address book. We fetch on mount and after every mutation, deliberately
 * avoiding optimistic updates — the backend handles the "only one default"
 * rule transactionally, and reading the authoritative list back is
 * cheaper (mentally + at the network level) than replicating that rule
 * here and risking a drift bug.
 */
export default function ProfileAddressesTab() {
  const [items, setItems] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Address | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<Address[]>("/user/addresses");
      setItems(data);
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "خطا در دریافت آدرس‌ها",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (addr: Address) => {
    setEditing(addr);
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("حذف این آدرس؟")) return;
    setBusyId(id);
    try {
      await apiClient.delete(`/user/addresses/${id}`);
      await load();
    } catch (err) {
      setError(
        err instanceof ApiRequestError ? err.message : "خطا در حذف آدرس",
      );
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-fg-primary">آدرس‌های من</h2>
          <p className="text-sm text-fg-secondary mt-1">
            برای هر خرید می‌توانید یکی از آدرس‌ها را انتخاب کنید.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold"
        >
          <Plus size={16} />
          آدرس جدید
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-fg-muted" />
        </div>
      ) : error ? (
        <div
          role="alert"
          className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
        >
          {error}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-fg-secondary">
          <p className="text-sm">هنوز آدرسی ثبت نکرده‌اید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((addr) => (
            <div
              key={addr.id}
              className="border border-line rounded-xl p-4 space-y-2 relative"
            >
              {addr.isDefault && (
                <span className="absolute top-3 left-3 flex items-center gap-1 text-[11px] font-semibold text-accent-text bg-accent-soft px-2 py-0.5 rounded-full">
                  <Star size={11} />
                  پیش‌فرض
                </span>
              )}
              <div className="font-semibold text-fg-primary pr-16">
                {addr.fullName}
              </div>
              <div className="text-sm text-fg-secondary">
                {addr.province}، {addr.city}، {addr.address}
              </div>
              <div className="text-xs text-fg-muted">
                کد پستی: {addr.postalCode} • {addr.phone}
              </div>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => openEdit(addr)}
                  className="flex items-center gap-1.5 text-xs text-fg-secondary hover:text-fg-primary transition-colors"
                >
                  <Pencil size={13} />
                  ویرایش
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(addr.id)}
                  disabled={busyId === addr.id}
                  className="flex items-center gap-1.5 text-xs text-danger hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  {busyId === addr.id ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Trash2 size={13} />
                  )}
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {dialogOpen && (
        <AddressFormDialog
          initial={editing ?? undefined}
          onClose={() => setDialogOpen(false)}
          onSaved={async () => {
            setDialogOpen(false);
            await load();
          }}
        />
      )}
    </div>
  );
}
