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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen font-sans text-slate-900 pb-16">
      
      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Saved Items</h1>
            <p className="text-xs text-slate-500 font-medium">Your curated collection of {favorites.length} {favorites.length === 1 ? 'product' : 'products'}</p>
          </div>
        </div>
        <Link 
          href="/shopping-cart"
          className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-rose-500 transition-all shadow-lg shadow-slate-100 active:scale-95 text-xs font-bold"
        >
          <ShoppingBag size={16} />
          Checkout Cart
        </Link>
      </div>

      {/* GRID SECTION */}
      <AnimatePresence mode="wait">
        {hasItems ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isFavourite={true}
                onAddFavourite={() => removeFavorite(product.id)}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="py-20 text-center bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden relative"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-400 via-indigo-500 to-rose-400 opacity-20" />
            <Heart size={32} className="text-slate-100 mx-auto mb-4 border-2 border-slate-50 p-1.5 rounded-xl h-12 w-12" />
            <h2 className="text-sm font-bold text-slate-900 tracking-tight">Wishlist is Empty</h2>
            <p className="text-xs text-slate-400 font-medium mt-1 mb-8 max-w-[200px] mx-auto">Discover something special and save it here for later.</p>
            <Link 
              href="/products"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold text-xs shadow-lg shadow-indigo-100 transition-all hover:bg-indigo-700 active:scale-95"
            >
              <Search size={16} /> Start Browsing
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}