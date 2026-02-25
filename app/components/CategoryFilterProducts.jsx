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
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition border ${
          isChecked
            ? "border-slate-900 text-slate-900 font-semibold bg-white"
            : "border-transparent text-slate-600 hover:bg-slate-50"
        }`}
      >
        {/* Checkbox — always has a visible border */}
        <span
          className={`flex-shrink-0 w-4 h-4 rounded border-[1.5px] flex items-center justify-center transition-colors ${
            isChecked
              ? "bg-slate-900 border-slate-900"
              : "border-slate-300 group-hover:border-slate-900 bg-white"
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
        </span>
        <span className="truncate text-left">{item.name}</span>
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
    <div className="min-h-screen bg-[#F8FAFC] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              All Products
            </h1>
            <p className="text-sm text-slate-500">
              Filter and explore our complete inventory.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition"
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

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT SIDEBAR */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="sticky top-6 space-y-6">

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

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-6">

                {/* Price */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Price Range
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Categories
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    <SidebarItem
                      item={{ id: "all", name: "All" }}
                      isChecked={selectedCategory === "all"}
                      onToggle={() =>
                        setSelectedCategory("all")
                      }
                    />
                    {categories.map((cat) => (
                      <SidebarItem
                        key={cat.id}
                        item={cat}
                        isChecked={
                          selectedCategory === cat.id
                        }
                        onToggle={() =>
                          setSelectedCategory(cat.id)
                        }
                      />
                    ))}
                  </ul>
                </div>

                {/* Brands */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Brands
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    <SidebarItem
                      item={{ id: "all", name: "All" }}
                      isChecked={selectedBrand === "all"}
                      onToggle={() =>
                        setSelectedBrand("all")
                      }
                    />
                    {brands.map((brand) => (
                      <SidebarItem
                        key={brand.id}
                        item={brand}
                        isChecked={
                          selectedBrand === brand.id
                        }
                        onToggle={() =>
                          setSelectedBrand(brand.id)
                        }
                      />
                    ))}
                  </ul>
                </div>

                {/* Stores */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Stores
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    <SidebarItem
                      item={{ id: "all", name: "All" }}
                      isChecked={selectedStore === "all"}
                      onToggle={() =>
                        setSelectedStore("all")
                      }
                    />
                    {stores.map((store) => (
                      <SidebarItem
                        key={store.id}
                        item={store}
                        isChecked={
                          selectedStore === store.id
                        }
                        onToggle={() =>
                          setSelectedStore(store.id)
                        }
                      />
                    ))}
                  </ul>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Colors
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    <SidebarItem
                      item={{ id: "all", name: "All" }}
                      isChecked={selectedColor === "all"}
                      onToggle={() =>
                        setSelectedColor("all")
                      }
                    />
                    {colors.map((color) => (
                      <SidebarItem
                        key={color.id}
                        item={color}
                        isChecked={
                          selectedColor === color.id
                        }
                        onToggle={() =>
                          setSelectedColor(color.id)
                        }
                      />
                    ))}
                  </ul>
                </div>

                {/* Sizes */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    Sizes
                  </h3>
                  <ul className="space-y-1 max-h-40 overflow-y-auto">
                    <SidebarItem
                      item={{ id: "all", name: "All" }}
                      isChecked={selectedSize === "all"}
                      onToggle={() =>
                        setSelectedSize("all")
                      }
                    />
                    {sizes.map((size) => (
                      <SidebarItem
                        key={size.id}
                        item={size}
                        isChecked={
                          selectedSize === size.id
                        }
                        onToggle={() =>
                          setSelectedSize(size.id)
                        }
                      />
                    ))}
                  </ul>
                </div>

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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
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