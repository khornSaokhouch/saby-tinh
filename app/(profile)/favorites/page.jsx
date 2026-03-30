"use client";

import React from "react";
import { useFavoriteStore } from "@/app/stores/useFavoriteStore";
import ProductCard from "@/app/components/card/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Heart, ShoppingBag, Search, Sparkles } from "lucide-react";

export default function UserFavouritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const hasItems = favorites.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. COMPACT HEADER */}
      <header className="pt-6 pb-6 px-5 sm:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-rose-500 font-black text-[10px] uppercase tracking-widest">
              <Heart size={12} fill="currentColor" />
              <span>Wishlist</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Saved Items</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
              {favorites.length} {favorites.length === 1 ? 'Product' : 'Products'} Reserved
            </p>
          </div>

          <Link 
            href="/shopping-cart"
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-slate-100 active:scale-95 text-xs font-bold"
          >
            <ShoppingBag size={16} />
            View Cart
          </Link>
        </div>
      </header>

      {/* 2. GRID SECTION */}
      <main className="px-5 sm:px-8 max-w-6xl mx-auto pb-16">
        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {favorites.map((product) => (
                <div key={product.id} className="scale-95 hover:scale-100 transition-transform">
                  <ProductCard
                    product={product}
                    isFavourite={true}
                    onAddFavourite={() => removeFavorite(product.id)}
                  />
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="max-w-md mx-auto py-16 text-center bg-slate-50/50 rounded-[24px] border border-slate-100"
            >
              <Heart size={24} className="text-slate-200 mx-auto mb-4" />
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight">Wishlist Empty</h2>
              <p className="text-[11px] text-slate-400 font-bold uppercase mt-1 mb-6">No items saved yet.</p>
              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md shadow-indigo-100"
              >
                <Search size={14} /> Explore Shop
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}