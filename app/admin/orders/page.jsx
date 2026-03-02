'use client';

import { useState } from 'react';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  ArrowUpDown, CheckCircle2, Clock, Truck, XCircle, 
  ChevronLeft, ChevronRight, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- MOCK DATA ---
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useEffect } from 'react';

export default function OrdersPage() {
  const { orders, fetchOrders, loading, error } = useShopOrderStore();
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);



  // Filter Logic
  const filteredOrders = orders.filter(order => {
    // Map status name from orderStatus relationship
    const statusName = order.order_status?.status_name || 'Pending';
    const matchesStatus = selectedStatus === 'All' || statusName === selectedStatus;
    
    const customerName = order.user?.name || 'Unknown';
    const orderId = `#ORD-${order.id}`;
    
    const matchesSearch = 
      orderId.toLowerCase().includes(searchQuery.toLowerCase()) || 
      customerName.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesStatus && matchesSearch;
  });

  const totalValue = orders.reduce((sum, order) => sum + parseFloat(order.order_total || 0), 0);
  const pendingCount = orders.filter(o => o.order_status?.status_name === 'Pending' || o.order_status?.status_name === 'Processing').length;
  const avgValue = orders.length > 0 ? totalValue / orders.length : 0;

  return (
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Order Management</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Track and manage customer orders.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all active:scale-95">
            <Filter size={14} />
            Advanced Filter
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <MetricCard label="Total Orders" value={orders.length.toLocaleString()} color="indigo" />
        <MetricCard label="Pending" value={pendingCount.toString()} color="orange" />
        <MetricCard label="Total Revenue" value={`$${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="emerald" />
        <MetricCard label="Avg. Order Value" value={`$${avgValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}`} color="rose" />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          
          {/* Search */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search by Order ID, Customer..." 
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <FilterSelect 
               options={['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled']} 
               value={selectedStatus} 
               onChange={setSelectedStatus}
               icon={Filter}
             />
             <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block"></div>
             <FilterSelect 
               options={['Last 7 Days', 'Last 30 Days', 'This Year']} 
               value="Last 30 Days" 
               onChange={() => {}}
               icon={Calendar}
             />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 w-10">
                  <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider cursor-pointer group hover:text-indigo-600">
                  <div className="flex items-center gap-1">Order ID <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100" /></div>
                </th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Product
                </th> 
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="8" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                         <span className="text-xs font-bold text-slate-500">Fetching order history...</span>
                      </div>
                   </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-slate-400 text-xs font-medium">
                    {error ? `Error: ${error}` : 'No orders found matching your filters.'}
                  </td>
                </tr>
              ) : filteredOrders.map((order, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  key={order.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                  </td>
                  <td className="px-5 py-3 text-xs font-bold text-indigo-600">#ORD-{order.id}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                        {(order.user?.name || 'U').charAt(0)}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{order.user?.name || 'Unknown User'}</span>
                        <span className="text-[10px] text-slate-400">{order.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-slate-500">
                    {new Date(order.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={order.order_status?.status_name || 'Pending'} />
                  </td>
                  <td className="px-5 py-3">
                    <PaymentBadge status="Paid" /> {/* Assuming Paid for now, or you can check payment account status if available */}
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">
                    ${parseFloat(order.order_total).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {(() => {
                      const line = order.order_lines?.[0];
                      const product = line?.product_item_variant?.product_item?.product;

                      const image =
                        product?.images?.find(img => img.is_primary === 1)?.image ||
                        product?.images?.[0]?.image ||
                        '/placeholder.png';

                      return (
                        <>
                          <img
                            src={image}
                            alt={product?.name || 'Product'}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-slate-50"
                          />

                          <div className="flex flex-col max-w-[160px]">
                            <span className="text-xs font-bold text-slate-900 truncate">
                              {product?.name || 'Unknown Product'}
                              {order.order_lines?.length > 1 && (
                                <span className="text-slate-400 font-medium">
                                  {' '}+{order.order_lines.length - 1} more
                                </span>
                              )}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              Qty: {line?.quantity || 1}
                            </span>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="View Details">
                        <Eye size={14} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all">
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-medium text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredOrders.length}</span> of <span className="font-bold text-slate-900">{orders.length}</span> orders
          </p>
          
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 disabled:opacity-50 transition-all" disabled>
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
               <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-200">1</button>
               <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors">2</button>
               <button className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors">3</button>
               <span className="text-xs text-slate-400">...</span>
            </div>
            <button className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white hover:border-indigo-200 transition-all">
              <ChevronRight size={14} />
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
    <div className={`p-4 rounded-xl border ${styles[color].split(' ')[2]} bg-white shadow-sm flex flex-col items-start hover:border-slate-300 transition-all`}>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
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
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wide ${style}`}>
      <Icon size={10} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    Paid: "text-emerald-600 bg-emerald-50",
    Pending: "text-orange-600 bg-orange-50",
    Failed: "text-rose-600 bg-rose-50",
    Refunded: "text-slate-500 bg-slate-100 line-through",
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${styles[status]}`}>
      {status}
    </span>
  );
}

function FilterSelect({ options, value, onChange, icon: Icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        {Icon && <Icon size={12} />}
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-200 hover:border-indigo-300 rounded-lg pl-8 pr-8 py-1.5 text-xs font-bold text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </div>
    </div>
  );
}