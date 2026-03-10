"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useInvoiceStore from '@/stores/useInvoiceStore';
import { useStore } from '@/stores/useStore';
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  MoreHorizontal, 
  ArrowUpDown, 
  CheckCircle2, 
  Clock, 
  Truck, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  ChevronDown,
  ShoppingBag, 
  DollarSign, 
  Activity, 
  TrendingUp,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';

function StoreInvoicesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const storeId = searchParams.get('store_id');
  
  const { invoices, meta, loading, fetchInvoices } = useInvoiceStore();
  const { stores, fetchStoreById } = useStore();
  
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('2');
  const [currentPage, setCurrentPage] = useState(1);
  
  const store = stores.find(s => s.id == storeId);

  useEffect(() => {
    if (storeId) {
      fetchStoreById(storeId);
      loadInvoices();
    }
  }, [storeId, currentPage, statusFilter]);

  const loadInvoices = () => {
    const params = {
      store_id: storeId,
      page: currentPage,
      per_page: 15,
      search: search,
    };
    if (statusFilter) params.status = statusFilter;
    fetchInvoices(params);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      setCurrentPage(1);
      loadInvoices();
    }
  };

  if (!storeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
            <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">Invalid Store ID</h2>
            <p className="text-slate-500 text-xs font-medium mb-6">Please select a store from the master list.</p>
            <Link href="/admin/invoices" className="px-4 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-lg hover:shadow-indigo-200 transition-all">
                Back to Masters
            </Link>
        </div>
      </div>
    );
  }

  const paidInvoices = invoices.filter(inv => {
    const s = inv.payment_status?.status?.toLowerCase();
    return s === 'paid' || s === 'success';
  });
  const totalValue = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);
  const paidCount = paidInvoices.length;
  const avgValue = paidCount > 0 ? totalValue / paidCount : 0;

  return (
    <div className="space-y-6 pb-10 font-sans p-4 sm:p-8 bg-slate-50/20 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
              onClick={() => router.back()}
              className="p-2 border border-slate-200 rounded-xl hover:bg-white text-slate-500 transition-all active:scale-95 shadow-sm"
          >
              <ChevronLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{store?.name || 'Store Details'} • Payments</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
                {store?.name}<span className="text-indigo-600">.</span>Payments
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest active:scale-95">
            <Download size={15} strokeWidth={2.5} />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-2xl text-[11px] font-black hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest">
            <Filter size={15} strokeWidth={2.5} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard label="Total Orders" value={meta.total.toLocaleString()} icon={ShoppingBag} color="indigo" />
        <MetricCard label="Paid Orders" value={paidCount.toString()} icon={CheckCircle2} color="emerald" />
        <MetricCard label="Total Earnings" value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={DollarSign} color="orange" />
        <MetricCard label="Average Sale" value={`$${avgValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={Activity} color="rose" />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          
          {/* Search */}
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search by Invoice Number..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
             <FilterSelect 
               options={['All', 'Paid', 'Pending', 'Cancelled', 'Failed']} 
               value={statusFilter === '2' ? 'Paid' : statusFilter === '1' ? 'Pending' : statusFilter === '3' ? 'Cancelled' : statusFilter === '4' ? 'Failed' : 'All'} 
               onChange={(val) => {
                  const mapping = { 'All': '', 'Paid': '2', 'Pending': '1', 'Cancelled': '3', 'Failed': '4' };
                  setStatusFilter(mapping[val] || '');
                  setCurrentPage(1);
               }}
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
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Invoice No.</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Payment Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Total</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Status</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="9" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                         <span className="text-xs font-bold text-slate-500 italic uppercase">Loading Payments...</span>
                      </div>
                   </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                   <td colSpan="9" className="py-12 text-center text-slate-400 text-xs font-medium italic uppercase tracking-widest">
                    No transactions found recorded for this store.
                  </td>
                </tr>
              ) : invoices.map((inv, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  key={inv.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-5 py-3">
                    <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20" />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-indigo-600">{inv.invoice_number}</span>
                      <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-tighter">ID: #{inv.id}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200">
                        {inv.order?.user?.name?.charAt(0) || 'G'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{inv.order?.user?.name || 'Guest User'}</span>
                        <span className="text-[10px] text-slate-400">{inv.order?.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-slate-500">
                    {format(new Date(inv.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-5 py-3">
                    <PaymentBadge status={inv.payment_status?.status || 'Pending'} />
                  </td>
                  <td className="px-5 py-3 text-right text-xs font-bold text-slate-900">
                    ${parseFloat(inv.total_amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-5 py-3">
                    <StatusBadge status={inv.order?.order_status?.status || 'Processing'} />
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const line = inv.order?.order_lines?.[0];
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
                                {inv.order?.order_lines?.length > 1 && (
                                  <span className="text-slate-400 font-medium">
                                    {' '}+{inv.order.order_lines.length - 1} more
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
                      <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
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
          <p className="text-xs font-medium text-slate-500 italic uppercase tracking-widest">
            Showing <span className="font-bold text-slate-900">{invoices.length}</span> of <span className="font-bold text-slate-900">{meta.total}</span> results
          </p>
          
          <div className="flex items-center gap-2">
            <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition-all disabled:opacity-50 shadow-sm"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(meta.last_page || 1, 5) }).map((_, i) => (
                    <button 
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all italic ${currentPage === i + 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
            <button 
                disabled={currentPage === meta.last_page}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className="p-2 border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function orderbystore() {
    return (
      <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-slate-50">
              <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
      }>
        <StoreInvoicesContent />
      </Suspense>
    );
}

// --- SUB-COMPONENTS (Synced with Orders Page) ---

function MetricCard({ label, value, icon: Icon, color }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    orange: "bg-orange-50 text-orange-600 border-orange-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 border-2 border-white shadow-sm ring-1 ring-slate-100/50 ${styles[color]} relative z-10`}>
        <Icon size={16} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</h3>
      </div>
      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}

function StatusBadge({ status }) {
  const norm = status?.toLowerCase() || '';
  const config = {
    pending: { label: 'Pending', icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    processing: { label: 'Processing', icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    shipped: { label: 'Shipped', icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    delivered: { label: 'Delivered', icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    cancelled: { label: 'Cancelled', icon: XCircle, style: "bg-slate-100 text-slate-500 border-slate-200" },
  };

  const current = config[norm] || config.pending;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest italic ${current.style}`}>
      <Icon size={12} strokeWidth={2.5} />
      {current.label}
    </span>
  );
}

function PaymentBadge({ status }) {
  const norm = status?.toLowerCase() || '';
  const styles = {
    success: { label: "Paid", style: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    paid: { label: "Paid", style: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    pending: { label: "Unpaid", style: "text-orange-600 bg-orange-50 border-orange-100" },
    unpaid: { label: "Unpaid", style: "text-rose-600 bg-rose-50 border-rose-100" },
    failed: { label: "Failed", style: "text-rose-600 bg-rose-50 border-rose-100" },
    refunded: { label: "Refunded", style: "text-slate-500 bg-slate-100 border-slate-200 line-through" },
  };
  
  const config = styles[norm] || { label: status, style: "text-slate-500 bg-slate-50 border-slate-100" };
  
  return (
    <span className={`text-[9px] font-black tracking-widest px-2 py-0.5 rounded-md border uppercase italic ${config.style}`}>
      {config.label}
    </span>
  );
}

function FilterSelect({ options, value, onChange, icon: Icon }) {
  return (
    <div className="relative group">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-indigo-600">
        {Icon && <Icon size={14} />}
      </div>
      <select 
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white border border-slate-100 hover:border-indigo-200 rounded-xl pl-9 pr-9 py-2 text-[10px] font-black uppercase tracking-widest text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer shadow-sm"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <ChevronDown size={14} className="text-slate-400" />
      </div>
    </div>
  );
}
