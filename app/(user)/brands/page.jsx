"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  Filter,
  X
} from "lucide-react";
import { useBrandStore } from "@/stores/useBrandStore";
import { useProductStore } from "@/stores/useProductStore";
import ProductCard from "@/components/card/ProductCard";

export default function BrandExplorerPage() {
  const { brands, fetchBrands } = useBrandStore();
  const { products, loading, fetchProducts, fetchProductsByFilters } = useProductStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("all");

  // 1. Initial Data Load
  useEffect(() => {
    fetchBrands();
    fetchProducts();
  }, []);

  // 2. Debounce Search Term (Performance/UX optimization)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400); 
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 3. Handle Brand Selection & Filtering
  useEffect(() => {
    const loadFiltered = async () => {
      await fetchProductsByFilters({ 
        brandId: selectedBrandId,
        search: debouncedSearch
      });
    };
    loadFiltered();
  }, [selectedBrandId, debouncedSearch]);

  const filteredProducts = products || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
              <ShieldCheck size={14} className="stroke-[2.5]" /> Official Partners
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Brand <span className="text-indigo-600">Explorer</span>
            </h1>
            <p className="text-sm text-slate-500">
              Procure directly from industry-leading manufacturers.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components or brands..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* --- MIDDLE SECTION: Horizontal Brand Filters --- */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            
            {/* "All" Button */}
            <button
              onClick={() => setSelectedBrandId("all")}
              className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                selectedBrandId === "all"
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              }`}
            >
              <ShieldCheck size={16} className={selectedBrandId === "all" ? "text-slate-300" : "text-slate-400"} />
              All Brands
            </button>

            {/* Brand Buttons */}
            {brands.map((brand) => (
              <button
                key={brand.id}
                onClick={() => setSelectedBrandId(brand.id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  selectedBrandId === brand.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                {brand.name}
              </button>
            ))}
          </div>
        </div>

        {/* --- INFO BAR: Results Count & Clear Filters --- */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Filter size={16} />
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> results
          </div>

          {(selectedBrandId !== "all" || debouncedSearch) && (
            <button
              onClick={() => {
                setSelectedBrandId("all");
                setSearchTerm("");
                setDebouncedSearch("");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* --- BOTTOM SECTION: Full-Width Product Grid --- */}
        <AnimatePresence mode="wait">
          {loading && filteredProducts.length === 0 ? (
            /* Skeleton Loading */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
                <div key={i} className="flex flex-col bg-white rounded-2xl border border-slate-100 p-3 overflow-hidden shadow-sm">
                  <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl mb-4" />
                  <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded mb-4" />
                  <div className="h-8 w-full bg-slate-50 animate-pulse rounded-lg mt-auto" />
                </div>
              ))}
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            /* Real Products */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-center px-4"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No hardware found</h3>
              <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                We couldn't find any products from this manufacturer matching your search. Try resetting your filters.
              </p>
              <button
                onClick={() => {
                  setSelectedBrandId("all");
                  setSearchTerm("");
                }}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Clear Filters & Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Global CSS to hide the scrollbar for horizontal scrolling tabs */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}