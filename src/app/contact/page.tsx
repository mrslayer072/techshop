import { Mail, Phone, MapPin } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-extrabold text-fg-primary mb-3">
          تماس با ما
        </h1>
        <p className="text-fg-secondary">
          هر سوال یا پیشنهادی دارید، با ما در میان بگذارید
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact info */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="flex items-start gap-3 bg-bg-card border border-line rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
              <Mail size={18} className="text-accent-text" />
            </div>
            <div>
              <h3 className="font-semibold text-fg-primary mb-1">ایمیل</h3>
              <p className="text-sm text-fg-secondary" dir="ltr">
                info@techshop.ir
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-bg-card border border-line rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
              <Phone size={18} className="text-accent-text" />
            </div>
            <div>
              <h3 className="font-semibold text-fg-primary mb-1">تلفن</h3>
              <p className="text-sm text-fg-secondary tabular">۰۲۱-۱۲۳۴۵۶۷۸</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-bg-card border border-line rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-accent-text" />
            </div>
            <div>
              <h3 className="font-semibold text-fg-primary mb-1">آدرس</h3>
              <p className="text-sm text-fg-secondary leading-relaxed">
                تهران، خیابان ولیعصر، بالاتر از میدان ونک، پلاک ۱۲۸، طبقه ۴
              </p>
            </div>
          </div>
        </aside>

        {/* Form */}
        <div className="lg:col-span-2 bg-bg-card border border-line rounded-2xl p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
