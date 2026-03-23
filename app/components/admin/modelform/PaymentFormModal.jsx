import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function PaymentFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const { language } = useLanguageStore();
  const [formData, setFormData] = useState({
    account_name: '',
    account_id: '',
    type_value: '',
    account_city: '',
    currency: 'USD',
    status: 1
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        account_name: initialData?.account_name || '',
        account_id: initialData?.account_id || '',
        type_value: initialData?.type_value || '',
        account_city: initialData?.account_city || '',
        currency: initialData?.currency || 'USD',
        status: initialData ? (initialData.status ? 1 : 0) : 1
      });
    }
  }, [initialData, isOpen]);

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
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[400px] p-5 relative z-10"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? t('Update Gateway', language) : t('Register Gateway', language)}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Account Name', language)}</label>
                  <input
                    type="text"
                    value={formData.account_name}
                    onChange={(e) => setFormData({ ...formData, account_name: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Account ID', language)}</label>
                  <input
                    type="text"
                    value={formData.account_id}
                    onChange={(e) => setFormData({ ...formData, account_id: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Provider Type', language)}</label>
                  <input
                    type="text"
                    value={formData.type_value}
                    onChange={(e) => setFormData({ ...formData, type_value: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('City', language)}</label>
                  <input
                    type="text"
                    value={formData.account_city}
                    onChange={(e) => setFormData({ ...formData, account_city: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">{t('Currency', language)}</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="USD">USD</option>
                    <option value="KHR">KHR</option>
                  </select>
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
                  {t('Offline', language)}
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
