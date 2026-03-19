"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Heart, ShoppingCart, Tag, Star, ArrowUpRight } from "lucide-react";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { motion } from "framer-motion";
import { toast } from 'react-hot-toast';

const slugify = (text) => text?.toString().toLowerCase().trim()
  .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-') || "";

export default function ProductCard({ product }) {
  const userId = useUserStore((state) => state.user?.id);
  const { addToCart } = useShoppingCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const favourited = isFavorite(product.id) && isMounted;

  useEffect(() => { setIsMounted(true); }, []);

  // --- LOGIC (Maintained) ---
  const promotions = (product.category?.promotions || []).filter(
    (p) => p.status === 1
  );
  const activePromotion = promotions[0];
  const discountType = activePromotion?.discount_type || 'none';
  const discountValue = parseFloat(activePromotion?.discount_value || 0);
  const hasPromotion = activePromotion && discountType !== 'none' && discountValue > 0;
  
  const originalPrice = parseFloat(product.price || 0);
  let discountedPrice = originalPrice;
  let discountBadge = "";

  if (hasPromotion) {
    if (discountType === 'percentage') {
      discountedPrice = originalPrice - (originalPrice * discountValue) / 100;
      discountBadge = `-${discountValue}%`;
    } else if (discountType === 'fixed') {
      discountedPrice = Math.max(0, originalPrice - discountValue);
      discountBadge = `-$${discountValue}`;
    }
  }
  const isNew = Math.ceil(Math.abs(new Date() - new Date(product.created_at)) / (1000 * 60 * 60 * 24)) <= 7;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userId) return toast.error("Please login to add to cart");
    const variantId = product.items?.[0]?.variants?.[0]?.id;
    if (!variantId) return toast.error("Unavailable");
    try { 
      await addToCart({ product_item_variant_id: variantId, quantity: 1 }); 
      toast.success("Added to cart");
    } catch (err) { 
      console.error(err); 
      toast.error("Failed to add");
    }
  };

  const productSlug = slugify(product.name);
  const primaryImage = product.images?.find(img => img.is_primary)?.image || product.images?.[0]?.image || "/placeholder.svg";

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] flex flex-col h-full overflow-hidden">
      
      {/* MEDIA AREA */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-50">
        <Link href={`/category/${slugify(product.category?.name || 'catalog')}/${productSlug}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {isNew && (
            <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-sm border border-slate-100">
              New Drop
            </span>
          )}
          {hasPromotion && (
            <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest shadow-lg">
              {discountBadge}
            </span>
          )}
        </div>

        {/* Action Overlay (Visible on Hover/Desktop, Always on Mobile) */}
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 translate-x-10 group-hover:translate-x-0 transition-transform duration-300">
           <button
            onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
            className={`p-2 rounded-xl transition-all shadow-sm ${favourited ? "bg-rose-500 text-white" : "bg-white text-slate-400 hover:text-rose-500"}`}
          >
            <Heart size={14} fill={favourited ? "currentColor" : "none"} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* CONTENT AREA */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest truncate max-w-[70%]">
            {product.category?.name || "General"}
          </span>
          <div className="flex items-center gap-0.5 text-amber-500">
             <Star size={8} fill="currentColor" stroke="none" />
             <span className="text-[9px] font-black text-slate-900">{product.reviews_avg_rating ? Number(product.reviews_avg_rating).toFixed(1) : "0.0"}</span>
          </div>
        </div>

        <Link href={`/category/${slugify(product.category?.name || 'catalog')}/${productSlug}`} className="mb-1">
          <h3 className="text-[12px] font-bold text-slate-800 leading-tight line-clamp-1 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[10px] text-slate-400 font-medium line-clamp-1 mb-3">
          {product.store?.name || "Official Store"}
        </p>

        {/* FOOTER AREA */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-900">
              ${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            {hasPromotion && (
              <span className="text-[8px] text-slate-400 line-through font-bold">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-lg transition-all active:scale-90 hover:bg-indigo-600 shadow-sm"
          >
            <ShoppingCart size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}