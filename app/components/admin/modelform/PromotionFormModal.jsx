"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Percent, Check, ChevronDown, Layers, Plus, Megaphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/useCategoryStore";

export default function PromotionFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
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

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="p-8 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
               <Megaphone size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Update Promotion' : 'New Promotion'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Campaign Strategy</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="col-span-1">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Campaign Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Summer Blowout"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Type</label>
                  <select
                    value={formData.event_type}
                    onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  >
                    <option value="promotion">Promotion</option>
                    <option value="offer">Offer</option>
                    <option value="seasonal">Seasonal</option>
                    <option value="global-event">Global Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Priority Level</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Discount Type</label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  >
                    <option value="none">None</option>
                    <option value="percentage">Percentage %</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Discount Value</label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={formData.discount_type === 'none'}
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) })}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all disabled:opacity-50"
                    placeholder="0.00"
                  />
                </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-20 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 transition-all resize-none outline-none placeholder:text-slate-400"
                placeholder="Details about this promotion catalog..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Starts</label>
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Ends</label>
                <input 
                  type="date" 
                  value={formData.end_date} 
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                  required 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Status</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 1 })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.status === 1 ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Active
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, status: 0 })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.status === 0 ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Disabled
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Target Segments</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                    className="w-full flex items-center justify-between px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-100 hover:bg-white transition-all text-left group"
                  >
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                      <span className="text-[12px] font-bold text-slate-700 truncate max-w-[80px]">
                        {formData.category_ids.length > 0 
                          ? `${formData.category_ids.length} Selected` 
                          : "Select Categories"}
                      </span>
                    </div>
                    <ChevronDown size={14} className={`text-slate-400 transition-transform duration-300 ${isCategoryOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isCategoryOpen && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          className="fixed inset-0 z-[160]" onClick={() => setIsCategoryOpen(false)} 
                        />
                        <motion.div
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          className="absolute bottom-full left-0 w-64 mb-4 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[170] overflow-hidden p-2 max-h-[200px] overflow-y-auto custom-scrollbar"
                        >
                          <div className="space-y-1">
                            {categories.map((cat) => {
                              const isSelected = formData.category_ids.includes(cat.id);
                              return (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => {
                                    const newIds = isSelected
                                      ? formData.category_ids.filter(id => id !== cat.id)
                                      : [...formData.category_ids, cat.id];
                                    setFormData({ ...formData, category_ids: newIds });
                                  }}
                                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                >
                                  <span className="text-[10px] font-black uppercase tracking-tight truncate">{cat.name}</span>
                                  {isSelected && <Check size={12} strokeWidth={3} />}
                                </button>
                              );
                            })}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              <button
                onClick={onClose}
                type="button"
                className="flex-1 py-3.5 rounded-2xl text-[10px] font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 uppercase tracking-widest transition-all active:scale-95"
              >
                Back
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
                {initialData ? 'Sync Promotion' : 'Save Strategy'}
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
