'use client';

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { usePromotionStore } from "@/app/stores/usePromotionStore";

export default function EventFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const { promotions, fetchPromotions } = usePromotionStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    promotion_id: "",
    start_date: "",
    end_date: "",
    status: "draft",
    priority: 0,
    event_image: null,
  });
  const [preview, setPreview] = useState(null);

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toISOString().slice(0, 16);
    } catch (e) { return ""; }
  };

  useEffect(() => {
    if (isOpen) {
      fetchPromotions();
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
        promotion_id: initialData?.promotion_id || "",
        start_date: formatDateForInput(initialData?.start_date),
        end_date: formatDateForInput(initialData?.end_date),
        status: initialData?.status || "draft",
        priority: initialData?.priority || 0,
        event_image: null,
      });
      setPreview(initialData?.event_image || null);
    }
  }, [initialData, isOpen, fetchPromotions]);

  const handlePromotionChange = (promoId) => {
    const selectedPromo = promotions.find(p => p.id == promoId);
    if (selectedPromo) {
      setFormData({
        ...formData,
        promotion_id: promoId,
        name: selectedPromo.name,
        description: selectedPromo.description || formData.description,
        start_date: formatDateForInput(selectedPromo.start_date) || formData.start_date,
        end_date: formatDateForInput(selectedPromo.end_date) || formData.end_date,
      });
    } else {
      setFormData({ ...formData, promotion_id: "" });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, event_image: file });
      setPreview(URL.createObjectURL(file));
    }
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
            className="bg-white border border-gray-100 text-gray-900 rounded-xl shadow-2xl w-full max-w-[800px] p-5 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10"
          >
            <div className="col-span-1 border-r border-gray-100 pr-6">
              <h2 className="text-sm font-bold border-b border-gray-100 pb-2 mb-4">Event Banner</h2>
              {preview && (
                <img src={preview} className="w-full aspect-square object-cover border border-gray-200 rounded-lg mb-3" alt="Preview" />
              )}
              <input type="file" onChange={handleFileChange} className="w-full border border-gray-200 p-1.5 text-xs rounded-md text-gray-600 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200" />
              
              <div className="mt-4">
                <label className="block text-xs font-bold mb-1.5 text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 p-2 text-xs rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-3">
              <h2 className="text-base font-bold border-b border-gray-100 pb-2 mb-4">
                {initialData ? 'Update Campaign' : 'New Campaign'}
              </h2>
              
              <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Event Title</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full border border-gray-200 p-2 text-xs rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Inherit Configuration From</label>
                  <select
                    value={formData.promotion_id}
                    onChange={(e) => handlePromotionChange(e.target.value)}
                    required
                    className="w-full border border-gray-200 p-2 text-xs rounded-md bg-white text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  >
                    <option value="">Select a base promotion...</option>
                    {promotions.map(promo => (
                      <option key={promo.id} value={promo.id}>
                        {promo.name} ({promo.event_type})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1.5 text-gray-700">Description Override</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-200 p-2 text-xs rounded-md text-gray-900 h-20 resize-none focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-gray-700">Starts</label>
                    <input
                      type="datetime-local"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      required
                      className="w-full border border-gray-200 p-2 text-xs rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1.5 text-gray-700">Ends</label>
                    <input
                      type="datetime-local"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      required
                      className="w-full border border-gray-200 p-2 text-xs rounded-md text-gray-900 focus:outline-none focus:ring-1 focus:ring-black focus:border-black transition-all"
                    />
                  </div>
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
                    {isSubmitting ? 'Saving...' : (initialData ? 'Sync' : 'Launch')}
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