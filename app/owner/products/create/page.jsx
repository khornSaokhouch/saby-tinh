'use client';

import ProductForm from '@/components/owner/ProductForm';

export default function CreateProductPage() {
  return (
    <main className="min-h-screen">
      <ProductForm mode="create" />
    </main>
  );
}
