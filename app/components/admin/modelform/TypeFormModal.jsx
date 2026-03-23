import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from '@/stores/useCategoryStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function TypeFormModal({ isOpen, onClose, onSubmit, initialData, isSubmitting }) {
  const { categories, fetchCategories } = useCategoryStore();
  const { language } = useLanguageStore();
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
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[350px] p-5 relative z-10"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? t('Update Type', language) : t('Register Type', language)}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Type Label', language)}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Hierarchy Category', language)}</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  <option value="">{t('Select Category', language)}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {t(category.name, language)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  {t('Cancel', language)}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-md bg-gray-900 text-white text-xs font-bold hover:bg-black transition-colors shadow-sm"
                >
                  {isSubmitting ? t('Saving...', language) : (initialData ? t('Sync', language) : t('Register', language))}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
