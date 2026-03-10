'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, 
  ChevronLeft, ChevronRight, Calendar, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useAuthStore } from '@/app/stores/authStore';

export default function OwnerOrdersPage() {
  const { user } = useAuthStore();
  const { orders, fetchOrders, loading, error } = useShopOrderStore();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All Time');
  const [selectedPayment, setSelectedPayment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status Filter
      const statusName = order.order_status?.status || 'Pending';
      const matchesStatus = selectedStatus === 'All' || statusName === selectedStatus;
      
      // Payment Filter
      const paymentStatus = order.payment_status?.status || 'Pending';
      let matchesPayment = selectedPayment === 'All';
      if (!matchesPayment) {
        if (selectedPayment === 'Paid') {
          matchesPayment = paymentStatus === 'Success';
        } else if (selectedPayment === 'Unpaid') {
          matchesPayment = paymentStatus !== 'Success';
        }
      }

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

  // KPI Calculations
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
    <div className="space-y-6 pb-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-3.5 h-3.5 text-indigo-600" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Store Operations</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">Order Management</h1>
          <p className="text-[11px] font-medium text-slate-500 mt-1">Manage and track your store's sales and performance.</p>
        </div>
        
        <div className="flex items-center gap-2.5">
          {!user?.social_accounts?.some(acc => acc.provider === 'telegram') && (
            <button 
              onClick={() => window.location.href = `https://t.me/saby_tinh_assistant_bot?start=${user?.id}`}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#24A1DE] text-white rounded-xl text-[12px] font-bold hover:bg-[#1e87bb] transition-all shadow-lg shadow-blue-100/50"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M11.944 0C5.346 0 0 5.346 0 11.944C0 18.542 5.346 23.888 11.944 23.888C18.542 23.888 23.888 18.542 23.888 11.944C23.888 5.346 18.542 0 11.944 0ZM18.17 8.013L15.937 18.537C15.769 19.294 15.321 19.479 14.686 19.123L11.284 16.613L9.643 18.192C9.462 18.373 9.31 18.524 8.959 18.524L9.204 15.061L15.509 9.362C15.783 9.118 15.45 8.981 15.085 9.224L7.29 14.136L3.937 13.085C3.208 12.857 3.195 12.356 4.09 12.007L17.18 6.963C17.787 6.74 18.317 7.103 18.17 8.013Z" />
              </svg>
              Connect Telegram
            </button>
          )}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[12px] font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard label="Total Sales" value={metrics.count.toLocaleString()} color="indigo" />
        <MetricCard label="Pending Orders" value={metrics.pending.toString()} color="orange" />
        <MetricCard label="Total Revenue" value={`$${metrics.revenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="emerald" />
        <MetricCard label="Avg. Order Value" value={`$${metrics.avgValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="rose" />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
        
        {/* Toolbar */}
       <div className="p-4 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center gap-3 justify-between bg-slate-50/20">
          
          {/* Search */}
       <div className="relative w-full sm:w-64 lg:w-72 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search ID, Customer..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[13px] font-medium focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto no-scrollbar pb-1 lg:pb-0">
             <FilterSelect 
               options={['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']} 
               value={selectedStatus} 
               onChange={setSelectedStatus}
               icon={Filter}
             />
             <FilterSelect 
               options={['All', 'Paid', 'Unpaid']} 
               value={selectedPayment} 
               onChange={setSelectedPayment}
               icon={Clock}
             />
             <FilterSelect 
               options={['All Time', 'Last 7 Days', 'Last 30 Days', 'This Year']} 
               value={selectedDate} 
               onChange={setSelectedDate}
               icon={Calendar}
             />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Order</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Products</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Payment</th>
                <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="6" className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                         <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                         <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Loading orders...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-32 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <ShoppingBag className="w-12 h-12 text-slate-200" />
                       <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                         {error ? `System Error: ${error}` : 'No orders found.'}
                       </p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.map((order, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                  key={order.id} 
                  className="hover:bg-slate-50/30 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[13px] font-bold text-indigo-600 hover:underline cursor-pointer">#ORD-{order.id}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{order.order_lines?.length || 0} Items</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <ProductPreview orderLines={order.order_lines || []} />
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-white shadow-sm">
                        {(order.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-900 leading-tight">{order.user?.name || 'Unknown User'}</span>
                        <span className="text-[11px] font-medium text-slate-400">{order.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[12px] font-medium text-slate-500">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.order_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-4 text-center">
                    <PaymentBadge status={order.payment_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-4 text-right text-[13px] font-black text-slate-900">
                    ${parseFloat(order.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link 
                        href={`/owner/orders/details-order?id=${order.id}`}
                        className="w-8 h-8 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-600 hover:text-white transition-all shadow-sm" 
                        title="View Details"
                      >
                        <Eye size={15} />
                      </Link>
                      <button className="w-8 h-8 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg hover:bg-slate-100 hover:text-slate-600 transition-all">
                        <MoreHorizontal size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/20">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Total Results: <span className="text-indigo-600">{filteredOrders.length}</span>
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 disabled:opacity-50 transition-all shadow-sm" disabled>
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
               <button className="w-9 h-9 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-lg shadow-indigo-100 italic">1</button>
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm" disabled>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricCard({ label, value, color }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  };

  return (
    <div className={`p-5 rounded-[20px] border ${styles[color].split(' ')[2]} bg-white shadow-[0_15px_40px_rgba(0,0,0,0.02)] flex flex-col items-start relative overflow-hidden group hover:border-indigo-100 transition-colors`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5 z-10">{label}</p>
      <h3 className="text-2xl font-black text-slate-900 z-10 tracking-tight italic">{value}</h3>
      <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-10 blur-xl group-hover:scale-150 transition-transform ${styles[color].split(' ')[0]}`} />
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Cancelled: { icon: XCircle, style: "bg-slate-100 text-slate-500 border-slate-200" },
  };

  const { icon: Icon, style } = config[status] || config.Cancelled;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={10} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'Success';
  
  const style = isPaid 
    ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
    : "text-rose-600 bg-rose-50 border-rose-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wider ${style}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

function FilterSelect({ options, value, onChange, icon: Icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-indigo-600 transition-colors">
        {Icon && <Icon size={16} />}
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 hover:border-indigo-300 rounded-xl pl-10 pr-9 py-2.5 text-[11px] font-bold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all cursor-pointer min-w-[140px]"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}

function ProductPreview({ orderLines }) {
  if (!orderLines || orderLines.length === 0) {
    return (
      <span className="text-xs text-slate-400 font-medium">
        No products
      </span>
    );
  }

  const firstLine = orderLines[0];
  const product =
    firstLine?.product_item_variant?.product_item?.product;

  const image =
    product?.images?.find(img => img.is_primary === 1)?.image ||
    product?.images?.[0]?.image ||
    '/placeholder.png';

  return (
    <div className="flex items-center gap-3">
      {/* Product Image */}
      <img
        src={image}
        alt={product?.name || 'Product'}
        className="w-10 h-10 rounded-xl object-cover border border-slate-200 bg-slate-50 shadow-sm"
      />

      {/* Product Info */}
      <div className="flex flex-col max-w-[180px]">
        <span className="text-[13px] font-bold text-slate-900 truncate leading-tight">
          {product?.name || 'Unknown Product'}
          {orderLines.length > 1 && (
            <span className="text-slate-400 font-semibold text-[11px]">
              {' '}+{orderLines.length - 1}
            </span>
          )}
        </span>

        <span className="text-[11px] text-slate-400 font-medium">
          Qty: {firstLine?.quantity || 1}
        </span>
      </div>
    </div>
  );
}