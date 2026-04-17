import { Rocket, ShieldCheck, Headphones, Award } from "lucide-react";

const VALUES = [
  {
    Icon: Rocket,
    title: "ارسال سریع",
    desc: "ارسال به سراسر کشور در کوتاه‌ترین زمان ممکن با همکاری بهترین شرکت‌های حمل و نقل.",
  },
  {
    Icon: ShieldCheck,
    title: "ضمانت اصالت",
    desc: "تمامی محصولات با ضمانت اصالت کالا و گارانتی شرکتی معتبر عرضه می‌شوند.",
  },
  {
    Icon: Headphones,
    title: "پشتیبانی ۲۴ ساعته",
    desc: "تیم پشتیبانی ما در تمام ساعات شبانه‌روز آماده پاسخگویی به سوالات شماست.",
  },
  {
    Icon: Award,
    title: "کیفیت برتر",
    desc: "انتخاب دقیق محصولات و همکاری با برندهای معتبر، تضمین‌کننده کیفیت است.",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-extrabold text-fg-primary mb-4">
          درباره تک شاپ
        </h1>
        <p className="text-fg-secondary text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          تک شاپ یکی از بزرگ‌ترین فروشگاه‌های آنلاین تخصصی محصولات دیجیتال در
          ایران است که با هدف ارائه بهترین محصولات با مناسب‌ترین قیمت و بالاترین
          کیفیت خدمات، فعالیت خود را آغاز کرده است.
        </p>
      </div>

      <div className="bg-bg-card border border-line rounded-2xl p-6 md:p-10 space-y-5 text-fg-secondary leading-relaxed">
        <p>
          ما در تک شاپ بر این باوریم که خرید یک محصول دیجیتال باید تجربه‌ای
          ساده، مطمئن و لذت‌بخش باشد. به همین دلیل، از انتخاب دقیق محصولات و
          همکاری با برندهای معتبر جهانی گرفته تا ارسال سریع و پشتیبانی حرفه‌ای
          پس از فروش، همه‌ی مراحل را با دقت و وسواس پیش می‌بریم.
        </p>
        <p>
          گستره‌ی محصولات ما شامل جدیدترین مدل‌های گوشی‌های هوشمند، لپ‌تاپ‌های
          قدرتمند، تبلت‌های پرکاربرد، هدفون‌های با کیفیت و انواع لوازم جانبی
          کاربردی است. هدف ما این است که هر آنچه برای یک سبک زندگی دیجیتال مدرن
          نیاز دارید را در یک مکان امن و مطمئن در اختیار شما قرار دهیم.
        </p>
        <p>
          رضایت مشتری، سرمایه اصلی ماست. تیم ما همواره تلاش می‌کند تا با ارائه
          مشاوره تخصصی، ضمانت اصالت کالا، ارسال به موقع و پشتیبانی ۲۴ ساعته،
          تجربه خرید شما را به یک خاطره خوش تبدیل کند.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-fg-primary text-center mt-14 mb-8">
        ارزش‌های ما
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {VALUES.map((v) => (
          <div
            key={v.title}
            className="bg-bg-card border border-line rounded-2xl p-6 hover:border-accent/40 hover:shadow-card transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-soft flex items-center justify-center mb-4">
              <v.Icon size={22} className="text-accent-text" />
            </div>
            <h3 className="font-bold text-fg-primary mb-2">{v.title}</h3>
            <p className="text-sm text-fg-secondary leading-relaxed">
              {v.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
