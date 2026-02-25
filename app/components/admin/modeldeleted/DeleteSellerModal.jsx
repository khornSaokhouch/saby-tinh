'use client';
import { ShieldAlert, X, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DeleteSellerModal({ isOpen, onClose, onConfirm, isDeleting, sellerName }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden"
                >
                    <div className="p-8">
                        <div className="flex justify-between items-start mb-6">
                            <div className="p-3 bg-rose-50 rounded-2xl text-rose-600">
                                <ShieldAlert size={28} />
                            </div>
                            <button 
                                onClick={onClose}
                                className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-2 mb-8">
                            <h3 className="text-xl font-bold text-slate-900 tracking-tight">Reject Request?</h3>
                            <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                You are about to reject the registration request from <span className="text-slate-900 font-bold">"{sellerName}"</span>. 
                                This will remove their data and notify them via email.
                            </p>
                        </div>

                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3 mb-8">
                            <AlertTriangle className="text-amber-600 shrink-0" size={18} />
                            <p className="text-xs font-bold text-amber-700 uppercase tracking-wider leading-normal">
                                This action is permanent and will remove all associated documents.
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={onClose}
                                className="flex-1 py-4 text-[10px] font-black text-emerald-600 hover:text-emerald-700 uppercase tracking-widest transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={onConfirm}
                                disabled={isDeleting}
                                className="flex-[2] py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-rose-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                            >
                                {isDeleting ? (
                                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                                ) : (
                                    "Reject Request"
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
