'use client';

import { useEffect, useState } from 'react';
import { 
  Activity, Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, Layers, Check , RefreshCw, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrderStatusStore } from '@/stores/useOrderStatusStore';
import StatusFormModal from '@/components/admin/modelform/StatusFormModal';
import { toast } from 'react-hot-toast';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function OrderStatusPage() {
  const { language } = useLanguageStore();
  const { 
    orderStatuses, 
    loading, 
    fetchOrderStatuses, 
    search, 
    setSearch, 
    saveOrderStatus, 
    deleteOrderStatus,
    deleteMultipleOrderStatus 
  } = useOrderStatusStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Bulk Selection State ---
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchOrderStatuses();

    const interval = setInterval(() => {
      fetchOrderStatuses();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOrderStatuses]);

  // Reset selection on search change
  useEffect(() => {
    setSelectedIds([]);
  }, [search]);

  // Filters based on the 'status' column from your table
  const filteredStatuses = orderStatuses.filter(s => 
    (s.status || '').toLowerCase().includes(search.toLowerCase())
  );

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredStatuses.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredStatuses.map(s => s.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} states?`)) {
      setIsActionLoading(true);
      try {
        await deleteMultipleOrderStatus(selectedIds);
        setSelectedIds([]);
        toast.success(`Removed ${selectedIds.length} states`);
      } catch (error) {
        toast.error('Batch deletion failed');
      } finally {
        setIsActionLoading(false);
      }
    }
  };

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      // Passes only the 'status' field as per your table schema
      await saveOrderStatus({ status: data.status, id: selectedItem?.id });
      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deleteOrderStatus(id);
      setConfirmDeleteId(null);
      toast.success('Status purged');
    } catch (err) {
      console.error(err);
      toast.error('Failed to remove status');
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
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Selected States</span>
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                onClick={handleBatchDelete}
                disabled={isActionLoading}
                className="flex items-center gap-2 px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black transition-all active:scale-95 disabled:opacity-50"
              >
                {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Trash2 size={12} strokeWidth={3} />}
                Delete Selected
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-[10px] font-black transition-all"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Workflow Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">States</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Maintain and manage the product fulfillment lifecycle stages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchOrderStatuses()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> Create State
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Lifecycle States" value={orderStatuses.length} icon={Layers} color="indigo" />
        <MetricCard label="Registry Status" value="Stable" icon={CheckCircle2} color="emerald" subText="Verified" />
        <MetricCard label="System Sync" value="Live" icon={Clock} color="purple" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search by state name..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredStatuses.length} States Configured
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-left">
                <th className="pl-6 w-10 py-3 text-left">
                  <div 
                    onClick={handleSelectAll}
                    className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                    selectedIds.length === filteredStatuses.length && filteredStatuses.length > 0
                      ? 'bg-indigo-600 border-indigo-600' 
                      : 'bg-white border-slate-200 hover:border-indigo-400'
                  }`}>
                    {selectedIds.length === filteredStatuses.length && filteredStatuses.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Internal Designation</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center min-w-[140px]">Last Update</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-left">
              {loading && orderStatuses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredStatuses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center text-sm font-bold text-slate-400 uppercase tracking-wider">No states matching filter</td>
                </tr>
              ) : filteredStatuses.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                  key={item.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(item.id) ? 'bg-indigo-50/40' : ''}`}
                >
                  <td className="pl-6 py-3.5">
                    <div 
                      onClick={() => toggleSelectId(item.id)}
                      className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                      selectedIds.includes(item.id) 
                        ? 'bg-indigo-600 border-indigo-600' 
                        : 'bg-white border-slate-200 group-hover:border-indigo-300'
                    }`}>
                      {selectedIds.includes(item.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center border border-white shadow-sm overflow-hidden shrink-0 transition-transform group-hover:scale-105">
                        <Activity size={14} className="text-slate-400" />
                      </div>
                      <div className="flex flex-col text-left">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{t(item.status, language)}</span>
                        <span className="text-[9px] font-black text-slate-400 mt-0.5 tracking-widest uppercase opacity-70">UID: {item.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-[10px] font-bold text-slate-700">
                          {new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        at {new Date(item.updated_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} 
                        className="p-1.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 shadow-sm active:scale-95 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === item.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1.5"
                          >
                            <button
                              onClick={() => handleDelete(item.id)}
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
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
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

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
             Showing: {filteredStatuses.length} States
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Registry Sync
           </div>
        </div>
      </div>

      <StatusFormModal 
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
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2 rounded-xl w-8 h-8 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}
