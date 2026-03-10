"use client";
import React, { useState, useEffect } from 'react';
import useInvoiceStore from '../../stores/useInvoiceStore';
import { 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  Store, 
  CheckCircle2,
  Clock,
  ChevronDown,
  DollarSign,
  ChevronRight,
  TrendingUp,
  Activity
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
    <div className="space-y-6 pb-10 font-sans p-4 sm:p-8 bg-slate-50/20 min-h-screen">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Finance Overview</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase italic">
            STORE<span className="text-indigo-600">.</span>PAYMENTS
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-[11px] font-black hover:bg-slate-50 transition-all shadow-sm uppercase tracking-widest active:scale-95">
            <Download size={15} strokeWidth={2.5} />
            <span>Consolidated Export</span>
          </button>
        </div>
      </div>

      {/* --- KPI METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard 
          label="Total Sales" 
          value={`$${(stats?.total_gmv || 0).toLocaleString()}`} 
          icon={DollarSign} 
          color="indigo" 
          trend="+12.5%" 
        />
        <MetricCard 
          label="Paid Orders" 
          value={(stats?.paid_count || 0).toString()} 
          icon={CheckCircle2} 
          color="emerald" 
          trend="Live"
        />
        <MetricCard 
          label="Waiting" 
          value={`$${(stats?.pending_amount || 0).toLocaleString()}`} 
          icon={Clock} 
          color="orange" 
          trend="Awaiting"
        />
        <MetricCard 
          label="Total Stores" 
          value={storeStats.length.toString()} 
          icon={Store} 
          color="rose" 
          trend="Online"
        />
      </div>

      {/* --- MAIN CONTAINER --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/30">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search merchant or store name..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-300 transition-all outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
              <FilterSelect options={['All Merchants', 'Active', 'Top Earners']} value="All Merchants" onChange={() => {}} icon={Filter} />
          </div>
        </div>

        {/* Table/List View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Store Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Paid Orders</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="px-6 py-6 h-16 bg-white"></td>
                  </tr>
                ))
              ) : filteredStores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Store className="mx-auto text-slate-200 mb-4" size={48} />
                    <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] italic">No merchants discovered</p>
                  </td>
                </tr>
              ) : filteredStores.map((store, idx) => (
                <motion.tr
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  key={store.id}
                  className="group hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm group-hover:scale-105 transition-transform duration-500">
                        <img 
                          src={store.store_image || 'https://via.placeholder.com/100'} 
                          alt={store.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="text-sm font-black text-slate-900 tracking-tight leading-none uppercase italic group-hover:text-indigo-600 transition-colors">{store.name}</h3>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mt-1">Merchant ID: #{store.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <p className="text-base font-[900] text-slate-900 italic tracking-tight">${parseFloat(store.total_earned || 0).toLocaleString()}</p>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gross Revenue</p>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                       <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
                          <CheckCircle2 size={14} />
                       </div>
                       <div className="flex flex-col">
                          <p className="text-sm font-black text-slate-900 leading-none">{store.paid_count}</p>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paid Orders</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-lg shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic">Active Store</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link href={`/admin/invoices/stores?store_id=${store.id}`}>
                      <button className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95 group/btn">
                        <span>See Payments</span>
                        <ArrowUpRight size={14} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </Link>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50/30 border-t border-slate-100 text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Authorized Financial Registry • {filteredStores.length} Active Merchants</p>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, trend }) {
  const styles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    orange: "bg-orange-50 text-orange-600 border-orange-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100/50 ${styles[color]}`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        {trend && (
           <div className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-widest italic ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
             {trend}
           </div>
        )}
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none italic">{value}</h3>
      </div>
      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
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
