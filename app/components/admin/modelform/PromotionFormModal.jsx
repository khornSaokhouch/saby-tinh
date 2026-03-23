import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { useCategoryStore } from "@/stores/useCategoryStore";
import { useLanguageStore } from "@/stores/useLanguageStore";
import { t } from "@/util/translations";

export default function PromotionFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const { language } = useLanguageStore();
  const { categories, fetchCategories } = useCategoryStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
    priority: 0,
    event_type: "promotion",
    discount_type: "none",
    discount_value: 0,
    category_ids: initialData?.categories?.map(c => c.id) || [],
  });

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split('T')[0];
    } catch (e) { return ""; }
  };

  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) fetchCategories();
      
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
        priority: initialData?.priority || 0,
        event_type: initialData?.event_type || "promotion",
        discount_type: initialData?.discount_type || "none",
        discount_value: initialData?.discount_value || 0,
        start_date: formatDateForInput(initialData?.start_date),
        end_date: formatDateForInput(initialData?.end_date),
        status: initialData?.status ?? 1,
        category_ids: initialData?.categories?.map(c => c.id) || [],
      });
    }
  }, [initialData, isOpen, categories.length, fetchCategories]);

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
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="bg-white border border-gray-100 text-gray-900 rounded-xl shadow-2xl w-full max-w-[550px] p-5 relative z-10 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? t('Update Promotion', language) : t('New Promotion', language)}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Campaign Title', language)}</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Event Type', language)}</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="promotion">{t('Promotion', language)}</option>
                    <option value="offer">{t('Offer', language)}</option>
                    <option value="seasonal">{t('Seasonal', language)}</option>
                    <option value="global-event">{t('Global Event', language)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Priority (Order)', language)}</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Discount Type', language)}</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="none">{t('None', language)}</option>
                    <option value="percentage">{t('Percentage %', language)}</option>
                    <option value="fixed">{t('Fixed Amount', language)}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Discount Value', language)}</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formData.discount_type === 'none'}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all disabled:opacity-50 disabled:bg-gray-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Description', language)}</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Starts', language)}</label>
                  <input 
                    type="date" 
                    value={formData.start_date} 
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                    required 
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Ends', language)}</label>
                  <input 
                    type="date" 
                    value={formData.end_date} 
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                    required 
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all" 
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-xs font-bold text-gray-700">{t('Categories Target', language)}</label>
                  <button
                    type="button"
                    onClick={() => {
                      const allIds = categories.map(cat => cat.id);
                      const isAllSelected = formData.category_ids.length === allIds.length;
                      setFormData({ ...formData, category_ids: isAllSelected ? [] : allIds });
                    }}
                    className="text-[10px] font-bold text-gray-500 hover:text-gray-900 transition-colors"
                  >
                    {formData.category_ids.length === categories.length ? t('Deselect All', language) : t('Select All', language)}
                  </button>
                </div>
                <div className="border border-gray-200 p-2 rounded-md max-h-24 overflow-y-auto grid grid-cols-2 gap-2 bg-gray-50">
                  {categories.map((cat) => (
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

              <div className="flex border border-gray-200 rounded-md overflow-hidden mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 1 })}
                  className={`flex-1 py-1.5 px-3 border-r border-gray-200 text-xs font-bold transition-colors ${formData.status === 1 ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {t('Active', language)}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 0 })}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold transition-colors ${formData.status === 0 ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  {t('Disabled', language)}
                </button>
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
                  {isSubmitting ? t('Saving...', language) : (initialData ? t('Sync', language) : t('Save', language))}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
