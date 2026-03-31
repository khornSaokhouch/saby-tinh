'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, 
  ChevronLeft, ChevronRight, Calendar, ShoppingBag,
  RefreshCw, DollarSign, Package, TrendingUp, SlidersHorizontal, ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useAuthStore } from '@/app/stores/authStore';
import { useOrderStatusStore } from '@/app/stores/useOrderStatusStore';
import { usePaymentStatusStore } from '@/app/stores/usePaymentStatusStore';

export default function OwnerOrdersPage() {
  const { user } = useAuthStore();
  const { orders, fetchOrders, loading: ordersLoading, error, confirmOrder } = useShopOrderStore();
  const { orderStatuses, fetchOrderStatuses } = useOrderStatusStore();
  const { paymentStatuses, fetchPaymentStatuses } = usePaymentStatusStore();
  
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All Time');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOrders();
    fetchOrderStatuses();
    fetchPaymentStatuses();
  }, [fetchOrders, fetchOrderStatuses, fetchPaymentStatuses]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedStatus, selectedDate, selectedPayment, searchQuery]);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status Filter
      const statusName = order.order_status?.status || 'Pending';
      const matchesStatus = selectedStatus === 'All' || statusName === selectedStatus;
      
      // Payment Filter
      const pStatus = order.payment_status?.status || 'Pending';
      const matchesPayment = selectedPayment === 'All' || pStatus === selectedPayment;

      // Date Filter
      const orderDate = new Date(order.created_at);
      const now = new Date();
      let matchesDate = true;
      if (selectedDate === 'Last 7 Days') {
        const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = orderDate >= sevenDaysAgo;
      } else if (selectedDate === 'Last 30 Days') {
        const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
        matchesDate = orderDate >= thirtyDaysAgo;
      } else if (selectedDate === 'This Year') {
        matchesDate = orderDate.getFullYear() === now.getFullYear();
      }

      // Search Filter
      const customerName = order.user?.name || 'Unknown';
      const orderId = `#ORD-${order.id}`;
      const matchesSearch = 
        orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
        customerName.toLowerCase().includes(searchQuery.toLowerCase());
        
      return matchesStatus && matchesPayment && matchesDate && matchesSearch;
    });
  }, [orders, selectedStatus, selectedPayment, selectedDate, searchQuery]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredOrders.slice(start, start + itemsPerPage);
  }, [filteredOrders, currentPage]);

  // Metric Calculations
  const metrics = useMemo(() => {
    const total = filteredOrders.reduce((sum, order) => sum + parseFloat(order.order_total || 0), 0);
    const pending = filteredOrders.filter(o => ['Pending', 'Processing'].includes(o.order_status?.status || 'Pending')).length;
    const avg = filteredOrders.length > 0 ? total / filteredOrders.length : 0;
    
    return {
      count: filteredOrders.length,
      pending,
      revenue: total,
      avgValue: avg
    };
  }, [filteredOrders]);

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transaction Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Orders</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage and track your store's sales performance.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {!user?.social_accounts?.some(acc => acc.provider === 'telegram') && (
            <button 
              onClick={() => window.location.href = `https://t.me/saby_tinh_assistant_bot?start=${user?.id}`}
              className="px-3 py-1.5 bg-[#24A1DE] text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-[#1e87bb] transition-all shadow-sm active:scale-95"
            >
              Connect Telegram
            </button>
          )}
          <button className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Sales" value={metrics.count.toLocaleString()} icon={ShoppingBag} color="indigo" />
        <MetricCard label="Pending" value={metrics.pending.toString()} icon={Clock} color="amber" />
        <MetricCard label="Revenue" value={`$${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={DollarSign} color="emerald" />
        <MetricCard label="Avg value" value={`$${metrics.avgValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} icon={TrendingUp} color="rose" />
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col xl:flex-row items-stretch xl:items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:w-64 lg:w-72 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder="Search ID, Customer..." 
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400 shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Inline Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <FilterSelect 
                label="Status"
                options={['All', ...orderStatuses.map(s => s.status)]} 
                value={selectedStatus} 
                onChange={setSelectedStatus}
              />
              <FilterSelect 
                label="Payment"
                options={['All', ...paymentStatuses.map(s => s.status)]} 
                value={selectedPayment} 
                onChange={setSelectedPayment}
              />
              <FilterSelect 
                label="Timeframe"
                options={['All Time', 'Last 7 Days', 'Last 30 Days', 'This Year']} 
                value={selectedDate} 
                onChange={setSelectedDate}
              />
            </div>

            <div className="hidden xl:block flex-1" />

            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
              {filteredOrders.length} Transactions found
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Products</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer info</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {ordersLoading && orders.length === 0 ? (
                <tr>
                   <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                         <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Syncing registry...</span>
                      </div>
                   </td>
                </tr>
              ) : paginatedOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <ShoppingBag className="w-10 h-10 text-slate-100" />
                       <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                         {error ? `System Error: ${error}` : 'Zero orders found.'}
                       </p>
                    </div>
                  </td>
                </tr>
              ) : paginatedOrders.map((order, idx) => (
                <motion.tr 
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-indigo-600">#ORD-{order.id}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">
                        {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <ProductPreview orderLines={order.order_lines || []} />
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                        {(order.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate leading-tight tracking-tight">{order.user?.name || 'Unknown User'}</span>
                        <span className="text-[9px] font-bold text-slate-300 truncate lowercase">{order.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-[12px] font-black text-slate-900 tracking-tight">
                        ${parseFloat(order.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={order.order_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-3.5">
                    <PaymentBadge status={order.payment_status?.status || 'Pending'} />
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link 
                        href={`/owner/orders/details-order?id=${order.id}`}
                        className="p-1.5 bg-indigo-500 text-white hover:bg-indigo-600 rounded-lg shadow-sm active:scale-95 transition-all" 
                      >
                        <Eye size={14} strokeWidth={3} />
                      </Link>
                      
                      {order.order_status?.status === 'Pending' && (
                        <button 
                          onClick={() => confirmOrder(order.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg shadow-sm shadow-emerald-100 active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 size={12} strokeWidth={3} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Confirm</span>
                        </button>
                      )}

                      {order.order_status?.status !== 'Pending' && (
                        <button className="p-1.5 bg-slate-50 text-slate-300 rounded-lg border border-slate-100 cursor-not-allowed">
                          <MoreHorizontal size={14} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
            Results: <span className="text-indigo-600">{filteredOrders.length}</span> (Page {currentPage} of {totalPages || 1})
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronLeft size={14} className="group-active:scale-90 transition-transform" />
            </button>
            <div className="px-3 py-1 bg-indigo-600 text-white text-[9px] font-black rounded-lg shadow-md shadow-indigo-100">
              {currentPage}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm disabled:opacity-30 disabled:cursor-not-allowed group"
            >
              <ChevronRight size={14} className="group-active:scale-90 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricCard({ label, value, icon: Icon, color }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    amber: "bg-amber-500 shadow-amber-100",
    rose: "bg-rose-500 shadow-rose-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Confirmed: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Cancelled: { icon: XCircle, style: "bg-slate-100 text-slate-400 border-slate-200" },
  };

  const { icon: Icon, style } = config[status] || config.Cancelled;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={10} strokeWidth={3} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'Paid' || status === 'Success';
  
  const style = isPaid 
    ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
    : "text-rose-600 bg-rose-50 border-rose-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${style}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

function FilterSelect({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-1.5 shadow-sm group hover:border-indigo-200 transition-all">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent text-[10px] font-bold text-slate-600 outline-none cursor-pointer min-w-[80px]"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function ProductPreview({ orderLines }) {
  if (!orderLines || orderLines.length === 0) {
    return <span className="text-[10px] text-slate-300 font-bold uppercase">No items</span>;
  }

  const firstLine = orderLines[0];
  const product = firstLine?.product_item_variant?.product_item?.product;

  const image =
    product?.images?.find(img => img.is_primary === 1)?.image ||
    product?.images?.[0]?.image ||
    null;

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
        {image ? (
            <img src={image} alt={product?.name || 'Product'} className="w-full h-full object-cover" />
        ) : (
            <Package size={14} className="text-slate-200" />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[11px] font-black text-slate-900 truncate leading-tight tracking-tight max-w-[120px]">
          {product?.name || 'Unknown Item'}
          {orderLines.length > 1 && (
            <span className="text-indigo-500 font-black ml-1">+{orderLines.length - 1}</span>
          )}
        </span>
        <span className="text-[9px] text-slate-400 font-bold">Qty: {firstLine?.quantity || 1}</span>
      </div>
    </div>
  );
}