'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus, Trash2, Search, RefreshCw, Edit3, Check, X, Loader2,
  Percent, Tag, ArrowUpRight, CheckCircle2, Box, Layers, SlidersHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromotionStore } from '@/stores/usePromotionStore';
import PromotionFormModal from '@/components/admin/modelform/PromotionFormModal';
import { toast } from 'react-hot-toast';

export default function OwnerPromotionsPage() {
  const { promotions, loading, fetchPromotions, savePromotion, deletePromotion } = usePromotionStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      await savePromotion({ ...formData, id: editData?.id });
      toast.success(editData ? 'Promotion updated' : 'Promotion created');
      setModalOpen(false);
      setEditData(null);
    } catch {
      toast.error('Failed to save promotion');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deletePromotion(id);
      setConfirmDeleteId(null);
      toast.success('Promotion deleted');
    } catch {
      toast.error('Failed to delete promotion');
    } finally {
      setIsActionLoading(false);
    }
  };

  const filtered = useMemo(() => {
    return promotions.filter(p =>
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [promotions, searchTerm]);

  const stats = useMemo(() => {
    const total = promotions.length;
    const active = promotions.filter(p => p.status === 1).length;
    const avgDiscount = total > 0
      ? Math.round(promotions.reduce((acc, p) => acc + (p.discount_percentage || 0), 0) / total)
      : 0;
    return { total, active, avgDiscount };
  }, [promotions]);

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—';

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Marketing Campaigns</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Active <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Promotions</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage your store discounts and offers.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => fetchPromotions()} className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button
            onClick={() => { setEditData(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> New Promo
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Offers" value={stats.total} icon={Tag} color="indigo" />
        <MetricCard label="Currently Live" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} Paused`} />
        <MetricCard label="Average Save" value={`${stats.avgDiscount}%`} icon={Percent} color="rose" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input
                type="text"
                placeholder="Search campaigns..."
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {filtered.length} Campaigns listed
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Promotion</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Scope</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Condition</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promotions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <RefreshCw className="animate-spin text-indigo-500" size={24} />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing ...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((promo, idx) => (
                <motion.tr
                  key={promo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{promo.name}</span>
                      <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase">ID: #{promo.id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-md text-[9px] font-black">
                      <Percent size={11} strokeWidth={3} /> {promo.discount_percentage}%
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-700">{formatDate(promo.start_date)}</span>
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Exp: {formatDate(promo.end_date)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-wrap gap-1 max-w-[180px]">
                      {(promo.categories || []).slice(0, 2).map(cat => (
                        <span key={cat.id} className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 text-[8px] font-black text-slate-500 uppercase rounded tracking-tighter">
                          {cat.name}
                        </span>
                      ))}
                      {(promo.categories || []).length > 2 && (
                        <span className="text-[8px] font-black text-indigo-400 lowercase">+{promo.categories.length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                        ${promo.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        <div className={`w-1 h-1 rounded-full ${promo.status === 1 ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                        {promo.status === 1 ? 'Active' : 'Paused'}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditData(promo); setModalOpen(true); }}
                        className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === promo.id ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1">
                            <button onClick={() => handleDelete(promo.id)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm">
                              <Check size={12} strokeWidth={3} />
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg">
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(promo.id)} className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95">
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Tag size={40} className="text-slate-100" />
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Zero promos found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      <PromotionFormModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditData(null); }}
        initialData={editData}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100"
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
                {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
            </div>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
