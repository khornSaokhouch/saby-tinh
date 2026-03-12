'use client';

import { X, Check, Loader2, Package, ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CategoryFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    status: true,
    category_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        status: initialData.status === 1 || initialData.status === '1' || initialData.status === 'active' || initialData.status === true,
        category_image: null,
      });
      setImagePreview(initialData.category_image || initialData.image);
    } else {
      setFormData({ name: '', status: true, category_image: null });
      setImagePreview(null);
    }
  }, [initialData, isOpen]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, category_image: file });
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
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
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="p-8 font-sans">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
               <Package size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Update Category' : 'Register Category'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Category Details</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <div className="relative group w-24 h-24 rounded-[24px] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-indigo-400 transition-all cursor-pointer overflow-hidden shadow-sm">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center flex flex-col items-center">
                    <ImageIcon size={24} className="text-slate-300 mb-1" />
                    <span className="text-[8px] font-black text-slate-400 uppercase">Icon</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Check size={16} className="text-white" strokeWidth={3} />
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Preview Image</label>
            </div>

            {/* Name Input */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Category Name</label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Footwear & Apparel"
                  required
                />
              </div>
            </div>

            {/* Status Toggle */}
            <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: true })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  formData.status ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
                }`}
              >
                Visible
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, status: false })}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  !formData.status ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'
                }`}
              >
                Hidden
              </button>
            </div>

            <div className="flex items-center gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all active:scale-95"
                disabled={isSubmitting}
              >
                Back
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
                {initialData ? 'Sync Changes' : 'Save Category'}
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