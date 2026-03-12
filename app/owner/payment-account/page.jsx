'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, Globe, Banknote, ShieldCheck, RefreshCw, Check, X
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
    const interval = setInterval(() => {
      fetchPaymentAccounts();
    }, 60000);
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
      toast.success('Node synchronized');
    } catch (err) {
      toast.error('Sync failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsActionLoading(true);
    try {
      await deletePaymentAccount(id);
      setConfirmDeleteId(null);
      toast.success('Node purged');
    } catch (err) {
      toast.error('Purge failed');
    } finally {
      setIsActionLoading(false);
    }
  };

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Protocol</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-indigo-500">Accounts</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Registry for {today}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPaymentAccounts()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-md hover:bg-slate-800 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> New Registry
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Financial Nodes" value={paymentAccounts.length} icon={ShieldCheck} color="indigo" />
        <MetricCard label="Active Status" value={paymentAccounts.filter(a => a.status).length} icon={CheckCircle2} color="emerald" subText="Online" />
        <MetricCard label="Global Zones" value={new Set(paymentAccounts.map(a => a.currency)).size} icon={Globe} color="rose" />
      </div>

      {/* --- LIST --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search financial IDs..." 
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                {paymentAccounts.length} Nodes Verified
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Account Node</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Type / Mapping</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Zone</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && paymentAccounts.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <RefreshCw className="animate-spin text-indigo-500" size={24} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Accessing Vault...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.map((acc, idx) => (
                <motion.tr 
                  key={acc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all">
                         {acc.type_value?.toLowerCase().includes('bakong') || acc.account_name?.toLowerCase().includes('bakong') ? (
                           <img src="/img/bakong.png" alt="Bakong" className="w-6 h-6 object-contain" />
                         ) : (
                           <div className="font-black text-[10px] uppercase italic">
                             {acc.type_value?.substring(0, 2) || 'CC'}
                           </div>
                         )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate uppercase tracking-tight">{acc.account_name}</span>
                        <div className={`inline-flex items-center gap-1.5 mt-0.5 text-[8px] font-black uppercase tracking-widest ${acc.status ? 'text-emerald-500' : 'text-slate-300'}`}>
                           <div className={`w-1 h-1 rounded-full ${acc.status ? 'bg-emerald-500' : 'bg-slate-300'}`} /> {acc.status ? 'Live' : 'Locked'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-700 uppercase truncate">{acc.type_value}</span>
                        <span className="text-[9px] font-black text-slate-300 tracking-tighter uppercase truncate">{acc.account_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                     <div className="flex items-center justify-center gap-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase">{acc.account_city}</span>
                        <span className="px-1.5 py-0.5 bg-slate-50 border border-slate-100 rounded text-[8px] font-black text-slate-400">{acc.currency}</span>
                     </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(acc); setIsFormOpen(true); }} 
                        className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all"
                      >
                        <Edit3 size={14} strokeWidth={3} />
                      </button>

                      <AnimatePresence mode="wait" initial={false}>
                        {confirmDeleteId === acc.id ? (
                          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex items-center gap-1">
                            <button onClick={() => handleDelete(acc.id)} className="p-1.5 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-sm">
                              <Check size={12} strokeWidth={3} />
                            </button>
                            <button onClick={() => setConfirmDeleteId(null)} className="p-1.5 bg-slate-100 text-slate-400 rounded-lg">
                              <X size={12} strokeWidth={3} />
                            </button>
                          </motion.div>
                        ) : (
                          <button onClick={() => setConfirmDeleteId(acc.id)} className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95">
                            <Trash2 size={14} strokeWidth={3} />
                          </button>
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

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100",
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
                {subText && <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{subText}</span>}
            </div>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
