"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useShoppingCartStore } from "@/stores/useShoppingCart";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
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

  // Promotion logic
  const promotions = (product.category?.promotions || []).filter(p => p.status === 1);
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
    } catch { toast.error("Failed to add"); }
  };

  const productSlug = slugify(product.name);
  const primaryImage = product.images?.find(img => img.is_primary)?.image || product.images?.[0]?.image || "/placeholder.svg";
  const productHref = `/category/${slugify(product.category?.name || 'catalog')}/${productSlug}`;

  return (
    <div className="group relative bg-white border border-slate-100 rounded-2xl hover:border-slate-200 hover:shadow-md transition-all duration-200 flex flex-col h-full overflow-hidden">

      {/* IMAGE */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 rounded-t-2xl">
        <Link href={productHref}>
          <img
            src={primaryImage}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {isNew && (
            <span className="bg-indigo-600 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              New
            </span>
          )}
          {hasPromotion && (
            <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
              {discountBadge}
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleFavorite(product); }}
          className={`absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-xl border transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 ${
            favourited
              ? "bg-rose-500 border-rose-500 text-white"
              : "bg-white border-slate-100 text-slate-400 hover:text-rose-500 hover:border-rose-200"
          }`}
        >
          <Heart size={13} fill={favourited ? "currentColor" : "none"} strokeWidth={2} />
        </button>
      </div>

      {/* INFO */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider truncate max-w-[70%]">
            {product.category?.name || "General"}
          </span>
          <div className="flex items-center gap-0.5">
            <Star size={8} fill="#f59e0b" stroke="none" />
            <span className="text-[9px] font-bold text-slate-500">
              {product.reviews_avg_rating ? Number(product.reviews_avg_rating).toFixed(1) : "—"}
            </span>
          </div>
        </div>

        <Link href={productHref}>
          <h3 className="text-[12px] font-semibold text-slate-800 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-[10px] text-slate-400 font-medium truncate mb-3">
          {product.store?.name || "Official Store"}
        </p>

        {/* Price + Cart */}
        <div className="mt-auto flex items-center justify-between pt-2.5 border-t border-slate-50">
          <div>
            <p className="text-sm font-black text-slate-900">
              ${discountedPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            {hasPromotion && (
              <p className="text-[9px] text-slate-400 line-through font-medium">
                ${originalPrice.toFixed(2)}
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-colors active:scale-95 shadow-sm"
          >
            <ShoppingCart size={14} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
}