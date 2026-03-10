import React, { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm font-sans">
      <div className="relative w-full max-w-sm bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
   {/* CUSTOM KHQR RED HEADER */}
<div 
  className="relative bg-red-600 h-28 flex items-center justify-center pt-2"
  style={{ 
    // This creates the sharp slanted cut seen in your design
    clipPath: "polygon(0 0, 100% 0, 100% 68%, 88% 100%, 0 100%)" 
  }}
>
  {/* Logo Image (from your image import) */}
  <img
    src='/img/header.png'
    alt="KHQR Logo"
    className="h-10 w-auto object-contain brightness-0 invert" 
  />

  {/* Close Button */}
  <button
    onClick={onClose}
    className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
  >
    <X size={20} />
  </button>
</div>

        {/* MERCHANT & AMOUNT INFO */}
        <div className="px-8 pt-8 pb-4 text-center">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
             Payment to Saby-tinh Store
          </p>
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-3xl font-black text-slate-900 tabular-nums">
                  {Number(qrData?.amount).toLocaleString()}
              </span>
              <span className="text-sm font-bold text-slate-500 uppercase">
                  {qrData?.currency || 'USD'}
              </span>
            </div>
            
            {(qrData?.discount_amount > 0) && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] font-bold text-slate-400 line-through">
                  ${Number(qrData?.original_total).toLocaleString()}
                </span>
                <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[9px] font-black rounded-md uppercase">
                  -${Number(qrData?.discount_amount).toLocaleString()} OFF
                </span>
              </div>
            )}
          </div>
        </div>

        {/* DASHED SEPARATOR */}
        <div className="px-6 py-2">
           <div className="border-t-2 border-dashed border-slate-100 w-full" />
        </div>

        {/* QR CODE SECTION */}
        <div className="p-8 flex flex-col items-center">
          {status === 'waiting' ? (
            <>
              <div className="relative p-2 bg-white rounded-2xl shadow-sm border border-slate-50">
                <QRCodeSVG 
                    value={qrData?.qr_string || ""} 
                    size={210} 
                    level="H" 
                    imageSettings={{
                        src: "/img/bakong.png", // Your central Bakong logo
                        height: 40,
                        width: 40,
                        excavate: true,
                    }}
                />
              </div>

              {/* TIMER */}
              <div className="mt-8 flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 rounded-full border border-slate-100">
                <Timer className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-bold text-slate-600 tabular-nums">
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
            </>
          ) : (
            <div className="py-12 text-center animate-in fade-in zoom-in-95">
              {status === 'success' ? (
                <>
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900">Paid Successfully</h4>
                </>
              ) : (
                <>
                  <AlertCircle className="w-16 h-16 text-rose-500 mx-auto mb-4" />
                  <h4 className="text-lg font-bold text-slate-900">Payment Failed</h4>
                </>
              )}
            </div>
          )}
        </div>

        {/* FOOTER VERIFICATION */}
        <div className="bg-slate-50/50 p-6 border-t border-slate-50 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">
              Verifying Transaction
            </span>
          </div>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">
            Please scan this QR via your mobile banking app
          </p>
        </div>
      </div>
    </div>
  );
}