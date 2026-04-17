import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient accents */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>
      <div className="relative max-w-4xl mx-auto text-center px-4 py-20 md:py-28">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-fg-primary leading-tight mb-5">
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
