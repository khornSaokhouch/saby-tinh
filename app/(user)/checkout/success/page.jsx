"use client";

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-xl p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
          <div className="relative bg-emerald-500 w-full h-full rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <CheckCircle2 className="w-16 h-16 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Payment Successful!</h1>
        <p className="text-slate-500 font-medium leading-relaxed mb-8">
          Thank you for your purchase. We have received your Bakong payment and your order is now being processed.
          {orderId && <span className="block mt-3 text-lg">Order ID: <strong className="text-slate-900">#{orderId}</strong></span>}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-2xl font-bold transition-all shadow-md shadow-slate-900/10 flex items-center justify-center gap-2 group"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="animate-pulse text-slate-400 font-medium italic">Loading success details...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
