'use client';

import { useEffect, useState, useMemo } from 'react';
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
    deletePaymentAccount,
    deleteMultiplePaymentAccounts
  } = usePaymentAccountStore();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // --- Bulk Selection State ---
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    fetchPaymentAccounts();

    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchPaymentAccounts();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchPaymentAccounts]);

  const filteredAccounts = useMemo(() => {
    return paymentAccounts.filter(acc => 
      (acc.account_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (acc.account_id || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [paymentAccounts, search]);

  // Reset selection on search
  useEffect(() => {
    setSelectedIds([]);
  }, [search]);

  // --- Handlers ---
  const handleSelectAll = () => {
    if (selectedIds.length === filteredAccounts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAccounts.map(acc => acc.id));
    }
  };

  const toggleSelectId = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${selectedIds.length} payment accounts?`)) {
      setIsActionLoading(true);
      const res = await deleteMultiplePaymentAccounts(selectedIds);
      if (res?.success) {
        toast.success(`Removed ${selectedIds.length} accounts`);
        setSelectedIds([]);
      } else {
        toast.error(res?.message || 'Batch delete failed');
      }
      setIsActionLoading(false);
    }
  };

  const handleSave = async (data) => {
    setIsActionLoading(true);
    try {
      await savePaymentAccount({ ...data, id: selectedItem?.id });
      setIsFormOpen(false);
      toast.success(selectedItem ? 'Account updated' : 'Account created');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save account');
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
              <div className="bg-blue-500 text-white w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black">
                {selectedIds.length}
              </div>
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300">Selected Bridges</span>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Financial Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Payment <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-400">Gateways</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage your organization's financial bridges and account configurations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPaymentAccounts()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-blue-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>

          <button 
            onClick={() => { setSelectedItem(null); setIsFormOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black shadow-lg shadow-slate-200 hover:bg-black transition-all active:scale-95 uppercase tracking-widest"
          >
            <Plus size={14} strokeWidth={3} /> New Bridge
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Active Nodes" value={paymentAccounts.length} icon={ShieldCheck} color="indigo" />
        <MetricCard label="Operational" value={paymentAccounts.filter(a => a.status).length} icon={CheckCircle2} color="emerald" subText="Live" />
        <MetricCard label="Currencies" value={`${new Set(paymentAccounts.map(a => a.currency)).size} Units`} icon={Globe} color="purple" subText="Global" />
      </div>

      {/* --- ACCOUNTS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Filter gateway assets..." 
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-blue-100 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
            {filteredAccounts.length} Nodes Detected
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
                    selectedIds.length === filteredAccounts.length && filteredAccounts.length > 0
                      ? 'bg-blue-600 border-blue-600' 
                      : 'bg-white border-slate-200 hover:border-blue-400'
                  }`}>
                    {selectedIds.length === filteredAccounts.length && filteredAccounts.length > 0 && <Check size={10} className="text-white" strokeWidth={5} />}
                  </div>
                </th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Asset Identity</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Type Definition</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-left">Regional Config</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Lifecycle</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && paymentAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                    <div className="flex flex-col items-center gap-4 text-center justify-center">
                      <Loader2 className="animate-spin text-blue-500 opacity-40" size={32} />
                      Syncing database...
                    </div>
                  </td>
                </tr>
              ) : filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No nodes found in registry</td>
                </tr>
              ) : (
                filteredAccounts.map((acc, idx) => (
                  <motion.tr 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.02 }}
                    key={acc.id} className={`group hover:bg-slate-50/30 transition-colors ${selectedIds.includes(acc.id) ? 'bg-blue-50/40' : ''}`}
                  >
                    <td className="pl-6 py-3.5">
                      <div 
                        onClick={() => toggleSelectId(acc.id)}
                        className={`w-4 h-4 rounded border-2 cursor-pointer flex items-center justify-center transition-all ${
                        selectedIds.includes(acc.id) 
                          ? 'bg-blue-600 border-blue-600' 
                          : 'bg-white border-slate-200 group-hover:border-blue-300'
                      }`}>
                        {selectedIds.includes(acc.id) && <Check size={10} className="text-white" strokeWidth={5} />}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm group-hover:scale-105 transition-all">
                           {acc.type_value?.toLowerCase().includes('bakong') || acc.account_name?.toLowerCase().includes('bakong') ? (
                             <img src="/img/bakong.png" alt="Bakong" className="w-6 h-6 object-contain" />
                           ) : (
                             <div className="w-full h-full bg-blue-50 text-blue-600 flex items-center justify-center font-black text-[9px] italic">
                               {acc.type_value?.substring(0, 2).toUpperCase()}
                             </div>
                           )}
                        </div>
                        <div className="flex flex-col text-left">
                          <span className="text-[12px] font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase leading-none mb-1 tracking-tight">{acc.account_name}</span>
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-70">Node ID: {acc.account_id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <div className="flex flex-col">
                          <span className="text-[11px] font-bold text-slate-700 uppercase leading-none mb-1">{acc.type_value}</span>
                          <span className="text-[8px] font-black text-blue-500/50 uppercase tracking-widest italic">{acc.currency} Unit</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-left">
                      <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{acc.account_city}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[7px] font-black text-slate-400 uppercase tracking-widest">{acc.currency}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-[0.15em] shadow-sm
193:                         ${acc.status ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
                        <div className={`w-1 h-1 rounded-full ${acc.status ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        {acc.status ? 'Live' : 'Static'}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => { setSelectedItem(acc); setIsFormOpen(true); }} 
                          className="p-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 shadow-sm active:scale-95 transition-all"
                        >
                          <Edit3 size={14} strokeWidth={3} />
                        </button>

                        <AnimatePresence mode="wait" initial={false}>
                          {confirmDeleteId === acc.id ? (
                            <motion.div
                              key="confirm-delete"
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              className="flex items-center gap-1.5"
                            >
                              <button
                                onClick={() => handleDelete(acc.id)}
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
                              onClick={() => setConfirmDeleteId(acc.id)}
                              className="p-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                            >
                              <Trash2 size={14} strokeWidth={3} />
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
           <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
             Showing: {filteredAccounts.length} Registry Entries
           </span>
           <div className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest shadow-sm">
             Registry Sync
           </div>
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
