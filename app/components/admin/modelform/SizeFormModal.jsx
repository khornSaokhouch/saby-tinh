import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SizeFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting, categories }) {
  const [formData, setFormData] = useState({
    name: '',
    category_ids: [],
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        category_ids: initialData?.categories?.map(c => c.id) || [],
      });
    }
  }, [initialData, isOpen]);

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
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white border border-gray-100 text-gray-900 rounded-xl shadow-2xl w-full max-w-[400px] p-5 relative z-10"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? 'Update Size' : 'Register Size'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">Categories</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = (categories || []).map(cat => cat.id);
                      const isAllSelected = formData.category_ids.length === allIds.length;
                      setFormData({ ...formData, category_ids: isAllSelected ? [] : allIds });
                    }}
                    className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {formData.category_ids.length === (categories || []).length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>
                <div className="border border-gray-200 p-2 rounded-md max-h-32 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50">
                  {(categories || []).map(cat => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer bg-white p-1.5 rounded border border-gray-200 hover:border-gray-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.category_ids.includes(cat.id)}
                        onChange={() => {
                          const newIds = formData.category_ids.includes(cat.id)
                            ? formData.category_ids.filter(id => id !== cat.id)
                            : [...formData.category_ids, cat.id];
                          setFormData({ ...formData, category_ids: newIds });
                        }}
                        className="w-3.5 h-3.5 text-black bg-white border-gray-300 rounded focus:ring-black"
                      />
                      <span className="text-xs font-medium text-gray-700">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">Size Reference</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  required
                />
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
                  {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Add Measurement')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
