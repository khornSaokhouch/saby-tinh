'use client';
import { useState, useEffect } from 'react';
import { X, Truck, Banknote, Loader2, Check  } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ShippingFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setPrice(initialData?.price || '');
    }
  }, [initialData, isOpen]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, price: Number(price) });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white">
            <div className="p-8 font-sans">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {initialData ? 'Update Method' : 'Register Carrier'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Logistics Identity</p>
                </div>
                <button onClick={onClose} disabled={isSubmitting} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-2xl transition-all disabled:opacity-50"><X size={20} /></button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                      Carrier Designation
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Truck size={18} />
                      </div>
                      <input 
                          type="text" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          placeholder="e.g. FedEx Standard"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm disabled:opacity-50" 
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                      Standard Service Fee
                    </label>
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                        <Banknote size={18} />
                      </div>
                      <input 
                          type="number" 
                          step="0.01" 
                          value={price} 
                          onChange={(e) => setPrice(e.target.value)} 
                          required 
                          disabled={isSubmitting}
                          placeholder="0.00"
                          className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm disabled:opacity-50" 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-50">
                  <button onClick={onClose} disabled={isSubmitting} type="button" className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-indigo-700">
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <div className="p-1 bg-white/10 rounded-lg"><Check size={14} strokeWidth={3} /></div>}
                    {initialData ? 'Sync Logistics' : 'Register Carrier'}
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