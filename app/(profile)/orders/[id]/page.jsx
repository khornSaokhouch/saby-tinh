"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { 
  ChevronLeft, MapPin, Truck, CreditCard, CheckCircle2, Loader2, 
  AlertCircle, FileText, ShoppingBag, HelpCircle, Box, MessageSquare, Star 
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

  useEffect(() => { loadOrder(); }, [id]);

  if (loading && !order) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-white">
        <Loader2 className="h-6 w-6 text-indigo-600 animate-spin mb-2" />
        <p className="text-xs text-slate-500 font-medium font-sans">Syncing order details...</p>
      </div>
    );
  }

  if (!order && !loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-6 text-center font-sans">
        <AlertCircle className="w-10 h-10 text-slate-300 mb-4" />
        <h2 className="text-lg font-bold text-slate-900">Order not found</h2>
        <button onClick={() => router.push("/orders")} className="mt-4 px-5 py-2 bg-slate-900 text-white rounded-lg text-xs font-bold">Return to orders</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 font-sans bg-[#FDFDFD]">
      {/* Compact Nav Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 h-12 flex items-center justify-between">
          <button onClick={() => router.push("/orders")} className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold transition-all">
            <ChevronLeft size={16} />
            <span>Back to orders</span>
          </button>
          <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-medium">
            <HelpCircle size={14} />
            <span>Support help</span>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 pt-6">
        {/* Header Section */}
        <header className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                Order #{order.id}
              </span>
              <StatusBadge status={order.order_status?.status} />
              <PaymentBadge status={order.payment_status?.status} />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Order confirmation</h1>
            <p className="text-xs text-slate-400 font-medium">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 font-bold text-[11px] hover:bg-slate-50 transition-all">
            <FileText size={14} className="text-slate-400" />
            Invoice
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-8 space-y-4">
            
            {/* Package Tracker - Compact */}
            <section className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Truck size={16} className="text-indigo-600" /> Logistics timeline
              </h3>
              <div className="space-y-6 relative ml-1">
                {order.order_history?.length > 1 && (
                  <div className="absolute left-[13px] top-4 bottom-4 w-px bg-slate-100" />
                )}

                {order.order_history?.map((event, idx) => (
                  <div key={event.id} className="flex items-start gap-3 relative z-10">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 ${
                      idx === 0 ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-300'
                    }`}>
                      {idx === 0 ? <CheckCircle2 size={14} /> : <Box size={12} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <p className={`text-xs font-bold leading-tight ${idx === 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                          {event.status_update || (idx === 0 ? 'Order placed' : 'Processing')}
                        </p>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                          {new Date(event.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                        {event.description || "The shipment is currently being processed."}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Product Items - Compact */}
            <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b border-slate-50 bg-slate-50/30 flex justify-between">
                <h3 className="text-xs font-bold text-slate-700">Order items</h3>
                <span className="text-xs text-slate-400 font-medium">{order.order_lines?.length} units</span>
              </div>
              <div className="divide-y divide-slate-50 px-5">
                {order.order_lines?.map((line) => {
                  const prod = line.product_item_variant?.product_item?.product || {};
                  return (
                    <div key={line.id} className="py-4 flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl overflow-hidden border border-slate-50 relative shrink-0">
                        <Image src={prod.images?.[0]?.image || "/placeholder.svg"} alt={prod.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{prod.name}</h4>
                        <p className="text-[10px] text-slate-500 font-medium">Qty {line.quantity} × ${Number(line.price).toLocaleString()}</p>
                        <div className="flex items-center gap-3 mt-1.5">
                           {line.review ? (
                             <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 rounded text-[9px] font-bold text-emerald-600">
                               <Star size={8} className="fill-emerald-600" /> Rated
                             </div>
                           ) : (
                             <button onClick={() => { setSelectedLine(line); setIsReviewModalOpen(true); }} className="flex items-center gap-1 text-[10px] font-bold text-indigo-600 hover:text-indigo-700">
                                <MessageSquare size={10} /> Add review
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

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-4">
            {/* Address */}
            <section className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-3">
                <MapPin size={14} className="text-indigo-600" />
                <span>Delivery address</span>
              </div>
              <div className="text-[11px] text-slate-600 leading-relaxed font-medium">
                <p className="text-slate-900 font-bold mb-0.5">{order.shipping_address?.province}</p>
                {order.shipping_address?.house_number}, {order.shipping_address?.street}<br/>
                {order.shipping_address?.commune}, {order.shipping_address?.district}
              </div>
            </section>

            {/* Payment Summary */}
            <section className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-xs mb-3">
                <CreditCard size={14} className="text-indigo-600" />
                <span>Payment & cost</span>
              </div>
              <div className="flex items-center gap-2 mb-4 bg-slate-50 p-2 rounded-lg">
                <div className="w-8 h-5 bg-slate-900 rounded flex items-center justify-center text-[7px] font-bold text-white tracking-widest">VISA</div>
                <span className="text-[11px] font-bold text-slate-700 truncate">{order.payment_method?.account_name}</span>
              </div>
              
              <div className="space-y-2 text-[11px] font-medium border-t border-slate-50 pt-3">
                <div className="flex justify-between text-slate-400"><span>Subtotal</span><span className="text-slate-900">${(Number(order.order_total) - Number(order.shipping_method?.price || 0)).toLocaleString()}</span></div>
                <div className="flex justify-between text-slate-400"><span>Shipping ({order.shipping_method?.name})</span><span className="text-slate-900">${Number(order.shipping_method?.price || 0).toFixed(2)}</span></div>
                <div className="flex justify-between items-center pt-2 border-t border-slate-50 mt-1">
                  <span className="text-xs font-bold text-slate-900">Total settlement</span>
                  <span className="text-lg font-black text-indigo-600">${Number(order.order_total).toLocaleString()}</span>
                </div>
              </div>
            </section>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
              <p className="text-[10px] font-semibold text-emerald-700">30-day coverage protection active</p>
            </div>
          </div>
        </div>
      </main>

      <UserReviewFormModal isOpen={isReviewModalOpen} onClose={() => { setIsReviewModalOpen(false); setSelectedLine(null); }} orderLine={selectedLine} onSave={loadOrder} />
    </div>
  );
}

function StatusBadge({ status }) {
  const norm = status?.toLowerCase() || '';
  const config = {
    pending: "bg-slate-100 text-slate-600",
    completed: "bg-emerald-50 text-emerald-600",
    processing: "bg-indigo-50 text-indigo-600",
    shipped: "bg-blue-50 text-blue-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border border-transparent ${config[norm] || "bg-slate-100 text-slate-600"}`}>
      {status || 'Unknown'}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status?.toLowerCase() === 'success' || status?.toLowerCase() === 'paid';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${isPaid ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-amber-50 text-amber-600 border-amber-100"}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}