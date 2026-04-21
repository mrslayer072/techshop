import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Toast from "@/components/Toast";

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "تک شاپ | فروشگاه تخصصی محصولات دیجیتال",
  description:
    "فروشگاه آنلاین تک شاپ — خرید موبایل، لپ‌تاپ، تبلت، هدفون و لوازم جانبی با بهترین قیمت و ضمانت اصالت کالا.",
};

const themeInit = `
(function(){
  try {
    var stored = localStorage.getItem('theme');
    var prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    var t = stored || (prefersLight ? 'light' : 'dark');
    document.documentElement.setAttribute('data-theme', t);
    if (t === 'dark') document.documentElement.classList.add('dark');
  } catch(e) {}
})();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={vazirmatn.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <ThemeProvider>
          {/* AuthProvider sits outside CartProvider so the cart (and anything
              nested deeper) can read auth state without prop-drilling. */}
          <AuthProvider>
            <CartProvider>
              <Header />
              <main className="min-h-[calc(100vh-64px)]">{children}</main>
              <Footer />
              <CartDrawer />
              <Toast />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
