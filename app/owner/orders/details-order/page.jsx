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
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Retrieving Secure Intel...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-4 text-center">
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
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* --- BREADCRUMBS / NAVIGATION --- */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
          <div className="space-y-1">
            <button 
              onClick={() => router.push("/owner/orders")}
              className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-2 hover:translate-x-1 transition-transform uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back to Repository
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">#ORD-{order.id}</h1>
              <StatusBadge status={order.order_status?.status || "Pending"} />
            </div>
            <p className="text-sm font-medium text-slate-500 mt-1">Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <Printer size={18} />
            </button>
            <button className="p-3 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
              <MoreVertical size={18} />
            </button>
            <div className="w-px h-8 bg-slate-200 mx-2" />
            <button className="px-6 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2">
              Update Status <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* --- LEFT: ORDER ITEMS & LOGISTICS --- */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* 1. ORDER ITEMS */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
               <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                      <ShoppingBag className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h3 className="font-bold text-lg text-slate-900">Order Manifest</h3>
                  </div>
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{order.order_lines?.length || 0} Components</span>
               </div>
               
               <div className="p-0">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-50">
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Integration</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Unit Price</th>
                        <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Volume</th>
                        <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Yield</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {order.order_lines?.map((line, idx) => {
                        const product = line.product_item_variant?.product_item?.product;
                        const image = product?.images?.[0]?.image || "/placeholder.png";
                        return (
                          <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0 group-hover:scale-105 transition-transform">
                                  <img src={image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="text-sm font-bold text-slate-900 truncate">{product?.name || "Unknown Interface"}</span>
                                  <span className="text-[10px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">
                                    SKU: {line.product_item_variant?.product_item?.sku || `PRO-${line.product_item_variant?.product_item?.id || idx + 1}`}
                                  </span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-6 text-center text-sm font-bold text-slate-600">
                              ${parseFloat(line.price).toLocaleString()}
                            </td>
                            <td className="px-6 py-6 text-center text-sm font-black text-slate-900 italic">
                               {line.quantity}
                            </td>
                            <td className="px-8 py-6 text-right text-sm font-black text-slate-900">
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
            <div className="grid md:grid-cols-2 gap-8">
               <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                      <Truck size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Logistic Protocol</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carrier / Method</span>
                          <span className="text-sm font-bold text-slate-900">{order.shipping_method?.name || "Express Logistics"}</span>
                       </div>
                       <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-indigo-600 italic">ACTIVE</span>
                    </div>
                    
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Coordinates</span>
                      <div className="flex gap-3">
                         <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600">
                           <MapPin size={16} />
                         </div>
                         <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900">{order.shipping_address?.province || "N/A"}</span>
                            <span className="text-xs font-medium text-slate-500 leading-relaxed mt-1">
                               {order.shipping_address?.house_number}, {order.shipping_address?.street}, {order.shipping_address?.commune}, {order.shipping_address?.district}
                            </span>
                         </div>
                      </div>
                    </div>
                  </div>
               </motion.div>

               <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                        <CreditCard size={20} />
                      </div>
                      <h3 className="font-bold text-lg">Payment Ledger</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Authorization Status</span>
                        <PaymentBadge status={order.payment_status?.status || "Pending"} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Registry Source</span>
                        <span className="text-sm font-bold text-slate-900">{order.payment_method?.account_name || "Platform Direct"}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-500">Transaction ID</span>
                        <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-tighter">
                          {order.user_payments && order.user_payments.length > 0 
                            ? `:${order.user_payments[order.user_payments.length - 1].transaction_id}` 
                            : "No Transaction Data"}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-slate-50 flex items-center gap-3 text-emerald-600 bg-emerald-50/30 p-4 rounded-2xl">
                    <CheckCircle2 size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">Security Verified Transaction</span>
                  </div>
               </motion.div>
            </div>
          </div>

          {/* --- RIGHT: CUSTOMER & FINANCIALS --- */}
          <div className="space-y-8">
              
              {/* CUSTOMER PROFILE */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <User size={20} />
                    </div>
                    <h3 className="font-bold text-lg">Customer Profile</h3>
                  </div>

                  <div className="flex items-center gap-4 mb-8">
                     <div className="w-16 h-16 rounded-[2rem] bg-slate-900 flex items-center justify-center text-xl font-black text-white italic border-4 border-white shadow-xl">
                        {(order.user?.name || "U").charAt(0).toUpperCase()}
                     </div>
                     <div className="flex flex-col min-w-0">
                        <span className="text-lg font-black text-slate-900 truncate">{order.user?.name || "Anonymous Client"}</span>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest mt-0.5 pointer-events-none">Loyalty Tier 1</span>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center gap-3 p-4 rounded-[1.25rem] bg-slate-50/50 border border-slate-50 group hover:border-indigo-100 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <Mail size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600 truncate">{order.user?.email || "not_disclosed@platform.com"}</span>
                     </div>
                     <div className="flex items-center gap-3 p-4 rounded-[1.25rem] bg-slate-50/50 border border-slate-50 group hover:border-indigo-100 transition-colors">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-400 group-hover:text-indigo-600 transition-colors">
                           <Phone size={16} />
                        </div>
                        <span className="text-sm font-bold text-slate-600">{order.user?.phone_number || "Not Provided"}</span>
                     </div>
                  </div>
              </motion.div>

              {/* FINANCIAL SUMMARY */}
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl shadow-indigo-900/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 text-white/5 pointer-events-none">
                     <ShoppingBag size={120} strokeWidth={1} />
                  </div>
                  
                  <h3 className="font-black text-xl mb-10 italic tracking-tighter uppercase tracking-widest opacity-40">Financial Ledger</h3>
                  
                  <div className="space-y-6 relative z-10">
                     <div className="flex justify-between items-center text-white/60">
                        <span className="text-sm font-bold uppercase tracking-widest">Gross Subtotal</span>
                        <span className="text-sm font-black text-white">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center text-white/60">
                        <span className="text-sm font-bold uppercase tracking-widest">Logistic Fee</span>
                        <span className="text-sm font-black text-emerald-400">${shipping.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                     </div>
                     <div className="flex justify-between items-center text-white/60">
                        <span className="text-sm font-bold uppercase tracking-widest">Platform Tax</span>
                        <span className="text-sm font-black text-white">$0.00</span>
                     </div>
                     
                     <div className="pt-6 mt-6 border-t border-white/10 flex flex-col gap-2">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Settlement Amount</p>
                        <div className="flex items-baseline gap-2">
                           <span className="text-5xl font-black tracking-tighter italic">${total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                           <span className="text-sm font-bold opacity-30 uppercase tracking-widest truncate">USD Net</span>
                        </div>
                     </div>
                  </div>
                  
                  <button className="w-full mt-10 py-4 bg-white text-slate-900 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all flex items-center justify-center gap-3">
                     Process Official Invoice <ArrowRight size={16} />
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
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border text-[10px] font-black uppercase tracking-[0.1em] ${style}`}>
      <Icon size={14} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    Success: "text-emerald-500 bg-emerald-50 border-emerald-100",
    Pending: "text-orange-500 bg-orange-50 border-orange-100",
    Failed: "text-rose-500 bg-rose-50 border-rose-100",
  };

  const style = styles[status] || styles.Pending;

  return (
    <span className={`inline-flex items-center px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${style}`}>
      {status}
    </span>
  );
}

