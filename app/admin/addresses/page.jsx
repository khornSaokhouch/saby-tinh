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
    <div className="max-w-[1400px] mx-auto space-y-6 pb-20 font-sans animate-in fade-in duration-500 pt-4">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Logistics Hub</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">
            Delivery <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-400">Points</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => fetchAllAddresses()}
            className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-xl hover:bg-slate-50 transition-all active:scale-95 shadow-sm"
            title="Refresh Registry"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} strokeWidth={2.5} />
          </button>

          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm group uppercase tracking-widest">
            <Download size={14} className="group-hover:text-indigo-600 transition-colors" /> 
            <span className="group-hover:text-slate-900 transition-colors">Export DB</span>
          </button>
        </div>
      </div>

      {/* --- STATS OVERVIEW --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label="Delivery Points" value={allAddresses.length} icon={LinkIcon} color="indigo" />
        <MetricCard label="Unique Hubs" value={[...new Set(allAddresses.map(m => m.address_id))].length} icon={MapIcon} color="purple" />
        <MetricCard label="User Linkage" value={`${((allAddresses.length / Math.max(1, [...new Set(allAddresses.map(m => m.user_id))].length))).toFixed(1)}x`} icon={Users} color="emerald" />
      </div>

      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Table Controls */}
        <div className="p-4 border-b border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/20">
          <div className="relative w-full sm:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search by user, city or country..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none placeholder:text-slate-400 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
             {filteredMappings.length} Records Traceable
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar min-h-[300px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[35%]">User Identity</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest w-[40%]">Geographic Link</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Region</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Lifecycle</th>
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
        <div className="p-4 border-t border-slate-50 flex items-center justify-between bg-slate-50/10">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             {filteredMappings.length} Endpoints
           </span>
           <div className="flex gap-4">
              <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-30 uppercase tracking-widest" disabled>Previous</button>
              <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">Next Segment</button>
           </div>
        </div>
      </div>

    </div>
  );
}

function MetricCard({ label, value, trend, icon: Icon, color, subText }) {
  const themes = {
    indigo: 'bg-indigo-600 shadow-indigo-100',
    emerald: 'bg-emerald-500 shadow-emerald-100',
    purple: 'bg-purple-600 shadow-purple-100',
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all duration-500">
      <div className={`p-2 rounded-xl w-8 h-8 flex items-center justify-center text-white mb-3 shadow-lg transition-transform group-hover:scale-110 relative z-10 ${themes[color] || themes.indigo}`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <div className="flex items-baseline gap-2 relative z-10">
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
        {subText && <span className="text-[9px] font-bold text-slate-400">{subText}</span>}
      </div>
      <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
    </div>
  );
}
