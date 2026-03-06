'use client';

import { useEffect, useState } from 'react';
import { 
  CreditCard, Search, Plus, Edit3, Trash2, Clock, 
  Loader2, CheckCircle2, Globe, Banknote, ShieldCheck, RefreshCw
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
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payment Accounts</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight leading-none">Payments</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchPaymentAccounts()}
            className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-6 py-4 bg-indigo-600 text-white rounded-2xl text-sm font-black shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={18} strokeWidth={2.5} /> New Account
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
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="p-6 border-b border-slate-50 bg-slate-50/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by Account or ID..." 
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:ring-4 focus:ring-indigo-500/5 transition-all outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar min-h-[400px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Account Name</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type / ID</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Zone / Currency</th>
                <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
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
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                         {acc.type_value?.toLowerCase().includes('bakong') || acc.account_name?.toLowerCase().includes('bakong') ? (
                           <img src="/img/bakong.png" alt="Bakong" className="w-8 h-8 object-contain" />
                         ) : (
                           <div className="w-full h-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-black text-xs italic">
                             {acc.type_value?.substring(0, 2).toUpperCase()}
                           </div>
                         )}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-900">{acc.account_name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Registry ID: {acc.account_id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{acc.type_value}</span>
                        <span className="text-xs font-medium text-indigo-600/60 tracking-wider">{acc.account_id}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-500 uppercase">{acc.account_city}</span>
                        <span className="px-2 py-0.5 bg-slate-100 rounded-md text-[10px] font-bold text-slate-400">{acc.currency}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider
                      ${acc.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                      <div className={`w-1 h-1 rounded-full ${acc.status ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                      {acc.status ? 'Active' : 'Offline'}
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => { setSelectedItem(acc); setIsFormOpen(true); }} 
                        className="w-9 h-9 rounded-xl bg-indigo-500 flex items-center justify-center text-white hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                      >
                        <Edit3 size={15} strokeWidth={2.5} />
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
                            onClick={() => setConfirmDeleteId(acc.id)}
                            className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center text-white hover:bg-rose-600 transition-all shadow-lg shadow-rose-100"
                          >
                            <Trash2 size={15} strokeWidth={2.5} />
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
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    purple: "bg-purple-50 text-purple-600"
  };
  return (
    <div className="bg-white p-7 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group">
      <div className={`p-3 rounded-xl w-fit mb-4 ${colors[color]}`}><Icon size={20} /></div>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{value}</h3>
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-50 rounded-full group-hover:scale-150 transition-all opacity-40" />
    </div>
  );
}
