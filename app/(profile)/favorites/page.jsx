"use client";

import React from "react";
import { useFavoriteStore } from "@/app/stores/useFavoriteStore";
import { useUserStore } from "@/app/stores/userStore";
import ProductCard from "@/app/components/card/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Heart, 
  ShoppingBag, 
  ArrowLeft, 
  Sparkles,
  Search
} from "lucide-react";

export default function UserFavouritesPage() {
  const { favorites, removeFavorite } = useFavoriteStore();
  const user = useUserStore((state) => state.user);

  const hasItems = favorites.length > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* 1. SIMPLE & CLEAN HEADER */}
      <header className="pt-12 pb-16 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex items-center gap-2 text-rose-500 font-bold text-sm mb-4 justify-center md:justify-start">
              <Heart size={16} fill="currentColor" />
              <span>My Wishlist</span>
            </div>
            
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Your Favorite Items
            </h1>
            
            <p className="text-slate-500 font-medium">
              You have {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved for later.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link 
              href="/shopping-cart"
              className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3.5 rounded-2xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
            >
              <ShoppingBag size={20} />
              <span className="text-sm font-bold">Go to Cart</span>
            </Link>
          </div>
        </div>
      </header>

      {/* 2. MAIN GRID SECTION */}
      <main className="px-6 sm:px-10 max-w-7xl mx-auto pb-24">
        <AnimatePresence mode="wait">
          {hasItems ? (
            <motion.div 
              key="favorites-grid"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {favorites.map((product) => (
                <div key={product.id} className="relative group">
                  <ProductCard
                    product={product}
                    isFavourite={true}
                    onAddFavourite={() => removeFavorite(product.id)}
                  />
                  {/* Optional: Add a 'Remove' helper text on hover for clarity */}
                </div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty-favorites"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto py-24 text-center bg-slate-50 rounded-[40px] border border-slate-100"
            >
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                <Heart size={32} className="text-slate-200" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                Your wishlist is empty
              </h2>
              <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10">
                Save items you love so you can easily find them later.
              </p>

              <Link 
                href="/products"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95 group"
              >
                <Search size={18} />
                Explore Products
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 3. REASSURANCE FOOTER */}
      <footer className="max-w-7xl mx-auto px-6 py-12 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
          <Sparkles size={16} className="text-amber-400" />
          <span>Items are saved to your account securely.</span>
        </div>
        <Link href="/" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
          Back to Home
        </Link>
      </footer>
    </div>
  );
}