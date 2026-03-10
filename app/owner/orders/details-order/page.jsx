"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  ShoppingBag,
  ArrowRight,
  Printer,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");
  const { fetchOrderById, loading: globalLoading } = useShopOrderStore();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId) {
      setError("No order ID provided");
      setLoading(false);
      return;
    }

    const loadOrder = async () => {
      setLoading(true);
      const data = await fetchOrderById(orderId);
      if (data) {
        setOrder(data);
      } else {
        setError("Failed to load order details");
      }
      setLoading(false);
    };

    loadOrder();
  }, [orderId, fetchOrderById]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving Secure Intel...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm">{error || "The system could not locate the requested order records."}</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-3 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
        >
          <ChevronLeft size={18} /> Return to Orders
        </button>
      </div>
    );
  }

  const subtotal = order.order_lines?.reduce((sum, line) => sum + (line.price * line.quantity), 0) || 0;
  const shipping = order.shipping_method?.price || 0;
  const total = parseFloat(order.order_total);

  return (
    <div className="min-h-screen pb-12 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* --- BREADCRUMBS / NAVIGATION --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="space-y-0.5">
            <button 
              onClick={() => router.push("/owner/orders")}
              className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 mb-1 hover:translate-x-1 transition-transform uppercase tracking-widest"
            >
              <ChevronLeft size={12} /> Back to Repository
            </button>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">#ORD-{order.id}</h1>
              {order.invoice && (
                <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-mono font-black border border-indigo-100 shadow-sm">
                  {order.invoice.invoice_number}
                </span>
              )}
              <StatusBadge status={order.order_status?.status || "Pending"} />
            </div>
            <p className="text-[11px] font-medium text-slate-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <Printer size={16} />
            </button>
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
              <MoreVertical size={16} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1" />
            <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[12px] font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
              Update Status <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: ORDER ITEMS & LOGISTICS --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. ORDER ITEMS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-[16px] text-slate-900">Order Manifest</h3>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{order.order_lines?.length || 0} Components</span>
               </div>
               
               <div className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-6 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Integration</th>
                        <th className="px-4 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                        <th className="px-4 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Volume</th>
                        <th className="px-6 py-3.5 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {order.order_lines?.map((line, idx) => {
                        const product = line.product_item_variant?.product_item?.product;
                        const image = product?.images?.[0]?.image || "/placeholder.png";
                        return (
                          <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                  <img src={image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-[13px] font-bold text-slate-900 truncate">{product?.name || "Unknown Interface"}</span>
                                  <span className="text-[9px] font-bold text-indigo-600 mt-0.5 uppercase tracking-widest">
                                    SKU: {line.product_item_variant?.product_item?.sku || `PRO-${line.product_item_variant?.product_item?.id || idx + 1}`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center text-[13px] font-bold text-slate-600">
                              ${parseFloat(line.price).toLocaleString()}
                            </td>
                            <td className="px-4 py-4 text-center text-[13px] font-black text-slate-900 italic">
                               {line.quantity}
                            </td>
                            <td className="px-6 py-4 text-right text-[13px] font-black text-slate-900">
                              ${(line.price * line.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
               </div>
            </motion.div>

            {/* 2. SHIPPING & LOGISTICS */}
            <div className="grid md:grid-cols-2 gap-6">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6">
                  <div className="flex items-center gap-2.5 mb-5">
                    <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
                      <Truck size={18} />
                    </div>
                    <h3 className="font-bold text-[16px]">Logistic Protocol</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Carrier / Method</span>
                          <span className="text-[13px] font-bold text-slate-900">{order.shipping_method?.name || "Express Logistics"}</span>
                       </div>
                       <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[9px] font-black text-indigo-600 italic">ACTIVE</span>
                    </div>
                    
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Delivery Coordinates</span>
                      <div className="flex gap-2.5">
                         <div className="w-7 h-7 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                           <MapPin size={14} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-[13px] font-bold text-slate-900">{order.shipping_address?.province || "N/A"}</span>
                            <span className="text-[11px] font-medium text-slate-500 leading-relaxed mt-0.5">
                               {order.shipping_address?.house_number}, {order.shipping_address?.street}, {order.shipping_address?.commune}, {order.shipping_address?.district}
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
               </motion.div>

               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2.5 mb-5">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CreditCard size={18} />
                      </div>
                      <h3 className="font-bold text-[16px]">Payment Ledger</h3>
                    </div>
                    
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-slate-500">Authorization</span>
                        <PaymentBadge status={order.payment_status?.status || "Pending"} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-slate-500">Source</span>
                        <span className="text-[13px] font-bold text-slate-900">{order.payment_method?.account_name || "Platform Direct"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-slate-500">Reference</span>
                        <span className="text-[11px] font-mono font-bold text-indigo-600 uppercase tracking-tighter truncate max-w-[120px]">
                          {order.user_payments && order.user_payments.length > 0 
                            ? `${order.user_payments[order.user_payments.length - 1].transaction_id}` 
                            : "No Data"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-5 border-t border-slate-50 flex items-center gap-2.5 text-emerald-600 bg-emerald-50/30 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest">
                    <CheckCircle2 size={16} />
                    Verified Transaction
                  </div>
               </motion.div>
            </div>
          </div>

          {/* --- RIGHT: CUSTOMER & FINANCIALS --- */}
          <div className="space-y-6">
              
              {/* CUSTOMER PROFILE */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-6">
                 <div className="flex items-center gap-2.5 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User size={18} />
                    </div>
                    <h3 className="font-bold text-[16px]">Customer Profile</h3>
                  </div>

                  <div className="flex items-center gap-3.5 mb-6">
                     <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-lg font-black text-white italic border-2 border-white shadow-xl">
                        {(order.user?.name || "U").charAt(0).toUpperCase()}
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-[16px] font-black text-slate-900 truncate leading-tight">{order.user?.name || "Anonymous Client"}</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mt-0.5 pointer-events-none">Loyalty Tier 1</span>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-50 group hover:border-indigo-100 transition-colors">
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <Mail size={14} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-600 truncate">{order.user?.email || "not_disclosed@platform.com"}</span>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 border border-slate-50 group hover:border-indigo-100 transition-colors">
                        <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <Phone size={14} />
                        </div>
                        <span className="text-[12px] font-bold text-slate-600">{order.user?.phone_number || "Not Provided"}</span>
                     </div>
                  </div>
              </motion.div>

              {/* FINANCIAL SUMMARY */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-slate-900 rounded-[24px] p-8 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-6 text-white/5 pointer-events-none">
                     <ShoppingBag size={100} strokeWidth={1} />
                  </div>
                  
                  <h3 className="font-black text-lg mb-8 italic tracking-tighter uppercase tracking-widest opacity-40">Financial Ledger</h3>
                  
                  <div className="space-y-4 relative z-10">
                     <div className="flex justify-between items-center text-white/60">
                        <span className="text-[11px] font-bold uppercase tracking-widest">Gross Subtotal</span>
                        <span className="text-[13px] font-black text-white">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center text-white/60">
                        <span className="text-[11px] font-bold uppercase tracking-widest">Logistic Fee</span>
                        <span className="text-[13px] font-black text-emerald-400">${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     
                     <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-1.5">
                        <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em]">Net Settlement</p>
                        <div className="flex items-baseline gap-1.5">
                           <span className="text-4xl font-black tracking-tighter italic">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           <span className="text-[11px] font-bold opacity-30 uppercase tracking-widest truncate">USD</span>
                        </div>
                     </div>
                  </div>
                  
                  <button className="w-full mt-8 py-3.5 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center justify-center gap-2.5">
                     Process Invoice <ArrowRight size={14} />
                  </button>
              </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function OrderDetailsPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Initializing Secure Connection...</p>
      </div>
    }>
      <OrderDetailsContent />
    </React.Suspense>
  );
}

// --- HELPERS ---

function StatusBadge({ status }) {
  const config = {
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Cancelled: { icon: XCircle, style: "bg-rose-50 text-rose-500 border-rose-100" },
  };

  const { icon: Icon, style } = config[status] || config.Pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={12} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'Success';
  
  const style = isPaid 
    ? "text-emerald-500 bg-emerald-50 border-emerald-100" 
    : "text-rose-500 bg-rose-50 border-rose-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

