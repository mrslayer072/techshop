import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { withBase } from "@/lib/utils";

export default function Hero() {
  return (
    <section>
      {/* Hero image — full width, switches with theme */}
      <div className="w-full overflow-hidden">
        <img
          src={withBase("/Hero/hero-light.webp")}
          alt="تک شاپ"
          className="w-full object-cover dark:hidden"
          draggable={false}
        />
        <img
          src={withBase("/Hero/hero-dark.webp")}
          alt="تک شاپ"
          className="w-full object-cover hidden dark:block"
          draggable={false}
        />
      </div>

      {/* Title + button below the image */}
      <div className="max-w-4xl mx-auto text-center px-4 py-10 md:py-14">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-fg-primary leading-tight mb-4">
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
