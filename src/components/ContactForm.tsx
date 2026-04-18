"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/api";
import {
  validateName,
  validateEmail,
  validateSubject,
  validateMessage,
} from "@/lib/validation";

type FieldKey = "name" | "email" | "subject" | "message";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    subject: false,
    message: false,
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: FieldKey, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const markTouched = (key: FieldKey) =>
    setTouched((p) => ({ ...p, [key]: true }));

  // Run validators every render — cheap, and we need the "is valid" flag too.
  const rawErrors: Record<FieldKey, string | null> = {
    name: validateName(form.name),
    email: validateEmail(form.email),
    subject: validateSubject(form.subject),
    message: validateMessage(form.message),
  };
  // Only show an error after the user has interacted with (or tried to submit) the field.
  const errors: Record<FieldKey, string | null> = {
    name: touched.name ? rawErrors.name : null,
    email: touched.email ? rawErrors.email : null,
    subject: touched.subject ? rawErrors.subject : null,
    message: touched.message ? rawErrors.message : null,
  };
  const isValid = Object.values(rawErrors).every((e) => e === null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      // Surface every error at once on submit attempt.
      setTouched({ name: true, email: true, subject: true, message: true });
      return;
    }
    setLoading(true);
    await submitContactForm(form);
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-success/15 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-success" />
        </div>
        <h3 className="text-xl font-bold text-fg-primary">پیام شما ارسال شد</h3>
        <p className="text-fg-secondary text-sm">
          به زودی با شما تماس خواهیم گرفت
        </p>
        <button
          type="button"
          onClick={() => {
            setSent(false);
            setForm({ name: "", email: "", subject: "", message: "" });
            setTouched({
              name: false,
              email: false,
              subject: false,
              message: false,
            });
          }}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium mt-2"
        >
          ارسال پیام جدید
        </button>
      </div>
    );
  }

  // Base + error-state classes pulled out so every field stays consistent.
  const baseInput =
    "w-full bg-search border rounded-xl px-4 py-3 text-sm text-fg-primary outline-none transition-colors placeholder:text-fg-muted";
  const inputClass = (err: string | null) =>
    `${baseInput} ${
      err
        ? "border-danger focus:border-danger"
        : "border-line focus:border-accent"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">نام</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={() => markTouched("name")}
            aria-invalid={!!errors.name}
            maxLength={50}
            className={inputClass(errors.name)}
            placeholder="نام شما"
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
            onBlur={() => markTouched("email")}
            aria-invalid={!!errors.email}
            maxLength={100}
            className={inputClass(errors.email)}
            placeholder="email@example.com"
            dir="ltr"
          />
          {errors.email && (
            <p className="text-xs text-danger mt-1.5">{errors.email}</p>
          )}
        </div>
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">موضوع</label>
        <input
          type="text"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          onBlur={() => markTouched("subject")}
          aria-invalid={!!errors.subject}
          maxLength={100}
          className={inputClass(errors.subject)}
          placeholder="موضوع پیام"
        />
        {errors.subject && (
          <p className="text-xs text-danger mt-1.5">{errors.subject}</p>
        )}
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">پیام</label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => markTouched("message")}
          aria-invalid={!!errors.message}
          maxLength={1000}
          className={`${inputClass(errors.message)} resize-none`}
          placeholder="پیام خود را بنویسید..."
        />
        <div className="flex items-center justify-between mt-1.5">
          <p className="text-xs text-danger">{errors.message ?? ""}</p>
          <p className="text-xs text-fg-muted tabular">
            {form.message.length}/1000
          </p>
        </div>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold text-sm"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Send size={16} />
        )}
        ارسال پیام
      </button>
    </form>
  );
}
