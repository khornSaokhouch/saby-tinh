'use client';

import { useEffect, useMemo } from 'react';
import { 
  Search, Tag, Loader2, CheckCircle2, 
  Ticket, RefreshCw, DollarSign, Clock, SlidersHorizontal
} from 'lucide-react';
import { motion } from 'framer-motion';
import { usePromoCodeStore } from '@/stores/usePromoCodeStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function OwnerPromoCodesPage() {
  const { language } = useLanguageStore();
  const { 
    promoCodes, 
    loading, 
    fetchPromoCodes, 
    search, 
    setSearch 
  } = usePromoCodeStore();

  useEffect(() => {
    fetchPromoCodes();
    const interval = setInterval(() => {
      fetchPromoCodes();
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchPromoCodes]);

  const filteredPromoCodes = useMemo(() => {
    return promoCodes.filter(p => 
      (p.code || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    );
  }, [promoCodes, search]);

  const today = new Date().toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Merchant Vault', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Promo', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-500">{t('Codes', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">{t('Registry status for', language)} {today}</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchPromoCodes()}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- METRICS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard label={t('Total Strings', language)} value={promoCodes.length} icon={Ticket} color="indigo" />
        <MetricCard label={t('Active Instances', language)} value={promoCodes.filter(p => p.status === 1 || p.status === true).length} icon={CheckCircle2} color="emerald" subText={t('Live', language)} />
        <MetricCard label={t('Global Use', language)} value={promoCodes.reduce((acc, p) => acc + (p.usage_count || 0), 0)} icon={RefreshCw} color="rose" />
      </div>

      {/* --- LIST --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative w-full sm:w-64 group text-left">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={13} />
              <input 
                type="text" 
                placeholder={t('Search code strings...', language)}
                className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-100 rounded-lg text-[11px] font-bold text-slate-700 focus:bg-white focus:border-indigo-100 transition-all outline-none placeholder:text-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="hidden sm:block flex-1" />
            <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                {filteredPromoCodes.length} {t('Codes verified', language)}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Code Identifier', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{t('Benefit', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{t('Activity', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">{t('Status', language)}</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Activity Log', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && promoCodes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-indigo-500" size={24} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t('Scanning Vault...', language)}</span>
                    </div>
                  </td>
                </tr>
              ) : filteredPromoCodes.length === 0 ? (
                <tr>
                    <td colSpan="5" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Ticket size={40} className="text-slate-100" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{t('Zero strings mapped', language)}</p>
                      </div>
                    </td>
                </tr>
              ) : filteredPromoCodes.map((promo, idx) => (
                <motion.tr 
                  key={promo.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                  className="group hover:bg-slate-50/30 transition-colors"
                >
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center transition-all group-hover:bg-slate-900 group-hover:text-white">
                        <Tag size={14} strokeWidth={3} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{promo.code}</span>
                        <span className="text-[9px] font-black text-slate-300 tracking-widest uppercase mt-0.5 line-clamp-1">{promo.description || t('GENERIC_DESC', language)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[12px] font-black text-slate-900 tabular-nums">
                         {promo.discount_type === 'percentage' ? '' : '$'}{promo.discount_value}{promo.discount_type === 'percentage' ? '%' : ''}
                       </span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">
                         {promo.discount_type === 'percentage' ? t('Percentage', language) : t('Fixed', language)}
                       </span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                    <div className="flex flex-col items-center">
                       <span className="text-[12px] font-black text-indigo-600 tabular-nums">{promo.usage_count || 0}</span>
                       <span className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">{t('Total Hits', language)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-center">
                     <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest
                        ${(promo.status === 1 || promo.status === true) ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                        <div className={`w-1 h-1 rounded-full ${(promo.status === 1 || promo.status === true) ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`} />
                        {(promo.status === 1 || promo.status === true) ? t('Active', language) : t('Locked', language)}
                     </div>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                       <div className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        {t('SECURE_MAPPING', language)}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, icon: Icon, color, subText }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    rose: "bg-rose-500 shadow-rose-100",
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
            <Icon size={14} strokeWidth={3} />
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                {subText && <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">{subText}</span>}
            </div>
        </div>
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}
