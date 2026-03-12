'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search, RefreshCw, Layers, Tag, Plus, Trash2, Check, X, Loader2,
  ArrowUpRight, Percent, CheckCircle2, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromotionStore } from '@/stores/usePromotionStore';
import { usePromotionsCategoryStore } from '@/stores/usePromotionsCategoryStore';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { toast } from 'react-hot-toast';

export default function OwnerPromotionCategoriesPage() {
  const { promotions, fetchPromotions, loading: promoLoading } = usePromotionStore();
  const {
    categoriesByPromotion,
    fetchCategoriesByPromotion,
    attachCategoriesToPromotion,
    detachCategoryFromPromotion,
    clearCategoriesByPromotion
  } = usePromotionsCategoryStore();
  const { categories, fetchCategories } = useCategoryStore();

  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAttaching, setIsAttaching] = useState(false);
  const [confirmDetachId, setConfirmDetachId] = useState(null);
  const [isDetaching, setIsDetaching] = useState(false);
  const [showAddDropdown, setShowAddDropdown] = useState(false);

  useEffect(() => {
    fetchPromotions();
    fetchCategories();
  }, [fetchPromotions, fetchCategories]);

  useEffect(() => {
    if (selectedPromotion) {
      fetchCategoriesByPromotion(selectedPromotion.id);
    } else {
      clearCategoriesByPromotion();
    }
  }, [selectedPromotion, fetchCategoriesByPromotion, clearCategoriesByPromotion]);

  const handleAttach = async (categoryId) => {
    if (!selectedPromotion) return;
    setIsAttaching(true);
    try {
      await attachCategoriesToPromotion(selectedPromotion.id, categoryId);
      toast.success('Category linked');
      setShowAddDropdown(false);
    } catch {
      toast.error('Link failed');
    } finally {
      setIsAttaching(false);
    }
  };

  const handleDetach = async (categoryId) => {
    if (!selectedPromotion) return;
    setIsDetaching(true);
    try {
      await detachCategoryFromPromotion(selectedPromotion.id, categoryId);
      setConfirmDetachId(null);
      toast.success('Category unlinked');
    } catch {
      toast.error('Unlink failed');
    } finally {
      setIsDetaching(false);
    }
  };

  const attachedCategoryIds = useMemo(() => {
    return (categoriesByPromotion || []).map(c => c.id);
  }, [categoriesByPromotion]);

  const availableCategories = useMemo(() => {
    return categories.filter(c => !attachedCategoryIds.includes(c.id));
  }, [categories, attachedCategoryIds]);

  const filteredAttached = useMemo(() => {
    return (categoriesByPromotion || []).filter(c =>
      (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoriesByPromotion, searchTerm]);

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Mapping Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Category <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Discounts</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Status for {today}</p>
        </div>
        <button onClick={() => { fetchPromotions(); if (selectedPromotion) fetchCategoriesByPromotion(selectedPromotion.id); }} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
          <RefreshCw size={14} className={promoLoading ? 'animate-spin' : ''} strokeWidth={3} />
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Global Promos" value={promotions.length} icon={Tag} color="indigo" />
        <MetricCard label="Scope Count" value={categoriesByPromotion?.length || 0} icon={Layers} color="emerald" subText="Mapped" />
        <MetricCard label="Available" value={availableCategories.length} icon={Box} color="rose" subText="Unmapped" />
      </div>

      {/* PROMOTION SELECTOR */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">1. Identify target campaign</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {promotions.map((promo) => {
            const isSelected = selectedPromotion?.id === promo.id;
            return (
              <button
                key={promo.id}
                onClick={() => setSelectedPromotion(isSelected ? null : promo)}
                className={`relative flex items-center gap-3 p-3.5 rounded-xl border transition-all text-left group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-slate-100 bg-white hover:border-slate-200'
                }`}
              >
                <div className={`p-2 rounded-lg shrink-0 transition-colors ${isSelected ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}>
                  <Percent size={14} strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{promo.name}</p>
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">{promo.discount_percentage}% Cut · {promo.status === 1 ? 'Live' : 'Off'}</p>
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <Check size={10} className="text-white" strokeWidth={4} />
                  </motion.div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CATEGORIES TABLE */}
      {selectedPromotion && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 bg-slate-50/20">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative w-full sm:w-64 group text-left">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
                <input
                  type="text"
                  placeholder="Search linked scopes..."
                  className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="hidden sm:block flex-1" />

              <div className="relative">
                <button
                    onClick={() => setShowAddDropdown(!showAddDropdown)}
                    disabled={availableCategories.length === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${showAddDropdown ? 'bg-slate-900 text-white shadow-lg' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 shadow-sm'}`}
                >
                    <Plus size={14} strokeWidth={3} /> Map Category
                </button>

                <AnimatePresence>
                    {showAddDropdown && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[50]" onClick={() => setShowAddDropdown(false)} />
                        <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-[60] overflow-hidden p-1.5 max-h-[300px] overflow-y-auto no-scrollbar"
                        >
                        {availableCategories.map(cat => (
                            <button
                            key={cat.id}
                            onClick={() => handleAttach(cat.id)}
                            disabled={isAttaching}
                            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-indigo-50 text-left transition-all"
                            >
                            <span className="text-[10px] font-black text-slate-700 uppercase">{cat.name}</span>
                            <Plus size={12} className="text-indigo-500" strokeWidth={3} />
                            </button>
                        ))}
                        </motion.div>
                    </>
                    )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Target Scope</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Efficiency</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAttached.length > 0 ? filteredAttached.map((cat, idx) => (
                  <motion.tr
                    key={cat.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                          {cat.category_image ? (
                             <img src={cat.category_image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                             <Layers size={14} className="text-slate-200" />
                          )}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase mt-0.5">Ref: {cat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                            ${cat.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            {cat.status === 1 ? 'Active' : 'Locked'}
                        </div>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                        <div className="flex flex-col items-center">
                            <span className="text-[12px] font-black text-indigo-600">{selectedPromotion.discount_percentage}% cut</span>
                        </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDetachId === cat.id ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDetach(cat.id)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm">
                              <Check size={12} strokeWidth={3} />
                            </button>
                            <button onClick={() => setConfirmDetachId(null)} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg">
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ) : (
                          <button onClick={() => setConfirmDetachId(cat.id)} className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95">
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                        <p className="text-slate-300 font-black uppercase tracking-widest text-[9px]">Zero scopes mapped</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!selectedPromotion && (
        <div className="bg-slate-50/30 rounded-[20px] border border-dashed border-slate-200 p-16 text-center">
          <Layers size={32} className="text-slate-200 mx-auto mb-3" />
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Select a campaign to initiate mapping</p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100",
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
            <Icon size={14} strokeWidth={3} />
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                {subText && <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{subText}</span>}
            </div>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
