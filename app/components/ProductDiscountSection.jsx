"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useProductStore } from '@/stores/useProductStore';
import { Loader2, Zap, ArrowRight, Tag, Package } from 'lucide-react';

const slugify = (text) => text?.toString().toLowerCase().trim()
  .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') || "";

const ProductDiscountSection = () => {
  const { products, fetchProductsByFilters, loading } = useProductStore();
  const [promotedProducts, setPromotedProducts] = useState([]);
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    fetchProductsByFilters({ hasPromotion: true, silent: true });
  }, [fetchProductsByFilters]);

  useEffect(() => {
    const promoted = (products || []).filter(p =>
      (p.category?.promotions || []).some(promo => promo.status === 1)
    );
    setPromotedProducts(promoted);
  }, [products]);

  const mainProduct = promotedProducts[0];
  const sideProducts = promotedProducts.slice(1, 4);

  const activePromotion = useMemo(() =>
    (mainProduct?.category?.promotions || []).find(p => p.status === 1),
    [mainProduct]
  );

  // Countdown
  useEffect(() => {
    if (!activePromotion?.end_date) return;
    const timer = setInterval(() => {
      const diff = +new Date(activePromotion.end_date) - +new Date();
      if (diff > 0) {
        setTimeLeft({
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [activePromotion]);

  if (loading && promotedProducts.length === 0) {
    return (
      <div className="py-10 text-center">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin mx-auto" />
      </div>
    );
  }

  if (promotedProducts.length === 0) return null;

  const originalPrice = Number(mainProduct?.price || 0);
  const discountValue = parseFloat(activePromotion?.discount_value || 0);
  const discountType = activePromotion?.discount_type || 'none';
  let discountedPrice = originalPrice;
  if (discountType === 'percentage') discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
  else if (discountType === 'fixed') discountedPrice = Math.max(0, originalPrice - discountValue);
  const discountBadge = discountType === 'percentage' ? `-${discountValue}%` : discountType === 'fixed' ? `-$${discountValue}` : '';

  const primaryImage = mainProduct?.images?.find(i => i.is_primary)?.image || mainProduct?.images?.[0]?.image || '/placeholder.svg';
  const productHref = `/category/${slugify(mainProduct?.category?.name || 'catalog')}/${slugify(mainProduct?.name)}`;

  return (
    <section className="font-sans">
      {/* Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 w-7 h-7 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <Zap size={14} className="text-rose-500" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">Deal of the Day</h2>
              {discountBadge && (
                <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                  {discountBadge}
                </span>
              )}
            </div>
            <p className="text-[12px] text-slate-400 font-medium mt-0.5">
              Ends in &nbsp;
              <span className="font-bold text-slate-700 tabular-nums">
                {String(timeLeft.hours).padStart(2,'0')}:{String(timeLeft.minutes).padStart(2,'0')}:{String(timeLeft.seconds).padStart(2,'0')}
              </span>
            </p>
          </div>
        </div>
        <Link href="/store" className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          View all <ArrowRight size={13} />
        </Link>
      </div>

      {/* Layout */}
      <div className="flex flex-col lg:flex-row gap-4">

        {/* Main Product */}
        <Link href={productHref} className="group flex-[2] bg-white border border-slate-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-5 hover:border-slate-200 hover:shadow-md transition-all">
          {/* Image */}
          <div className="w-full sm:w-44 shrink-0 aspect-square bg-slate-50 rounded-xl flex items-center justify-center overflow-hidden">
            <img
              src={primaryImage}
              alt={mainProduct?.name}
              className="w-full h-full object-contain transition-transform group-hover:scale-105 duration-500"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between flex-1 min-w-0">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {mainProduct?.category?.name || 'General'}
              </span>
              <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug line-clamp-2 mt-1 group-hover:text-indigo-600 transition-colors">
                {mainProduct?.name}
              </h3>
              <p className="text-[12px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                {mainProduct?.description}
              </p>
            </div>

            <div>
              {/* Badges */}
              <div className="flex gap-2 mt-3">
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-lg uppercase tracking-wider">Free Shipping</span>
                {activePromotion?.name && (
                  <span className="text-[9px] font-black bg-rose-50 text-rose-500 px-2 py-0.5 rounded-lg uppercase tracking-wider">{activePromotion.name}</span>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-black text-slate-900">
                  ${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                {discountValue > 0 && (
                  <span className="text-sm text-slate-400 line-through font-medium">${originalPrice.toFixed(2)}</span>
                )}
              </div>

              {/* Stock bar */}
              <div className="mt-3">
                <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                  <span>Stock remaining</span>
                  <span>{mainProduct?.items?.[0]?.quantity_in_stock || 0} left</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (mainProduct?.items?.[0]?.quantity_in_stock / 50) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </Link>

        {/* Side products */}
        {sideProducts.length > 0 && (
          <div className="lg:w-64 flex flex-row lg:flex-col gap-3">
            {sideProducts.map(p => {
              const img = p.images?.find(i => i.is_primary)?.image || p.images?.[0]?.image || '/placeholder.svg';
              const href = `/category/${slugify(p.category?.name || 'catalog')}/${slugify(p.name)}`;
              return (
                <Link
                  key={p.id}
                  href={href}
                  className="group flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:border-slate-200 hover:shadow-sm transition-all flex-1 lg:flex-initial"
                >
                  <div className="w-14 h-14 shrink-0 bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center">
                    <img src={img} alt={p.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1 mb-0.5">
                      <Tag size={9} className="text-rose-400 shrink-0" />
                      <span className="text-[9px] font-bold text-rose-400 uppercase tracking-wider">Deal</span>
                    </div>
                    <p className="text-[12px] font-semibold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">{p.name}</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">${Number(p.price).toFixed(2)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductDiscountSection;