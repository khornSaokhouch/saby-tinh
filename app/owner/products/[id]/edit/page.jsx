'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useProductStore } from '@/stores/useProductStore';
import ProductForm from '@/components/owner/ProductForm';
import { Loader2, Package } from 'lucide-react';

export default function EditProductPage() {
  const { id } = useParams();
  const { product: storeProduct, fetchProductById, loading } = useProductStore();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Sync store product to local state when it changes
  useEffect(() => {
    if (storeProduct && String(storeProduct.id) === String(id)) {
      setProduct(storeProduct);
    }
  }, [storeProduct, id]);

  if (loading && !product) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-bold uppercase tracking-widest">Retrieving Product Data...</p>
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-slate-50/50 flex flex-col items-center justify-center text-slate-400">
        <Package className="mb-4 opacity-20" size={64} />
        <p className="text-sm font-bold text-slate-900">Product Not Found</p>
        <p className="text-xs mt-1">The requested inventory item could not be retrieved.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50">
      <ProductForm mode="edit" initialData={product} />
    </main>
  );
}
