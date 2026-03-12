'use client';

import React, { useState, useEffect } from 'react';
import useInvoiceStore from '../../stores/useInvoiceStore';
import { 
  Search, Filter, Download, ArrowUpRight, Store, 
  CheckCircle2, Clock, ChevronDown, DollarSign,
  TrendingUp, RefreshCw
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminInvoices() {
  const [search, setSearch] = useState('');
  const { storeStats, stats, loading, fetchStoreStats, fetchStats } = useInvoiceStore();

  useEffect(() => {
    fetchStats();
    fetchStoreStats();
  }, []);

  const filteredStores = storeStats.filter(store => 
    store.name.toLowerCase().includes(search.toLowerCase()) &&
    parseInt(store.paid_count || 0) > 0
  );

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Financial Registry</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-400">Payments</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Browse and coordinate merchant earnings and transaction settlements.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { fetchStats(); fetchStoreStats(); }}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:border-indigo-300 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={13} className={`${loading ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} strokeWidth={3} />
            Sync
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-black hover:bg-slate-800 transition-all shadow-md uppercase tracking-widest active:scale-95">
            <Download size={14} strokeWidth={3} />
            Export
          </button>
        </div>
      </div>

      {/* --- KPI GRID (Dashboard Style) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={`$${(stats?.total_gmv || 0).toLocaleString()}`} 
          icon={DollarSign} 
          color="indigo" 
          trend="+12%" 
        />
        <StatCard 
          title="Paid Orders" 
          value={(stats?.paid_count || 0).toString()} 
          icon={CheckCircle2} 
          color="emerald" 
          trend="Active"
        />
        <StatCard 
          title="Pending" 
          value={`$${(stats?.pending_amount || 0).toLocaleString()}`} 
          icon={Clock} 
          color="rose" 
          trend="Waiting"
        />
        <StatCard 
          title="Merchants" 
          value={storeStats.length.toString()} 
          icon={Store} 
          color="blue" 
          trend="Online"
        />
      </div>

      {/* --- MAIN REGISTRY TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white">
          <div className="relative w-full sm:w-72 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={13} />
            <input 
              type="text" 
              placeholder="Search store name..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-transparent rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:bg-white focus:border-indigo-100 transition-all placeholder:text-slate-400 placeholder:font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

<div className="flex items-center gap-2">
  <FilterSelect 
    options={['All Merchants', 'Active', 'Top Earners']} 
    value="All Merchants" 
    onChange={(e) => console.log(e.target.value)}
  />
</div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Store Profile</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Net</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Paid Orders</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(3).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-5 h-16 bg-white"></td>
                  </tr>
                ))
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center">
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">No merchants located in registry</p>
                  </td>
                </tr>
              ) : filteredStores.map((store, idx) => (
                <tr key={store.id} className="group hover:bg-slate-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm shrink-0">
                        <img 
                          src={store.store_image || 'https://via.placeholder.com/100'} 
                          alt={store.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h3 className="text-xs font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                        <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest mt-0.5">ID: #{store.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 tracking-tight">${parseFloat(store.total_earned || 0).toLocaleString()}</span>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Accumulated Earnings</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="text-xs font-black text-slate-700">{store.paid_count}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border border-emerald-100 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-widest">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/invoices/stores?store_id=${store.id}`}>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-sm active:scale-95 group/btn">
                        <span>Details</span>
                        <ArrowUpRight size={12} strokeWidth={3} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

       
      </div>
    </div>
  );
}

// --- SHARED COMPONENT: StatCard ---

function StatCard({ title, value, icon: Icon, color, trend }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100",
    blue: "bg-blue-600 shadow-blue-100",
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={14} strokeWidth={3} />
        </div>
        {trend && (
          <div className="text-[8px] font-black px-1.5 py-0.5 rounded border bg-slate-50 text-slate-400 uppercase tracking-widest">
            {trend}
          </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

// --- Updated Sub-component ---
function FilterSelect({ options, value, onChange }) {
  return (
    <div className="relative">
      <select 
        value={value}
        onChange={onChange} // <--- Add this line
        className="appearance-none bg-white border border-slate-100 hover:border-indigo-200 rounded-lg pl-3 pr-8 py-1.5 text-[9px] font-black uppercase tracking-widest text-slate-600 outline-none transition-all cursor-pointer shadow-sm"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
        <ChevronDown size={12} strokeWidth={3} />
      </div>
    </div>
  );
}