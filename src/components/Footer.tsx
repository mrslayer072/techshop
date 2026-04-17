"use client";

import Link from "next/link";
import Logo from "./Logo";
import { Instagram, Twitter, Send } from "lucide-react";

const usefulLinks = [
  { name: "موبایل", href: "/products?category=mobiles" },
  { name: "لپ‌تاپ", href: "/products?category=laptops" },
  { name: "هدفون", href: "/products?category=headphones" },
  { name: "تبلت", href: "/products?category=tablets" },
  { name: "لوازم جانبی", href: "/products?category=accessories" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-card border-t-2 border-accent/30 mt-16">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* About */}
          <div className="space-y-4">
            <Logo size={30} />
            <h3 className="font-bold text-fg-primary">درباره تک شاپ</h3>
            <p className="text-sm text-fg-secondary leading-relaxed">
              تک شاپ، فروشگاه آنلاین تخصصی محصولات دیجیتال با ضمانت اصالت کالا،
              ارسال سریع و پشتیبانی ۲۴ ساعته. ما به ارائه بهترین محصولات با
              مناسب‌ترین قیمت متعهد هستیم.
            </p>
          </div>

          {/* Useful links */}
          <div>
            <h3 className="font-bold text-fg-primary mb-4">لینک‌های مفید</h3>
            <ul className="space-y-2.5">
              {usefulLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-fg-secondary hover:text-accent-text transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-fg-primary mb-4">تماس با ما</h3>
            <ul className="space-y-2.5 text-sm text-fg-secondary">
              <li>ایمیل: info@techshop.ir</li>
              <li>تلفن: ۰۲۱-۱۲۳۴۵۶۷۸</li>
              <li>آدرس: تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۸</li>
            </ul>
            <div className="flex items-center gap-3 mt-5">
              <a
                href="#"
                aria-label="اینستاگرام"
                className="w-9 h-9 rounded-lg border border-line hover:border-accent hover:text-accent-text flex items-center justify-center text-fg-muted transition-colors"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="توییتر"
                className="w-9 h-9 rounded-lg border border-line hover:border-accent hover:text-accent-text flex items-center justify-center text-fg-muted transition-colors"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                aria-label="تلگرام"
                className="w-9 h-9 rounded-lg border border-line hover:border-accent hover:text-accent-text flex items-center justify-center text-fg-muted transition-colors"
              >
                <Send size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-line text-center text-xs text-fg-muted">
          © ۱۴۰۵ تک شاپ — تمامی حقوق محفوظ است
        </div>
      </div>
    </footer>
  );
}
