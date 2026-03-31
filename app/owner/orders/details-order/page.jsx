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
  MoreHorizontal,
  AlertCircle,
  Download,
  ExternalLink,
  ShieldCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";

function OrderDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("id");
  const { fetchOrderById, confirmOrder, loading: globalLoading } = useShopOrderStore();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);

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

  const handleConfirm = async () => {
    if (!order) return;
    setIsConfirming(true);
    const res = await confirmOrder(order.id);
    if (res.success) {
      // Refresh local order state
      const updated = await fetchOrderById(order.id);
      if (updated) setOrder(updated);
    }
    setIsConfirming(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-semibold text-slate-400">Loading order details...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50/50">
        <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6 shadow-sm border border-rose-100">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 tracking-tight">Order Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-sm font-medium">{error || "The system could not locate the requested order records."}</p>
        <button 
          onClick={() => router.back()}
          className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl font-bold text-xs hover:bg-black transition-all flex items-center gap-2.5 shadow-lg active:scale-95"
        >
          <ChevronLeft size={16} strokeWidth={2.5} /> Return to Orders
        </button>
      </div>
    );
  }

  const subtotal = order.order_lines?.reduce((sum, line) => sum + (line.price * line.quantity), 0) || 0;
  const shipping = order.shipping_method?.price || 0;
  const total = parseFloat(order.order_total);

  return (
    <div className="min-h-screen pb-12 font-sans ">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <div className="space-y-1">
            <button 
              onClick={() => router.push("/owner/orders")}
              className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 mb-1 hover:-translate-x-1 transition-transform"
            >
              <ChevronLeft size={12} strokeWidth={2.5} /> Back to Orders
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">
                Order # {order.id}
              </h1>
              {order.invoice && (
                <span className="px-2.5 py-0.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold border border-slate-800 shadow-sm flex items-center gap-2">
                  <ShieldCheck size={12} className="text-indigo-400" strokeWidth={2.5} />
                  {order.invoice.invoice_number}
                </span>
              )}
              <StatusBadge status={order.order_status?.status || "Pending"} />
            </div>
            <div className="flex items-center gap-3 mt-2">
               <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                 <Calendar size={12} className="text-indigo-500" strokeWidth={2.5} />
                 {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
               </p>
               <div className="w-1 h-1 rounded-full bg-slate-200" />
               <p className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                 <Clock size={12} className="text-indigo-500" strokeWidth={2.5} />
                 {new Date(order.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
               </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-xs group">
              <Printer size={16} strokeWidth={2} className="group-hover:scale-105 transition-transform" />
            </button>
            <button className="p-2 bg-white border border-slate-100 text-slate-400 rounded-lg hover:text-indigo-600 hover:border-indigo-100 transition-all shadow-xs group">
              <Download size={16} strokeWidth={2} className="group-hover:scale-105 transition-transform" />
            </button>
            
            <div className="w-px h-6 bg-slate-100 mx-1" />
            
            {order.order_status?.status === 'Pending' ? (
              <button 
                onClick={handleConfirm}
                disabled={isConfirming}
                className="px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isConfirming ? <Clock className="animate-spin" size={14} /> : <CheckCircle2 size={14} strokeWidth={2.5} />}
                Confirm Order
              </button>
            ) : order.order_status?.status === 'Confirmed' ? (
               null
            ) : (
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center gap-2 active:scale-95">
                Update Status <ArrowRight size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* --- LEFT: ORDER ITEMS & LOGISTICS --- */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. ORDER ITEMS */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
               <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/20">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-100">
                      <ShoppingBag className="w-4.5 h-4.5 text-white" strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight leading-none">Order Items</h3>
                      <p className="text-[11px] font-medium text-slate-400 mt-1">Products in this order</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 bg-slate-50 text-slate-500 rounded-lg text-[10px] font-bold border border-slate-100">
                    {order.order_lines?.length || 0} items
                  </span>
               </div>
               
               <div className="overflow-x-auto no-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/10">
                        <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product</th>
                        <th className="px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Price</th>
                        <th className="px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Qty</th>
                        <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {order.order_lines?.map((line, idx) => {
                        const product = line.product_item_variant?.product_item?.product;
                        const image = product?.images?.[0]?.image || "/placeholder.png";
                        return (
                          <tr key={idx} className="group hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform shadow-xs relative">
                                  <img src={image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-xs font-bold text-slate-900 truncate tracking-tight mb-0.5">{product?.name || "Product Name"}</span>
                                  <div className="flex items-center gap-2">
                                     <span className="text-[9px] font-bold text-slate-400 uppercase">
                                       SKU: {line.product_item_variant?.product_item?.sku || line.product_item_variant?.product_item?.id}
                                     </span>
                                     <span className="text-[9px] font-bold text-indigo-500 uppercase">
                                       {line.product_item_variant?.variant_name || "Standard"}
                                     </span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-center">
                               <span className="text-xs font-bold text-slate-900 tabular-nums">${parseFloat(line.price).toLocaleString()}</span>
                            </td>
                            <td className="px-4 py-4 text-center">
                               <span className="text-xs font-medium text-slate-400 tabular-nums">x{line.quantity}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                               <span className="text-xs font-bold text-indigo-600 tabular-nums tracking-tight">
                                 ${(line.price * line.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                               </span>
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
               <motion.div 
                 initial={{ opacity: 0, x: -20 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: 0.1 }} 
                 className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
               >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 shadow-xs border border-orange-100/50">
                        <Truck size={18} strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight leading-none uppercase">Shipping Detail</h3>
                    </div>
                    <button className="text-indigo-600 p-1.5 hover:bg-indigo-50 rounded-lg transition-all active:scale-90">
                       <ExternalLink size={14} strokeWidth={2} />
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                          <span className="text-xs font-bold text-slate-900">{order.shipping_method?.name || "Global Express"}</span>
                       </div>
                       <div className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-widest border border-emerald-100">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                          Live Status
                       </div>
                    </div>
                    
                    <div className="space-y-3 px-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Address</span>
                      <div className="flex gap-4">
                         <div className="w-10 h-10 rounded-[14px] bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-white shadow-xl">
                           <MapPin size={18} strokeWidth={2.5} className="text-indigo-400" />
                         </div>
                         <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold text-slate-900 tracking-tight mb-1 leading-none">{order.shipping_address?.province || "Unspecified Region"}</span>
                            <span className="text-[11px] font-medium text-slate-400 leading-relaxed uppercase tracking-tight">
                               {order.shipping_address?.house_number} {order.shipping_address?.street}, {order.shipping_address?.commune}, {order.shipping_address?.district}
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
               </motion.div>

               <motion.div 
                 initial={{ opacity: 0, x: 20 }} 
                 animate={{ opacity: 1, x: 0 }} 
                 transition={{ delay: 0.2 }} 
                 className="bg-white rounded-[24px] border border-slate-100 shadow-sm p-7 flex flex-col justify-between"
               >
                  <div>
                    <div className="flex items-center gap-3.5 mb-8">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100/50">
                        <ShieldCheck size={20} strokeWidth={2} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 tracking-tight leading-none uppercase">Payment Status</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Authorization</span>
                        <PaymentBadge status={order.payment_status?.status || "Pending"} />
                      </div>
                      <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Method</span>
                        <span className="text-sm font-bold text-slate-900 tracking-tight">{order.payment_method?.account_name || "Direct Settlement"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Transaction ID</span>
                        <span className="text-[10px] font-mono font-bold text-indigo-600 px-2 py-1 bg-indigo-50 border border-indigo-100 rounded-lg tracking-tighter truncate max-w-[160px] shadow-sm">
                          {order.user_payments?.length > 0 
                            ? `#${order.user_payments[0].transaction_id.toString().toUpperCase()}` 
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-xl flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-md shadow-emerald-200 flex-shrink-0">
                       <CheckCircle2 size={14} strokeWidth={3} />
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">Verified</span>
                       <span className="text-[8px] font-bold text-emerald-600/60 uppercase tracking-widest">Hash Confirmed</span>
                    </div>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* --- RIGHT: CUSTOMER & FINANCIALS --- */}
          <div className="space-y-6">
              
              {/* CUSTOMER PROFILE */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5"
              >
                 <div className="flex items-center gap-3 mb-6">
                    <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-200">
                      <User size={18} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900 tracking-tight leading-none uppercase">Customer</h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-6 bg-slate-50/50 p-4 rounded-2xl border border-slate-100 shadow-inner group">
                     <div className="relative">
                       <div className="w-11 h-11 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center text-lg font-bold text-white shadow-xl transition-transform group-hover:scale-105">
                          {(order.user?.name || "U").charAt(0).toUpperCase()}
                       </div>
                       <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-indigo-500 rounded-lg border-2 border-white flex items-center justify-center text-white shadow-lg">
                          <CheckCircle2 size={9} strokeWidth={4} />
                       </div>
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-slate-900 truncate tracking-tight mb-0.5">{order.user?.name || "User Name"}</span>
                        <span className="text-[9px] font-bold text-indigo-600 uppercase">Premium Member</span>
                     </div>
                  </div>

                  <div className="space-y-2.5">
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-50 shadow-xs">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                           <Mail size={14} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Email</span>
                           <span className="text-xs font-bold text-slate-600 truncate">{order.user?.email || "N/A"}</span>
                        </div>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-50 shadow-xs">
                        <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                           <Phone size={14} strokeWidth={2.5} />
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Phone</span>
                           <span className="text-xs font-bold text-slate-600">{order.user?.phone_number || "N/A"}</span>
                        </div>
                     </div>
                  </div>
              </motion.div>

              {/* FINANCIAL SUMMARY */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} 
                animate={{ opacity: 1, scale: 1 }} 
                transition={{ delay: 0.1 }} 
                className="bg-slate-900 rounded-[28px] p-6 text-white shadow-xl shadow-indigo-900/20 relative overflow-hidden group"
              >
                  <div className="absolute -top-10 -right-10 p-4 text-white/5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
                     <ShoppingBag size={180} strokeWidth={1} />
                  </div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-8">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                       <h3 className="font-bold text-[10px] uppercase opacity-60 tracking-widest">Settlement</h3>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="flex justify-between items-center text-white/40">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Subtotal</span>
                          <span className="text-xs font-bold text-white/90 tabular-nums">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       </div>
                       <div className="flex justify-between items-center text-white/40">
                          <span className="text-[10px] font-bold uppercase tracking-widest">Shipping</span>
                          <span className="text-xs font-bold text-emerald-400 tabular-nums">+${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                       </div>
                       
                       <div className="pt-6 mt-4 border-t border-white/10 flex flex-col gap-1.5">
                          <div className="flex justify-between items-end">
                             <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Net Total</p>
                             <span className="text-[9px] font-bold opacity-30 uppercase mb-1">USD</span>
                          </div>
                          <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-bold tracking-tight text-white">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          </div>
                       </div>
                    </div>
                    
                    <button className="w-full mt-8 py-4 bg-white text-slate-900 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-100 transition-all flex items-center justify-center gap-3 shadow-lg active:scale-95">
                       Process Invoice <ArrowRight size={16} strokeWidth={2.5} />
                    </button>
                  </div>
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50/50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">Syncing Connection...</p>
      </div>
    }>
      <OrderDetailsContent />
    </React.Suspense>
  );
}

// --- HELPERS ---

function StatusBadge({ status }) {
  const config = {
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100 shadow-blue-50" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100 shadow-indigo-50" },
    Confirmed: { icon: ShieldCheck, style: "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-emerald-50" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100 shadow-orange-50" },
    Cancelled: { icon: XCircle, style: "bg-rose-50 text-rose-500 border-rose-100 shadow-rose-50" },
  };

  const { icon: Icon, style } = config[status] || config.Pending;

  return (
    <span className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all shadow-sm ${style}`}>
      <Icon size={12} strokeWidth={3} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'Paid' || status === 'Success';
  
  const style = isPaid 
    ? "text-emerald-500 bg-emerald-50 border-emerald-100 shadow-emerald-50" 
    : "text-rose-500 bg-rose-50 border-rose-100 shadow-rose-50";

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest shadow-sm ${style}`}>
      <div className={`w-1.5 h-1.5 rounded-full mr-2 ${isPaid ? 'bg-emerald-500' : 'bg-rose-500'} animate-pulse`} />
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}


