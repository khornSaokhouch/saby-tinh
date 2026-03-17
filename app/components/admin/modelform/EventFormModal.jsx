"use client";
import { useState, useEffect } from "react";
import { X, Loader2, ImageIcon, Check, Calendar, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-5xl relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Visual Section */}
          <div className="w-full md:w-4/12 bg-slate-50 p-8 flex flex-col items-center justify-start border-r border-slate-100 overflow-y-auto custom-scrollbar">
            <div className="relative group w-full aspect-square rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center hover:border-indigo-400 transition-all cursor-pointer shadow-sm mb-6">
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" alt="Campaign Banner" />
              ) : (
                <div className="text-center">
                  <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Banner</span>
                </div>
              )}
              <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
            </div>
            
            <div className="w-full space-y-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-4 py-3 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-600 transition-all"
                >
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
          </div>

          {/* Configuration Section */}
          <div className="w-full md:w-8/12 p-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                 <Calendar size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {initialData ? 'Update Campaign' : 'New Campaign'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Campaign Configuration</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Title</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                    placeholder="e.g. Seasonal Clearance"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Inherit Configuration From</label>
                  <div className="relative group">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
                    <select
                      value={formData.promotion_id}
                      onChange={(e) => handlePromotionChange(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all appearance-none"
                    >
                      <option value="">Select a base promotion...</option>
                      {promotions.map(promo => (
                        <option key={promo.id} value={promo.id}>
                          {promo.name} ({promo.event_type})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description Override</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-24 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 transition-all resize-none outline-none placeholder:text-slate-400"
                    placeholder="Brief overrides for this specific instance..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Starts</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Ends</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
              </div>

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
                  {initialData ? 'Sync Changes' : 'Launch Campaign'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
      )}
    </AnimatePresence>
  );
}