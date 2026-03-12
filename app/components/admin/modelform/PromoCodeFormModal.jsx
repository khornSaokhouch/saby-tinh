"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Tag, Check, ChevronDown, Calendar, Percent, DollarSign, Plus, Ticket } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="p-8 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
               <Ticket size={24} strokeWidth={2.5} />
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Update Promo Code' : 'New Promo Code'}
            </h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Promotion Details</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Promo Code */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Promo Code</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    required
                    className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                    placeholder="e.g. FLASH20"
                  />
                  <Tag className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                </div>
              </div>

              {/* Discount Type */}
              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Discount Type</label>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discount_type: "percentage" })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.discount_type === "percentage" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Percentage (%)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, discount_type: "fixed" })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      formData.discount_type === "fixed" ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'
                    }`}
                  >
                    Fixed Amount ($)
                  </button>
                </div>
              </div>

              {/* Discount Value */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Value</label>
                <div className="relative">
                  <input
                    type="number"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                    placeholder="0.00"
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400">
                    {formData.discount_type === "percentage" ? <Percent size={14} /> : <DollarSign size={14} />}
                  </div>
                </div>
              </div>

              {/* Min Order Amount */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Min Order</label>
                <input
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  placeholder="e.g. 50.00"
                />
              </div>

              {/* Date Controls */}
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Start Date</label>
                <input 
                  type="date" 
                  value={formData.start_date} 
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">End Date</label>
                <input 
                  type="date" 
                  value={formData.end_date} 
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all" 
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full h-20 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 transition-all resize-none outline-none"
                placeholder="Details about the promotion..."
              />
            </div>

            {/* Status Toggle */}
            <div className="flex p-1.5 bg-slate-50 rounded-2xl border border-slate-100">
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

            <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
              <button
                type="button"
                onClick={onClose}
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
                {initialData ? 'Sync Details' : 'Create Code'}
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
