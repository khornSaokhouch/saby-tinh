"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Heart, ShoppingCart, Tag, Star } from "lucide-react";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { motion } from "framer-motion";

const slugify = (text) => text.toString().toLowerCase().trim()
  .replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-');

export default function ProductCard({ product }) {
  const userId = useUserStore((state) => state.user?.id);
  const { addToCart } = useShoppingCartStore();
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  
  const [isMounted, setIsMounted] = useState(false);
  const favourited = isFavorite(product.id) && isMounted;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- LOGIC ---
  const promotions = product.category?.promotions || [];
  const activePromotion = promotions[0];
  const hasPromotion = activePromotion && (activePromotion.discount_percentage > 0);
  const discount = hasPromotion ? activePromotion.discount_percentage : 0;
  
  const originalPrice = parseFloat(product.price || 0);
  const discountedPrice = hasPromotion
    ? originalPrice - (originalPrice * discount) / 100
    : originalPrice;

  const createdAt = new Date(product.created_at);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now - createdAt) / (1000 * 60 * 60 * 24));
  const isNew = diffDays <= 7;

  // --- HANDLERS ---
  const handleFavouriteClick = (e) => {
    e.preventDefault();
    toggleFavorite(product);
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!userId) return alert("Please log in.");
    
    // Get the first variant of the first item as default for quick-add
    const variantId = product.items?.[0]?.variants?.[0]?.id;
    
    if (!variantId) {
      return alert("This product is currently unavailable for purchase.");
    }

    try {
      await addToCart({ 
        product_item_variant_id: variantId, 
        quantity: 1 
      });
    } catch (err) {
      console.error(err);
    }
  };

  const productSlug = slugify(product.name);
  const primaryImage = product.images?.find(img => img.is_primary)?.image || product.images?.[0]?.image || "/placeholder.svg";

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-100 transition-all duration-300 flex flex-col h-full"
    >
      {/* 1. TOP MEDIA AREA */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <Link href={`/category/${slugify(product.category?.name || 'hardware')}/${productSlug}`}>
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
        </Link>
        
        {/* NEW DROP - TOP LEFT */}
        {isNew && (
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-lg uppercase tracking-[0.12em] flex items-center gap-1 shadow-lg">
              <Star size={10} fill="#fbbf24" stroke="none" /> New
            </span>
          </div>
        )}

        {/* DISCOUNT - BOTTOM RIGHT */}
        {hasPromotion && (
          <div className="absolute bottom-3 right-3 z-10">
            <span className="bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-lg flex items-center gap-1">
               <Tag size={10} /> -{discount}%
            </span>
          </div>
        )}

        {/* Wishlist Button - TOP RIGHT */}
        <button
          onClick={handleFavouriteClick}
          className={`absolute top-3 right-3 p-2 rounded-xl transition-all shadow-sm z-10 ${
            favourited 
              ? "bg-rose-500 text-white" 
              : "bg-white/90 backdrop-blur-md text-slate-400 hover:text-rose-500"
          }`}
        >
          <Heart size={14} fill={favourited ? "currentColor" : "none"} />
        </button>
      </div>

      {/* 2. CONTENT AREA */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {product.category?.name || "Hardware"}
            </span>
            <div className="flex items-center gap-1.5 text-amber-500">
                <Star size={11} fill="currentColor" stroke="none" />
                <span className="text-[11px] font-black text-slate-900">
                    {product.reviews_avg_rating ? Number(product.reviews_avg_rating).toFixed(1) : "0.0"}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">
                    ({product.reviews_count || 0})
                </span>
            </div>
        </div>

        <Link href={`/category/${slugify(product.category?.name || 'hardware')}/${productSlug}`}>
          <h3 className="text-sm font-black text-slate-900 leading-snug line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[11px] text-slate-500 font-medium line-clamp-2 leading-relaxed mb-4">
          {product.description || "Premium performance hardware listing."}
        </p>

        {/* 3. PRICE & CTA BLOCK */}
        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
             <span className="text-sm font-black text-slate-900">
                ${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
             {hasPromotion && (
               <span className="text-[10px] text-slate-400 line-through font-bold">
                 ${originalPrice.toFixed(2)}
               </span>
             )}
          </div>

          <button
            onClick={handleAddToCart}
            className="group/btn flex items-center gap-2 bg-slate-900 hover:bg-indigo-600 text-white p-2.5 px-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-slate-200"
          >
            <span className="text-[10px] font-black uppercase tracking-widest hidden sm:block">Add</span>
            <ShoppingCart size={14} className="group-hover/btn:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}