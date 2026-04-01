'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import usePayoutStore from '@/stores/usePayoutStore';
import { 
  ArrowLeft, Calendar, CreditCard, Hash, 
  ExternalLink, CheckCircle2, AlertCircle, Clock,
  FileText, Store, Wallet, DollarSign, RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

function PayoutDetailsContent() {
  const { language } = useLanguageStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = searchParams.get('id');
  
  const { fetchPayoutDetail, loading, error } = usePayoutStore();
  const [payout, setPayout] = useState(null);

  useEffect(() => {
    if (id) {
      loadPayout();
    }
  }, [id]);

  const loadPayout = async () => {
    try {
      const res = await fetchPayoutDetail(id);
      if (res.success) {
        setPayout(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const containerRef = React.useRef();

  const handlePrint = () => {
    window.print();
  };

  if (loading && !payout) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
        <p className="text-sm font-bold uppercase tracking-widest">{t('Loading receipt...', language)}</p>
      </div>
    );
  }

  if (error || (!loading && !payout)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <AlertCircle className="w-12 h-12 mb-4 text-rose-400" />
        <p className="text-lg font-bold text-slate-600 mb-2">{t('Payout Not Found', language)}</p>
        <button 
          onClick={() => router.back()}
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-md"
        >
          {t('Go Back', language)}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-slate-900 font-bold transition-all"
        >
          <ArrowLeft size={16} />
          <span className="text-xs uppercase tracking-widest">{t('All Payouts', language)}</span>
        </button>
        
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-600 hover:border-emerald-500 hover:text-emerald-600 transition-all shadow-sm active:scale-95"
        >
          <ExternalLink size={14} />
          {t('Print Receipt', language)}
        </button>
      </div>

      {/* Main Receipt Paper */}
      <div 
        ref={containerRef}
        className="bg-white rounded-[32px] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
      >
        {/* Top Decorative Bar */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-400 w-full" />
        
        <div className="p-10 md:p-14 space-y-12">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-[20px] font-black text-slate-900 uppercase tracking-tighter leading-none">
                  Saby-Tinh
                </span>
                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.2em] mt-1.5">
                  Platform Settlement
                </span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 inline-block">
                 <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('Receipt Number', language)}</p>
                 <p className="text-sm font-black text-slate-900">#PAY-{payout.id.toString().padStart(6, '0')}</p>
              </div>
            </div>

            <div className="text-right flex flex-col items-end gap-2 text-wrap max-w-[250px]">
               <div className={`px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest inline-flex items-center gap-1.5
                 ${payout.payment_status_id === 2 ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-orange-50 border-orange-200 text-orange-600'}`}>
                 <span className={`w-1 h-1 rounded-full ${payout.payment_status_id === 2 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                 {payout.status?.status || t('Pending', language)}
               </div>
               <p className="text-xs font-bold text-slate-400">
                 {payout.paid_at ? format(new Date(payout.paid_at), 'PPP') : t('Awaiting Confirmation', language)}
               </p>
            </div>
          </div>

          {/* Parties Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 border-y border-slate-50 py-10">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Beneficiary', language)}</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                  <img 
                    src={payout.store?.store_image || 'https://via.placeholder.com/100'} 
                    alt="Merchant" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">{payout.store?.name}</h3>
                  <p className="text-[11px] font-medium text-slate-500">{t('Store Owner ID', language)} #{payout.store?.user_id}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-left md:text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Settlement Method', language)}</p>
              <div className="inline-flex items-center gap-3 justify-end">
                <div className="text-right">
                  <h3 className="text-[13px] font-black text-slate-900 leading-tight">Bakong KHQR Payment</h3>
                  <p className="text-[10px] font-medium text-slate-500">Real-time Transfer</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                  <Wallet size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Section */}
          <div className="space-y-6">
            <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">{t('Settlement Breakdown', language)}</h4>
            <div className="bg-slate-50/50 rounded-[24px] border border-slate-100 overflow-hidden">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-slate-100">
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Description', language)}</th>
                     <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Amount', language)}</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   <tr>
                     <td className="px-6 py-5">
                       <div>
                         <p className="text-[12px] font-bold text-slate-800">
                           {t('Invoice Settlement', language)} - {payout.invoice?.invoice_number}
                         </p>
                         <p className="text-[10px] text-slate-400 mt-1">
                           {t('Full payout for customer order', language)} #{payout.invoice?.order?.order_number}
                         </p>
                       </div>
                     </td>
                     <td className="px-6 py-5 text-right font-black text-slate-900 text-sm">
                       {payout.currency === 'USD' ? '$' : ''}
                       {parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                       {payout.currency === 'KHR' ? ' ៛' : ''}
                     </td>
                   </tr>
                 </tbody>
                 <tfoot>
                   <tr className="bg-emerald-50/30">
                     <td className="px-6 py-6 text-[11px] font-black text-emerald-700 uppercase tracking-widest">{t('Total Settlement', language)}</td>
                     <td className="px-6 py-6 text-right">
                       <span className="text-2xl font-black text-emerald-700">
                         {payout.currency === 'USD' ? '$' : ''}
                         {parseFloat(payout.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                         {payout.currency === 'KHR' ? ' ៛' : ''}
                       </span>
                     </td>
                   </tr>
                 </tfoot>
               </table>
            </div>
          </div>

          {/* Footer Section */}
          <div className="pt-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-6">
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{t('Transaction Authenticator', language)}</p>
                <div className="p-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex items-center gap-3">
                   <div className="p-2 bg-white rounded-lg border border-slate-200">
                     <Hash size={14} className="text-indigo-400" />
                   </div>
                   <div className="min-w-0">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Bakong TRN', language)}</p>
                     <p className="text-[11px] font-mono font-bold text-slate-600 truncate">{payout.transaction_reference}</p>
                   </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-slate-500">{t('This is a digitally generated platform receipt and serves as proof of settlement.', language)}</p>
              </div>
            </div>

            {/* Platform Branding/Seal */}
            <div className="flex flex-col items-center md:items-end opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default grayscale hover:grayscale-0">
               <div className="w-16 h-16 border-4 border-double border-emerald-500 rounded-full flex items-center justify-center text-emerald-500 font-black text-[10px] text-center rotate-12 p-1">
                 VERIFIED SETTLEMENT
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Decorative Pattern */}
        <div className="h-10 bg-slate-50/50 flex items-center justify-center gap-1 border-t border-slate-50">
           {Array(20).fill(0).map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           ))}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          .max-w-3xl { max-width: 100% !important; }
          .shadow-2xl { shadow: none !important; }
          .rounded-\[32px\] { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  );
}


export default function PayoutDetailsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
        <RefreshCw className="w-8 h-8 animate-spin mb-4 text-emerald-500" />
      </div>
    }>
      <PayoutDetailsContent />
    </Suspense>
  );
}