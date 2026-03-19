"use client";

import React, { useEffect, useState } from "react";
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useProductStore } from "@/stores/useProductStore";
import { useStore } from "@/stores/useStore";
import { useUserStore } from "@/stores/userStore";
import { useFavoriteStore } from "@/stores/useFavoriteStore";
import { useBrandStore } from "@/stores/useBrandStore";
import { useColorStore } from "@/stores/useColorStore";
import { useSizeStore } from "@/stores/useSizeStore";
import ProductCard from "./card/ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Filter, ShoppingBag } from "lucide-react";

const SidebarItem = ({ item, isChecked, onToggle }) => {
  return (
    <li>
      <button
        onClick={() => onToggle(item.id)}
        className={`w-full flex items-center justify-between gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 rounded-md text-[10px] sm:text-[13px] transition border ${
          isChecked
            ? "border-slate-900 text-slate-900 font-bold bg-slate-50"
            : "border-transparent text-slate-500 hover:bg-slate-50 font-medium"
        }`}
      >
        <span className="truncate text-left">{item.name}</span>
        
        <div 
          className={`flex-shrink-0 w-3 sm:w-3.5 h-3 sm:h-3.5 rounded border flex items-center justify-center transition-colors ${
            isChecked
              ? "bg-slate-900 border-slate-900"
              : "border-slate-300 bg-white"
          }`}
        >
          {isChecked && (
            <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none">
              <path
                d="M1 4l2.5 2.5L9 1"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </button>
    </li>
  );
};

export default function CategoryFilterProducts() {
  const { categories, fetchCategories } = useCategoryStore();
  const { stores, fetchStores } = useStore();
  const { brands, fetchBrands } = useBrandStore();
  const { colors, fetchColors } = useColorStore();
  const { sizes, fetchSizes } = useSizeStore();
  const { products, fetchProductsByFilters, loading } =
    useProductStore();
  const userId = useUserStore((state) => state.user?.id);
  const { favorites, addFavorite, removeFavorite } =
    useFavoriteStore();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStore, setSelectedStore] = useState("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedColor, setSelectedColor] = useState("all");
  const [selectedSize, setSelectedSize] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });

  useEffect(() => {
    fetchCategories();
    fetchStores();
    fetchBrands();
    fetchColors();
    fetchSizes();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProductsByFilters({
        categoryId: selectedCategory,
        storeId: selectedStore,
        brandId: selectedBrand,
        colorId: selectedColor,
        sizeId: selectedSize,
        search: searchTerm,
        minPrice: priceRange.min,
        maxPrice: priceRange.max,
      });
    }, 400);

    return () => clearTimeout(handler);
  }, [
    selectedCategory,
    selectedStore,
    selectedBrand,
    selectedColor,
    selectedSize,
    searchTerm,
    priceRange,
  ]);

  const handleToggleFavourite = async (productId) => {
    if (!userId) return;
    const favRecord = favorites?.find(
      (f) => f.product_id === productId
    );

    if (favRecord) {
      await removeFavorite(favRecord.id);
    } else {
      await addFavorite({
        user_id: userId,
        product_id: productId,
      });
    }
  };

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedStore("all");
    setSelectedBrand("all");
    setSelectedColor("all");
    setSelectedSize("all");
    setSearchTerm("");
    setPriceRange({ min: "", max: "" });
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedStore !== "all" ||
    selectedBrand !== "all" ||
    selectedColor !== "all" ||
    selectedSize !== "all" ||
    searchTerm !== "" ||
    priceRange.min !== "" ||
    priceRange.max !== "";

  return (
    <div className="min-h-screen pt-4 pb-8 bg-slate-50/20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">
              Collections
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {products.length} Products Available
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by name..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 outline-none transition shadow-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Layout - Side by Side Always */}
        <div className="flex flex-row items-start gap-2 sm:gap-8">

          {/* LEFT SIDEBAR - Persistent Column */}
          <aside className="w-24 sm:w-64 shrink-0">
            <div className="sticky top-20 sm:top-24 space-y-4 sm:space-y-6">

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Filter size={16} />
                  Filters
                </div>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-indigo-600 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-5">

                <div>
                  <h3 className="text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 sm:mb-4 flex items-center gap-1 sm:gap-2">
                    <span className="w-0.5 sm:w-1 h-3 bg-slate-900 rounded-full"></span>
                    <span className="hidden sm:inline">Price Range</span>
                    <span className="sm:hidden">Price</span>
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
                    <input
                      type="number"
                      placeholder="MIN"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      className="w-full px-1.5 sm:px-2 py-1 sm:py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium focus:border-indigo-500 outline-none"
                    />
                    <input
                      type="number"
                      placeholder="MAX"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      className="w-full px-1.5 sm:px-2 py-1 sm:py-1.5 border border-slate-200 rounded-lg text-[10px] sm:text-xs font-medium focus:border-indigo-500 outline-none"
                    />
                  </div>
                </div>

                {/* Categories */}
                {[
                  { title: "Categories", data: categories, state: selectedCategory, setState: setSelectedCategory, short: "Cats" },
                  { title: "Brands", data: brands, state: selectedBrand, setState: setSelectedBrand, short: "Brand" },
                  { title: "Stores", data: stores, state: selectedStore, setState: setSelectedStore, short: "Store" },
                  { title: "Colors", data: colors, state: selectedColor, setState: setSelectedColor, short: "Color" },
                  { title: "Sizes", data: sizes, state: selectedSize, setState: setSelectedSize, short: "Size" },
                ].map((group) => (
                  <div key={group.title}>
                    <h3 className="text-[9px] sm:text-[11px] font-black text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-1 sm:gap-2">
                      <span className="w-0.5 sm:w-1 h-3 bg-slate-900 rounded-full"></span>
                      <span className="hidden sm:inline">{group.title}</span>
                      <span className="sm:hidden">{group.short}</span>
                    </h3>
                    <ul className="space-y-0.5 max-h-32 sm:max-h-48 overflow-y-auto custom-scrollbar">
                      <SidebarItem
                        item={{ id: "all", name: "All" }}
                        isChecked={group.state === "all"}
                        onToggle={() => group.setState("all")}
                      />
                      {group.data.map((item) => (
                        <SidebarItem
                          key={item.id}
                          item={item}
                          isChecked={group.state === item.id}
                          onToggle={() => group.setState(item.id)}
                        />
                      ))}
                    </ul>
                  </div>
                ))}

              </div>
            </div>
          </aside>

          {/* RIGHT PRODUCTS */}
          <main className="flex-1 min-w-0">
            <div className="mb-6 text-sm text-slate-500">
              {products.length} products found
            </div>

            <AnimatePresence mode="wait">
              {products.length > 0 ? (
                <motion.div
                  key="products"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4"
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavourite={favorites?.some(
                        (f) =>
                          f?.product_id === product.id
                      )}
                      onAddFavourite={() =>
                        handleToggleFavourite(product.id)
                      }
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200"
                >
                  <ShoppingBag
                    size={36}
                    className="mx-auto text-slate-300 mb-4"
                  />
                  <h3 className="text-lg font-semibold text-slate-900">
                    No products found
                  </h3>
                  <p className="text-sm text-slate-500 mb-6">
                    Try adjusting your filters.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-5 py-2 bg-indigo-600 text-white rounded-lg text-sm"
                  >
                    Clear Filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}