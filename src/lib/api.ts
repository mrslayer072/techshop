import { products } from "@/data/products";
import type {
  Product,
  ContactFormData,
  CheckoutFormData,
  CategorySlug,
  SortBy,
} from "@/types";

const CATEGORY_NAMES: Record<CategorySlug, string> = {
  mobiles: "موبایل",
  laptops: "لپ‌تاپ",
  headphones: "هدفون",
  tablets: "تبلت",
  accessories: "لوازم جانبی",
};

function sortProducts(list: Product[], sortBy?: SortBy): Product[] {
  if (!sortBy) return list;
  const copy = [...list];
  switch (sortBy) {
    case "newest":
      return copy; // preserve natural order (newest first in the array)
    case "cheapest":
      return copy.sort((a, b) => a.price - b.price);
    case "expensive":
      return copy.sort((a, b) => b.price - a.price);
    case "popular":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    default:
      return copy;
  }
}

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  discountOnly?: boolean;
  sortBy?: SortBy;
}): Promise<Product[]> {
  let result = [...products];
  if (filters?.category) {
    result = result.filter((p) => p.categorySlug === filters.category);
  }
  if (filters?.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.includes(filters.search!) ||
        p.category.includes(filters.search!),
    );
  }
  if (filters?.discountOnly) {
    result = result.filter((p) => p.originalPrice && p.originalPrice > p.price);
  }
  return sortProducts(result, filters?.sortBy);
}

export async function searchProducts(
  query: string,
  limit: number = 5,
): Promise<Product[]> {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  return products
    .filter((p) => p.name.toLowerCase().includes(q))
    .slice(0, limit);
}

export async function getDiscountedProducts(): Promise<Product[]> {
  return products.filter((p) => p.originalPrice && p.originalPrice > p.price);
}

export async function getProductById(id: string): Promise<Product | null> {
  return products.find((p) => p.id === id) ?? null;
}

export async function getCategories(): Promise<
  { slug: CategorySlug; name: string; count: number }[]
> {
  const slugs: CategorySlug[] = [
    "mobiles",
    "laptops",
    "headphones",
    "tablets",
    "accessories",
  ];
  return slugs.map((slug) => ({
    slug,
    name: CATEGORY_NAMES[slug],
    count: products.filter((p) => p.categorySlug === slug).length,
  }));
}

export async function submitContactForm(
  _data: ContactFormData,
): Promise<{ success: boolean }> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  return { success: true };
}

export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit: number = 6,
): Promise<Product[]> {
  return products
    .filter((p) => p.categorySlug === categorySlug && p.id !== productId)
    .slice(0, limit);
}

export async function getAllProductIds(): Promise<string[]> {
  return products.map((p) => p.id);
}

export async function submitOrder(
  _data: CheckoutFormData,
): Promise<{ success: boolean; orderNumber: string }> {
  await new Promise((resolve) => setTimeout(resolve, 1200));
  const num = Math.floor(Math.random() * 900000) + 100000;
  return { success: true, orderNumber: `TS-${num}` };
}
