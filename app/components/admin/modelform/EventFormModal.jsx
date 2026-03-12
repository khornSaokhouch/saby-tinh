"use client";
import { useState, useEffect } from "react";
import { X, Loader2, ImageIcon, Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EventFormModal({ isOpen, onClose, initialData, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    start_date: "",
    end_date: "",
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
      setFormData({
        name: initialData?.name || "",
        description: initialData?.description || "",
        start_date: formatDateForInput(initialData?.start_date),
        end_date: formatDateForInput(initialData?.end_date),
        event_image: null,
      });
      setPreview(initialData?.event_image || null);
    }
  }, [initialData, isOpen]);

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
        className="bg-white rounded-[32px] shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden border border-slate-100"
      >
        <div className="flex flex-col md:flex-row h-full max-h-[90vh]">
          {/* Visual Section */}
          <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100">
            <div className="relative group w-full aspect-video rounded-3xl overflow-hidden border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center hover:border-indigo-400 transition-all cursor-pointer shadow-sm">
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
            <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Campaign Banner (1200x600)</p>
          </div>

          {/* Configuration Section */}
          <div className="w-full md:w-7/12 p-8 overflow-y-auto custom-scrollbar">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-100">
                 <Calendar size={24} strokeWidth={2.5} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {initialData ? 'Update Campaign' : 'New Campaign'}
              </h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Event Details</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Event Title</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400"
                  placeholder="e.g. Black Friday Sale"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full h-24 px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-medium text-slate-700 focus:bg-white focus:border-indigo-600 transition-all resize-none outline-none placeholder:text-slate-400"
                  placeholder="Tell users about this event..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Starts</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-600 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 px-1">Ends</label>
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
                  {initialData ? 'Sync Event' : 'Save Campaign'}
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