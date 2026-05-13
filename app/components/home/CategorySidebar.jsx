"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronRight, Layers } from 'lucide-react';
import { useTypeStore } from '@/stores/useTypeStore';
import { motion, AnimatePresence } from 'framer-motion';

const slugify = (text) => {
  if (!text) return "untitled";
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-");
};

const CategorySidebar = ({ categories = [] }) => {
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const { types, fetchTypes } = useTypeStore();

  useEffect(() => { fetchTypes(); }, [fetchTypes]);

  const activeTypes = Array.isArray(types)
    ? types.filter(type => type.category_id === hoveredCategory?.id)
    : [];

  return (
    <div
      className="hidden lg:flex lg:col-span-3 relative"
      onMouseLeave={() => setHoveredCategory(null)}
    >
      {/* SIDEBAR */}
      <aside className="w-full bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[400px] z-20 relative overflow-hidden">

        {/* Header */}
        <div className="px-4 py-3 border-b border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center">
              <Layers className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-[12px] font-black text-slate-900 uppercase tracking-widest">Category</span>
          </div>
        </div>

        {/* List */}
        <nav className="px-2 py-2 flex-grow overflow-y-auto custom-scrollbar">
          <ul className="space-y-0.5">
            {categories?.length > 0 ? (
              categories.slice(0, 10).map((category) => {
                const isActive = hoveredCategory?.id === category.id;
                return (
                  <li key={category.id} onMouseEnter={() => setHoveredCategory(category)}>
                    <Link
                      href={`/category/${slugify(category.name)}`}
                      className={`group flex items-center justify-between px-3 py-2 rounded-xl transition-all duration-200 active:scale-95 ${
                        isActive
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span className={`text-[13px] tracking-tight transition-all ${isActive ? 'font-bold' : 'font-medium'}`}>
                        {category.name}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 transition-all duration-200 ${isActive ? 'opacity-100 text-indigo-400' : 'opacity-0 -translate-x-1'}`} />
                    </Link>
                  </li>
                );
              })
            ) : (
              [1, 2, 3, 4, 5, 6].map(i => (
                <li key={i} className="h-9 w-full bg-slate-100 animate-pulse rounded-xl mb-1" />
              ))
            )}
          </ul>
        </nav>

        {/* Footer CTA */}
        <div className="p-3 border-t border-slate-50">
          <Link
            href="/category"
            className="group flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95"
          >
            All Categories
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </aside>

      {/* FLYOUT */}
      <AnimatePresence>
        {hoveredCategory && activeTypes.length > 0 && (
          <>
            {/* Bridge to prevent mouseLeave */}
            <div className="absolute left-full w-3 h-full z-10" />

            <motion.div
              initial={{ opacity: 0, x: 12, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 8, scale: 0.97 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="absolute left-[calc(100%+12px)] top-0 h-full w-[240px] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 rounded-2xl z-30 flex flex-col overflow-hidden"
            >
              {/* Flyout header */}
              <div className="px-4 py-3 border-b border-slate-50">
                <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase truncate">
                  {hoveredCategory.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{activeTypes.length} types</p>
              </div>

              {/* Flyout list */}
              <ul className="space-y-0.5 overflow-y-auto custom-scrollbar p-2 flex-1">
                {activeTypes.map((type, idx) => (
                  <li key={type.id}>
                    <Link
                      href={`/products?category=${hoveredCategory.id}&type=${type.id}`}
                      className="group flex items-center justify-between p-2.5 rounded-xl transition-all duration-200 border border-transparent hover:bg-indigo-50 hover:border-indigo-100 active:scale-95"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-indigo-300 transition-colors w-5">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="text-[13px] font-medium text-slate-600 group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">
                          {type.name}
                        </p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-indigo-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CategorySidebar;