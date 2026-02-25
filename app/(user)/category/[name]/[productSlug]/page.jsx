"use client";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

export default function CategoryProductDetailsPage() {
  const params = useParams();
  const productSlug = params?.productSlug;

  if (!productSlug) return <div className="text-center p-10">Product not found.</div>;

  return <ProductDetails productSlug={productSlug} />;
}
