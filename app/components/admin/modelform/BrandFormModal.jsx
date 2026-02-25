'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    status: 1,
    image: null,
  });
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        status: initialData ? Number(initialData.status) : 1,
        image: null,
      });
      setPreview(initialData?.image || null);
    }
  }, [initialData, isOpen]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleFormSubmit = (e) => {
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
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-white"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update Brand' : 'New Brand'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Brand Details</p>
              </div>
              <button
                onClick={onClose}
                className="p-3 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
              {/* Brand Logo Upload */}
              <div className="relative group w-full h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center justify-center overflow-hidden hover:border-indigo-400 hover:bg-white transition-all cursor-pointer">
                {preview ? (
                  <img src={preview} className="w-full h-full object-contain p-6" alt="Preview" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto text-slate-300" size={32} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">Upload Logo</span>
                  </div>
                )}
                <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
              </div>

              {/* brand Name */}
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Saby-Tinh Dynamics"
                  required
                  className="w-full px-6 py-4 bg-slate-50/50 border-2 border-slate-50 rounded-2xl text-sm font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm"
                />
              </div>

              {/* Status Toggle */}
              <div 
                onClick={() => setFormData({ ...formData, status: formData.status === 1 ? 0 : 1 })}
                className="flex p-1.5 bg-slate-50 rounded-2xl cursor-pointer"
              >
                <div className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.status === 1 ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>
                  {formData.status === 1 && <div className="w-1 h-1 rounded-full bg-indigo-600 animate-pulse" />} Active
                </div>
                <div className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${formData.status === 0 ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>
                  {formData.status === 0 && <div className="w-1 h-1 rounded-full bg-rose-500 animate-pulse" />} Inactive
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
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
                  className="flex-1 py-5 bg-indigo-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-indigo-700"
                >
                  {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  {initialData ? 'Update Brand' : 'Save Brand'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
