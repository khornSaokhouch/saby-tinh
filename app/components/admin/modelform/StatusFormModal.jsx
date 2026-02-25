'use client';
import { useState, useEffect } from 'react';
import { X, Activity, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatusFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (isOpen) {
      setStatus(initialData?.status || '');
    }
  }, [initialData, isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ status });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white">
            <div className="p-8 md:p-10 font-sans">
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">{initialData ? 'Update Status' : 'New Status'}</h2>
                <button onClick={onClose} disabled={isSubmitting} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors"><X size={20} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-8">
                <div className="relative group">
                  <input 
                      type="text" 
                      value={status} 
                      onChange={(e) => setStatus(e.target.value)} 
                      required 
                      disabled={isSubmitting}
                      className="peer w-full h-16 pt-6 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none disabled:opacity-50" 
                      placeholder=" " 
                  />
                  <label className="absolute left-5 top-5 text-slate-400 text-sm font-medium transition-all 
                    peer-focus:top-2 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                    peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                  >
                    Status Name
                  </label>
                  <Activity className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                </div>

                <div className="flex gap-4 pt-6">
                  <button onClick={onClose} disabled={isSubmitting} type="button" className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-indigo-700">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : (initialData ? 'Update Status' : 'Save Status')}
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