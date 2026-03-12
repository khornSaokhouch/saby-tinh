'use client';
import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, UploadCloud, Store, Loader2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/stores/useStore';
import { useUserStore } from '@/stores/userStore';
import { toast } from 'react-hot-toast';

export default function OwnerStoreFormModal({ isOpen, onClose, initialData }) {
  const { createStore, updateStore, fetchStores } = useStore();
  const { user } = useUserStore();

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load initial data when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(initialData?.name || '');
      setPreview(initialData?.store_image || null);
      setImageFile(null);
    }
  }, [initialData, isOpen]);

  // Update preview when a new image is selected
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return alert('Store name is required');
    if (!user?.id) return alert('Failed to identify owner. Please log in again.');

    const formData = new FormData();
    formData.append('name', name);
    // Automatically set user_id from auth
    formData.append('user_id', user.id);
    if (imageFile) formData.append('store_image', imageFile);

    try {
      setIsSubmitting(true);

      if (initialData) {
        await updateStore(initialData.id, formData);
      } else {
        await createStore(formData);
      }

      await fetchStores(); // Auto-reload page data
      onClose();
    } catch (err) {
      console.error('Failed to save store:', err);
      alert(err.message || 'Failed to save store');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-8 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                   <Store size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {initialData ? 'Update Store' : 'Register New Store'}
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Retail Logistics Protocol</p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Image Upload */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1 text-left">Storefront Image</label>
                  <div className="relative group w-full h-32 bg-slate-50 rounded-[24px] border border-slate-100 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-all cursor-pointer shadow-sm">
                    {preview ? (
                      <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="mx-auto text-slate-300" size={32} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2 block">Upload Visual Node</span>
                      </div>
                    )}
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                  </div>
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1 text-left">Store Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                      placeholder="e.g. Saby Tinh Central"
                    />
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  <button 
                    type="button" 
                    onClick={onClose} 
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
                    {initialData ? 'Sync Details' : 'Register Unit'}
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
