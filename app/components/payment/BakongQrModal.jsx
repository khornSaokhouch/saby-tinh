import React, { useEffect, useState } from 'react';

import { Loader2, X, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { usePaymentStore } from '@/app/stores/usePaymentStore';


export default function BakongQrModal({ isOpen, onClose, qrData, orderId, onPaymentSuccess }) {
  const { checkBakongStatus } = usePaymentStore();
  const [status, setStatus] = useState('waiting'); // waiting, success, error
  const [timeLeft, setLeft] = useState(300);

  useEffect(() => {
    if (!isOpen || !qrData?.md5) return;

    const timer = setInterval(() => {
      setLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const poller = setInterval(async () => {
      const res = await checkBakongStatus(qrData.md5);
      if (res.success && res.status === 'success') {
        setStatus('success');
        clearInterval(poller);
        clearInterval(timer);
        setTimeout(() => {
          onPaymentSuccess();
          onClose();
        }, 2000);
      }
    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, [isOpen, qrData, checkBakongStatus, onPaymentSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-[340px] bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Close Button overlapping the image */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/50 transition-colors backdrop-blur-sm"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center w-full relative min-h-[400px] justify-center">
          {status === 'waiting' ? (
            <>
              {/* BACKEND TEMPLATE IMAGE */}
              {qrData?.qr_image ? (
                <img 
                  src={qrData.qr_image} 
                  alt="Bakong KHQR" 
                  className="w-full h-auto object-contain block"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-[400px] bg-white">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-300 mb-4" />
                  <p className="text-sm font-medium text-slate-500">Generating KHQR...</p>
                </div>
              )}

              {/* TIMER overlay */}
              {qrData?.qr_image && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-[0_8px_16px_rgba(0,0,0,0.12)] border border-slate-100/50">
                  <Timer className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-bold text-slate-700 tabular-nums">
                    {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="py-16 px-6 text-center animate-in fade-in zoom-in-95 w-full bg-white h-[400px] flex flex-col justify-center items-center">
              {status === 'success' ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Paid Successfully</h4>
                  <p className="mt-2 text-sm text-slate-500">Waiting to redirect...</p>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-slate-900">Payment Failed</h4>
                  <p className="mt-2 text-sm text-slate-500">Please try again or use another payment method.</p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}