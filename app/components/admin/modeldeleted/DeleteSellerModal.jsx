'use client';
import { ShieldAlert, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteSellerModal({ isOpen, onClose, onConfirm, isDeleting, sellerName }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[20px] shadow-2xl w-full max-w-sm border border-slate-100 overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-2 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
                                <ShieldAlert size={20} strokeWidth={2.5} />
                            </div>
                            <button onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                                <X size={18} />
                            </button>
                        </div>

                        <div className="space-y-1 mb-6">
                            <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase italic">Reject Partner?</h3>
                            <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                                Denying <span className="text-slate-900 font-black">"{sellerName}"</span> will remove their application and notify the merchant via email.
                            </p>
                        </div>

                        <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 flex gap-2 mb-6">
                            <AlertTriangle className="text-amber-600 shrink-0" size={14} />
                            <p className="text-[9px] font-black text-amber-700 uppercase tracking-widest leading-normal">
                                This action cannot be reversed.
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={onClose}
                                className="flex-1 py-2 text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                            >
                                Back
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-[2] py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-rose-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-3 h-3 animate-spin text-white" />
                                ) : (
                                    "Confirm Reject"
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}