"use client";

import { useState } from "react";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitContactForm } from "@/lib/api";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
          }}
          className="btn-primary px-6 py-2.5 rounded-xl text-sm font-medium mt-2"
        >
          ارسال پیام جدید
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">نام</label>
          <input
            type="text"
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full bg-search border border-line rounded-xl px-4 py-3 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted"
            placeholder="نام شما"
          />
        </div>
        <div>
          <label className="block text-sm text-fg-secondary mb-1.5">
            ایمیل
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full bg-search border border-line rounded-xl px-4 py-3 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted"
            placeholder="email@example.com"
            dir="ltr"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">موضوع</label>
        <input
          type="text"
          required
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          className="w-full bg-search border border-line rounded-xl px-4 py-3 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted"
          placeholder="موضوع پیام"
        />
      </div>
      <div>
        <label className="block text-sm text-fg-secondary mb-1.5">پیام</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          className="w-full bg-search border border-line rounded-xl px-4 py-3 text-sm text-fg-primary outline-none focus:border-accent transition-colors placeholder:text-fg-muted resize-none"
          placeholder="پیام خود را بنویسید..."
        />
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
