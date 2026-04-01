import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  X, CheckCircle2, AlertCircle, Loader2, Wallet, ListChecks 
} from 'lucide-react';
import usePayoutStore from '@/stores/usePayoutStore';
import { usePaymentStore } from '@/app/stores/usePaymentStore';

export default function PayoutModal({ store, invoices, totalAmount, onSuccess, onClose }) {
  const { generatePayoutQr, bulkPayout } = usePayoutStore();
  
  // Steps: 'summary' -> 'qr' -> 'result'
  const [step, setStep] = useState('summary');
  
  const [qrData, setQrData] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [payoutResult, setPayoutResult] = useState(null);
  const [payoutError, setPayoutError] = useState(null);

  const handleGenerateQr = async () => {
    setQrLoading(true);
    setQrError(null);
    try {
      const res = await generatePayoutQr(store?.id, totalAmount, 'USD');
      if (res.success) {
        setQrData(res.data);
        setStep('qr');
      }
    } catch (err) {
      setQrError(err.message || 'Failed to generate QR code.');
    } finally {
      setQrLoading(false);
    }
  };

  const { checkBakongStatus } = usePaymentStore();

  const handleMarkAsPaid = React.useCallback(async () => {
    setSubmitting(true);
    setPayoutError(null);
    try {
      const result = await bulkPayout(invoices, store?.id, 'USD', 2);
      setPayoutResult(result);
      setStep('result');
      if (result.failed === 0) {
        onSuccess?.();
      }
    } catch (err) {
      setPayoutError(err.message || 'Payout failed. Please try again.');
      setStep('result');
    } finally {
      setSubmitting(false);
    }
  }, [invoices, store?.id, bulkPayout, onSuccess]);

  React.useEffect(() => {
    if (step !== 'qr' || !qrData?.md5) return;

    const poller = setInterval(async () => {
      try {
        const res = await checkBakongStatus(qrData.md5);
        if (res.success && res.status === 'success') {
          clearInterval(poller);
          // Auto-confirm the payout once Bakong network says it's paid
          handleMarkAsPaid();
        }
      } catch (e) {
        // ignore polling network errors
      }
    }, 5000);

    return () => clearInterval(poller);
  }, [step, qrData, checkBakongStatus, handleMarkAsPaid]);

  const isSuccess = payoutResult && payoutResult.failed === 0;
  const isPartial = payoutResult && payoutResult.failed > 0 && payoutResult.success;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={!submitting ? onClose : undefined} />

      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.95, y: 16 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 16 }}
        transition={{ type: 'spring', damping: 20 }}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white shadow-lg">
              <Wallet size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 tracking-tight">Process Payout</h2>
              <p className="text-[10px] text-slate-400 font-medium">{store?.name || 'Merchant'}</p>
            </div>
          </div>
          {!submitting && (
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-all">
              <X size={14} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {qrError && step === 'summary' && (
            <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl p-3">
              <AlertCircle size={14} className="text-rose-500 shrink-0" />
              <p className="text-[11px] text-rose-600 font-medium">{qrError}</p>
            </div>
          )}

          {step === 'summary' && (
            <>
              {/* Invoice list */}
              <div className="rounded-2xl border border-slate-100 overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <ListChecks size={13} className="text-slate-400" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {invoices.length} Eligible Invoice{invoices.length > 1 ? 's' : ''}
                  </span>
                </div>
                <div className="max-h-48 overflow-y-auto divide-y divide-slate-50">
                  {invoices.map((inv) => (
                    <div key={inv.id} className="flex items-center justify-between px-4 py-2.5">
                      <div>
                        <p className="text-[11px] font-bold text-slate-700 leading-tight">{inv.invoice_number}</p>
                        <p className="text-[9px] text-slate-400 font-medium">{inv.order?.user?.name || 'Guest'}</p>
                      </div>
                      <span className="text-xs font-bold text-emerald-600">
                        ${parseFloat(inv.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100">
                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Total Payout</span>
                <span className="text-xl font-black text-emerald-700">
                  ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  <span className="text-[10px] font-bold text-emerald-400 ml-1">USD</span>
                </span>
              </div>
            </>
          )}

          {step === 'qr' && (
             <div className="flex flex-col items-center w-full max-w-[280px] mx-auto relative min-h-[280px] justify-center rounded-2xl overflow-hidde mb-4">
                {qrLoading ? (
                  <div className="flex flex-col items-center justify-center w-full h-[280px]">
                    <Loader2 className="w-8 h-8 animate-spin text-slate-300 mb-4" />
                    <p className="text-sm font-medium text-slate-500">Generating KHQR...</p>
                  </div>
                ) : qrData?.qr_image ? (
                  <img 
                    src={qrData.qr_image} 
                    alt="Bakong KHQR" 
                    className="w-full h-auto max-h-[280px] object-contain block"
                  />
                ) : (
                  <span className="text-xs text-slate-400">No QR Available</span>
                )}
             </div>
          )}

          {step === 'result' && (
            <>
              {isSuccess && (
                <div className="flex flex-col items-center py-4 gap-2 text-center border-b border-slate-50 pb-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Payout Processed!</p>
                  <p className="text-[11px] text-slate-400">
                    {payoutResult.total} invoice{payoutResult.total > 1 ? 's' : ''} paid out successfully.
                  </p>
                </div>
              )}

              {isPartial && (
                <div className="flex flex-col items-center py-4 gap-2 text-center border-b border-slate-50 pb-6">
                  <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center">
                    <AlertCircle size={28} className="text-orange-500" />
                  </div>
                  <p className="text-sm font-bold text-slate-900">Partially Processed</p>
                  <p className="text-[11px] text-slate-400">
                    {payoutResult.total - payoutResult.failed} succeeded · {payoutResult.failed} failed. Check console.
                  </p>
                </div>
              )}

              {payoutError && !payoutResult && (
                <div className="flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-xl p-3">
                  <AlertCircle size={14} className="text-rose-500 shrink-0" />
                  <p className="text-[11px] text-rose-600 font-medium">{payoutError}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-2 shrink-0">
          {step === 'summary' && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={qrLoading}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateQr}
                disabled={qrLoading || invoices.length === 0}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[11px] font-bold text-white hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
              >
                {qrLoading ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Generating QR...
                  </>
                ) : (
                  <>
                    <Wallet size={13} strokeWidth={3} />
                    Confirm Payout
                  </>
                )}
              </button>
            </div>
          )}

          {step === 'qr' && (
            <div className="flex flex-col gap-2">
               <p className="text-[10px] text-slate-400 text-center mb-1">
                 Scan the QR code above with a KHQR-compatible app, then mark as paid below.
               </p>
               <div className="flex gap-3">
                 <button
                   onClick={() => setStep('summary')}
                   disabled={submitting}
                   className="flex-1 py-2.5 rounded-xl bg-slate-100 text-[11px] font-bold text-slate-600 hover:bg-slate-200 transition-all disabled:opacity-50"
                 >
                   Back
                 </button>
                 <button
                   onClick={handleMarkAsPaid}
                   disabled={submitting}
                   className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-[11px] font-bold text-white hover:opacity-90 transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-md shadow-emerald-100"
                 >
                   {submitting ? (
                     <>
                       <Loader2 size={13} className="animate-spin" />
                       Processing...
                     </>
                   ) : (
                     <>
                       <CheckCircle2 size={13} strokeWidth={3} />
                       Mark as Paid
                     </>
                   )}
                 </button>
               </div>
            </div>
          )}

          {step === 'result' && (
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-slate-900 text-[11px] font-bold text-white hover:bg-slate-800 transition-all shadow-md shadow-slate-200"
            >
              Done
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
