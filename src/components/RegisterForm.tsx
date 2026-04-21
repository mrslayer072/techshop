"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AuthCard from "./AuthCard";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/apiClient";
import {
  validateEmail,
  validateFullName,
  validateIranianMobile,
  toEnglishDigits,
} from "@/lib/validation";

// Mirror the backend's min: 8 chars. Longer requirements live server-side
// (the backend bounces anything under 8) — we show the rule here as
// guidance so the user knows before submitting.
function validatePassword(value: string): string | null {
  if (!value) return "رمز عبور را وارد کنید";
  if (value.length < 8) return "رمز عبور باید حداقل ۸ کاراکتر باشد";
  if (value.length > 128) return "رمز عبور خیلی طولانی است";
  return null;
}

type FieldKey = "name" | "email" | "phone" | "password";

export default function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register, user, hydrated } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    phone: false,
    password: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const next = searchParams?.get("next") || "/profile";

  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  const rawErrors: Record<FieldKey, string | null> = {
    name: validateFullName(form.name),
    email: validateEmail(form.email),
    // Phone is optional — skip validation when blank.
    phone: form.phone ? validateIranianMobile(form.phone) : null,
    password: validatePassword(form.password),
  };
  const errors: Record<FieldKey, string | null> = {
    name: touched.name ? rawErrors.name : null,
    email: touched.email ? rawErrors.email : null,
    phone: touched.phone ? rawErrors.phone : null,
    password: touched.password ? rawErrors.password : null,
  };
  const isValid = Object.values(rawErrors).every((e) => e === null);

  const update = (key: FieldKey, value: string) =>
    setForm((p) => ({ ...p, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isValid) {
      setTouched({ name: true, email: true, phone: true, password: true });
      return;
    }
    setSubmitting(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        phone: form.phone || undefined,
      });
      router.replace(next);
    } catch (err) {
      // 409 CONFLICT → email already exists — surface the server message.
      setFormError(
        err instanceof ApiRequestError
          ? err.message
          : "ثبت‌نام ناموفق بود. دوباره تلاش کنید.",
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
    <AuthCard
      title="ایجاد حساب کاربری"
      subtitle="برای خرید و پیگیری سفارش‌ها، حساب باز کنید"
      footer={
        <>
          قبلاً ثبت‌نام کرده‌اید؟{" "}
          <Link
            href={`/login${next !== "/profile" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-accent-text hover:underline"
          >
            ورود
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            نام و نام خانوادگی
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, name: true }))}
            aria-invalid={!!errors.name}
            autoComplete="name"
            maxLength={60}
            className={inputClass(errors.name)}
            placeholder="نام کامل"
          />
          {errors.name && (
            <p className="text-xs text-danger mt-1.5">{errors.name}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            ایمیل
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            aria-invalid={!!errors.email}
            autoComplete="email"
            dir="ltr"
            className={inputClass(errors.email)}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="text-xs text-danger mt-1.5">{errors.email}</p>
          )}
        </div>
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            شماره تلفن <span className="text-fg-muted">(اختیاری)</span>
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", toEnglishDigits(e.target.value))}
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
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            رمز عبور
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            aria-invalid={!!errors.password}
            autoComplete="new-password"
            className={inputClass(errors.password)}
            placeholder="حداقل ۸ کاراکتر"
          />
          {errors.password && (
            <p className="text-xs text-danger mt-1.5">{errors.password}</p>
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

        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
        >
          {submitting && <Loader2 size={16} className="animate-spin" />}
          ثبت‌نام
        </button>
      </form>
    </AuthCard>
  );
}
