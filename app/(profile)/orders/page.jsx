"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  ChevronLeft, 
  ChevronRight, 
  Loader2, 
  Search, 
  ShoppingBag, 
  Inbox, 
  Calendar,
  Filter
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useShopOrderStore } from "@/app/stores/useShopOrderStore";

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading, fetchOrders } = useShopOrderStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all"); // all, pending, paid, completed

  const itemsPerPage = 8;

  useEffect(() => { fetchOrders(); }, []);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = order.id.toString().toLowerCase().includes(searchQuery.toLowerCase());
      const orderStatus = order.order_status?.status?.toLowerCase() || '';
      const paymentStatus = order.payment_status?.status?.toLowerCase() || '';

      if (activeFilter === "pending") return matchesSearch && ["pending", "processing", "shipped"].includes(orderStatus);
      if (activeFilter === "paid") return matchesSearch && (paymentStatus === "paid" || paymentStatus === "success");
      if (activeFilter === "completed") return matchesSearch && ["completed", "delivered"].includes(orderStatus);
      
      return matchesSearch;
    });
  }, [orders, searchQuery, activeFilter]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const currentOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (loading && !orders.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] gap-2">
        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
        <p className="text-xs text-slate-500 font-medium">Loading orders...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto pb-16 font-sans">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <button 
            onClick={() => router.back()} 
            className="flex items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors text-xs font-medium mb-1"
          >
            <ChevronLeft size={14} />
            <span>Back to profile</span>
          </button>
          <h1 className="text-xl font-bold text-slate-900 leading-tight">Order history</h1>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search order id..." 
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            className="w-full md:w-64 h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* 2. Filter Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 no-scrollbar">
        <Filter size={14} className="text-slate-400 mr-1 shrink-0" />
        {[
          { id: "all", label: "All orders" },
          { id: "pending", label: "Pending" },
          { id: "paid", label: "Paid" },
          { id: "completed", label: "Completed" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveFilter(tab.id); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-md text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === tab.id 
              ? "bg-slate-900 text-white shadow-sm" 
              : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3. Order List */}
      {filteredOrders.length === 0 ? (
        <EmptyState hasFilter={activeFilter !== 'all' || searchQuery !== ''} />
      ) : (
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {currentOrders.map((order) => (
              <OrderRow key={order.id} order={order} router={router} />
            ))}
          </AnimatePresence>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                disabled={currentPage === 1}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-20 flex items-center gap-1"
              >
                <ChevronLeft size={14} /> Previous
              </button>
              
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-tight">
                {currentPage} of {totalPages}
              </span>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-20 flex items-center gap-1"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function OrderRow({ order, router }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => router.push(`/orders/${order.id}`)}
      className="group bg-white rounded-lg border border-slate-100 p-3 flex items-center justify-between hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-9 h-9 rounded-md bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors shrink-0">
          <ShoppingBag size={18} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-bold text-slate-900 truncate">Order #{order.id}</span>
            <StatusBadge status={order.order_status?.status} />
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
            <span className="flex items-center gap-1 shrink-0">
              <Calendar size={12} /> 
              {new Date(order.created_at).toLocaleDateString()}
            </span>
            <span className="truncate">{order.order_lines?.length || 0} items</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6 shrink-0">
        <div className="hidden md:flex items-center -space-x-1.5">
          {order.order_lines?.slice(0, 3).map((line, i) => (
            <div key={i} className="w-6 h-6 rounded border border-white shadow-sm overflow-hidden bg-slate-100">
              <img src={line.product_item_variant?.product_item?.product?.images?.[0]?.image} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">${Number(order.order_total).toFixed(2)}</p>
          <PaymentText status={order.payment_status?.status} />
        </div>

        <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
      </div>
    </motion.div>
  );
}

function EmptyState({ hasFilter }) {
  return (
    <div className="py-16 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-xl">
      <Inbox className="w-8 h-8 text-slate-200 mx-auto mb-3" />
      <p className="text-sm font-bold text-slate-800">
        {hasFilter ? "No matches found" : "No orders yet"}
      </p>
      <p className="text-xs text-slate-400 mt-1">
        {hasFilter ? "Try adjusting your filters or search." : "Your purchase history will appear here."}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const s = status?.toLowerCase();
  const styles = {
    pending: "bg-slate-100 text-slate-600",
    completed: "bg-emerald-50 text-emerald-600",
    processing: "bg-indigo-50 text-indigo-600",
    shipped: "bg-blue-50 text-blue-600",
    delivered: "bg-emerald-50 text-emerald-600",
    cancelled: "bg-rose-50 text-rose-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${styles[s] || 'bg-slate-100 text-slate-600'}`}>
      {status || 'Unknown'}
    </span>
  );
}

function PaymentText({ status }) {
  const s = status?.toLowerCase();
  const isPaid = s === 'success' || s === 'paid';
  return (
    <p className={`text-[10px] font-bold ${isPaid ? 'text-emerald-500' : 'text-amber-500'}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </p>
  );
}