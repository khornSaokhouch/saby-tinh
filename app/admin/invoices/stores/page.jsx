'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import useInvoiceStore from '@/stores/useInvoiceStore';
import { useStore } from '@/stores/useStore';
import { 
  Search, Filter, Download, Eye, MoreHorizontal, 
  CheckCircle2, Clock, Truck, XCircle, ChevronLeft, 
  ChevronRight, Calendar, ChevronDown, ShoppingBag, 
  DollarSign, Activity, Loader2, AlertCircle, RefreshCw
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

  if (!storeId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-8">
        <div className="text-center">
            <AlertCircle className="mx-auto text-rose-500 mb-4" size={48} />
            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tighter">Invalid Access</h2>
            <Link href="/admin/invoices" className="text-[10px] font-black uppercase text-indigo-600 border-b border-indigo-200 pb-0.5">Return to Registry</Link>
        </div>
      </div>
    );
  }

  const paidInvoices = invoices.filter(inv => {
    const s = inv.payment_status?.status?.toLowerCase();
    return s === 'paid' || s === 'success';
  });
  const totalValue = paidInvoices.reduce((sum, inv) => sum + parseFloat(inv.total_amount || 0), 0);

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button 
              onClick={() => router.back()}
              className="p-2 border border-slate-200 rounded-lg hover:bg-white text-slate-500 transition-all active:scale-95 shadow-sm"
          >
              <ChevronLeft size={14} strokeWidth={3} />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{store?.name || 'Merchant'} Registry</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
                Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Payments</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={loadInvoices}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-slate-800 transition-all shadow-md uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} />
            Export
          </button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Orders" value={meta.total.toLocaleString()} icon={ShoppingBag} color="indigo" subText="Transactions" />
        <StatCard label="Status" value={paidInvoices.length.toString()} icon={CheckCircle2} color="emerald" subText="Completed" />
        <StatCard label="Earnings" value={`$${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} icon={DollarSign} color="rose" subText="Net Profit" />
        <StatCard label="Volume" value="Live" icon={Activity} color="blue" subText="Real-time" />
      </div>

      {/* --- TABLE CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="relative w-full sm:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Invoice #..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && loadInvoices()}
            />
          </div>

          <div className="flex items-center gap-2">
             <FilterSelect 
               options={['All', 'Paid', 'Pending', 'Cancelled']} 
               value={statusFilter === '2' ? 'Paid' : statusFilter === '1' ? 'Pending' : statusFilter === '3' ? 'Cancelled' : 'All'} 
               onChange={(val) => {
                  const mapping = { 'All': '', 'Paid': '2', 'Pending': '1', 'Cancelled': '3' };
                  setStatusFilter(mapping[val] || '');
                  setCurrentPage(1);
               }}
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
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment Status</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Net Amount</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan="7" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">Syncing Registry...</td></tr>
              ) : invoices.map((inv, idx) => (
                <tr key={inv.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-indigo-600 tracking-tight">{inv.invoice_number}</span>
                      <span className="text-[8px] font-black text-slate-300 uppercase">ID: {inv.id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-700">{inv.order?.user?.name || 'Guest'}</span>
                      <span className="text-[9px] text-slate-400 font-medium truncate max-w-[120px]">{inv.order?.user?.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase">
                    {format(new Date(inv.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-4 py-4">
                    <PaymentBadge status={inv.payment_status?.status || 'Pending'} />
                  </td>
                  <td className="px-4 py-4 text-right text-xs font-black text-slate-900">
                    ${parseFloat(inv.total_amount || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2 max-w-[180px]">
                      <div className="w-8 h-8 rounded-lg border border-slate-100 bg-slate-50 shrink-0 overflow-hidden">
                        <img src={inv.order?.order_lines?.[0]?.product_item_variant?.product_item?.product?.images?.[0]?.image || '/placeholder.png'} className="w-full h-full object-cover" />
                      </div>
                      <span className="text-[10px] font-bold text-slate-500 truncate">{inv.order?.order_lines?.[0]?.product_item_variant?.product_item?.product?.name || 'Item'}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <StatusBadge status={inv.order?.order_status?.status || 'Processing'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Page {currentPage} of {meta.last_page}</span>
          <div className="flex gap-1">
            <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} className="p-1.5 border border-slate-200 rounded-md hover:bg-white transition-all"><ChevronLeft size={12} /></button>
            <button onClick={() => setCurrentPage(p => Math.min(meta.last_page, p+1))} className="p-1.5 border border-slate-200 rounded-md hover:bg-white transition-all"><ChevronRight size={12} /></button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function OrderByStore() {
    return (
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>}>
        <StoreInvoicesContent />
      </Suspense>
    );
}

// --- REFINED SUB-COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    rose: "bg-rose-500 shadow-rose-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
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
  const norm = status?.toLowerCase() || '';
  const config = {
    delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    shipped: "bg-blue-50 text-blue-600 border-blue-100",
    cancelled: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${config[norm] || "bg-orange-50 text-orange-600 border-orange-100"}`}>
      <span className="w-1 h-1 rounded-full bg-current mr-1.5 animate-pulse" />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const norm = status?.toLowerCase() || '';
  const styles = {
    paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
    success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    failed: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${styles[norm] || "text-orange-600 bg-orange-50 border-orange-100"}`}>
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