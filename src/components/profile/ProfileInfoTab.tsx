"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import type { StoredUser } from "@/lib/authStorage";
import {
  validateFullName,
  validateIranianMobile,
  toEnglishDigits,
} from "@/lib/validation";

/**
 * Name + phone editor. Email is immutable client-side — changing an email
 * should be a deliberate flow with verification and isn't in scope for
 * this build.
 */
export default function ProfileInfoTab() {
  const { user, patchUser } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [touched, setTouched] = useState({ name: false, phone: false });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (!user) return null;

  const rawErrors = {
    name: validateFullName(name),
    phone: phone ? validateIranianMobile(phone) : null,
  };
  const errors = {
    name: touched.name ? rawErrors.name : null,
    phone: touched.phone ? rawErrors.phone : null,
  };
  const dirty = name !== user.name || (phone || "") !== (user.phone ?? "");
  const isValid = !rawErrors.name && !rawErrors.phone;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);
    if (!isValid) {
      setTouched({ name: true, phone: true });
      return;
    }
    setSubmitting(true);
    try {
      const updated = await apiClient.patch<StoredUser>("/user/profile", {
        name: name.trim(),
        phone: phone || undefined,
      });
      // Mirror the response back into context + storage.
      patchUser({ name: updated.name, phone: updated.phone });
      setSuccess(true);
      // Auto-dismiss the success chip so it feels alive rather than sticky.
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) {
      setFormError(
        err instanceof ApiRequestError ? err.message : "به‌روزرسانی انجام نشد.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const baseInput =
    "w-full bg-search border rounded-xl px-4 py-3 text-sm text-fg-primary outline-none transition-colors placeholder:text-fg-muted disabled:opacity-60";
  const inputClass = (err: string | null) =>
    `${baseInput} ${
      err
        ? "border-danger focus:border-danger"
        : "border-line focus:border-accent"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg" noValidate>
      <h2 className="text-lg font-bold text-fg-primary">اطلاعات من</h2>

      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">ایمیل</label>
        <input
          type="email"
          value={user.email}
          disabled
          dir="ltr"
          className={`${baseInput} border-line`}
        />
        <p className="text-xs text-fg-muted mt-1.5">
          برای تغییر ایمیل با پشتیبانی تماس بگیرید
        </p>
      </div>

      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">
          نام و نام خانوادگی
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, name: true }))}
          aria-invalid={!!errors.name}
          autoComplete="name"
          maxLength={60}
          className={inputClass(errors.name)}
        />
        {errors.name && (
          <p className="text-xs text-danger mt-1.5">{errors.name}</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">
          شماره تلفن
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(toEnglishDigits(e.target.value))}
          onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
          aria-invalid={!!errors.phone}
          autoComplete="tel"
          inputMode="tel"
          maxLength={15}
          dir="ltr"
          className={inputClass(errors.phone)}
          placeholder="09123456789"
        />
        {errors.phone && (
          <p className="text-xs text-danger mt-1.5">{errors.phone}</p>
        )}
      </div>

      {formError && (
        <div
          role="alert"
          className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
        >
          {formError}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!dirty || submitting}
          className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          ذخیره تغییرات
        </button>
        {success && (
          <span className="flex items-center gap-1.5 text-sm text-accent-text">
            <Check size={16} />
            ذخیره شد
          </span>
        )}
      </div>
    </form>
  );
}
