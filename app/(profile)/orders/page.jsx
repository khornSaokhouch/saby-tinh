"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ChevronLeft, 
  Package, 
  Clock, 
  ChevronRight, 
  Loader2,
  Search,
  ShoppingBag,
  HelpCircle,
  Inbox
} from "lucide-react";
import { motion } from "framer-motion";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, fetchOrders } = useShopOrderStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading && !orders.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
        <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-medium text-slate-500">Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-10 max-w-5xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-2">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 transition-colors text-sm font-semibold mb-4"
          >
            <ChevronLeft size={16} /> Back to Shop
          </button>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Order History
          </h1>
          <p className="text-slate-500 font-medium">
            Track your recent purchases and view order details.
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by order number..." 
            className="w-full pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      {!orders.length ? (
        <div className="bg-white rounded-[40px] p-16 border border-slate-100 shadow-sm flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
            <Inbox className="w-10 h-10 text-indigo-200" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 text-sm max-w-xs mb-8">
            When you buy something from our shop, it will show up here.
          </p>
          <Link 
            href="/products" 
            className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, idx) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              key={order.id}
              className="group bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 hover:border-indigo-600 transition-all hover:shadow-xl hover:shadow-slate-200/50 cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                
                {/* Order Identity & Status */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-slate-900">Order #{order.id.toString().padStart(6, '0')}</h4>
                      <StatusBadge status={order.order_status?.status} />
                    </div>
                    <div className="flex items-center gap-3 text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> 
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full" />
                      <span>{order.order_lines?.length} {order.order_lines?.length === 1 ? 'Item' : 'Items'}</span>
                    </div>
                  </div>
                </div>

                {/* Items & Price */}
                <div className="flex items-center justify-between sm:justify-end gap-8 border-t sm:border-t-0 pt-4 sm:pt-0">
                  {/* Mini Image Stack */}
                  <div className="flex items-center -space-x-3">
                    {order.order_lines?.slice(0, 3).map((line, i) => (
                      <div key={i} className="w-10 h-10 rounded-xl border-2 border-white bg-slate-100 p-1 ring-1 ring-slate-200/50 relative overflow-hidden">
                        <img 
                          src={line.product_item_variant?.product_item?.product?.images?.[0]?.image} 
                          alt="product" 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                    ))}
                    {order.order_lines?.length > 3 && (
                      <div className="w-10 h-10 rounded-xl border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 ring-1 ring-slate-200/50">
                        +{order.order_lines.length - 3}
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right min-w-[100px]">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Paid</p>
                    <p className="text-xl font-extrabold text-slate-900 tracking-tight">
                      ${Number(order.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <div className="hidden sm:flex w-10 h-10 rounded-full bg-slate-50 items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={20} />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Friendly Support Section */}
      <div className="mt-16 p-8 rounded-[32px] bg-white border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-8 shadow-sm">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shrink-0">
            <HelpCircle size={24} />
          </div>
          <div>
            <h3 className="text-slate-900 font-bold">Have a question about an order?</h3>
            <p className="text-slate-500 text-sm font-medium">Our friendly support team is here to help you every step of the way.</p>
          </div>
        </div>
        <button className="whitespace-nowrap px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-100">
          Contact Support
        </button>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    'Pending': 'bg-amber-50 text-amber-700 border-amber-100',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Cancelled': 'bg-rose-50 text-rose-700 border-rose-100',
    'Processing': 'bg-indigo-50 text-indigo-700 border-indigo-100',
  };

  const style = styles[status] || 'bg-slate-50 text-slate-600 border-slate-100';

  return (
    <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${style}`}>
      {status || 'Unknown'}
    </span>
  );
}