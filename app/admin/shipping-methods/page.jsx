'use client';

import { useEffect, useState } from 'react';
import { 
  Truck, Search, Check, Banknote, 
  Plus, Edit3, Trash2, Clock, 
  X , PackageCheck, Loader2, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShippingMethodStore } from '@/stores/useShippingMethodStore';
import ShippingFormModal from '@/app/components/admin/modelform/ShippingFormModal';
import { toast } from 'react-hot-toast';

export default function ShippingMethodsPage() {
  const { 
    shippingMethods, 
    loading, 
    fetchShippingMethods, 
    search, 
    setSearch, 
    saveShippingMethod, 
    deleteShippingMethod 
  } = useShippingMethodStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchShippingMethods();

    const interval = setInterval(() => {
      fetchShippingMethods();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchShippingMethods]);

  // Filtering based on store's search string
  const filteredMethods = shippingMethods.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await saveShippingMethod({ ...data, id: selectedMethod?.id });
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
      await deleteShippingMethod(id);
      setConfirmDeleteId(null);
      toast.success('Shipping method deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete shipping method');
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
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Management</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Shipping Methods</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchShippingMethods()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={() => { setSelectedMethod(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={16} strokeWidth={2.5} /> New Carrier
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Transit Methods" value={shippingMethods.length} icon={PackageCheck} color="indigo" />
        <MetricCard 
            label="Average Cost" 
            value={shippingMethods.length > 0 
                ? `$${(shippingMethods.reduce((a, b) => a + Number(b.price), 0) / shippingMethods.length).toFixed(2)}` 
                : '$0.00'} 
            icon={Banknote} 
            color="emerald" 
        />
        <MetricCard label="System Sync" value="Live" icon={Clock} color="purple" />
      </div>

      {/* --- SHIPPING TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search methods..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Shipping Name</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Added On</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredMethods.map((method, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={method.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100/50">
                        <Truck size={16} strokeWidth={2.5} />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{method.name}</span>
                        <span className="text-[10px] font-black text-indigo-600/50 uppercase tracking-widest">ID:{method.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100/50 shadow-sm">
                      {Number(method.price) === 0 ? 'FREE' : `$${Number(method.price).toFixed(2)}`}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-bold text-slate-500 uppercase tracking-tight">
                        {new Date(method.created_at).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedMethod(method); setIsFormOpen(true); }} 
                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
                      >
                        <Edit3 size={14} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === method.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDelete(method.id)}
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
                            onClick={() => setConfirmDeleteId(method.id)}
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

      <ShippingFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedMethod} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
      />

      <ShippingFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedMethod} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
      />
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    purple: "bg-purple-50 text-purple-600 border-purple-100/50"
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2.5 rounded-xl w-fit mb-4 border-2 border-white shadow-sm relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
