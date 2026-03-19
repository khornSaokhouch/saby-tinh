"use client";

import React, { useEffect, useState, useMemo } from 'react';
import { useProductStore } from '@/stores/useProductStore';
import { Loader2, Package, Zap } from 'lucide-react';
import SectionHeader from '@/components/ui/SectionHeader';

const ProductDiscountSection = () => {
  const { products, fetchProductsByFilters, loading } = useProductStore();
  const [promotedProducts, setPromotedProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const loadData = async () => {
      await fetchProductsByFilters({ hasPromotion: true, silent: true });
    };
    loadData();
  }, [fetchProductsByFilters]);

  // Sync internal state when store products change
  useEffect(() => {
    const promoted = (products || []).filter(p => 
      (p.category?.promotions || []).some(promo => promo.status === 1)
    );
    setPromotedProducts(promoted);
  }, [products]);

  const mainProduct = promotedProducts[0];
  const sideProducts = promotedProducts.slice(1, 4);

  // Active promotion for the main product
  const activePromotion = useMemo(() => {
    return (mainProduct?.category?.promotions || []).find(p => p.status === 1);
  }, [mainProduct]);

  useEffect(() => {
    if (!activePromotion?.end_date) return;

    const timer = setInterval(() => {
      const difference = +new Date(activePromotion.end_date) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activePromotion]);

  if (loading && promotedProducts.length === 0) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 text-rose-500 animate-spin mx-auto mb-4" />
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Searching for deals...</p>
      </div>
    );
  }

  if (promotedProducts.length === 0) return null;

  const originalPrice = Number(mainProduct?.price || 0);
  const discountValue = parseFloat(activePromotion?.discount_value || 0);
  const discountType = activePromotion?.discount_type || 'none';
  
  let discountedPrice = originalPrice;
  if (discountType === 'percentage') {
    discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
  } else if (discountType === 'fixed') {
    discountedPrice = Math.max(0, originalPrice - discountValue);
  }

  return (
    <div className="font-sans">
      <div className="max-w-8xl mx-auto">
        {/* Header Bar - Harmonized with Home Page */}
        <SectionHeader 
          title="Flash Deals" 
          subtitle="Limited time offers from our top merchants" 
          icon={Zap} 
          color="text-rose-500 bg-rose-50"
          count={promotedProducts.length}
          deadline={activePromotion?.end_date}
          link="/store" 
        />

        {/* Main Content Area (Old UI - Featured Layout) */}
        <main className="flex flex-col lg:flex-row gap-6">
          {/* Left Column: Main Product Card */}
          <div className="flex-[3] bg-white p-6 rounded-lg shadow-sm flex flex-col md:flex-row gap-8 border border-gray-100">
            {/* Image Gallery */}
            <div className="flex gap-4 flex-1">
              <div className="flex flex-col gap-3">
                {(mainProduct?.images || []).slice(0, 4).map((img, i) => (
                  <div key={i} className={`w-16 h-16 border rounded-md cursor-pointer flex items-center justify-center p-1 ${i === 0 ? 'border-indigo-500' : 'border-gray-100'}`}>
                    <img src={img.image} alt="Thumbnail" className="max-w-full max-h-full object-contain" />
                  </div>
                ))}
              </div>
              <div className="flex-grow flex items-center justify-center">
                <img 
                   src={mainProduct?.images?.[0]?.image || "/placeholder.svg"} 
                   alt={mainProduct?.name} 
                   className="max-h-[400px] object-contain transition-transform hover:scale-105 duration-500" 
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="flex-1 flex flex-col gap-4">
              <h3 className="text-xl font-bold text-gray-800 leading-tight line-clamp-2 uppercase tracking-tight">{mainProduct?.name}</h3>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-rose-600">${discountedPrice.toLocaleString()}</span>
                {discountValue > 0 && (
                  <span className="text-lg text-gray-400 line-through font-bold">${originalPrice.toLocaleString()}</span>
                )}
              </div>
              
              <div className="text-[13px] text-gray-600 leading-relaxed border-l-2 border-indigo-500 pl-4 py-1 italic line-clamp-3">
                {mainProduct?.description}
              </div>

              <div className="flex gap-3">
                <span className="bg-green-100 text-green-700 text-[10px] font-black py-1 px-3 rounded uppercase tracking-widest">Free Shipping</span>
                <span className="bg-rose-100 text-rose-700 text-[10px] font-black py-1 px-3 rounded uppercase tracking-widest">{activePromotion?.name || "Flash Sale"}</span>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-50">
                <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest leading-none">
                  Hurry Up! Promotion expires in:
                </p>
                <div className="flex gap-4 items-center">
                  <CountdownItem value={timeLeft.days} label="d" />
                  <CountdownItem value={timeLeft.hours} label="h" />
                  <CountdownItem value={timeLeft.minutes} label="m" />
                  <CountdownItem value={timeLeft.seconds} label="s" />
                </div>
              </div>
              
              <div className="mt-auto pt-4">
                <div className="flex justify-between text-[11px] font-black text-gray-400 uppercase tracking-widest mb-2">
                   <span>Availability</span>
                   <span>{mainProduct?.items?.[0]?.quantity_in_stock || 0} left</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                   <div 
                     className="h-full bg-indigo-500 transition-all duration-1000" 
                     style={{ width: `${Math.min(100, (mainProduct?.items?.[0]?.quantity_in_stock / 100) * 100)}%` }} 
                   />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Ad Sidebar */}
          <aside className="lg:w-80 flex flex-col gap-4">
            {sideProducts.length > 0 ? (
              sideProducts.map((p) => (
                <div key={p.id} className="group relative rounded-xl overflow-hidden shadow-sm border border-gray-100 bg-white aspect-[5/4]">
                  <img 
                    src={p.images?.[0]?.image || "/placeholder.svg"} 
                    alt={p.name} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-4">
                     <span className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">Limited Deal</span>
                     <h4 className="text-white font-bold text-xs truncate uppercase tracking-tight">{p.name}</h4>
                     <p className="text-white/60 text-[10px] font-bold">${p.price}</p>
                  </div>
                </div>
              ))
            ) : (
                <div className="flex-1 rounded-xl bg-gray-50 border border-dashed border-gray-200 flex flex-col items-center justify-center p-8 text-center">
                   <Package className="w-8 h-8 text-gray-200 mb-2" />
                   <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">More deals coming soon</p>
                </div>
            )}
          </aside>
        </main>
      </div>
    </div>
  );
};

const CountdownItem = ({ value, label }) => (
  <div className="flex flex-col items-center min-w-[40px]">
    <span className="text-2xl font-black text-gray-900 leading-none">{String(value).padStart(2, '0')}</span>
    <span className="text-[10px] font-black text-gray-400 uppercase mt-1">{label}</span>
  </div>
);

export default ProductDiscountSection;