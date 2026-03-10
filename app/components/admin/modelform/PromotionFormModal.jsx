"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Percent, Check, ChevronDown, Layers, Plus  } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCategoryStore } from "@/stores/useCategoryStore";

export default function PromotionFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const { categories, fetchCategories } = useCategoryStore();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    discount_percentage: "",
    start_date: "",
    end_date: "",
    status: 1,
    category_ids: [],
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (categories.length === 0) fetchCategories();
      
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
        discount_percentage: initialData?.discount_percentage || "",
        start_date: initialData?.start_date ? initialData.start_date.split(' ')[0] : "",
        end_date: initialData?.end_date ? initialData.end_date.split(' ')[0] : "",
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-7 font-sans">
              {/* Header */}
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {initialData ? "Update Promotion" : "New Promotion"}
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Promotion Settings</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-12 gap-4">
                  <div className="col-span-8">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Promotion Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                      placeholder="Black Friday Sale"
                    />
                  </div>
                  <div className="col-span-4">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Percentage</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.discount_percentage}
                        onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm pr-10"
                        placeholder="20"
                      />
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-20 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all resize-none shadow-sm"
                    placeholder="Briefly explain the promotion strategy..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Start Date</label>
                    <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">End Date</label>
                    <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} required className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 items-end">
                  {/* Status Toggle */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Status</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl gap-1 border border-slate-100">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 1 })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          formData.status === 1
                            ? 'bg-white text-emerald-600 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 0 })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          formData.status === 0
                            ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Inactive
                      </button>
                    </div>
                  </div>

                  {/* Target Categories */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Target Categories</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                        className="w-full flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl hover:bg-white hover:border-indigo-600 transition-all text-left group"
                      >
                        <div className="flex items-center gap-2">
                          <Layers size={14} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                          <span className="text-[11px] font-bold text-slate-700 truncate max-w-[100px]">
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
                              className="absolute bottom-full left-0 w-64 mb-2 bg-white rounded-2xl shadow-2xl border border-slate-100 z-[170] overflow-hidden p-1.5 max-h-[200px] overflow-y-auto no-scrollbar"
                            >
                              <div className="grid grid-cols-1 gap-1">
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
                                      className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all ${isSelected ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'}`}
                                    >
                                      <span className="text-[10px] font-bold uppercase tracking-tight truncate">{cat.name}</span>
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

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={onClose}
                    type="button"
                    className="flex-1 py-4 text-[10px] font-black text-slate-400 hover:text-rose-500 uppercase tracking-[0.2em] transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-slate-200 flex items-center justify-center gap-2 transition-all active:scale-95 hover:bg-black"
                  >
                    {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} strokeWidth={3} />}
                    {initialData ? "Update Promotion" : "Save Promotion"}
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
