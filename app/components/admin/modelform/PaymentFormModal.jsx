'use client';
import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, Globe, Check  } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PaymentFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    account_name: '',
    account_id: '',
    type_value: '',
    account_city: '',
    currency: 'USD',
    status: 1
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        account_name: initialData?.account_name || '',
        account_id: initialData?.account_id || '',
        type_value: initialData?.type_value || '',
        account_city: initialData?.account_city || '',
        currency: initialData?.currency || 'USD',
        status: initialData ? (initialData.status ? 1 : 0) : 1
      });
    }
  }, [initialData, isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // user_id removed, backend uses auth
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-8 font-sans">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-100">
                   <CreditCard size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update Gateway' : 'Register Gateway'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Provider Config</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                  {/* Account Name */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Gateway Identity</label>
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g ABA Bank"
                    />
                  </div>

                  {/* Account ID / Number */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Internal Reference</label>
                    <input
                      type="text"
                      value={formData.account_id}
                      onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g 000 123 456"
                    />
                  </div>

                  {/* Type (ABA, Wing, etc) */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Provider Format</label>
                    <input
                      type="text"
                      value={formData.type_value}
                      onChange={(e) => setFormData({ ...formData, type_value: e.target.value })}
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g Mobile Banking"
                    />
                  </div>

                  {/* City */}
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Regional Scope</label>
                    <input
                      type="text"
                      value={formData.account_city}
                      onChange={(e) => setFormData({ ...formData, account_city: e.target.value })}
                      required
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-blue-600 outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g Phnom Penh"
                    />
                  </div>

                  {/* Currency */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Settlement Unit</label>
                    <div className="relative">
                      <select
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 appearance-none focus:bg-white focus:border-blue-600 outline-none transition-all"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="KHR">KHR - Riel</option>
                      </select>
                      <Globe className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={14} />
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 1 })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.status === 1 ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Live Node
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 0 })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.status === 0 ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Offline
                  </button>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    type="button"
                    className="flex-1 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-3.5 bg-emerald-500 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-[0.95] hover:bg-emerald-600"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={14} strokeWidth={3} />
                    )}
                    {initialData ? 'Sync Details' : 'Register Gateway'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
