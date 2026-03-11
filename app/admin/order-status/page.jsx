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

export default function OrderStatusPage() {
  const { 
    orderStatuses, 
    loading, 
    fetchOrderStatuses, 
    search, 
    setSearch, 
    saveOrderStatus, 
    deleteOrderStatus 
  } = useOrderStatusStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchOrderStatuses();

    const interval = setInterval(() => {
      fetchOrderStatuses();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchOrderStatuses]);

  // Filters based on the 'status' column from your table
  const filteredStatuses = orderStatuses.filter(s => 
    s.status.toLowerCase().includes(search.toLowerCase())
  );

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
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500 pt-4">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Workflow Lifecycle</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">States</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchStatuses()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={3} /> Add New State
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Registered States" value={orderStatuses.length} icon={Layers} color="indigo" />
        <MetricCard label="Active Linkage" value="Stable" icon={CheckCircle2} color="emerald" />
        <MetricCard label="System Sync" value="Live" icon={Clock} color="purple" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search by state name..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            {filteredStatuses.length} States Configured
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[50%] text-left">Internal Designation</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Last Modified</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredStatuses.map((item, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={item.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                        <Activity size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-[11px] font-black text-slate-900 italic">
                        {new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(item); setIsFormOpen(true); }} 
                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
                      >
                        <Edit3 size={14} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === item.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDelete(item.id)}
                              disabled={isActionLoading}
                              className="w-9 h-9 rounded-xl bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} strokeWidth={2.5} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="delete-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setConfirmDeleteId(item.id)}
                            className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100/50"
                          >
                            <Trash2 size={14} strokeWidth={2.5} />
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
