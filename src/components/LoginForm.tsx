"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AuthCard from "./AuthCard";
import { useAuth } from "@/context/AuthContext";
import { ApiRequestError } from "@/lib/apiClient";
import { validateEmail } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, user, hydrated } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // `?next=/somewhere` lets flows like checkout kick users to /login and
  // bounce them back to where they started after a successful sign-in.
  const next = searchParams?.get("next") || "/profile";

  // If already signed in, skip the form entirely.
  useEffect(() => {
    if (hydrated && user) router.replace(next);
  }, [hydrated, user, next, router]);

  const rawErrors = {
    email: validateEmail(email),
    password: password.length < 1 ? "رمز عبور را وارد کنید" : null,
  };
  const errors = {
    email: touched.email ? rawErrors.email : null,
    password: touched.password ? rawErrors.password : null,
  };
  const isValid = !rawErrors.email && !rawErrors.password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isValid) {
      setTouched({ email: true, password: true });
      return;
    }
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace(next);
    } catch (err) {
      // The backend returns the same generic message for bad-email and
      // bad-password, so we can surface it verbatim without risking
      // user-enumeration oracles.
      setFormError(
        err instanceof ApiRequestError
          ? err.message
          : "ورود ناموفق بود. دوباره تلاش کنید.",
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
      title="ورود به حساب"
      subtitle="برای ادامه، ایمیل و رمز عبور خود را وارد کنید"
      footer={
        <>
          حساب کاربری ندارید؟{" "}
          <Link
            href={`/register${next !== "/profile" ? `?next=${encodeURIComponent(next)}` : ""}`}
            className="text-accent-text hover:underline"
          >
            ثبت‌نام
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            ایمیل
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            رمز عبور
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            aria-invalid={!!errors.password}
            autoComplete="current-password"
            className={inputClass(errors.password)}
            placeholder="••••••••"
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
          ورود
        </button>
      </form>
    </AuthCard>
  );
}
