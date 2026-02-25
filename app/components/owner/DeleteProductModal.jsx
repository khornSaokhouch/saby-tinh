'use client';

import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteProductModal({ isOpen, onClose, onConfirm, isDeleting, productName }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[160] flex items-center justify-center p-4 overflow-hidden">
          {/* Backdrop blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[40px] shadow-2xl border border-white w-full max-w-md relative z-10 overflow-hidden font-sans"
          >
            {/* Header */}
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center shadow-sm">
                  <AlertTriangle size={24} className="text-rose-600" />
                </div>
                <div className="flex flex-col">
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
                    Delete Product
                  </h2>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">
                    Catalog Management
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-slate-50 text-slate-400 rounded-xl transition-colors disabled:opacity-50"
                disabled={isDeleting}
              >
                <X size={20} />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-[14px] text-slate-600 font-medium leading-relaxed">
                  Are you certain you want to delete the product{' '}
                  <span className="font-bold text-slate-900 underline underline-offset-4 decoration-rose-200">
                    "{productName}"
                  </span>?
                </p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider leading-relaxed">
                  This action will permanently remove this item and all associated stock records from your inventory.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-all active:scale-95"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={onConfirm}
                  className="flex-[1.5] px-4 py-4 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-rose-200 hover:shadow-rose-300 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Delete Item
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
