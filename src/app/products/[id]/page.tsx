import { notFound } from "next/navigation";
import { getAllProductIds, getProductById } from "@/lib/api";
import ProductDetail from "@/components/ProductDetail";

export async function generateStaticParams() {
  const ids = await getAllProductIds();
  return ids.map((id) => ({ id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getProductById(params.id);
  if (!product) notFound();
  return <ProductDetail product={product} />;
}
