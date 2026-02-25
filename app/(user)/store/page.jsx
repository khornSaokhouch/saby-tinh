"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  MapPin,
  ArrowRight,
  X,
  Filter,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";

const slugify = (text) =>
  (text || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

export default function StoresPage() {
  const { stores, fetchStores, loading } = useStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /* ---------------- Initial Load ---------------- */
  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  /* ---------------- Debounce ---------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  /* ---------------- Filter ---------------- */
  const filteredStores = useMemo(() => {
    const list = Array.isArray(stores) ? stores : [];
    if (!debouncedSearch) return list;

    return list.filter((s) =>
      s.name?.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [stores, debouncedSearch]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ================= HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
              Explore Stores
            </h1>
            <p className="text-sm text-slate-500">
              Browse verified hardware retailers and official partners near you.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search stores..."
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

        {/* ================= INFO BAR (Matches Category) ================= */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
            <Filter size={16} />
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filteredStores.length}
            </span>{" "}
            stores
          </div>

          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100"
            >
              <X size={14} /> Clear search
            </button>
          )}
        </div>

        {/* ================= GRID SECTION ================= */}
        <AnimatePresence mode="wait">
          {loading && stores.length === 0 ? (
            /* Skeleton */
            <motion.div
              key="skeleton"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
                >
                  <div className="w-14 h-14 bg-slate-100 rounded-xl mb-4 animate-pulse" />
                  <div className="h-4 w-3/4 bg-slate-100 animate-pulse rounded mb-2" />
                  <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded mb-4" />
                  <div className="h-8 w-full bg-slate-50 animate-pulse rounded-lg mt-auto" />
                </div>
              ))}
            </motion.div>
          ) : filteredStores.length > 0 ? (
            /* Real Grid */
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6"
            >
              {filteredStores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))}
            </motion.div>
          ) : (
            /* Empty State (Same Feel as Category Page) */
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-16 sm:py-24 flex flex-col items-center justify-center bg-white rounded-3xl border border-dashed border-slate-200 text-center px-6"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-5">
                <Store size={32} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No stores found
              </h3>
              <p className="text-slate-500 text-sm max-w-md mb-8 leading-relaxed">
                We couldn’t find any stores matching your search. Try a different keyword.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl shadow-sm hover:bg-indigo-700 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                Clear Search
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= STORE CARD ================= */

function StoreCard({ store, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/store/${slugify(store.name)}`}>
        <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col h-full">
          
          <div className="w-14 h-14 rounded-xl bg-slate-50 flex items-center justify-center mb-4 overflow-hidden">
            {store.store_image ? (
              <img
                src={store.store_image}
                alt={store.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Store className="w-6 h-6 text-slate-300" />
            )}
          </div>

          <h3 className="text-sm font-bold text-slate-900 truncate mb-1">
            {store.name}
          </h3>

          <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
            <MapPin size={12} />
            {store.user?.company_info?.address?.province || "Online Store"}
          </div>

          <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-indigo-600 text-sm font-semibold">
            Visit
            <ArrowRight size={14} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}