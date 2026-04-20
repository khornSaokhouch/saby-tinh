"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CheckCircle2, ShoppingBag, ArrowRight, Package, 
  MapPin, CreditCard, Calendar, Truck, ChevronRight 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { fetchOrderById } = useShopOrderStore();
  const { language } = useLanguageStore();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId).then(data => {
        setOrder(data);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [orderId, fetchOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium italic animate-pulse">{t('Verifying your order...', language)}</p>
        </div>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{t('Order Not Found', language)}</h2>
          <p className="text-slate-500 mb-6">{t('We could not retrieve the details for this order.', language)}</p>
          <button onClick={() => router.push('/')} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">
            {t('Go Home', language)}
          </button>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 font-sans">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-2xl mx-auto"
      >
        {/* Success Header */}
        <motion.div variants={itemVariants} className="text-center mb-6">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 bg-emerald-100 rounded-full animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite] opacity-75"></div>
            <div className="relative bg-emerald-500 w-full h-full rounded-full flex items-center justify-center shadow-md shadow-emerald-500/20">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1 tracking-tight">{t('Submission Success!', language)}</h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            {t('Thank you for your purchase. Your order is being processed and you will receive updates soon.', language)}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Main Info */}
          <div className="lg:col-span-3 space-y-4">
            {/* Order Items */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Package className="text-indigo-600" size={16} />
                  <h3 className="font-bold text-slate-900 text-sm">{t('Order Items', language)}</h3>
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {order.order_lines?.length} {t('Items', language)}
                </span>
              </div>
              <div className="divide-y divide-slate-50">
                {order.order_lines?.map((item, idx) => (
                  <div key={idx} className="p-3 flex gap-3 group">
                    <div className="w-14 h-14 rounded-xl bg-slate-50 overflow-hidden flex-shrink-0 border border-slate-100">
                      <img 
                        src={item.product_item_variant?.product_item?.product?.images?.[0]?.image_path || '/placeholder-product.png'} 
                        alt="Product"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-900 text-sm truncate mb-0.5">
                        {item.product_item_variant?.product_item?.product?.name || 'Product'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] font-semibold text-slate-400">
                        <span>Qty: {item.quantity}</span>
                        {item.product_item_variant?.color && (
                          <span className="flex items-center gap-1 uppercase tracking-tighter">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.product_item_variant.color.hex_code }}></span>
                            {item.product_item_variant.color.color_name}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col justify-center">
                      <div className="font-black text-slate-900 text-sm">${parseFloat(item.price).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Shipping Info */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
              <div className="flex items-center gap-2 mb-3 text-indigo-600">
                <Truck size={16} />
                <h3 className="font-bold text-slate-900 text-sm">{t('Shipping Details', language)}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <MapPin size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{t('Destination', language)}</p>
                    <p className="text-xs font-bold text-slate-700 leading-snug">
                      {order.shipping_address?.address_line_1 || 'No address provided'}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <Calendar size={14} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{t('Order Date', language)}</p>
                    <p className="text-xs font-bold text-slate-700 leading-snug">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side Summary */}
          <div className="lg:col-span-2 space-y-4">
            <motion.div variants={itemVariants} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-col items-center text-center">
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-500 mb-1">Order Tracking ID</p>
              <div className="bg-indigo-50 px-3 py-1.5 rounded-xl mb-4">
                <span className="text-base font-black text-indigo-600 tracking-wider">#ORD-{order.id}</span>
              </div>

              <div className="w-full space-y-2 mb-5">
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400">{t('Subtotal', language)}</span>
                  <span className="text-xs font-black text-slate-900">${parseFloat(order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-1.5 border-b border-slate-50">
                  <span className="text-xs font-bold text-slate-400">{t('Shipping', language)}</span>
                  <span className="text-xs font-black text-slate-900">${parseFloat(order.shipping_fee || 0).toFixed(2)}</span>
                </div>
                {parseFloat(order.discount_amount) > 0 && (
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-50 text-rose-500">
                    <span className="text-xs font-bold">{t('Discount', language)}</span>
                    <span className="text-xs font-black">-${parseFloat(order.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-sm font-black text-slate-900">{t('Grand Total', language)}</span>
                  <span className="text-xl font-black text-indigo-600">${parseFloat(order.order_total).toFixed(2)}</span>
                </div>
              </div>

              <div className="w-full space-y-2">
                <button
                  onClick={() => router.push('/orders')}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag size={16} />
                  {t('Manage Orders', language)}
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/')}
                  className="w-full py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl font-bold text-sm transition-all"
                >
                  {t('Continue Shopping', language)}
                </button>
              </div>
            </motion.div>

            {/* Quick Summary Card */}
            <motion.div variants={itemVariants} className="bg-indigo-600 rounded-2xl shadow-md p-5 text-white relative overflow-hidden">
               <div className="absolute top-0 right-0 p-2 opacity-10">
                 <ShoppingBag size={80} strokeWidth={1} />
               </div>
               <div className="relative z-10">
                 <h4 className="text-base font-black mb-1">{t('Order Placed!', language)}</h4>
                 <p className="text-indigo-100 text-xs leading-relaxed mb-4 font-medium">
                   {t('Your items are being secured. We will notify you once they are shipped.', language)}
                 </p>
                 <div className="flex items-center gap-2 text-indigo-200">
                    <CreditCard size={14} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{order.payment_method?.provider || 'Secure Payment'}</span>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-8 h-8 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
