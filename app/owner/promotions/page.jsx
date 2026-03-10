'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus , Trash2, Search, RefreshCw, Edit3, Check, X, Loader2,
  Percent, Tag, ArrowUpRight, CheckCircle2 , Box, Layers 
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
    <div className="space-y-6 pb-10 font-sans">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-indigo-500" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Marketing Dashboard</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Active Campaigns</h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => fetchPromotions()} className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm">
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => { setEditData(null); setModalOpen(true); }}
            className="flex items-center gap-2 px-5 py-3.5 bg-slate-900 text-white rounded-2xl text-[11px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={2.5} /> Create Promo
          </button>
        </div>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Global Promos" value={stats.total} icon={Tag} color="indigo" />
        <MetricCard label="Running Now" value={stats.active} icon={CheckCircle2} color="emerald" subText={`${stats.total - stats.active} off`} />
        <MetricCard label="Average Cut" value={`${stats.avgDiscount}%`} icon={Percent} color="rose" />
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search by campaign name..."
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Promotion Detail</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Discount</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Timeline</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Target Groups</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promotions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-10 h-10 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                      <p className="text-slate-400 font-bold tracking-tight">Syncing campaigns...</p>
                    </div>
                  </td>
                </tr>
              ) : filtered.length > 0 ? filtered.map((promo, idx) => (
                <motion.tr
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={promo.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight line-clamp-1">{promo.name}</span>
                      <span className="text-[10px] font-medium text-slate-400 line-clamp-1 mt-0.5">{promo.description || 'No additional details provided.'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-[12px] font-black ring-1 ring-indigo-700/10">
                      <Percent size={11} /> {promo.discount_percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-slate-700">{formatDate(promo.start_date)}</span>
                      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Exp: {formatDate(promo.end_date)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1.5 max-w-[200px]">
                      {(promo.categories || []).slice(0, 3).map(cat => (
                        <span key={cat.id} className="px-2 py-0.5 bg-white border border-slate-100 text-slate-600 rounded-md text-[9px] font-black uppercase tracking-tighter flex items-center gap-1">
                          <Layers size={8} className="text-slate-300" /> {cat.name}
                        </span>
                      ))}
                      {(promo.categories || []).length > 3 && (
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-500 rounded-md text-[9px] font-black">
                          +{promo.categories.length - 3} more
                        </span>
                      )}
                      {(!promo.categories || promo.categories.length === 0) && (
                        <span className="text-[10px] text-slate-300 font-medium italic">Unassigned</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest
                        ${promo.status === 1 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100'}`}>
                        <div className={`w-1 h-1 rounded-full ${promo.status === 1 ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                        {promo.status === 1 ? 'Active' : 'Paused'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditData(promo); setModalOpen(true); }}
                        className="w-8 h-8 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        <Edit3 size={14} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === promo.id ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1">
                            <button onClick={() => handleDelete(promo.id)} disabled={isActionLoading} className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50">
                              {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={2.5} />}
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="w-8 h-8 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm">
                              <X size={12} strokeWidth={2.5} />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button key="del" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} onClick={() => setConfirmDeleteId(promo.id)} className="w-8 h-8 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100">
                            <Trash2 size={14} strokeWidth={2.5} />
                          </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              )) : (
                <tr>
                  <td colSpan="6" className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Tag size={40} className="text-slate-200" />
                      <p className="text-slate-400 font-bold tracking-tight">No promotions found.</p>
                      <button onClick={() => { setEditData(null); setModalOpen(true); }} className="text-indigo-600 text-[10px] font-black uppercase tracking-widest mt-2 hover:underline">
                        Create your first promotion
                      </button>
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
