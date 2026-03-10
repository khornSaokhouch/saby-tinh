'use client';

import { useEffect, useState, useMemo } from 'react';
import { 
  Plus, Search, Edit3, Trash2, Tag, Loader2, CheckCircle2, 
  X, Check, Ticket, Calendar, RefreshCw, Percent, DollarSign, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePromoCodeStore } from '@/stores/usePromoCodeStore';
import PromoCodeFormModal from '@/app/components/admin/modelform/PromoCodeFormModal';
import { toast } from 'react-hot-toast';

export default function PromoCodesPage() {
  const { 
    promoCodes, 
    loading, 
    fetchPromoCodes, 
    search, 
    setSearch, 
    savePromoCode, 
    deletePromoCode 
  } = usePromoCodeStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPromoCodes();

    const interval = setInterval(() => {
      fetchPromoCodes();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchPromoCodes]);

  const filteredPromoCodes = useMemo(() => {
    return promoCodes.filter(p => 
      (p.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [promoCodes, search]);

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await savePromoCode({ ...data, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success(selectedItem ? 'Promo code updated' : 'Promo code created');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to save promo code');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deletePromoCode(id);
      setConfirmDeleteId(null);
      toast.success('Promo code deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove promo code');
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Promotion Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Promo Code Vault</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchPromoCodes()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={2.5} /> Generate Code
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Codes" value={promoCodes.length} icon={Ticket} color="indigo" />
        <MetricCard label="Active Now" value={promoCodes.filter(p => p.status === 1 || p.status === true).length} icon={CheckCircle2} color="emerald" subText="Live" />
        <MetricCard label="Total Redemptions" value={promoCodes.reduce((acc, p) => acc + (p.usage_count || 0), 0)} icon={RefreshCw} color="purple" />
      </div>

      {/* --- PROMO CODES TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search by code or desc..." 
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
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Descriptor</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Value</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Usage</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promoCodes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-indigo-600 opacity-20" />
                    <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</p>
                  </td>
                </tr>
              ) : filteredPromoCodes.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Ticket size={40} className="text-slate-100" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Zero results found</p>
                      </div>
                    </td>
                </tr>
              ) : filteredPromoCodes.map((promo, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={promo.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100 shadow-sm transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:border-slate-900">
                        <Tag size={18} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{promo.code}</span>
                        <span className="text-[9px] font-bold text-slate-400 tracking-wider truncate max-w-[200px]">{promo.description || 'No description provided'}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[8px] font-black text-slate-300 uppercase">Limit: {promo.usage_limit || '∞'}</span>
                           <span className="text-[8px] font-black text-slate-300 uppercase">Per User: {promo.per_user_limit || '1'}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[14px] font-black text-slate-900 flex items-center gap-0.5">
                         {promo.discount_type === 'percentage' ? '' : '$'}{promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ''}
                       </span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                         {promo.discount_type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                       </span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[14px] font-black text-indigo-600">{promo.usage_count || 0}</span>
                       <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Total Used</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                      (promo.status === 1 || promo.status === true)
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-slate-50 text-slate-400 border-slate-100'
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${(promo.status === 1 || promo.status === true) ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                      {promo.status === 1 || promo.status === true ? 'Active' : 'Disabled'}
                    </span>
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

      <PromoCodeFormModal 
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
