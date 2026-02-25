"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, 
  Package, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  FileText,
  ShoppingBag,
  HelpCircle,
  Box,
  MessageSquare,
  Star
} from "lucide-react";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";
import UserReviewFormModal from "@/app/components/user/UserReviewFormModal";

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = useParams();
  const { fetchOrderById, loading } = useShopOrderStore();
  const [order, setOrder] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);

  const loadOrder = async () => {
    const data = await fetchOrderById(id);
    if (data) setOrder(data);
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  if (loading && !order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading your order details...</p>
      </div>
    );
  }

  if (!order && !loading) {
    const error = useShopOrderStore.getState().error;
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Order not found</h2>
        <p className="text-slate-500 mb-4">We couldn’t find the order you’re looking for.</p>
        {error && (
          <div className="mb-8 p-4 bg-rose-50 rounded-2xl border border-rose-100 max-w-md">
            <p className="text-xs font-mono text-rose-600 break-all">Debug Error: {error}</p>
          </div>
        )}
        <button 
          onClick={() => router.push("/orders")}
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-transform active:scale-95"
        >
          View all orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Friendly Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => router.push("/orders")}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <ChevronLeft size={20} />
            <span>My Orders</span>
          </button>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <HelpCircle size={16} />
            <span>Need help?</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-10">
        {/* Order Success Greeting */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                Order #{order.id.toString().padStart(6, '0')}
              </span>
              <StatusBadge status={order.order_status?.status} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">
              Thanks for your order!
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              Placed on {new Date(order.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-all shadow-sm">
            <FileText size={18} className="text-slate-400" />
            Download Receipt
          </button>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content (Items & Tracking) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Dynamic Delivery Progress */}
            <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-8">Where is my package?</h3>
              <div className="space-y-8 relative">
                {/* Vertical Connector Line */}
                {order.order_history && order.order_history.length > 1 && (
                  <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-slate-100" />
                )}

                {order.order_history?.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-4 relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                      idx === 0 ? 'bg-indigo-600 text-white shadow-indigo-100' : 'bg-white border-2 border-slate-100 text-slate-300'
                    }`}>
                      {idx === 0 ? <CheckCircle2 size={20} /> : <Box size={18} />}
                    </div>
                    <div className="flex-1 pt-1.5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <p className={`font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                          {idx === 0 ? 'Order Pending' : (event.status_update || 'Processing Update')}
                        </p>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {new Date(event.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">
                        {event.description || (idx === 0 ? "We've received your order and it's currently pending review." : "The protocol is progressing through the logistics pipeline.")}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Next Step Placeholder if only one event */}
                {order.order_history?.length === 1 && (
                  <div className="flex items-start gap-4 opacity-40">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300">
                      <Truck size={20} />
                    </div>
                    <div className="flex-1 pt-1.5">
                      <p className="font-bold text-slate-400">Heading your way</p>
                      <p className="text-sm text-slate-500">We&apos;ll notify you as soon as your items ship.</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Order Items */}
            <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/30 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <ShoppingBag size={18} className="text-indigo-600" />
                  Items in your order
                </h3>
                <span className="text-sm font-medium text-slate-500">{order.order_lines?.length} Items</span>
              </div>
              
              <div className="divide-y divide-slate-100 px-8">
                {order.order_lines?.map((line) => {
                  const prod = line.product_item_variant?.product_item?.product || {};
                  return (
                    <div key={line.id} className="py-6 flex items-center gap-6">
                      <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 relative shrink-0">
                        <Image 
                          src={prod.images?.[0]?.image || "/placeholder.svg"} 
                          alt={prod.name} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {line.product_item_variant?.color?.name} • Qty {line.quantity}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                           <p className="text-sm font-bold text-slate-900">
                             ${Number(line.price).toLocaleString()}
                           </p>
                           {line.review ? (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
                               <div className="w-1 h-1 rounded-full bg-emerald-600" />
                               <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Reviewed</span>
                               <div className="flex items-center ml-1">
                                 {[...Array(line.review.rating)].map((_, i) => (
                                   <Star key={i} size={8} className="fill-emerald-600 stroke-emerald-600" />
                                 ))}
                               </div>
                             </div>
                           ) : (
                             <button 
                               onClick={() => {
                                 setSelectedLine(line);
                                 setIsReviewModalOpen(true);
                               }}
                               className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-slate-900 transition-colors"
                             >
                                <MessageSquare size={12} /> Submit Review
                             </button>
                           )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar (Shipping & Payment) */}
          <div className="space-y-6">
            
            {/* Shipping Info */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                <MapPin size={18} className="text-indigo-600" />
                <h4>Shipping Address</h4>
              </div>
              <p className="text-sm font-medium text-slate-900">{order.shipping_address?.province}</p>
              <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                {order.shipping_address?.house_number}, {order.shipping_address?.street}<br/>
                {order.shipping_address?.commune}, {order.shipping_address?.district}
              </p>
              <div className="mt-6 pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Shipping Method</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700">{order.shipping_method?.name}</span>
                  <span className="text-sm font-bold text-slate-900">${Number(order.shipping_method?.price).toFixed(2)}</span>
                </div>
              </div>
            </section>

            {/* Payment Info */}
            <section className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-4">
                <CreditCard size={18} className="text-indigo-600" />
                <h4>Payment Method</h4>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-7 bg-slate-900 rounded flex items-center justify-center text-[8px] font-bold text-white">CARD</div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{order.payment_method?.account_name}</p>
                  <p className="text-xs text-slate-500 uppercase">{order.payment_method?.currency}</p>
                </div>
              </div>
              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${(Number(order.order_total) - Number(order.shipping_method?.price || 0)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-500">
                  <span>Shipping</span>
                  <span className="font-semibold text-slate-900">${Number(order.shipping_method?.price || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-3 mt-1 border-t border-slate-100">
                  <span className="font-bold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-indigo-600 tracking-tight">
                    ${Number(order.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </section>

            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <p className="text-xs font-medium text-emerald-800 text-center">
                This purchase is protected by our 30-day money-back guarantee.
              </p>
            </div>
          </div>
        </div>
      </main>

      <UserReviewFormModal 
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedLine(null);
        }}
        orderLine={selectedLine}
        onSave={loadOrder}
      />
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-amber-100 text-amber-700',
    'Completed': 'bg-emerald-100 text-emerald-700',
    'Cancelled': 'bg-rose-100 text-rose-700',
    'Processing': 'bg-indigo-100 text-indigo-700',
  };

  const style = styles[status] || 'bg-slate-100 text-slate-700';

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${style}`}>
      {status || 'Updating...'}
    </span>
  );
}