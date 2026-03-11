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
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Global Marketing Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Promotion <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">Registry</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage global platform discounts and marketing offers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPromotions()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-500 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> Deploy Campaign
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Total Campaigns" value={promotions.length} icon={Megaphone} color="indigo" />
        <MetricCard label="Active Now" value={promotions.filter(p => p.status === 'active' || p.status === 1).length} icon={CheckCircle2} color="emerald" subText="Live" />
        <MetricCard label="Active Owners" value={new Set(promotions.map(p => p.user_id)).size} icon={Calendar} color="purple" />
      </div>

      {/* --- PROMOTIONS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search campaigns..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Promotion Detail</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Owner / Creator</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Modified</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promotions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">Syncing Registry...</td>
                </tr>
              ) : filteredPromotions.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Megaphone size={40} className="text-slate-100" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No deployments matching filter</p>
                      </div>
                    </td>
                </tr>
              ) : filteredPromotions.map((promo, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={promo.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                        <Megaphone size={14} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{promo.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase">REF: #{promo.id}</span>
                          {promo.categories?.length > 0 && (
                            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">• {promo.categories.length} Categories</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-[9px] font-black text-slate-400 border border-slate-200">
                        {promo.user?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="flex flex-col">
                         <span className="text-[10px] font-bold text-slate-700">{promo.user?.name || 'System Admin'}</span>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{promo.user?.email || 'admin@platform.com'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border ${
                      (promo.status === 'active' || promo.status === 1)
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${(promo.status === 'active' || promo.status === 1) ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                      {promo.status === 'active' || promo.status === 1 ? 'Live' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">
                        {new Date(promo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        at {new Date(promo.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(promo); setIsFormOpen(true); }} 
                        className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === promo.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <button
                              onClick={() => handleDelete(promo.id)}
                              disabled={isActionLoading}
                              className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-1.5 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-lg shadow-sm active:scale-95 transition-all"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ) : (
                            <motion.button
                              key="delete-button"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              onClick={() => setConfirmDeleteId(promo.id)}
                              className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm active:scale-95 transition-all"
                            >
                              <Trash2 size={14} strokeWidth={3} />
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

        <div className="p-3 bg-slate-50/50 border-t border-slate-50 text-center">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">Global Promotion Audit • {filteredPromotions.length} Active Campaigns</p>
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
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
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
