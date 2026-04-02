import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X, CheckCircle2, AlertCircle, Timer, QrCode } from 'lucide-react';
import { usePaymentStore } from '@/app/stores/usePaymentStore';

export default function BakongQrModal({ isOpen, onClose, qrData, orderId, onPaymentSuccess }) {
  const { checkBakongStatus } = usePaymentStore();
  const [status, setStatus] = useState('waiting'); // waiting, success, error
  const [timeLeft, setLeft] = useState(300);

  useEffect(() => {
    if (!isOpen || !qrData?.md5) return;

    // Reset status and timer when reopening
    setStatus('waiting');
    setLeft(300);

    const timer = setInterval(() => {
      setLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const poller = setInterval(async () => {
      try {
        const res = await checkBakongStatus(qrData.md5);
        if (res.success && res.status === 'success') {
          setStatus('success');
          clearInterval(poller);
          clearInterval(timer);
          setTimeout(() => {
            onPaymentSuccess();
            onClose();
          }, 2500);
        }
      } catch (err) {
        // Silently handle polling errors
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, [isOpen, qrData, checkBakongStatus, onPaymentSuccess, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={status === 'waiting' ? onClose : undefined} 
          />

          <motion.div
            className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-[340px] overflow-hidden flex flex-col"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-white shadow-lg shadow-rose-100">
                  <QrCode size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 tracking-tight">Bakong KHQR</h2>
                  <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Scan to Pay</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-all"
              >
                <X size={14} />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 flex flex-col items-center">
              {status === 'waiting' ? (
                <>
                  <div className="relative w-full aspect-square overflow-hidden flex items-center justify-center">
                    {qrData?.qr_image ? (
                      <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        src={qrData.qr_image}
                        alt="Bakong KHQR"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 animate-spin text-rose-300 mb-3" />
                        <p className="text-xs font-semibold text-slate-400">Generating QR Code...</p>
                      </div>
                    )}
                  </div>

                  {qrData?.deeplink && (
                    <motion.a
                      href={qrData.deeplink}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 w-full py-3 bg-[#E11D48] text-white rounded-2xl flex items-center justify-center gap-2 font-bold text-xs shadow-lg shadow-rose-100 hover:opacity-90 transition-all active:scale-95"
                    >
                      <img src="https://bakong.nbc.gov.kh/images/logo.svg" alt="Bakong" className="w-4 h-4 brightness-0 invert" />
                      Open in Bakong App
                    </motion.a>
                  )}

                  {/* Timer */}
                  <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-full border border-slate-100 shadow-sm">
                    <Timer size={14} className="text-rose-500" />
                    <span className="text-sm font-bold text-slate-700 tabular-nums">
                      {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-3 text-[10px] text-slate-400 font-medium text-center">
                    Please complete the payment within 5 minutes
                  </p>
                </>
              ) : (
                <div className="py-10 flex flex-col items-center text-center w-full animate-in fade-in zoom-in-95 duration-500">
                  {status === 'success' ? (
                    <>
                      <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Payment Successful</h4>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        Your payment has been verified.<br />Redirecting to order details...
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
                        <AlertCircle className="w-10 h-10 text-rose-500" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">Payment Failed</h4>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed">
                        Something went wrong during the payment process.<br />Please try again.
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Hint Footer */}
            <div className="px-6 pb-8 pt-2">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] text-slate-500 font-medium text-center leading-tight">
                   Use any KHQR-supported banking app<br />to scan the code above.
                 </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
