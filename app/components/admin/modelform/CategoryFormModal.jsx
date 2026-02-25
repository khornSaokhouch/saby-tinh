'use client';

import { X, Check, Loader2 ,Package } from 'lucide-react';
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
      if (initialData.category_image || initialData.image) {
        setImagePreview(initialData.category_image || initialData.image);
      }
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update Category' : 'New Category'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Category Details</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Image Upload - Premium Circular Style */}
              <div className="flex flex-col items-center justify-center gap-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Category Image</label>
                <div className="relative group cursor-pointer">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 group-hover:border-indigo-100 transition-all bg-slate-50 relative shadow-inner">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <Package size={40} />
                      </div>
                    )}
                    
                    <label className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all cursor-pointer">
                      <div className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all flex flex-col items-center">
                        <Check size={24} className="mb-1" />
                        <span className="text-[8px] font-black uppercase">Change</span>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Name Input with Icon */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 px-1">
                  Category Name
                </label>
                <div className="relative">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                    <Package size={18} />
                  </div>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-2 border-transparent rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    placeholder="Enter category name"
                    required
                  />
                </div>
              </div>

              {/* Status Toggle - Modern Pill Style */}
              <div className="space-y-3">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest px-1">
                  Status
                </label>
                <div 
                  onClick={() => setFormData({ ...formData, status: !formData.status })}
                  className="flex p-1.5 bg-slate-50 rounded-[24px] cursor-pointer border border-slate-100"
                >
                  <div className={`flex-1 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${formData.status ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-400'}`}>
                    {formData.status && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />} Active
                  </div>
                  <div className={`flex-1 py-4 rounded-[18px] text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${!formData.status ? 'bg-white text-rose-500 shadow-md' : 'text-slate-400'}`}>
                    {!formData.status && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />} Inactive
                  </div>
                </div>
              </div>

              {/* Actions - Premium Gradient Footer */}
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
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-3 transition-all active:scale-[0.98] hover:bg-indigo-700"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <div className="p-1 bg-white/10 rounded-lg"><Check size={14} strokeWidth={3} /></div>}
                  {initialData ? 'Update Category' : 'Add Category'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
