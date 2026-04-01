'use client';

import React, { useState, useEffect } from 'react';
import usePayoutStore from '@/stores/usePayoutStore';
import { 
  Search, RefreshCw, Download, DollarSign, Wallet,
  CalendarDays, CheckCircle2, ChevronLeft, ChevronRight, Hash, Eye
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AdminPayouts() {
  const { language } = useLanguageStore();
  const { payouts, meta, loading, fetchPayouts } = usePayoutStore();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchWord, setSearchWord] = useState('');

  useEffect(() => {
    fetchPayouts({ page: currentPage });
  }, [currentPage, fetchPayouts]);

  // Derived filtered metrics
  const displayPayouts = payouts.filter(p => 
    p.store?.name?.toLowerCase().includes(searchWord.toLowerCase()) || 
    p.transaction_reference?.toLowerCase().includes(searchWord.toLowerCase()) ||
    p.invoice?.invoice_number?.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Ledger</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Payout <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">History</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Complete registry of all processed merchant earnings and Bakong transfers.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPayouts({ page: currentPage })}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:border-emerald-300 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={13} className={`${loading ? 'animate-spin text-emerald-600' : 'text-slate-400'}`} strokeWidth={3} />
            Sync
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-slate-800 transition-all shadow-md uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} />
            Export
          </button>
        </div>
      </div>

      {/* --- KPI SUMMARY --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Payouts" value={meta.total || 0} icon={Wallet} color="teal" />
      </div>

      {/* --- TABLE LAYOUT --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search by store, invoice, or TRN..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-emerald-100 transition-all placeholder:text-slate-400 placeholder:font-medium"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
            />
          </div>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto min-h-[400px]">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">ID</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Invoice / Target</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Store</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Amount Paid</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="7" className="py-20 text-center">
                     <RefreshCw className="w-6 h-6 animate-spin text-emerald-400 mx-auto" />
                   </td>
                </tr>
              ) : displayPayouts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">No payouts found matching criteria.</p>
                  </td>
                </tr>
              ) : displayPayouts.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                     <span className="text-[10px] font-black text-slate-400">#{p.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <Hash size={12} className="text-slate-300" />
                        {p.invoice?.invoice_number || 'N/A'}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        TRN: {p.transaction_reference}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                        {p.store?.name || `Store #${p.store_id}`}
                     </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-xs font-black text-emerald-600">
                        {p.currency === 'USD' ? '$' : ''}
                        {parseFloat(p.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        {p.currency === 'KHR' ? ' ៛' : ''}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{p.currency}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                     <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                       ${p.payment_status_id === 2 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-orange-50 border-orange-100 text-orange-600'}`}>
                       <span className={`w-1 h-1 rounded-full animate-pulse ${p.payment_status_id === 2 ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                       {p.status?.status || 'Unknown'}
                     </span>
                  </td>
                  <td className="px-6 py-4">
                     <div className="flex items-center gap-1.5 text-slate-500">
                       <CalendarDays size={13} />
                       <span className="text-[10px] font-bold tracking-tight">
                         {p.paid_at ? format(new Date(p.paid_at), 'MMM dd, yyyy HH:mm') : 'Pending'}
                       </span>
                     </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/payouts/details?id=${p.id}`}>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-sm active:scale-95 group/btn">
                        <Eye size={12} strokeWidth={3} />
                        <span>{t('Details', language)}</span>
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
            Page {meta.current_page || 1} of {meta.last_page || 1}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 border border-slate-200 rounded-md hover:bg-white transition-all disabled:opacity-40 shadow-sm bg-white"
            >
              <ChevronLeft size={12} className="text-slate-600" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(meta.last_page || p, p + 1))}
              disabled={currentPage >= (meta.last_page || 1)}
              className="p-1.5 border border-slate-200 rounded-md hover:bg-white transition-all disabled:opacity-40 shadow-sm bg-white"
            >
              <ChevronRight size={12} className="text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  const themes = {
    teal: "bg-teal-500 shadow-teal-100",
  };

  return (
    <div className="bg-white p-4 items-center gap-3 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden flex">
      <div className={`w-10 h-10 rounded-2xl ${themes[color] || themes.teal} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 shrink-0 z-10`}>
        <Icon size={18} strokeWidth={2.5} />
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
