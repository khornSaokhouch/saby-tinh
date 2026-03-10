'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  MapPin, Users, ExternalLink , Home, Globe, Calendar, 
  Loader2, Search, Filter, Download, ArrowUpRight,
  ShieldCheck, Map as MapIcon, Link as LinkIcon,
  ShieldAlert, MoreHorizontal, Trash2, RefreshCw
} from 'lucide-react';
import { useAddressStore } from '@/stores/useAddressStore';
import { motion } from 'framer-motion';

export default function AdminAddressesPage() {
  const { allAddresses, fetchAllAddresses, loading, error } = useAddressStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAllAddresses();

    const interval = setInterval(() => {
      fetchAllAddresses();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllAddresses]);

  const filteredMappings = useMemo(() => {
    return allAddresses.filter(m => 
      String(m.user_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.user_email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.province || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(m.country_name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allAddresses, searchTerm]);

  return (
    <div className="space-y-10 font-sans">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Address Directory</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none italic uppercase">Addresses</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchAllAddresses()}
            className="p-3 bg-white border border-slate-100 text-slate-600 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm group uppercase tracking-widest">
            <Download size={14} className="group-hover:text-indigo-600 transition-colors" /> 
            <span className="group-hover:text-slate-900 transition-colors">Export Registry</span>
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          label="Total Addresses"
          value={allAddresses.length}
          trend="+8%"
          icon={LinkIcon}
        />
        <MetricCard
          label="Unique Locations"
          value={[...new Set(allAddresses.map(m => m.address_id))].length}
          trend="+5.2%"
          icon={MapIcon}
        />
        <MetricCard
          label="Address Density"
          value={`${((allAddresses.length / Math.max(1, [...new Set(allAddresses.map(m => m.user_id))].length))).toFixed(1)}x`}
          trend="+1.2%"
          icon={Users}
        />
      </div>

      {/* --- ADDRESSES TABLE --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Filter by user or location..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-slate-400 hover:text-indigo-600 transition-colors group">
            <Filter size={16} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-widest">Advanced Filters</span>
          </button>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Address Details</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Country</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                 <tr><td colSpan="4" className="px-8 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                   <div className="flex flex-col items-center gap-4">
                     <Loader2 className="animate-spin text-indigo-500" size={32} />
                     Loading addresses...
                   </div>
                 </td></tr>
              ) : error ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center">
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100">
                      <ShieldAlert size={14} /> Error: {error}
                    </div>
                 </td></tr>
              ) : filteredMappings.length === 0 ? (
                 <tr><td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-bold">No addresses found.</td></tr>
              ) : (
                filteredMappings.map((mapping, idx) => (
                  <tr key={`${mapping.user_id}-${mapping.address_id}-${idx}`} className="group hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center font-black text-slate-400 text-[11px] border border-white shadow-sm uppercase group-hover:bg-white transition-colors">
                           {mapping.user_name ? mapping.user_name.charAt(0) : '?'}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[13px] font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{mapping.user_name}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{mapping.user_email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${mapping.latitude},${mapping.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col group/address"
                        title="Open in Google Maps"
                      >
                        <div className="flex items-center gap-1.5">
                          <span className="text-[13px] font-black text-slate-700 leading-tight group-hover/address:text-indigo-600 transition-colors">
                            {mapping.house_number ? `#${mapping.house_number}, ` : ''}{mapping.street}
                          </span>
                          <ExternalLink size={10} className="text-slate-300 opacity-0 group-hover/address:opacity-100 group-hover/address:text-indigo-400 transition-all" />
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/address:text-slate-500 transition-colors">
                          {mapping.commune}, {mapping.district}, {mapping.province}
                        </span>
                      </a>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100/50 transition-all shadow-sm">
                        {mapping.country_name || 'Unset'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex flex-col items-end">
                         <span className="text-[11px] font-black text-slate-900 italic">
                           {new Date(mapping.linked_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                         </span>
                         <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 uppercase mt-0.5 tracking-widest bg-emerald-50 px-1.5 rounded-md border border-emerald-100/50">
                            <ShieldCheck size={10} /> Live
                         </div>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
             Total: {filteredMappings.length} Endpoints
           </span>
           <div className="flex gap-4">
              <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 uppercase tracking-[0.2em]" disabled>Prev</button>
              <button className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Next Segment</button>
           </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, isWarning }) {
  return (
    <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className="absolute top-0 right-0 w-20 h-20 translate-x-8 -translate-y-8 rounded-full bg-indigo-600 opacity-0 group-hover:opacity-[0.03] active:opacity-[0.05] group-hover:rotate-45 transition-all duration-700" />
      
      <div className="flex items-start justify-between mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border-2 border-white shadow-sm ${isWarning ? 'bg-rose-50 text-rose-600 border-rose-100/50' : 'bg-indigo-50 text-indigo-600 border-indigo-100/50'} group-hover:scale-110 transition-transform duration-500`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded-md shadow-sm border ${trend.includes('+') ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
          {trend} <ArrowUpRight size={10} strokeWidth={3} />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700" />
    </div>
  );
}
