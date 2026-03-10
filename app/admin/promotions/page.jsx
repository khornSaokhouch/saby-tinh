'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Percent, Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, ChevronRight, X, Check, Megaphone, Calendar, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromotionStore } from '@/stores/usePromotionStore';
import PromotionFormModal from '@/app/components/admin/modelform/PromotionFormModal';
import { toast } from 'react-hot-toast';

export default function PromotionsPage() {
  const { 
    promotions, 
    loading, 
    fetchPromotions, 
    search, 
    setSearch, 
    savePromotion, 
    deletePromotion 
  } = usePromotionStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPromotions();

    const interval = setInterval(() => {
      fetchPromotions();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPromotions]);

  const filteredPromotions = useMemo(() => {
    return promotions.filter(p => 
      (p.name || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [promotions, search]);

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await savePromotion({ ...data, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success('Promotion updated');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save promotion');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deletePromotion(id);
      setConfirmDeleteId(null);
      toast.success('Promotion deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove promotion');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-10 pb-10 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Marketing Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Promotion Registry</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchPromotions()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={2.5} /> Deploy Campaign
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Campaigns" value={promotions.length} icon={Megaphone} color="indigo" />
        <MetricCard label="Active Now" value={promotions.filter(p => p.status === 'active' || p.status === 1).length} icon={CheckCircle2} color="emerald" subText="Live on Platform" />
        <MetricCard label="Active Owners" value={new Set(promotions.map(p => p.user_id)).size} icon={Calendar} color="purple" />
      </div>

      {/* --- PROMOTIONS TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Promotion Detail</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Owner / Creator</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Modified</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promotions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600 opacity-20" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing Registry...</p>
                  </td>
                </tr>
              ) : filteredPromotions.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Megaphone size={40} className="text-slate-100" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">No deployments matching filter</p>
                      </div>
                    </td>
                </tr>
              ) : filteredPromotions.map((promo, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={promo.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                        <Megaphone size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{promo.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] font-bold text-slate-400 tracking-wider">REF: #{promo.id}</span>
                          {promo.categories?.length > 0 && (
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">• {promo.categories.length} Categories Linked</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 border border-slate-200">
                        {promo.user?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[12px] font-black text-slate-700">{promo.user?.name || 'System Admin'}</span>
                         <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">{promo.user?.email || 'admin@platform.com'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      (promo.status === 'active' || promo.status === 1)
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${(promo.status === 'active' || promo.status === 1) ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                      {promo.status === 'active' || promo.status === 1 ? 'Live' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-black text-slate-700">
                        {new Date(promo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        at {new Date(promo.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-right">
                      <button 
                        onClick={() => { setSelectedItem(promo); setIsFormOpen(true); }} 
                        className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all shadow-sm"
                      >
                        <Edit3 size={16} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === promo.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDelete(promo.id)}
                              disabled={isActionLoading}
                              className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-lg shadow-rose-100 disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} strokeWidth={2.5} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-9 h-9 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
                            >
                              <X size={16} strokeWidth={2.5} />
                            </button>
                          </motion.div>
                        ) : (
                            <motion.button
                              key="delete-button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => setConfirmDeleteId(promo.id)}
                              className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all shadow-sm"
                            >
                              <Trash2 size={16} strokeWidth={2.5} />
                            </motion.button>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PromotionFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
      />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100/50',
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2.5 rounded-xl w-fit mb-4 border ${themes[color]}`}><Icon size={18} strokeWidth={2.5} /></div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        {subText && <span className="text-[10px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
