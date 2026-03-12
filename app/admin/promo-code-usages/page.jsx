'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, Filter, Download, Eye, Calendar, 
  Ticket, Users, DollarSign, Activity, 
  ChevronLeft, ChevronRight, ShoppingBag
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePromoCodeUsageStore } from '@/stores/usePromoCodeUsageStore';

export default function AdminPromoCodeUsagesPage() {
  const { usages, meta, stats, fetchUsages, fetchStats, loading, error } = usePromoCodeUsageStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsages({ page: currentPage, search: searchQuery });
    fetchStats();
  }, [currentPage, searchQuery]);

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Promo Code Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Usage <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-400">Analytics</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Track and analyze promo code performance across the platform.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-500 rounded-lg text-[10px] font-black hover:text-indigo-500 transition-all shadow-sm uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Usages" 
          value={stats?.total_usages?.toLocaleString() || '0'} 
          icon={Ticket} 
          color="indigo" 
        />
        <MetricCard 
          label="Total Savings" 
          value={`$${parseFloat(stats?.total_discount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`} 
          icon={DollarSign} 
          color="emerald" 
        />
        <MetricCard 
          label="Unique Users" 
          value={stats?.unique_users?.toLocaleString() || '0'} 
          icon={Users} 
          color="purple" 
        />
        <MetricCard 
          label="Top Promo Code" 
          value={stats?.top_code?.code || 'None'} 
          subText={`${stats?.top_code?.count || 0} hits`}
          icon={Activity} 
          color="rose" 
        />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64 group text-left">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search Promo Code, User..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-500">
              <Calendar size={12} className="text-slate-400" />
              <span>Timeframe</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Usage ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Promo Code</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Discount Amount</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Date</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="7" className="py-20 text-center text-[10px] font-black text-slate-400 uppercase animate-pulse">Loading Data...</td>
                </tr>
              ) : usages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                       <Ticket size={40} className="text-slate-100" />
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                         {error ? `System Error: ${error}` : 'No usages found'}
                       </p>
                    </div>
                  </td>
                </tr>
              ) : usages.map((usage, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}
                  key={usage.id} 
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-[10px] font-bold text-slate-400">#USG-{usage.id}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[10px] font-black text-indigo-600 tracking-tighter uppercase whitespace-nowrap">
                         {usage.promo_code?.code || 'N/A'}
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-[9px] font-black text-white shadow-sm">
                        {(usage.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-bold text-slate-900 truncate max-w-[120px]">{usage.user?.name || 'Unknown User'}</span>
                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{usage.user?.email || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-[12px] font-black text-emerald-600 leading-none tabular-nums">
                      -${parseFloat(usage.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 cursor-pointer transition-colors">
                      #ORD-{usage.order_id || 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-700">
                        {new Date(usage.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                        at {new Date(usage.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 bg-slate-900 text-white rounded-lg hover:bg-black shadow-sm active:scale-95 transition-all">
                      <Eye size={14} strokeWidth={3} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-3 bg-slate-50/50 border-t border-slate-50 flex items-center justify-between">
          <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Showing: <span className="text-indigo-600">{usages.length}</span> of <span className="text-slate-900">{meta.total || 0}</span> Usages
          </p>
          
          <div className="flex items-center gap-1.5">
            <button 
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-all shadow-sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft size={14} strokeWidth={3} />
            </button>
            <div className="flex items-center gap-1">
               <button className="w-7 h-7 flex items-center justify-center rounded-lg bg-slate-900 text-white text-[9px] font-black shadow-lg shadow-slate-200">{currentPage}</button>
            </div>
            <button 
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-all shadow-sm"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= meta.last_page || loading}
            >
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
    rose: 'bg-rose-500 shadow-rose-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className={`w-8 h-8 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10`}>
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
