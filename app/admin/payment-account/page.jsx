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
    <div className="space-y-10 pb-10 font-sans">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Vault</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Payments</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchPaymentAccounts()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-[0.2em]"
          >
            <Plus size={16} strokeWidth={3} /> Create Account
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard label="Total Accounts" value={paymentAccounts.length} icon={ShieldCheck} color="indigo" />
        <MetricCard label="Active Status" value={paymentAccounts.filter(a => a.status).length} icon={CheckCircle2} color="emerald" />
        <MetricCard label="Currencies" value={new Set(paymentAccounts.map(a => a.currency)).size} icon={Globe} color="purple" />
      </div>

      {/* --- ACCOUNTS TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter vault..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm text-slate-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {filteredAccounts.length} of {paymentAccounts.length} Records
          </span>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Identity</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Type Definition</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Regional Config</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-600 opacity-20" />
                  </td>
                </tr>
              ) : filteredAccounts.map((acc, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={acc.id} className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm group-hover:rotate-3 transition-transform">
                         {acc.type_value?.toLowerCase().includes('bakong') || acc.account_name?.toLowerCase().includes('bakong') ? (
                           <img src="/img/bakong.png" alt="Bakong" className="w-7 h-7 object-contain" />
                         ) : (
                           <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-[10px] italic">
                             {acc.type_value?.substring(0, 2).toUpperCase()}
                           </div>
                         )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{acc.account_name}</span>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Entry ID: {acc.account_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                        <span className="text-[13px] font-black text-slate-700">{acc.type_value}</span>
                        <span className="text-[10px] font-black text-indigo-500/50 uppercase tracking-widest italic">{acc.account_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider">{acc.account_city}</span>
                        <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[9px] font-black text-slate-400 uppercase tracking-widest">{acc.currency}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest shadow-sm
                      ${acc.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                      <div className={`w-1 h-1 rounded-full ${acc.status ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {acc.status ? 'Live' : 'Static'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button 
                        onClick={() => { setSelectedItem(acc); setIsFormOpen(true); }} 
                        className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100/50"
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
                              className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all shadow-sm"
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
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
    purple: 'bg-purple-50 text-purple-600 border-purple-100/50',
  };
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500 text-left">
      <div className="absolute top-0 right-0 w-20 h-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-[0.03] active:opacity-[0.05] group-hover:rotate-45 transition-all duration-700" />
      <div className={`p-2.5 rounded-xl w-fit mb-4 border-2 border-white shadow-sm relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
