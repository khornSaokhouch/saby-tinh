'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Edit3, Trash2, 
  RefreshCw, Clock , Megaphone,
  Loader2, Check, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { usePromotionStore } from '@/stores/usePromotionStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import PromotionFormModal from '@/app/components/admin/modelform/PromotionFormModal';

export default function PromotionsPage() {
  const { language } = useLanguageStore();
  const { 
    promotions, 
    loading, 
    fetchPromotions, 
    search, 
    setSearch, 
    savePromotion, 
    deletePromotion,
    deleteMultiplePromotions
  } = usePromotionStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Bulk Selection State ---
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchPromotions();

    const interval = setInterval(() => {
      fetchPromotions();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPromotions]);

  // Reset selection on search
  useEffect(() => {
    setSelectedIds([]);
  }, [search]);

  const filteredPromotions = useMemo(() => {
    return promotions.filter(p => 
      (p.name || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [promotions, search]);

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredPromotions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPromotions.map(p => p.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`${t('Are you sure you want to delete ', language)}${selectedIds.length}${t(' promotions?', language)}`)) {
      setIsActionLoading(true);
      const res = await deleteMultiplePromotions(selectedIds);
      if (res?.success) {
        toast.success(`${t('Removed ', language)}${selectedIds.length}${t(' promotions', language)}`);
        setSelectedIds([]);
      } else {
        toast.error(res?.message || t('Batch deletion failed', language));
      }
      setIsActionLoading(false);
    }
  };

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await savePromotion({ ...data, id: selectedItem?.id });
      toast.success(selectedItem ? t('Promotion updated', language) : t('Promotion created', language));
      setIsFormOpen(false);
    } catch (error) {
      toast.error(error.message || t('Operation failed', language));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deletePromotion(id);
      toast.success(t('Promotion deleted', language));
      setConfirmDeleteId(null);
    } catch (error) {
      toast.error(t('Operation failed', language));
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 relative">
      
      {/* --- BATCH ACTIONS BAR --- */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-6"
          >
            <div className="flex items-center gap-3 border-r border-slate-700 pr-6">
              <div className="bg-indigo-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">{t('Selected Campaigns', language)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBatchDelete}
                disabled={isActionLoading}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={3} />}
                {t('Delete Selected', language)}
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black transition-all"
              >
                {t('Cancel', language)}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Global Marketing Protocol', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Promotion', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">{t('Registry', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Manage global platform discounts and marketing offers.', language)}
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
            <Plus size={14} strokeWidth={3} /> {t('Create Promotion', language)}
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Active Campaigns', language)} value={promotions.filter(p => p.status === 'active' || p.status === 1).length} icon={Megaphone} color="indigo" />
        <MetricCard label={t('Total Deployments', language)} value={promotions.length} icon={RefreshCw} color="emerald" subText={t('Global Nodes', language)} />
        <MetricCard label={t('Upcoming Events', language)} value={0} icon={Clock} color="purple" subText={t('Scheduled', language)} />
      </div>

      {/* --- PROMOTIONS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder={t('Search campaigns...', language)} 
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
                <th className="pl-6 w-10 py-3 text-left">
                  <div 
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                    selectedIds.length === filteredPromotions.length && filteredPromotions.length > 0
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-200 hover:border-indigo-400'
                  }`}>
                    {selectedIds.length === filteredPromotions.length && filteredPromotions.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Promotion Detail', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Owner / Creator', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{t('Status', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Date', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Control', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promotions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">{t('Loading ...', language)}</td>
                </tr>
              ) : filteredPromotions.length === 0 ? (
                <tr>
                    <td colSpan="6" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Megaphone size={40} className="text-slate-100" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('No products matching filter', language)}</p>
                      </div>
                    </td>
                </tr>
              ) : filteredPromotions.map((promo, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={promo.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(promo.id) ? 'bg-indigo-50/40' : ''}`}
                >
                  <td className="pl-6 py-4">
                    <div 
                      onClick={() => toggleSelectId(promo.id)}
                      className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedIds.includes(promo.id) 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-slate-200 group-hover:border-indigo-300'
                    }`}>
                      {selectedIds.includes(promo.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                        <Megaphone size={14} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{promo.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[8px] font-black text-slate-400 tracking-wider uppercase">{t('REF: #', language)}{promo.id}</span>
                          {promo.categories?.length > 0 && (
                            <span className="text-[8px] font-black text-rose-500 uppercase tracking-widest">• {promo.categories.length} {t('Categories', language)}</span>
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
                      {promo.status === 'active' || promo.status === 1 ? t('Live', language) : t('Paused', language)}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">
                        {new Date(promo.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        {t('at', language)} {new Date(promo.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
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
                            key="confirm"
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
                            key="delete"
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
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.3em]">{t('Global Promotion Audit', language)} • {filteredPromotions.length} {t('Active Campaigns', language)}</p>
        </div>
      </div>

      <PromotionFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave} 
      />
    </div>
  );
}

// --- SUB COMPONENTS ---

function MetricCard({ label, value, icon: Icon, color, subText, language }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-600 shadow-emerald-100',
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
