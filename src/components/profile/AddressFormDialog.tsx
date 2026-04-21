"use client";

import { useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import { apiClient, ApiRequestError } from "@/lib/apiClient";
import {
  validateFullName,
  validateIranianMobile,
  validateAddress,
  validatePostalCode,
  validateProvince,
  validateCity,
  toEnglishDigits,
} from "@/lib/validation";

export interface AddressInput {
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

interface WithId extends AddressInput {
  id: string;
}

const PROVINCES = [
  "تهران",
  "اصفهان",
  "فارس",
  "خراسان رضوی",
  "آذربایجان شرقی",
  "آذربایجان غربی",
  "مازندران",
  "کرمان",
  "گیلان",
  "خوزستان",
  "سیستان و بلوچستان",
  "مرکزی",
  "هرمزگان",
  "کرمانشاه",
  "گلستان",
  "البرز",
  "همدان",
  "یزد",
  "لرستان",
  "اردبیل",
  "بوشهر",
  "قم",
  "زنجان",
  "کردستان",
  "سمنان",
  "چهارمحال و بختیاری",
  "خراسان شمالی",
  "خراسان جنوبی",
  "ایلام",
  "کهگیلویه و بویراحمد",
  "قزوین",
];

type FieldKey =
  | "fullName"
  | "phone"
  | "address"
  | "postalCode"
  | "province"
  | "city";

/**
 * Create / edit address dialog. Renders as a centered modal overlay.
 * Shares validation rules with CheckoutForm so the two views stay in
 * lock-step — an address that's valid here is valid there and vice versa.
 */
export default function AddressFormDialog({
  initial,
  onClose,
  onSaved,
}: {
  initial?: WithId;
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState<AddressInput>({
    fullName: initial?.fullName ?? "",
    phone: initial?.phone ?? "",
    province: initial?.province ?? "",
    city: initial?.city ?? "",
    address: initial?.address ?? "",
    postalCode: initial?.postalCode ?? "",
    isDefault: initial?.isDefault ?? false,
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    fullName: false,
    phone: false,
    address: false,
    postalCode: false,
    province: false,
    city: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Esc to close — expected behavior for any modal.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const update = <K extends keyof AddressInput>(
    key: K,
    value: AddressInput[K],
  ) => setForm((p) => ({ ...p, [key]: value }));

  const mark = (k: FieldKey) => setTouched((t) => ({ ...t, [k]: true }));

  const rawErrors: Record<FieldKey, string | null> = {
    fullName: validateFullName(form.fullName),
    phone: validateIranianMobile(form.phone),
    address: validateAddress(form.address),
    postalCode: validatePostalCode(form.postalCode),
    province: validateProvince(form.province),
    city: validateCity(form.city),
  };
  const errors: Record<FieldKey, string | null> = {
    fullName: touched.fullName ? rawErrors.fullName : null,
    phone: touched.phone ? rawErrors.phone : null,
    address: touched.address ? rawErrors.address : null,
    postalCode: touched.postalCode ? rawErrors.postalCode : null,
    province: touched.province ? rawErrors.province : null,
    city: touched.city ? rawErrors.city : null,
  };
  const isValid = Object.values(rawErrors).every((e) => e === null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!isValid) {
      setTouched({
        fullName: true,
        phone: true,
        address: true,
        postalCode: true,
        province: true,
        city: true,
      });
      return;
    }
    setSubmitting(true);
    try {
      if (isEdit && initial) {
        await apiClient.patch(`/user/addresses/${initial.id}`, form);
      } else {
        await apiClient.post("/user/addresses", form);
      }
      await onSaved();
    } catch (err) {
      setFormError(
        err instanceof ApiRequestError ? err.message : "ذخیره آدرس انجام نشد.",
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-bg-primary border border-line rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-line sticky top-0 bg-bg-primary">
          <h3 className="text-lg font-bold text-fg-primary">
            {isEdit ? "ویرایش آدرس" : "آدرس جدید"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="text-fg-muted hover:text-fg-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                نام و نام خانوادگی
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                onBlur={() => mark("fullName")}
                aria-invalid={!!errors.fullName}
                maxLength={60}
                className={inputClass(errors.fullName)}
              />
              {errors.fullName && (
                <p className="text-xs text-danger mt-1.5">{errors.fullName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                شماره تلفن
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  update("phone", toEnglishDigits(e.target.value))
                }
                onBlur={() => mark("phone")}
                aria-invalid={!!errors.phone}
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
          </div>

          <div>
            <label className="block text-sm text-fg-secondary mb-1.5">
              آدرس کامل
            </label>
            <textarea
              rows={3}
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              onBlur={() => mark("address")}
              aria-invalid={!!errors.address}
              maxLength={250}
              className={`${inputClass(errors.address)} resize-none`}
            />
            {errors.address && (
              <p className="text-xs text-danger mt-1.5">{errors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                استان
              </label>
              <select
                value={form.province}
                onChange={(e) => {
                  update("province", e.target.value);
                  mark("province");
                }}
                onBlur={() => mark("province")}
                aria-invalid={!!errors.province}
                className={inputClass(errors.province)}
              >
                <option value="">انتخاب استان</option>
                {PROVINCES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.province && (
                <p className="text-xs text-danger mt-1.5">{errors.province}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                شهر
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                onBlur={() => mark("city")}
                aria-invalid={!!errors.city}
                maxLength={40}
                className={inputClass(errors.city)}
              />
              {errors.city && (
                <p className="text-xs text-danger mt-1.5">{errors.city}</p>
              )}
            </div>
            <div>
              <label className="block text-sm text-fg-secondary mb-1.5">
                کد پستی
              </label>
              <input
                type="text"
                value={form.postalCode}
                onChange={(e) =>
                  update("postalCode", toEnglishDigits(e.target.value))
                }
                onBlur={() => mark("postalCode")}
                aria-invalid={!!errors.postalCode}
                inputMode="numeric"
                maxLength={10}
                dir="ltr"
                className={inputClass(errors.postalCode)}
              />
              {errors.postalCode && (
                <p className="text-xs text-danger mt-1.5">
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={form.isDefault}
              onChange={(e) => update("isDefault", e.target.checked)}
              className="accent-[var(--accent)]"
            />
            <span className="text-sm text-fg-secondary">
              این آدرس به عنوان پیش‌فرض تنظیم شود
            </span>
          </label>

          {formError && (
            <div
              role="alert"
              className="text-sm text-danger bg-danger-soft border border-danger/30 rounded-lg px-3 py-2"
            >
              {formError}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              ذخیره
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl font-medium text-sm border border-line text-fg-secondary hover:bg-bg-card-hover transition-colors"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
