"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { LayoutGrid, ChevronRight, ArrowRight, Activity, Zap, Layers } from 'lucide-react';
import { useTypeStore } from '@/stores/useTypeStore'; 
import { motion, AnimatePresence } from 'framer-motion';

const slugify = (text) => {
  if (!text) return "untitled";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
};

const CategorySidebar = ({ categories = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { types, fetchTypes } = useTypeStore();

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  const activeTypes = Array.isArray(types) ? types.filter(type => type.category_id === hoveredCategory?.id) : [];

  return (
    <div 
      className="hidden lg:flex lg:col-span-3 relative"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      {/* --- MAIN SIDEBAR (LIQUID GLASS) --- */}
      <aside className="w-full backdrop-blur-2xl rounded-[32px] border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-col h-[400px] z-20 relative overflow-hidden">
        
        <div className="p-4 pb-2.5">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-[13px] font-black text-slate-900 uppercase tracking-tight">Category</h3>
            </div>
          </div>
        </div>

        <nav className="px-2 flex-grow overflow-y-auto custom-scrollbar">
          <ul className="space-y-1">
            {categories?.length > 0 ? (
              categories.slice(0, 10).map((category) => (
                <li key={category.id} onMouseEnter={() => setHoveredCategory(category)}>
                  <Link 
                    href={`/category/${slugify(category.name)}`}
                    className={`
                      group relative flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                      active:scale-95
                      ${hoveredCategory?.id === category.id 
                        ? 'bg-blue-600/10 text-blue-600 backdrop-blur-xl shadow-[0_10px_20px_rgba(37,99,235,0.08)] border border-blue-600/20' 
                        : 'hover:bg-white/60 hover:backdrop-blur-md text-slate-600 border border-transparent hover:border-white/60'
                      }
                    `}
                  >
                    <span className="text-[13px] font-medium tracking-tight z-10">{category.name}</span>
                    <ChevronRight className={`w-4 h-4 transition-all duration-500 ${
                         hoveredCategory?.id === category.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                    }`} />
                  </Link>
                </li>
              ))
            ) : (
              [1,2,3,4,5,6].map(i => (
                <li key={i} className="h-10 w-full bg-slate-100/40 animate-pulse rounded-2xl mb-1" />
              ))
            )}
          </ul>
        </nav>

        <div className="p-3 bg-white/30 backdrop-blur-md border-t border-white/40">
          <Link href="/category" className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[14px] bg-white/60 border border-white/80 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] hover:bg-white hover:text-blue-600 transition-all shadow-sm active:scale-95 group">
            All Categories 
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </aside>

      {/* --- FLYOUT UI (LIQUID GLASS) --- */}
      <AnimatePresence>
        {hoveredCategory && activeTypes.length > 0 && (
          <>
            <div className="absolute left-full w-3 h-full z-10" />

            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute left-[calc(100%+12px)] top-0 h-full w-[260px] bg-white backdrop-blur-3xl border border-white/50 shadow-[20px_40px_80px_-15px_rgba(0,0,0,0.12)] rounded-[32px] z-30 p-1.5 flex flex-col"
            >
              <div className="p-4 pb-3">
                <h4 className="text-base font-black text-slate-900 tracking-tighter leading-none uppercase truncate">{hoveredCategory.name}</h4>
              </div>
              
              <ul className="space-y-1 overflow-y-auto custom-scrollbar px-1 pb-3">
                {activeTypes.map((type, idx) => (
                  <li key={type.id}>
                    <Link 
                      href={`/products?category=${hoveredCategory.id}&type=${type.id}`}
                      className="
                        group flex items-center justify-between p-2.5 rounded-xl 
                        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                        border border-transparent
                        hover:bg-blue-600/10 hover:backdrop-blur-xl hover:border-blue-600/20
                        hover:shadow-[0_8px_20px_rgba(37,99,235,0.06)]
                        active:scale-95
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-blue-400 transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[13px] font-medium text-slate-600 group-hover:text-blue-600 transition-colors truncate max-w-[160px]">
                          {type.name}
                        </p>
                      </div>
                      <div className="w-6 h-6 rounded-full bg-white/80 border border-white shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all">
                        <ArrowRight className="w-3 h-3 text-blue-600" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-auto m-1.5 p-3 bg-slate-900/90 backdrop-blur-2xl rounded-[20px] flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-2">
                   <Activity className="w-3.5 h-3.5 text-blue-400" />
                   <span className="text-[9px] font-black text-white uppercase tracking-widest">Categories Types</span>
                </div>
                <span className="text-[10px] font-black bg-blue-500 text-white px-2 py-0.5 rounded-lg shadow-lg shadow-blue-500/40">
                    {activeTypes.length}
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySidebar;