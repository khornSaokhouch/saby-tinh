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
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Usage Analytics</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Promo Code Usages</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest active:scale-95">
            <Download size={15} strokeWidth={2.5} />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
          color="orange" 
        />
        <MetricCard 
          label="Top Code" 
          value={stats?.top_code?.code || 'None'} 
          subText={`${stats?.top_code?.count || 0} times`}
          icon={Activity} 
          color="rose" 
        />
      </div>

      {/* --- MAIN TABLE CONTAINER --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search Code, User..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all outline-none placeholder:text-slate-400"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500">
              <Calendar size={12} className="text-slate-400" />
              <span>Filter Period</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Usage ID</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Promo Code</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Discount</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Order Reference</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Used At</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                   <td colSpan="7" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                         <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Compiling Analytics...</span>
                      </div>
                   </td>
                </tr>
              ) : usages.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                       <Ticket className="w-12 h-12 text-slate-200" />
                       <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                         {error ? `Error: ${error}` : 'No usage records found.'}
                       </p>
                    </div>
                  </td>
                </tr>
              ) : usages.map((usage, idx) => (
                <motion.tr 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                  key={usage.id} 
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-5 py-4 text-xs font-bold text-slate-400 italic">#USG-{usage.id}</td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                       <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded text-[11px] font-black text-indigo-600 tracking-tighter uppercase">
                         {usage.promo_code?.code || 'N/A'}
                       </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 flex items-center justify-center text-[10px] font-black text-white italic">
                        {(usage.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-900">{usage.user?.name || 'Unknown'}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{usage.user?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-center">
                    <span className="text-[13px] font-black text-emerald-600 leading-none">
                      -${parseFloat(usage.discount_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-bold text-indigo-600 hover:underline cursor-pointer">
                      #ORD-{usage.order_id || 'N/A'}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right text-[11px] font-bold text-slate-500 uppercase tabular-nums">
                    {new Date(usage.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    <br/>
                    <span className="opacity-50 text-[9px]">{new Date(usage.created_at).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors">
                      <Eye size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Showing <span className="text-indigo-600 italic">{usages.length}</span> of <span className="text-slate-900">{meta.total || 0}</span> usages
          </p>
          
          <div className="flex items-center gap-2">
            <button 
              className="p-2 border border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-all"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
               <button className="w-8 h-8 flex items-center justify-center rounded-xl bg-indigo-600 text-white text-xs font-black italic shadow-lg shadow-indigo-100">{currentPage}</button>
            </div>
            <button 
              className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-white disabled:opacity-30 transition-all"
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={currentPage >= meta.last_page || loading}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function MetricCard({ label, value, icon: Icon, color, subText }) {
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
        <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</h3>
            {subText && <span className="text-[10px] font-bold text-slate-400">{subText}</span>}
        </div>
      </div>
      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}
