"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingBag, Filter, Box, X } from "lucide-react";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useProductStore } from "@/stores/useProductStore";
import ProductCard from "@/components/card/ProductCard";

export default function CategoryExplorerPage() {
  const { categories, fetchCategories } = useCategoryStore();
  const { products, loading, fetchProducts, fetchProductsByFilters } =
    useProductStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("all");

  /* -------------------- Initial Load -------------------- */
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  /* -------------------- Debounce -------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* -------------------- Filters -------------------- */
  useEffect(() => {
    const loadFiltered = async () => {
      await fetchProductsByFilters({
        categoryId: selectedCategoryId,
        search: debouncedSearch,
      });
    };
    loadFiltered();
  }, [selectedCategoryId, debouncedSearch]);

  const filteredProducts = products || [];

  return (
    <div className="min-h-screen pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Explore Components
            </h1>
            <p className="text-sm text-slate-500">
              Discover high-performance hardware components tailored for your build.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search components..."
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

        {/* ================= CATEGORY FILTERS ================= */}
        <div className="mb-8">
          <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 scroll-smooth snap-x snap-mandatory">
            
            {/* All Button */}
            <button
              onClick={() => setSelectedCategoryId("all")}
              className={`snap-start flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                selectedCategoryId === "all"
                  ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
                  : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
              }`}
            >
              <Box size={16} />
              All Products
            </button>

            {/* Dynamic Categories */}
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`snap-start flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                  selectedCategoryId === cat.id
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/20"
                    : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 shadow-sm"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* ================= INFO BAR ================= */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Filter size={16} />
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredProducts.length}
            </span>{" "}
            items
          </div>

          {(selectedCategoryId !== "all" || debouncedSearch) && (
            <button
              onClick={() => {
                setSelectedCategoryId("all");
                setSearchTerm("");
                setDebouncedSearch("");
              }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
            >
              <X size={14} /> Clear filters
            </button>
          )}
        </div>

        {/* ================= PRODUCT GRID ================= */}
        <AnimatePresence mode="wait">
          {loading && filteredProducts.length === 0 ? (
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white rounded-2xl border border-slate-100 p-3 overflow-hidden shadow-sm"
                >
                  <div className="w-full aspect-square bg-slate-100 animate-pulse rounded-xl mb-4" />
                  <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded mb-4" />
                  <div className="h-8 w-full bg-slate-50 animate-pulse rounded-lg mt-auto" />
                </div>
              ))}
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 sm:py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-center px-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <ShoppingBag size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No hardware found
              </h3>
              <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                We couldn't find any products matching your active filters.
                Try searching for a different component or resetting your
                categories.
              </p>
              <button
                onClick={() => {
                  setSelectedCategoryId("all");
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

      {/* Hide Horizontal Scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `,
        }}
      />
    </div>
  );
}