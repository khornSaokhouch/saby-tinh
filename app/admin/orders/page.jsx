'use client';

import { useState, useEffect } from 'react';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, 
  ChevronLeft, ChevronRight, Calendar, ChevronDown,
  ShoppingBag, DollarSign, Activity, RefreshCw, ArrowUpRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useShopOrderStore } from '@/stores/useShopOrderStore';

export default function OrdersPage() {
  const { orders, fetchOrders, loading, error } = useShopOrderStore();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter Logic
  const filteredOrders = orders.filter(order => {
    const statusName = order.order_status?.status || 'Pending';
    const matchesStatus = selectedStatus === 'All' || statusName === selectedStatus;
    const customerName = order.user?.name || 'Unknown';
    const orderId = `#ORD-${order.id}`;
    
    const matchesSearch = 
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.order_total || 0), 0);
  const pendingCount = orders.filter(o => o.order_status?.status === 'Pending' || o.order_status?.status === 'Processing').length;
  const avgValue = orders.length > 0 ? totalValue / orders.length : 0;

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Registry Operations</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400">Orders</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Monitor and coordinate global customer transactions.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchOrders()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm active:scale-95"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-black transition-all shadow-lg shadow-slate-200 uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} /> Export Data
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={orders.length.toLocaleString()} icon={ShoppingBag} color="indigo" />
        <StatCard label="In-Process" value={pendingCount.toString()} icon={Clock} color="rose" />
        <StatCard label="Gross Revenue" value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={DollarSign} color="emerald" />
        <StatCard label="Avg. Value" value={`$${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Activity} color="blue" />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center bg-white">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search ID or Customer..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
             <FilterSelect 
               options={['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']} 
               value={selectedStatus} 
               onChange={setSelectedStatus}
             />
             <div className="h-4 w-px bg-slate-200 mx-1"></div>
             <FilterSelect options={['Last 30 Days', 'This Year']} value="Last 30 Days" onChange={() => {}} />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">ORDER STATUS</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Total price</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Item</th> 
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">Scanning Registry...</td></tr>
              ) : filteredOrders.map((order, idx) => (
                <tr key={order.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-indigo-600 tracking-tight">#ORD-{order.id}</span>
                      <span className="text-[9px] font-black text-slate-300 uppercase mt-0.5">{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{order.user?.name || 'Guest'}</span>
                      <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">{order.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.order_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-4">
                    <PaymentBadge status={order.payment_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-black text-slate-900">
                    ${parseFloat(order.order_total).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 max-w-[160px]">
                      <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 shrink-0 overflow-hidden">
                        <img src={order.order_lines?.[0]?.product_item_variant?.product_item?.product?.images?.[0]?.image || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate">{order.order_lines?.[0]?.product_item_variant?.product_item?.product?.name || 'Item'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 bg-slate-50 border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-100 rounded-lg shadow-sm transition-all active:scale-95" title="Quick View">
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all shadow-sm active:scale-95">
                        <ArrowUpRight size={14} strokeWidth={2.5} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-6">
            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Page 1 of {Math.ceil(orders.length / 15) || 1} • {filteredOrders.length} Results</p>
            <div className="flex gap-1">
              <button className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronLeft size={12} /></button>
              <button className="p-1 border border-slate-200 rounded hover:bg-white text-slate-400"><ChevronRight size={12} /></button>
            </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Dashboard/Registry Pattern) ---

function StatCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    rose: 'bg-rose-500 shadow-rose-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    blue: 'bg-blue-600 shadow-blue-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
          {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
        </div>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Shipped: "bg-blue-50 text-blue-600 border-blue-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${config[status] || config.Cancelled}`}>
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    Paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Unpaid: "text-rose-600 bg-rose-50 border-rose-100",
    Failed: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles[status] || "text-orange-600 bg-orange-50 border-orange-100"}`}>
      {status}
    </span>
  );
}

function FilterSelect({ options, value, onChange }) {
  return (
    <div className="relative">
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-100 rounded-lg pl-3 pr-8 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none transition-all cursor-pointer shadow-sm"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
    </div>
  );
}