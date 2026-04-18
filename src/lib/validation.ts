/**
 * Reusable form-field validators. All rules return a Persian error message
 * string when invalid, or `null` when valid — so callers can render errors
 * directly without needing lookup tables.
 */

// Normalize Persian (۰-۹) / Arabic-Indic (٠-٩) digits to ASCII (0-9).
// Users on Persian keyboards often type Persian digits for phone numbers etc.
export function toEnglishDigits(input: string): string {
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  return input
    .replace(/[۰-۹]/g, (d) => String(persian.indexOf(d)))
    .replace(/[٠-٩]/g, (d) => String(arabic.indexOf(d)));
}

// Remove common separators before digit/phone validation.
const stripSeparators = (s: string) => s.replace(/[\s\-()]/g, "");

// Persian + Latin letter class (used for names, cities, etc.)
const LETTERS_RE = /^[a-zA-Z\u0600-\u06FF\s\u200c]+$/;

// ───────────────────────── text fields ──────────────────────────

export function validateName(value: string, label = "نام"): string | null {
  const v = value.trim();
  if (!v) return `لطفاً ${label} را وارد کنید`;
  if (v.length < 2) return `${label} باید حداقل ۲ حرف باشد`;
  if (v.length > 50) return `${label} نباید بیش از ۵۰ حرف باشد`;
  if (!LETTERS_RE.test(v)) return `${label} فقط می‌تواند شامل حروف باشد`;
  return null;
}

export function validateFullName(value: string): string | null {
  const v = value.trim().replace(/\s+/g, " ");
  if (!v) return "لطفاً نام و نام خانوادگی را وارد کنید";
  if (v.length < 3) return "نام وارد شده خیلی کوتاه است";
  if (v.length > 60) return "نام نباید بیش از ۶۰ حرف باشد";
  if (!v.includes(" ")) return "نام و نام خانوادگی را کامل وارد کنید";
  if (!LETTERS_RE.test(v)) return "نام فقط می‌تواند شامل حروف باشد";
  return null;
}

export function validateCity(value: string): string | null {
  const v = value.trim();
  if (!v) return "لطفاً شهر را وارد کنید";
  if (v.length < 2) return "نام شهر خیلی کوتاه است";
  if (v.length > 40) return "نام شهر نباید بیش از ۴۰ حرف باشد";
  if (!LETTERS_RE.test(v)) return "نام شهر فقط می‌تواند شامل حروف باشد";
  return null;
}

export function validateAddress(value: string): string | null {
  const v = value.trim();
  if (!v) return "لطفاً آدرس را وارد کنید";
  if (v.length < 10) return "آدرس باید حداقل ۱۰ حرف باشد";
  if (v.length > 250) return "آدرس نباید بیش از ۲۵۰ حرف باشد";
  return null;
}

export function validateSubject(value: string): string | null {
  const v = value.trim();
  if (!v) return "لطفاً موضوع پیام را وارد کنید";
  if (v.length < 3) return "موضوع باید حداقل ۳ حرف باشد";
  if (v.length > 100) return "موضوع نباید بیش از ۱۰۰ حرف باشد";
  return null;
}

export function validateMessage(value: string): string | null {
  const v = value.trim();
  if (!v) return "لطفاً متن پیام را وارد کنید";
  if (v.length < 10) return "پیام باید حداقل ۱۰ حرف باشد";
  if (v.length > 1000) return "پیام نباید بیش از ۱۰۰۰ حرف باشد";
  return null;
}

export function validateProvince(value: string): string | null {
  if (!value) return "لطفاً استان را انتخاب کنید";
  return null;
}

// ──────────────────────── email / phone ────────────────────────

// Reasonable email regex — RFC-5322 is too permissive for UX,
// this covers the ~99% case and rejects obvious garbage.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateEmail(value: string): string | null {
  const v = value.trim();
  if (!v) return "لطفاً ایمیل را وارد کنید";
  if (v.length > 100) return "ایمیل نباید بیش از ۱۰۰ حرف باشد";
  if (!EMAIL_RE.test(v)) return "ایمیل وارد شده معتبر نیست";
  return null;
}

// Iranian mobile: 09XXXXXXXXX, +989XXXXXXXXX, 00989XXXXXXXXX
const IRAN_MOBILE_RE = /^(?:\+98|0098|0)9\d{9}$/;

export function validateIranianMobile(value: string): string | null {
  const v = stripSeparators(toEnglishDigits(value));
  if (!v) return "لطفاً شماره موبایل را وارد کنید";
  if (!IRAN_MOBILE_RE.test(v))
    return "شماره موبایل معتبر وارد کنید (مثال: ۰۹۱۲۳۴۵۶۷۸۹)";
  return null;
}

// Iranian postal code: exactly 10 digits.
const POSTAL_RE = /^\d{10}$/;

export function validatePostalCode(value: string): string | null {
  const v = stripSeparators(toEnglishDigits(value));
  if (!v) return "لطفاً کد پستی را وارد کنید";
  if (!POSTAL_RE.test(v)) return "کد پستی باید دقیقاً ۱۰ رقم باشد";
  return null;
}
