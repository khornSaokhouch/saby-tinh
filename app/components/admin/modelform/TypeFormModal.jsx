'use client';

import { X, Check, Loader2, ChevronDown , Database } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '@/stores/useCategoryStore';

export default function TypeFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const { categories, fetchCategories } = useCategoryStore();
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
  });

  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) fetchCategories();
      setFormData({
        name: initialData?.name || '',
        category_id: initialData?.category_id || '',
      });
    }
  }, [initialData, isOpen, categories.length, fetchCategories]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative shrink-0 overflow-hidden border border-white"
          >
            <div className="p-8 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                    {initialData ? 'Update Type' : 'Register Type'}
                  </h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Classification Identity</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Designation Name
                  </label>
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                      <Database size={18} />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Core Processor"
                      required
                      className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Parent Category
                  </label>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                      <ChevronDown size={18} />
                    </div>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      required
                      className="w-full pl-14 pr-12 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-[13px] font-black text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm appearance-none"
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-slate-50">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-5 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-indigo-700"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <div className="p-1 bg-white/10 rounded-lg"><Check size={14} strokeWidth={3} /></div>}
                    {initialData ? 'Sync Changes' : 'Register Type'}
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
