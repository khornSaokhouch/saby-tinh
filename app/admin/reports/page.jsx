'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, MoreHorizontal, Zap,
  TrendingUp, Award, Rocket, Target, PieChart as PieIcon,
  ChevronRight, ArrowRight, Wallet, Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import useDashboardStore from '@/stores/useDashboardStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { Loader2 } from 'lucide-react';

export default function ReportsPage() {
  const { language } = useLanguageStore();
  const { reportsData, loading: reportsLoading, fetchReports } = useAnalyticsStore();
  const { dashboardData, loading: dashboardLoading, fetchDashboardData } = useDashboardStore();
  const [isMounted, setIsMounted] = useState(false);
  const [dateRange] = useState('Last 7 Days');

  useEffect(() => {
    setIsMounted(true);
    fetchReports();
    fetchDashboardData();
  }, []);

  if (!isMounted) return null;

  if ((reportsLoading || dashboardLoading) && !reportsData) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <div className="relative">
            <div className="w-12 h-12 border-2 border-indigo-100 rounded-full animate-pulse" />
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin absolute inset-0" strokeWidth={3} />
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">{t('Loading Reports...', language)}</span>
      </div>
    );
  }

  const totals = dashboardData?.totals || {};
  const revenueChart = dashboardData?.revenue_chart || [];
  const topStores = reportsData?.top_stores || [];
  const topCategories = reportsData?.top_categories || [];
  const userDistribution = reportsData?.user_distribution || [];
  const latestPayouts = reportsData?.latest_payouts || [];

  return (
    <div className="space-y-5 pb-6 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 pt-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Reports Overview', language)}</span>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Business', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-indigo-600">{t('Insights', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('A clear look at how your platform is growing.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
            <Calendar size={13} className="text-indigo-600" strokeWidth={3} />
            {t(dateRange, language)}
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('Gross Revenue', language)} 
          value={totals.revenue?.value || "$0.00"} 
          trend={totals.revenue?.trend || "0%"} 
          isPositive={totals.revenue?.isPositive ?? true} 
          icon={DollarSign} 
          color="indigo"
          language={language}
        />
        <StatCard 
          title={t('Network Nodes', language)} 
          value={userDistribution.reduce((a,c)=>a+c.count, 0).toString()} 
          trend="+12%" 
          isPositive={true} 
          icon={Users} 
          color="rose"
          language={language}
        />
        <StatCard 
          title={t('Elite Merchants', language)} 
          value={topStores.length.toString()} 
          trend="+5%" 
          isPositive={true} 
          icon={Award} 
          color="emerald"
          language={language}
        />
        <StatCard 
          title={t('Fulfillment Rate', language)} 
          value="98.4%" 
          trend="+0.2%" 
          isPositive={true} 
          icon={Zap} 
          color="blue"
          language={language}
        />
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* REVENUE CHART */}
        <div className="lg:col-span-8 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Revenue Growth', language)}</h3>
              <p className="text-md font-black text-slate-900">{t('Sales Overview', language)}</p>
            </div>
            <div className="text-right">
                <p className="text-lg font-black text-slate-900 tracking-tighter leading-none">{totals.revenue?.value}</p>
                <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">{totals.revenue?.trend} {t('Growth', language)}</p>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="repoGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 800 }} 
                />
                <YAxis 
                   axisLine={false} 
                   tickLine={false} 
                   tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 800 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area type="natural" dataKey="value" stroke="#6366f1" strokeWidth={3} fill="url(#repoGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* DISTRIBUTION PIE */}
        <div className="lg:col-span-4 bg-slate-900 p-5 rounded-[20px] shadow-xl flex flex-col h-[350px] relative overflow-hidden text-white">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute bottom-[-10%] right-[-10%] w-48 h-48 bg-rose-500 rounded-full blur-[50px] opacity-20" />
          </div>
          
          <div className="mb-4 relative z-10 text-center">
            <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{t('Distribution', language)}</h3>
            <p className="text-md font-black">{t('Your Community', language)}</p>
          </div>

          <div className="flex-1 relative z-10 flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={userDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={75} paddingAngle={8} dataKey="count" cornerRadius={10}>
                  {userDistribution.map((e, i) => (
                    <Cell key={i} fill={['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip dark />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
               <span className="text-2xl font-black">{userDistribution.reduce((a,c)=>a+c.count, 0)}</span>
               <span className="text-[8px] font-black text-indigo-400 tracking-widest uppercase">{t('Nodes', language)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 relative z-10 mt-4">
            {userDistribution.slice(0, 4).map((r, i) => (
              <div key={i} className="p-2 bg-white/5 rounded-xl border border-white/10 flex flex-col items-center">
                <span className="text-[8px] font-bold text-indigo-300 uppercase mb-0.5">{t(r.role, language)}</span>
                <span className="text-sm font-black">{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- ELITE MERCHANTS --- */}
      <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Award size={16} strokeWidth={3} /></div>
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Merchants', language)}</h3>
              <p className="text-md font-black text-slate-900">{t('Top Rated Sellers', language)}</p>
            </div>
          </div>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:bg-slate-50 px-3 py-1.5 rounded-lg transition-all">{t('Full Audit', language)}</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {topStores.slice(0, 6).map((s, i) => (
            <div key={s.id} className="p-3 bg-white rounded-xl border border-slate-100 hover:border-indigo-100 hover:shadow-md transition-all flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden relative">
                  {s.store_image ? <img src={`http://127.0.0.1:8000/storage/${s.store_image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-slate-900 text-white flex items-center justify-center text-[10px] font-black">{s.name.charAt(0)}</div>}
                  <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-slate-900 text-white text-[7px] font-black flex items-center justify-center rounded-bl-lg">{i+1}</div>
                </div>
                <div>
                  <h5 className="text-[12px] font-black text-slate-800 line-clamp-1">{s.name}</h5>
                  <p className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">{s.total_orders} {t('Orders', language)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-black text-slate-900 tracking-tighter">${number_format(s.total_revenue)}</p>
                <div className="h-1 w-16 bg-slate-50 rounded-full mt-1.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(s.total_revenue / topStores[0].total_revenue) * 100}%` }} className="h-full bg-indigo-500" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- LATEST LIQUIDATIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
             <div className="flex items-center gap-3">
               <div className="w-8 h-8 bg-rose-50 text-rose-500 rounded-xl flex items-center justify-center"><Wallet size={16} strokeWidth={3} /></div>
               <h4 className="text-md font-black text-slate-900">{t('Recent Payouts', language)}</h4>
             </div>
             <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest bg-rose-50 px-2 py-0.5 rounded-lg">{t('Live', language)}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {latestPayouts.slice(0, 4).map((p, i) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 capitalize">{p.store?.name?.charAt(0) || 'S'}</div>
                  <div>
                    <p className="text-[11px] font-black text-slate-800 line-clamp-1">{p.store?.name || 'S'}</p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-sm font-black text-slate-900 tracking-tighter">${number_format(p.amount)}</p>
                  <span className="text-[7px] font-black uppercase text-emerald-500 flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-emerald-500" />
                    {p.status || 'Paid'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="bg-slate-900 p-5 rounded-[20px] text-white flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h5 className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-1">{t('Tips', language)}</h5>
              <p className="text-sm font-black tracking-tight leading-tight">{t('Your business is performing well!', language)}</p>
            </div>
            <button className="w-7 h-7 bg-white/10 rounded-full flex items-center justify-center self-end border border-white/10 hover:bg-white/20 transition-all">
              <ArrowUpRight size={14} />
            </button>
          </div>
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 flex flex-col justify-between shadow-sm">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{t('Avg Performance', language)}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-slate-900">$4.2k</span>
              <span className="text-[8px] font-black text-emerald-500">+12%</span>
            </div>
            <div className="h-1 w-full bg-slate-50 rounded-full mt-3">
              <div className="h-full w-2/3 bg-indigo-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB COMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color, language }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    rose: "bg-rose-500 shadow-rose-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110`}>
          <Icon size={14} strokeWidth={3} />
        </div>
        <div className={`text-[8px] font-black px-1.5 py-0.5 rounded border ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{title}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function CustomTooltip({ active, payload, label, dark = false }) {
  if (active && payload && payload.length) {
    return (
      <div className={`${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-2 rounded-lg shadow-xl border text-[10px] font-black`}>
        <p className={`uppercase tracking-widest mb-1 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{label || 'Metric'}</p>
        <div className="space-y-1">
          {payload.map((e, i) => (
            <p key={i} className={dark ? 'text-white' : 'text-slate-900'}>
              {['value','revenue','count'].includes(e.name) ? `$${e.value.toLocaleString()}` : e.value.toLocaleString()}
            </p>
          ))}
        </div>
      </div>
    );
  }
  return null;
}

function number_format(number) {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(number);
}
