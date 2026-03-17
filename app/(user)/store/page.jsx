"use client";

import React, { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Store,
  Search,
  MapPin,
  ArrowRight,
  X,
  Sparkles,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useStore } from "@/stores/useStore";

const slugify = (text) =>
  (text || "").toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/--+/g, "-");

export default function StoresPage() {
  const { stores, fetchStores, loading } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 400);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const filteredStores = useMemo(() => {
    const list = Array.isArray(stores) ? stores : [];
    if (!debouncedSearch) return list;
    return list.filter((s) => s.name?.toLowerCase().includes(debouncedSearch.toLowerCase()));
  }, [stores, debouncedSearch]);

  return (
    <div className="min-h-screen pb-20 pt-2">
      <div className="max-w-[1400px] mx-auto px-4">
        
        {/* ================= COMPACT HEADER ================= */}
        <div className="bg-white rounded-[24px] p-6 mb-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3 text-indigo-600" />
                <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Verified Stores</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-[1000] text-slate-900 tracking-tight leading-none uppercase">
                Store <span className="text-indigo-600 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Directory</span>
              </h1>
            </div>

            <div className="relative w-full md:w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="Search for a store..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500/30 focus:bg-white transition-all"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ================= INFO BAR ================= */}
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {filteredStores.length} Available Stores
                </span>
             </div>
             <div className="hidden sm:block h-4 w-px bg-slate-200" />
             <p className="hidden sm:block text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               Hardware & Supply Registry
             </p>
          </div>
        </div>

        {/* ================= STORE GRID ================= */}
        <AnimatePresence mode="wait">
          {loading && stores.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-32 bg-white rounded-2xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {filteredStores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="py-20 flex flex-col items-center text-center">
              <Store size={40} className="text-slate-200 mb-4" />
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">No Merchants Found</h3>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= COMPACT STORE CARD ================= */

function StoreCard({ store, index }) {
  const location = store.user?.company_info?.address?.province || "Global Node";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
    >
      <Link href={`/store/${slugify(store.name)}`} className="group block">
        <div className="bg-white rounded-2xl border border-slate-200/60 p-4 transition-all duration-300 hover:border-indigo-600 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] h-full relative overflow-hidden">
          
          {/* Subtle Background Accent */}
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
              {store.store_image ? (
                <img src={store.store_image} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xl font-black text-slate-300 uppercase">{store.name[0]}</span>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight truncate leading-tight group-hover:text-indigo-600 transition-colors">
                {store.name}
              </h3>
              <div className="flex items-center gap-1 text-slate-400 mt-1">
                <MapPin size={10} className="shrink-0" />
                <span className="text-[9px] font-bold uppercase tracking-wider truncate">
                  {location}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between">
            <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded">
              Official Store
            </span>
            <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}