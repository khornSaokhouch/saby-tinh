"use client";
import { useState, useEffect } from "react";
import { X, Loader2, Tag, Check, ChevronDown, Calendar, Percent, DollarSign, Plus } from "lucide-react";
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
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-7 font-sans max-h-[90vh] overflow-y-auto no-scrollbar">
              {/* Header */}
              <div className="flex items-center justify-between mb-7">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {initialData ? "Update Promo Code" : "New Promo Code"}
                  </h2>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Discount Management</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Promo Code */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Promo Code</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm pl-10"
                        placeholder="SAVE20"
                      />
                      <Tag className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                    </div>
                  </div>

                  {/* Discount Type */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Discount Type</label>
                    <div className="flex bg-slate-50 p-1 rounded-xl gap-1 border border-slate-100">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, discount_type: "percentage" })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          formData.discount_type === "percentage"
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Percentage
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, discount_type: "fixed" })}
                        className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                          formData.discount_type === "fixed"
                            ? 'bg-white text-indigo-600 shadow-sm ring-1 ring-slate-200'
                            : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        Fixed Amount
                      </button>
                    </div>
                  </div>

                  {/* Discount Value */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Discount Value</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.discount_value}
                        onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                        required
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm pr-10"
                        placeholder={formData.discount_type === "percentage" ? "20" : "10.00"}
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300">
                        {formData.discount_type === "percentage" ? <Percent size={14} /> : <DollarSign size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Min Order Amount */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Min Order Amount</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={formData.min_order_amount}
                        onChange={(e) => setFormData({ ...formData, min_order_amount: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  {/* Max Discount Amount */}
                  {formData.discount_type === "percentage" && (
                    <div className="col-span-full md:col-span-1">
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Max Discount Cap</label>
                      <input
                        type="number"
                        value={formData.max_discount_amount}
                        onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                        className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                        placeholder="Unlimited"
                      />
                    </div>
                  )}

                  {/* Usage Limits */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Total Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usage_limit}
                      onChange={(e) => setFormData({ ...formData, usage_limit: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                      placeholder="Unlimited"
                    />
                  </div>

                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Per User Limit</label>
                    <input
                      type="number"
                      value={formData.per_user_limit}
                      onChange={(e) => setFormData({ ...formData, per_user_limit: e.target.value })}
                      required
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all shadow-sm"
                      placeholder="1"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Start Date</label>
                    <input 
                      type="date" 
                      value={formData.start_date} 
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} 
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm" 
                    />
                  </div>
                  <div className="col-span-full md:col-span-1">
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">End Date</label>
                    <input 
                      type="date" 
                      value={formData.end_date} 
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} 
                      className="w-full px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all shadow-sm" 
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full h-20 px-5 py-3.5 bg-slate-50/50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/5 outline-none transition-all resize-none shadow-sm"
                    placeholder="Provide details about this discount..."
                  />
                </div>

                {/* Status */}
                <div>
                  <label className="block text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Status</label>
                  <div className="flex bg-slate-50 p-1 rounded-xl gap-1 border border-slate-100 w-1/2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: 1 })}
                      className={`flex-1 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${
                        formData.status === 1 || formData.status === true
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
                        formData.status === 0 || formData.status === false
                          ? 'bg-white text-rose-600 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Disabled
                    </button>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white pb-2">
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
                    {initialData ? "Update Code" : "Create Code"}
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
