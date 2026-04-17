import HomeSearch from "@/components/HomeSearch";
import Hero from "@/components/Hero";
import DiscountedProducts from "@/components/DiscountedProducts";
import CategoryShowcase from "@/components/CategoryShowcase";

export default function HomePage() {
  return (
    <>
      <HomeSearch />
      <Hero />
      <DiscountedProducts />
      <CategoryShowcase />
    </>
  );
}
