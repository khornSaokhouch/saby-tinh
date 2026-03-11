'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, Search, Plus, Edit3, Trash2, X , 
  Loader2, CheckCircle2, Globe, Check , ShieldCheck, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaymentAccountStore } from '@/stores/usePaymentAccountStore';
import PaymentFormModal from '@/components/admin/modelform/PaymentFormModal';
import { toast } from 'react-hot-toast';

export default function PaymentAccountsPage() {
  const { 
    paymentAccounts, 
    loading, 
    fetchPaymentAccounts, 
    search, 
    setSearch, 
    savePaymentAccount, 
    deletePaymentAccount 
  } = usePaymentAccountStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchPaymentAccounts();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPaymentAccounts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPaymentAccounts]);

  const filteredAccounts = paymentAccounts.filter(acc => 
    acc.account_name.toLowerCase().includes(search.toLowerCase()) ||
    acc.account_id.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await savePaymentAccount({ ...data, id: selectedItem?.id });
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
      await deletePaymentAccount(id);
      setConfirmDeleteId(null);
      toast.success('Account deleted');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete account');
    } finally {
      setIsActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Financial Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Gateways</span>
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPaymentAccounts()}
            className="p-2.5 bg-white border border-slate-200 text-slate-400 hover:text-blue-600 rounded-xl transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 text-white rounded-xl text-[9px] font-black shadow-lg hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> New Bridge
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Active Nodes" value={paymentAccounts.length} icon={ShieldCheck} color="indigo" />
        <MetricCard label="Operational" value={paymentAccounts.filter(a => a.status).length} icon={CheckCircle2} color="emerald" />
        <MetricCard label="Currencies" value={`${new Set(paymentAccounts.map(a => a.currency)).size} Units`} icon={Globe} color="purple" />
      </div>

      {/* --- ACCOUNTS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:max-w-xs group text-left">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Filter gateway assets..." 
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 focus:border-blue-100 transition-all outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            {filteredAccounts.length} Nodes Detected
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Asset Identity</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type Definition</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Regional Config</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-500 opacity-40" />
                  </td>
                </tr>
              ) : filteredAccounts.map((acc, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  key={acc.id} className="group hover:bg-slate-50/20 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:rotate-2 transition-transform">
                         {acc.type_value?.toLowerCase().includes('bakong') || acc.account_name?.toLowerCase().includes('bakong') ? (
                           <img src="/img/bakong.png" alt="Bakong" className="w-6 h-6 object-contain" />
                         ) : (
                           <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[9px] italic">
                             {acc.type_value?.substring(0, 2).toUpperCase()}
                           </div>
                         )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 group-hover:text-blue-600 transition-colors truncate tracking-tight uppercase leading-none mb-1">{acc.account_name}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Node ID: {acc.account_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex flex-col">
                        <span className="text-[11px] font-black text-slate-700 truncate max-w-[150px] uppercase leading-none mb-1">{acc.type_value}</span>
                        <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest italic">{acc.account_id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-tight">{acc.account_city}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400 uppercase tracking-widest">{acc.currency}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest shadow-sm
                      ${acc.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                      <div className={`w-1 h-1 rounded-full ${acc.status ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {acc.status ? 'Live' : 'Static'}
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(acc); setIsFormOpen(true); }} 
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-blue-600 hover:border-blue-100 transition-all shadow-sm group"
                      >
                        <Edit3 size={14} strokeWidth={2.5} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === acc.id ? (
                          <motion.div
                            key="confirm-delete"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center gap-1"
                          >
                            <button
                              onClick={() => handleDelete(acc.id)}
                              disabled={isActionLoading}
                              className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center hover:bg-rose-600 transition-all shadow-sm disabled:opacity-50"
                            >
                              {isActionLoading ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} strokeWidth={3} />}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
                            >
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ) : (
                          <motion.button
                            key="delete-button"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            onClick={() => setConfirmDeleteId(acc.id)}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-300 hover:text-rose-500 hover:border-rose-100 transition-all hover:bg-rose-50"
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

      <PaymentFormModal 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        initialData={selectedItem} 
        onSubmit={handleSave}
        isSubmitting={isActionLoading}
      />

    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-left">
      <div className={`p-2 rounded-xl w-8 h-8 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color]}`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}
