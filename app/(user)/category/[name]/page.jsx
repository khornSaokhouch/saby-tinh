"use client";
import { useParams } from "next/navigation";
import ProductsByCategoryPage from "@/components/ProductsByCategoryPage";

export default function CategoryPage() {
  const params = useParams();
  const name = params.name;

  return <ProductsByCategoryPage categoryName={name} />;
}
