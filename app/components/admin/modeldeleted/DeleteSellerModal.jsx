'use client';
import { ShieldAlert, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteSellerModal({ isOpen, onClose, onConfirm, isDeleting, sellerName }) {
    if (!isOpen) return null;

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
            className="bg-white border text-gray-900 border-gray-100 rounded-xl shadow-2xl w-full max-w-[350px] p-5 relative z-10"
          >
            <h2 className="text-base font-bold mb-3 border-b border-gray-100 pb-2 flex items-center gap-2 text-rose-600">
              <ShieldAlert size={16} strokeWidth={2.5} />
              Reject Partner?
            </h2>

            <div className="space-y-4 mb-4">
              <p className="text-xs text-gray-600 leading-relaxed">
                Denying <span className="text-gray-900 font-bold">"{sellerName}"</span> will remove their application and notify the merchant via email.
              </p>

              <div className="p-3 bg-red-50 rounded-md border border-red-100 flex gap-2 items-start">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={14} />
                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest leading-normal">
                  This action cannot be reversed within the current cycle.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-md border border-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-md bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <><Loader2 size={12} className="animate-spin" /> Rejecting...</>
                ) : (
                  "Confirm Reject"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    );
}