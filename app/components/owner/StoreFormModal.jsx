'use client';
import { useState, useEffect } from 'react';
import { X, Image as ImageIcon, UploadCloud } from 'lucide-react';
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
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[24px] shadow-2xl w-full max-w-md relative z-10 overflow-hidden border border-white"
          >
            <div className="p-6 md:p-8 font-sans">
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                    {initialData ? 'Update Store' : 'Register New Store'}
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2">Retail Logistics Protocol</span>
                </div>
                <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 hover:text-rose-500 rounded-xl transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={handleSubmit}>
                
                {/* Image Upload */}
                <div className="relative group w-full h-32 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden hover:border-indigo-400 transition-all cursor-pointer">
                  {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                  ) : (
                    <div className="text-center">
                      <UploadCloud className="mx-auto text-slate-300" size={32} />
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-2 block">Upload Storefront Image</span>
                    </div>
                  )}
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleFileChange} />
                </div>

                {/* Name Input */}
                <div className="relative">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder=" "
                    className="peer w-full h-14 pt-5 px-5 bg-slate-50 border-b-2 border-transparent rounded-2xl text-sm font-bold focus:bg-white focus:border-indigo-600 transition-all outline-none"
                  />
                  <label className="absolute left-5 top-4 text-slate-400 text-sm font-medium transition-all 
                    peer-focus:top-1.5 peer-focus:text-xs peer-focus:font-bold peer-focus:text-indigo-600 peer-focus:uppercase peer-focus:tracking-wider
                    peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-bold peer-[:not(:placeholder-shown)]:text-indigo-600 peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider"
                  >
                    Store Name
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest transition-all">Cancel</button>
                  <button type="submit" disabled={isSubmitting} className="flex-[2] py-4 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98] hover:bg-indigo-700">
                    {isSubmitting ? 'Saving...' : initialData ? 'Apply Changes' : 'Register Store'}
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
