'use client';
import { useState, useEffect } from 'react';
import { X, Activity, Loader2 ,Check } from 'lucide-react';
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
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }} 
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-8 font-sans">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                  <Activity size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update State' : 'Register Lifecycle'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Status Profile</p>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">
                    Workflow Designation
                  </label>
                  <input 
                    type="text" 
                    value={status} 
                    onChange={(e) => setStatus(e.target.value)} 
                    required 
                    disabled={isSubmitting}
                    placeholder="e.g. Processing"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400" 
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button 
                    onClick={onClose} 
                    disabled={isSubmitting} 
                    type="button" 
                    className="flex-1 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all active:scale-95"
                  >
                    Back
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="flex-[2] py-3.5 bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-emerald-600"
                  >
                    {isSubmitting ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Check size={14} strokeWidth={3} />
                    )}
                    {initialData ? 'Sync Life-Cycle' : 'Register Lifecycle'}
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