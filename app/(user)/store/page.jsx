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
    <div className="min-h-screen pb-32 bg-slate-50/30">
      <div className="max-w-7xl mx-auto px-6 py-10">
        
        {/* ================= PREMIUM HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center border border-indigo-100/50">
                <Store size={16} className="text-indigo-600" />
              </div>
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">Partner Directory</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-3">
              Explore our <span className="text-indigo-600">Merchant</span> Network
            </h1>
            <p className="text-slate-400 text-[14px] font-medium leading-relaxed max-w-lg">
              Connect with verified stores and professional distributors specializing in high-quality hardware and accessories.
            </p>
          </div>

          <div className="relative w-full md:w-80 group shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Find a merchant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-200 rounded-2xl text-[13px] font-bold text-slate-900 placeholder:text-slate-300 outline-none focus:border-indigo-500/30 focus:ring-4 focus:ring-indigo-500/5 transition-all shadow-sm"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* ================= INFO BAR ================= */}
        <div className="flex items-center justify-between mb-8 px-1">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/20" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                  {filteredStores.length} Available Nodes
                </span>
             </div>
             <div className="hidden sm:block h-3 w-px bg-slate-200" />
             <p className="hidden sm:block text-[10px] font-black text-slate-400 uppercase tracking-widest">
               Enterprise Grade Supply
             </p>
          </div>
        </div>

        {/* ================= STORE GRID ================= */}
        <AnimatePresence mode="wait">
          {loading && stores.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-[4/5] bg-white rounded-3xl border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : filteredStores.length > 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
            >
              {filteredStores.map((store, index) => (
                <StoreCard key={store.id} store={store} index={index} />
              ))}
            </motion.div>
          ) : (
            <div className="py-32 flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-3xl bg-slate-50 flex items-center justify-center mb-6">
                <Store size={40} className="text-slate-200" />
              </div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Zero Matches Found</h3>
              <p className="text-[11px] text-slate-300 font-bold uppercase mt-2">Try adjusting your search criteria</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ================= PREMIUM VERTICAL STORE CARD ================= */

function StoreCard({ store, index }) {
  const location = store.user?.company_info?.address?.province || "Main Office";
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
    >
      <Link href={`/store/${slugify(store.name)}`} className="group block h-full">
        <div className="bg-white rounded-3xl border border-slate-100 p-2 pb-6 transition-all duration-500 hover:border-indigo-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] h-full relative flex flex-col group-hover:-translate-y-1.5">
          
          {/* Logo Frame */}
          <div className="aspect-square rounded-2xl bg-slate-50/50 border border-slate-50 flex items-center justify-center overflow-hidden mb-5 group-hover:bg-white transition-colors duration-500 relative">
            {store.store_image ? (
              <img 
                src={store.store_image} 
                alt="" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" 
              />
            ) : (
              <span className="text-3xl font-black text-slate-200 uppercase">{store.name[0]}</span>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>

          <div className="px-3 text-center">
            <div className="flex flex-col items-center gap-1 mb-3">
              <span className="text-[8px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full mb-1 border border-indigo-100/50 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
                Official Merchant
              </span>
              <h3 className="text-[14px] font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors uppercase truncate w-full">
                {store.name}
              </h3>
            </div>

            <div className="flex items-center justify-center gap-1 px-1 py-1 rounded-xl bg-slate-50/80 group-hover:bg-slate-100 transition-colors">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter truncate">
                {location}
              </span>
            </div>
          </div>

          {/* Action indicator */}
          <div className="absolute -bottom-1 -right-1 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg transform rotate-45 group-hover:rotate-0 transition-transform duration-500">
               <ArrowRight size={14} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}