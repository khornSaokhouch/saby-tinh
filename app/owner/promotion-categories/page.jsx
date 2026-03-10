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
      toast.success('Category attached');
      setShowAddDropdown(false);
    } catch {
      toast.error('Failed to attach category');
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
      toast.success('Category detached');
    } catch {
      toast.error('Failed to detach category');
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

  return (
    <div className="space-y-6 pb-10 font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Campaign Range</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Category Discounts</h1>
        </div>
        <button onClick={() => { fetchPromotions(); if (selectedPromotion) fetchCategoriesByPromotion(selectedPromotion.id); }} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 w-fit shadow-sm">
          <RefreshCw size={20} className={promoLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Active Promos" value={promotions.length} icon={Tag} color="indigo" />
        <MetricCard label="Linked Categories" value={categoriesByPromotion?.length || 0} icon={Layers} color="emerald" />
        <MetricCard label="Others Available" value={availableCategories.length} icon={CheckCircle2} color="rose" />
      </div>

      {/* PROMOTION SELECTOR */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] p-6">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">1. Select a Promotion</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {promotions.map((promo) => {
            const isSelected = selectedPromotion?.id === promo.id;
            return (
              <button
                key={promo.id}
                onClick={() => setSelectedPromotion(isSelected ? null : promo)}
                className={`relative flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left group ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-lg shadow-indigo-100'
                    : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                }`}
              >
                <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                  <Percent size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-bold text-slate-900 truncate">{promo.name}</p>
                  <p className="text-[10px] font-medium text-slate-400">{promo.discount_percentage}% Discount · {promo.status === 1 ? 'Active' : 'Inactive'}</p>
                </div>
                {isSelected && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </button>
            );
          })}
          {promotions.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
              <Tag size={32} className="text-slate-200 mb-2" />
              <p className="text-sm text-slate-400 font-bold">No promotions found.</p>
              <p className="text-[10px] text-slate-300">Create a promotion in the Marketing tab first.</p>
            </div>
          )}
        </div>
      </div>

      {/* CATEGORIES TABLE */}
      {selectedPromotion && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search linked categories..."
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* ADD CATEGORY DROPDOWN */}
            <div className="relative">
              <button
                onClick={() => setShowAddDropdown(!showAddDropdown)}
                disabled={availableCategories.length === 0}
                className="flex items-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest disabled:opacity-50"
              >
                <Plus size={14} strokeWidth={2.5} /> Link Category
              </button>

              <AnimatePresence>
                {showAddDropdown && (
                  <>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[50]" onClick={() => setShowAddDropdown(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 z-[60] overflow-hidden p-2 max-h-[300px] overflow-y-auto no-scrollbar"
                    >
                      <div className="px-3 py-2 border-b border-slate-50 mb-1">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Available Categories</span>
                      </div>
                      {availableCategories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => handleAttach(cat.id)}
                          disabled={isAttaching}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-indigo-50 text-left transition-all disabled:opacity-50"
                        >
                          <span className="text-[11px] font-bold text-slate-700">{cat.name}</span>
                          <Plus size={14} className="text-indigo-500" />
                        </button>
                      ))}
                      {availableCategories.length === 0 && (
                        <p className="text-center text-[11px] text-slate-400 py-6">All categories are already linked.</p>
                      )}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Category</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date Linked</th>
                  <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Discount</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAttached.length > 0 ? filteredAttached.map((cat, idx) => (
                  <motion.tr
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={cat.id} className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden border border-slate-100 flex-shrink-0 group-hover:shadow-md transition-all duration-300">
                          {cat.category_image ? (
                             <img src={cat.category_image} alt={cat.name} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50 font-black text-[10px]">NO IMG</div>
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{cat.name}</span>
                           <span className="text-[10px] text-slate-400 font-medium">Ref: #{cat.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-center">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-[0.1em] ${
                          cat.status === 1 
                          ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-600/10' 
                          : 'bg-slate-50 text-slate-400 ring-1 ring-slate-100'
                        }`}>
                          <div className={`w-1 h-1 rounded-full ${cat.status === 1 ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                          {cat.status === 1 ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[11px] font-bold text-slate-700">{new Date(cat.created_at).toLocaleDateString()}</span>
                        <span className="text-[9px] text-slate-400">{new Date(cat.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[12px] font-black w-fit">
                          <Percent size={11} /> {selectedPromotion.discount_percentage}%
                        </span>
                        <p className="text-[9px] font-medium text-slate-400 truncate max-w-[120px]">{selectedPromotion.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDetachId === cat.id ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center justify-end gap-1">
                            <button onClick={() => handleDetach(cat.id)} disabled={isDetaching} className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-50">
                              {isDetaching ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={2.5} />}
                            </button>
                            <button onClick={() => setConfirmDetachId(null)} className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-all">
                              <X size={12} strokeWidth={2.5} />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button key="del" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setConfirmDetachId(cat.id)} className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 transition-all group/btn shadow-sm">
                            <Trash2 size={14} strokeWidth={2.5} className="group-hover/btn:scale-110 transition-transform" />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                )) : (
                  <tr>
                    <td colSpan="5" className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center text-slate-200">
                           <Box size={32} />
                        </div>
                        <div>
                           <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No linked categories</p>
                           <p className="text-[10px] text-slate-300 font-medium mt-1">Start by linking a category to this campaign.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {!selectedPromotion && (
        <div className="bg-white rounded-[24px] border border-dashed border-slate-200 p-16 text-center">
          <Layers size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-slate-400 font-bold">Select a promotion above to manage its categories</p>
          <p className="text-[10px] text-slate-300 font-medium mt-1">Categories determine which products the discount applies to</p>
        </div>
      )}
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100/50"
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] relative overflow-hidden group hover:shadow-xl transition-all duration-500">
      <div className={`p-2.5 rounded-xl w-fit mb-4 shadow-sm border ${themes[color]}`}><Icon size={18} strokeWidth={2.5} /></div>
      <div className="space-y-1">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter">{value}</h3>
          {subText && <span className="text-[10px] font-bold text-slate-400 tracking-tight">{subText}</span>}
        </div>
      </div>
      <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className={`p-1.5 rounded-full ${themes[color]}`}><ArrowUpRight size={14} /></div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out -z-0" />
    </div>
  );
}
