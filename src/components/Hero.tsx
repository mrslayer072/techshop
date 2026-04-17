import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withBase } from "@/lib/utils";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Full-bleed hero image — switches automatically with data-theme */}
      <div className="absolute inset-0">
        {/* Light mode image */}
        <img
          src={withBase("/Hero/hero-light.webp")}
          alt=""
          aria-hidden
          className="w-full h-full object-cover dark:hidden"
          draggable={false}
        />
        {/* Dark mode image */}
        <img
          src={withBase("/Hero/hero-dark.webp")}
          alt=""
          aria-hidden
          className="w-full h-full object-cover hidden dark:block"
          draggable={false}
        />
        {/* Gradient overlay so text stays legible over any image */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/60 via-bg-primary/30 to-bg-primary/70" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center px-4 py-28 md:py-36">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-fg-primary leading-tight mb-5 drop-shadow-sm">
          بهترین محصولات، بهترین قیمت‌ها
        </h1>
        <p className="text-lg md:text-xl text-fg-secondary mb-8 max-w-xl mx-auto leading-relaxed">
          از فناوری تا لوازم جانبی، همه چیز در یک‌جا
        </p>
        <Link
          href="/products"
          className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-base"
        >
          مشاهده همه محصولات
          <ArrowLeft size={18} />
        </Link>
      </div>
    </section>
  );
}
