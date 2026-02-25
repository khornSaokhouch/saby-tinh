'use client';
import { useState, useEffect } from 'react';
import { X, CreditCard, Loader2, Globe } from 'lucide-react';
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
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden border border-white"
          >
            <div className="p-8 md:p-10 font-sans">
              <div className="flex justify-between items-center mb-10">
                <div className="flex flex-col">
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                    {initialData ? 'Update Account' : 'Register Account'}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Payment Details</span>
                </div>
                <button
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors disabled:opacity-50"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Account Name */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.account_name}
                      onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                      required
                      className="peer w-full h-14 pt-5 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none"
                      placeholder=" "
                    />
                    <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all 
                        peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                        peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Account Name
                    </label>
                  </div>

                  {/* Account ID / Number */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.account_id}
                      onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                      required
                      className="peer w-full h-14 pt-5 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none"
                      placeholder=" "
                    />
                    <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all 
                        peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                        peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Account Number / ID
                    </label>
                  </div>

                  {/* Type (ABA, Wing, etc) */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.type_value}
                      onChange={(e) => setFormData({ ...formData, type_value: e.target.value })}
                      required
                      className="peer w-full h-14 pt-5 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none"
                      placeholder=" "
                    />
                    <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all 
                        peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                        peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Provider Type (e.g. ABA)
                    </label>
                  </div>

                  {/* City */}
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.account_city}
                      onChange={(e) => setFormData({ ...formData, account_city: e.target.value })}
                      required
                      className="peer w-full h-14 pt-5 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none"
                      placeholder=" "
                    />
                    <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all 
                        peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                        peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                    >
                      Account City
                    </label>
                  </div>

                  {/* Currency */}
                  <div className="relative">
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full h-14 px-5 bg-slate-50 border-none rounded-2xl text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/5 appearance-none"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="KHR">KHR - Riel</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Globe size={16} />
                    </div>
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex p-1.5 bg-slate-50 rounded-2xl">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 1 })}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.status === 1 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Active Account
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 0 })}
                    className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      formData.status === 0 ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Inactive
                  </button>
                </div>

                <div className="flex gap-4 pt-6">
                  <button
                    onClick={onClose}
                    disabled={isSubmitting}
                    type="button"
                    className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-indigo-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-indigo-700"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : initialData ? 'Update Account' : 'Save Account'}
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
