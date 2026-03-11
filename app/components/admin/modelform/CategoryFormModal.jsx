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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 20, opacity: 0 }}
            className="bg-white rounded-[20px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-6 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                  <Package size={20} strokeWidth={2.5} />
                </div>
                <button type="button" onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  {initialData ? 'Update Category' : 'New Category'}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  Classification Registry Node
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Image Upload - Compact Rounded Box */}
              <div className="flex flex-col items-center">
                <div className="relative group w-24 h-24 rounded-[20px] border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-indigo-400 transition-all cursor-pointer overflow-hidden shadow-inner">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center flex flex-col items-center">
                      <ImageIcon size={24} className="text-slate-300 mb-1" />
                      <span className="text-[8px] font-black text-slate-400 uppercase">Art</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Check size={16} className="text-white" strokeWidth={3} />
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-2">Display Profile</label>
              </div>

              {/* Name Input */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Category Designation</label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-100 transition-all outline-none"
                    placeholder="e.g. Footwear & Apparel"
                    required
                  />
                </div>
              </div>

              {/* Status Selector */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Lifecycle Status</label>
                <div 
                  onClick={() => setFormData({ ...formData, status: !formData.status })}
                  className="flex p-1 bg-slate-50 rounded-xl cursor-pointer border border-slate-100"
                >
                  <div className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${formData.status ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                    {formData.status && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />} Active
                  </div>
                  <div className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 ${!formData.status ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>
                    {!formData.status && <span className="w-1 h-1 rounded-full bg-current animate-pulse" />} Hidden
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-50 mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2 text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                  disabled={isSubmitting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[2] py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {isSubmitting ? (
                    <Loader2 size={12} className="animate-spin text-white" />
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