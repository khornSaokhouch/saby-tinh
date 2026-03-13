"use client";
import { useParams } from "next/navigation";
import ProductDetails from "@/components/ProductDetails";

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug; 

  if (!slug) return <div className="text-center">Product not found.</div>;

  return <ProductDetails productSlug={slug} />;
}
