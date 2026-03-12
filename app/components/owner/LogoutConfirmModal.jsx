import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, AlertTriangle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function LogoutConfirmModal({ isOpen, onClose, onConfirm, isLoggingOut }) {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-8 font-sans">
              <div className="flex flex-col items-center text-center mb-8">
                <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center text-white mb-4 shadow-lg shadow-rose-100">
                  <LogOut size={24} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  Sign Out?
                </h2>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Session Termination</p>
              </div>

              <div className="space-y-4 mb-8">
                <p className="text-[13px] font-medium text-slate-500 text-center leading-relaxed">
                  Are you sure you want to sign out of your account?
                </p>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                  <AlertTriangle className="text-amber-600 shrink-0" size={16} />
                  <p className="text-[10px] font-black text-amber-700 uppercase tracking-widest leading-normal">
                    Any unsaved changes in current forms may be lost.
                  </p>
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
                  onClick={handleConfirm}
                  disabled={loading || isLoggingOut}
                  className="flex-[2] py-3.5 bg-rose-500 text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-rose-100 flex items-center justify-center gap-2 transition-all active:scale-[0.95] hover:bg-rose-600 disabled:opacity-70"
                >
                  {(loading || isLoggingOut) ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    "Confirm Sign Out"
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
