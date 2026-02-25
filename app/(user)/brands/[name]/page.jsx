"use client";

import { useParams } from "next/navigation";
import ProductsByBrandPage from "@/components/ProductsByBrandPage";

export default function BrandNamePage() {
  const params = useParams();
  const name = params.name;

  return <ProductsByBrandPage brandSlug={name} />;
}
