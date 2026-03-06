import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Loader2, X, CheckCircle2, AlertCircle, Timer } from 'lucide-react';
import { usePaymentStore } from '@/app/stores/usePaymentStore';

export default function BakongQrModal({ isOpen, onClose, qrData, orderId, onPaymentSuccess }) {
  const { checkBakongStatus } = usePaymentStore();
  const [status, setStatus] = useState('waiting'); // waiting, success, error
  const [timeLeft, setLeft] = useState(300); // 5 minutes

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
    }, 5000); // Poll every 5 seconds

    return () => {
      clearInterval(timer);
      clearInterval(poller);
    };
  }, [isOpen, qrData, checkBakongStatus, onPaymentSuccess, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 text-center border-b border-slate-50">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
             {/* Bakong Logo Placeholder or Icon */}
             <div className="text-red-600 font-black text-xl italic">Bakong</div>
          </div>
          <h3 className="text-xl font-bold text-slate-900">Scan to Pay</h3>
          <p className="text-sm text-slate-500 mt-1">Order #{orderId}</p>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center">
          
          {status === 'waiting' && (
            <>
              <div className="relative p-6 bg-white rounded-3xl shadow-inner border border-slate-100 mb-6 group transition-all hover:scale-105">
                <div className="absolute inset-0 bg-indigo-500/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCodeSVG 
                    value={qrData?.qr_string || ""} 
                    size={200} 
                    level="H" 
                    includeMargin={false}
                    className="relative z-10"
                />
              </div>

              <div className="flex items-center gap-2 mb-8 px-4 py-2 bg-slate-50 rounded-full border border-slate-100">
                <Timer className="w-4 h-4 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
                <div className="w-px h-3 bg-slate-200 mx-1" />
                <span className="text-xs font-medium text-slate-400">Expires soon</span>
              </div>

              <div className="w-full space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Amount to Pay</span>
                  <span className="font-bold text-slate-900">
                    {qrData?.currency === 'USD' ? '$' : '៛'}
                    {Number(qrData?.amount).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500">Network</span>
                  <span className="font-bold text-red-600">Bakong KHQR</span>
                </div>
              </div>
            </>
          )}

          {status === 'success' && (
            <div className="py-12 flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-100 ring-8 ring-emerald-50/50">
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">Payment Confirmed!</h4>
              <p className="text-slate-500">Your transaction was successful. Redirecting...</p>
            </div>
          )}

          {status === 'error' && (
            <div className="py-12 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-10 h-10 text-rose-500" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Payment Failed</h4>
              <p className="text-sm text-slate-500 mb-6">Something went wrong with the transaction.</p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50/50 border-t border-slate-50 flex flex-col items-center gap-2">
           <div className="flex items-center gap-2">
             <Loader2 className="w-3 h-3 animate-spin text-indigo-600" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Awaiting Verification</span>
           </div>
           <p className="text-[9px] text-slate-400 max-w-[200px] text-center">
             Open your mobile banking app to scan the KHQR and authorize payment.
           </p>
        </div>
      </div>
    </div>
  );
}
