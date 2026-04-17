export interface ProductSpecs {
  brand?: string;
  model?: string;
  color?: string;
  warranty?: string;
  weight?: string;
  dimensions?: string;
  screenSize?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  os?: string;
  connectionType?: string;
  driverSize?: string;
  frequency?: string;
  impedance?: string;
  material?: string;
}

export type CategorySlug =
  | "mobiles"
  | "laptops"
  | "headphones"
  | "tablets"
  | "accessories";

export interface Product {
  id: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  category: string;
  categorySlug: CategorySlug;
  image: string;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  specs: ProductSpecs;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface CheckoutFormData {
  fullName: string;
  phone: string;
  address: string;
  postalCode: string;
  province: string;
  city: string;
  paymentMethod: "online" | "cod";
}

export type SortBy = "newest" | "cheapest" | "expensive" | "popular";
