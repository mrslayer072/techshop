import CheckoutForm from "@/components/CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
      <h1 className="text-2xl md:text-3xl font-extrabold text-fg-primary text-center mb-2">
        تکمیل خرید
      </h1>
      <p className="text-center text-fg-secondary text-sm mb-10">
        اطلاعات خود را وارد کنید تا سفارش شما ثبت شود
      </p>
      <CheckoutForm />
    </div>
  );
}
