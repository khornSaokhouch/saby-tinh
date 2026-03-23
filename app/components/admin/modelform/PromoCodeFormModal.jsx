import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';

export default function PromoCodeFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: "",
    min_order_amount: "",
    max_discount_amount: "",
    usage_limit: "",
    per_user_limit: 1,
    start_date: "",
    end_date: "",
    status: 1,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        code: initialData?.code || "",
        description: initialData?.description || "",
        discount_type: initialData?.discount_type || "percentage",
        discount_value: initialData?.discount_value || "",
        min_order_amount: initialData?.min_order_amount || "",
        max_discount_amount: initialData?.max_discount_amount || "",
        usage_limit: initialData?.usage_limit || "",
        per_user_limit: initialData?.per_user_limit ?? 1,
        start_date: initialData?.start_date ? initialData.start_date.split('T')[0].split(' ')[0] : "",
        end_date: initialData?.end_date ? initialData.end_date.split('T')[0].split(' ')[0] : "",
        status: initialData?.status ?? 1,
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
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[450px] p-5 relative z-10 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-base font-bold mb-4 border-b border-gray-100 pb-2">
              {initialData ? 'Update Promo Code' : 'New Promo Code'}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Promo Code</label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    placeholder="PROMO20"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Discount Type</label>
                  <div className="flex border border-gray-200 rounded-md overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, discount_type: "percentage" })}
                      className={`flex-1 py-1.5 px-3 border-r border-gray-200 text-xs font-bold transition-colors ${formData.discount_type === "percentage" ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      Percentage (%)
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, discount_type: "fixed" })}
                      className={`flex-1 py-1.5 px-3 text-xs font-bold transition-colors ${formData.discount_type === "fixed" ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                      Fixed Amount
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Value</label>
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Min Order</label>
                  <input
                    type="number"
                    value={formData.min_order_amount}
                    onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-md p-2 text-xs text-gray-900 h-16 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>
              </div>

              <div className="flex border border-gray-200 rounded-md overflow-hidden mt-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 1 })}
                  className={`flex-1 py-1.5 px-3 border-r border-gray-200 text-xs font-bold transition-colors ${formData.status === 1 ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Active
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, status: 0 })}
                  className={`flex-1 py-1.5 px-3 text-xs font-bold transition-colors ${formData.status === 0 ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                >
                  Disabled
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
                  {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Create Code')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
