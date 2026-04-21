"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";

function validateNewPassword(v: string): string | null {
  if (!v) return "رمز عبور جدید الزامی است";
  if (v.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد";
  if (v.length > 128) return "رمز عبور خیلی طولانی است";
  return null;
}

/**
 * Changing a password revokes every refresh token on the server side, so
 * after a successful change we log the user out locally and nudge them
 * back to /login. This matches the backend's security model — a password
 * change should invalidate every active session.
 */
export default function ProfilePasswordTab() {
  const { logout } = useAuth();
  const [currentPassword, setCurrent] = useState("");
  const [newPassword, setNew] = useState("");
  const [confirm, setConfirm] = useState("");
  const [touched, setTouched] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const rawErrors = {
    current: currentPassword ? null : "رمز عبور فعلی الزامی است",
    next: validateNewPassword(newPassword),
    confirm:
      confirm === newPassword
        ? null
        : "تکرار رمز عبور با رمز جدید مطابقت ندارد",
  };
  const errors = {
    current: touched.current ? rawErrors.current : null,
    next: touched.next ? rawErrors.next : null,
    confirm: touched.confirm ? rawErrors.confirm : null,
  };
  const isValid = !rawErrors.current && !rawErrors.next && !rawErrors.confirm;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);
    if (!isValid) {
      setTouched({ current: true, next: true, confirm: true });
      return;
    }
    setSubmitting(true);
    try {
      await apiClient.post("/user/password", {
        currentPassword,
        newPassword,
      });
      setSuccess(true);
      // Server revoked our tokens — finish up locally too. Small delay so
      // the success message is actually visible before we bounce.
      setTimeout(async () => {
        await logout();
      }, 1500);
    } catch (err) {
      setFormError(
        err instanceof ApiRequestError
          ? err.message
          : "تغییر رمز عبور انجام نشد.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const baseInput =
    "w-full bg-search border rounded-xl px-4 py-3 text-sm text-fg-primary outline-none transition-colors placeholder:text-fg-muted";
  const inputClass = (err: string | null) =>
    `${baseInput} ${
      err
        ? "border-danger focus:border-danger"
        : "border-line focus:border-accent"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-lg" noValidate>
      <div>
        <h2 className="text-lg font-bold text-fg-primary">تغییر رمز عبور</h2>
        <p className="text-sm text-fg-secondary mt-1">
          پس از تغییر رمز، از تمام دستگاه‌ها خارج خواهید شد.
        </p>
      </div>

      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">
          رمز عبور فعلی
        </label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrent(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, current: true }))}
          aria-invalid={!!errors.current}
          autoComplete="current-password"
          className={inputClass(errors.current)}
        />
        {errors.current && (
          <p className="text-xs text-danger mt-1.5">{errors.current}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">
          رمز عبور جدید
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNew(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, next: true }))}
          aria-invalid={!!errors.next}
          autoComplete="new-password"
          className={inputClass(errors.next)}
          placeholder="حداقل ۸ کاراکتر"
        />
        {errors.next && (
          <p className="text-xs text-danger mt-1.5">{errors.next}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">
          تکرار رمز عبور جدید
        </label>
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
          aria-invalid={!!errors.confirm}
          autoComplete="new-password"
          className={inputClass(errors.confirm)}
        />
        {errors.confirm && (
          <p className="text-xs text-danger mt-1.5">{errors.confirm}</p>
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
      {success && (
        <div
          role="status"
          className="flex items-center gap-2 text-sm text-accent-text bg-accent-soft border border-accent/30 rounded-lg px-3 py-2"
        >
          <Check size={16} />
          رمز عبور با موفقیت تغییر کرد. در حال خروج...
        </div>
      )}

      <button
        type="submit"
        disabled={submitting || success}
        className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm disabled:opacity-50"
      >
        {submitting && <Loader2 size={16} className="animate-spin" />}
        تغییر رمز عبور
      </button>
    </form>
  );
}
