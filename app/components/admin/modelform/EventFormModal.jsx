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
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-[20px] shadow-2xl w-full max-w-4xl border border-slate-100 overflow-hidden flex flex-col md:flex-row"
          >
              {/* Image Section */}
              <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col items-center justify-center border-r border-slate-100">
                <div className="relative group w-full aspect-video md:aspect-square rounded-2xl overflow-hidden border-2 border-dashed border-slate-200 bg-white flex flex-col items-center justify-center hover:border-indigo-400 transition-all cursor-pointer">
                  {preview ? (
                    <img src={preview} className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="mx-auto text-slate-300 mb-2" size={32} />
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Select Banner</span>
                    </div>
                  )}
                  <input type="file" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                </div>
                <p className="mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Recommended: 1200x600px</p>
              </div>

              {/* Form Section */}
              <div className="w-full md:w-7/12 p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                    <Calendar size={20} strokeWidth={2.5} />
                  </div>
                  <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                    <X size={18} />
                  </button>
                </div>

                <div className="space-y-1 mb-6">
                  <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">{initialData ? "Edit Campaign" : "New Campaign"}</h3>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                    Configure the promotional event details, banner, and duration.
                  </p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="space-y-4">
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Event Title</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-100 transition-all outline-none"
                      placeholder="e.g. Black Friday 2025"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Meta Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full h-24 px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-[11px] font-medium text-slate-700 focus:bg-white focus:border-indigo-100 transition-all resize-none outline-none"
                      placeholder="Brief details about the event..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Starts</label>
                      <input
                        type="datetime-local"
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-100 transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Ends</label>
                      <input
                        type="datetime-local"
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        required
                        className="w-full px-3 py-2 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-900 focus:bg-white focus:border-indigo-100 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="button" onClick={onClose} className="flex-1 py-2 text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all">Discard</button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-[2] py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <Check size={14} strokeWidth={3} />}
                      {initialData ? "Update Record" : "Save Event"}
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