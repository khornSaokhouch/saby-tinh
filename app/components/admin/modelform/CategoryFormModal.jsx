'use client';

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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white border border-gray-100 rounded-xl shadow-2xl w-full max-w-[400px] p-5 relative z-10 text-gray-900"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? 'Update Category' : 'Register Category'}
            </h2>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-3">
              <div className="flex flex-col mb-3">
                <label className="text-xs font-bold mb-1.5 text-gray-700">Image</label>
                {imagePreview && (
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 object-cover border border-gray-200 rounded-lg mb-2" />
                )}
                <input type="file" accept="image/*" className="border border-gray-200 rounded-md p-1.5 text-xs text-gray-600 w-full file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setFormData({ ...formData, category_image: file });
                    const reader = new FileReader();
                    reader.onloadend = () => setImagePreview(reader.result);
                    reader.readAsDataURL(file);
                  }
                }} />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">Category Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  required
                />
              </div>

              <div className="flex border border-gray-200 rounded-md overflow-hidden mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: true })}
                  className={`flex-1 py-1.5 px-3 border-r border-gray-200 text-xs font-bold transition-colors ${formData.status ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Visible
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: false })}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold transition-colors ${!formData.status ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Hidden
                </button>
              </div>

              <div className="flex justify-end gap-2 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-sm"
                >
                  {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Save')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}