'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, MoreHorizontal, Filter,
  Loader2, AlertCircle, TrendingUp, Zap, PieChart as PieIcon,
  ChevronRight, Globe, Shield, CreditCard
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import useDashboardStore from '@/stores/useDashboardStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AnalyticsPage() {
  const { language } = useLanguageStore();
  const { analyticsData, loading: analyticsLoading, fetchAnalytics } = useAnalyticsStore();
  const { dashboardData, loading: dashboardLoading, fetchDashboardData } = useDashboardStore();
  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('revenue');

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
    fetchAnalytics();
  }, []);

  const loading = analyticsLoading || dashboardLoading;

  if (!isMounted) return null;

  if (loading && !analyticsData) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center gap-3">
        <div className="relative">
            <div className="w-10 h-10 border-2 border-indigo-100 rounded-full animate-pulse" />
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin absolute inset-0" strokeWidth={3} />
        </div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">{t('Refreshing Data...', language)}</span>
      </div>
    );
  }

  const data = analyticsData || {};
  const totals = dashboardData?.totals || {};
  const monthlyTrend = data.monthly_trend || [];
  const statusDistribution = data.status_distribution || [];
  const paymentDistribution = data.payment_distribution || [];

  return (
    <div className="space-y-5 pb-6 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500 pt-4">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Analytics', language)}</span>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Business', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-rose-500">{t('Growth', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1 leading-relaxed opacity-80">
            {t('Tracking your sales and orders across the platform.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-lg shadow-sm">
            {['revenue', 'orders'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1 rounded-md text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {t(tab, language)}
              </button>
            ))}
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- HERO VELOCITY CHART --- */}
      <div className="p-5 bg-white rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-3 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <TrendingUp size={18} strokeWidth={3} />
            </div>
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Sales Trends', language)}</h3>
              <p className="text-md font-black text-slate-900">{t('Revenue Overview', language)}</p>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{t('Revenue', language)}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
              <span className="text-[10px] font-black text-slate-600 uppercase tracking-tighter">{t('Orders', language)}</span>
            </div>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="heroRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="heroOrders" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
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
              <Tooltip content={<PremiumTooltip />} />
              <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#heroRevenue)" />
              <Area type="monotone" dataKey="orders" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#heroOrders)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- KPI TILES --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title={t('Revenue', language)} value={totals.revenue?.value} trend={totals.revenue?.trend} isPositive={totals.revenue?.isPositive ?? true} icon={DollarSign} color="indigo" language={language} />
        <StatCard title={t('Orders', language)} value={totals.orders?.value} trend={totals.orders?.trend} isPositive={totals.orders?.isPositive ?? true} icon={ShoppingBag} color="rose" language={language} />
        <StatCard title={t('Customers', language)} value={totals.customers?.value} trend={totals.customers?.trend} isPositive={totals.customers?.isPositive ?? true} icon={Users} color="emerald" language={language} />
        <StatCard title={t('Conversion', language)} value="2.4%" trend="+0.8%" isPositive={true} icon={Activity} color="blue" language={language} />
      </div>

      {/* --- SECONDARY GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* TRANSACTION LAYER */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shadow-inner">
                <CreditCard size={16} strokeWidth={3} />
              </div>
              <h4 className="text-[12px] font-black text-slate-900 tracking-tight">{t('Payment Methods', language)}</h4>
            </div>
          </div>
          
          <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">
            {paymentDistribution.map((item, idx) => (
              <div key={item.name} className="p-3 bg-slate-50/50 rounded-xl border border-transparent hover:border-slate-100 hover:bg-white transition-all">
                <div className="flex justify-between items-center mb-2 text-[9px] font-black uppercase tracking-widest">
                  <span className="text-slate-500">{item.name}</span>
                  <span className="text-slate-900">{item.value} {t('txns', language)}</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(item.value / Math.max(...paymentDistribution.map(x=>x.value)) || 1) * 100}%` }}
                    className="h-full bg-indigo-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FULFILLMENT VELOCITY */}
        <div className="bg-slate-900 rounded-[20px] p-5 flex flex-col items-center justify-center text-white relative overflow-hidden shadow-xl h-[350px]">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-56 h-56 bg-indigo-500 rounded-full blur-[60px] opacity-20" />
          </div>
          
          <div className="text-center mb-4 relative z-10">
            <h4 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-1">{t('Summary', language)}</h4>
            <p className="text-md font-black tracking-tight">{t('Order Status', language)}</p>
          </div>

          <div className="w-full h-[180px] relative z-10 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusDistribution} innerRadius={50} outerRadius={70} paddingAngle={10} dataKey="value" strokeWidth={0} cornerRadius={8}>
                  {statusDistribution.map((e, i) => (
                    <Cell key={i} fill={['#6366f1', '#ff0080', '#10b981', '#f59e0b', '#8b5cf6'][i % 5]} />
                  ))}
                </Pie>
                <Tooltip content={<PremiumTooltip dark />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black">{statusDistribution.reduce((a,b)=>a+b.value,0)}</span>
              <span className="text-[7px] font-black text-indigo-400 uppercase tracking-widest">{t('Orders', language)}</span>
            </div>
          </div>
        </div>

        {/* AI & HEALTH */}
        <div className="flex flex-col gap-4 h-[350px]">
          <div className="flex-1 bg-indigo-600 rounded-[20px] text-white p-5 flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute right-[-5%] bottom-[-5%] w-24 h-24 bg-white/10 rounded-full blur-[30px]" />
            <div className="relative z-10">
              <h4 className="text-[12px] font-black tracking-tight mb-2 uppercase tracking-widest text-indigo-100">{t('AI Prediction', language)}</h4>
              <p className="text-md font-black leading-tight max-w-[200px]">
                {t(data.prediction?.text || 'Platform growth is stable and trending positively.', language)}
              </p>
            </div>
            <button className="relative z-10 self-end w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
          
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm">
            <h4 className="text-[9px] font-black text-slate-400 mb-4 uppercase tracking-[0.2em]">{t('Pulse Health', language)}</h4>
            <div className="space-y-4">
               <HealthRow icon={Globe} label="Latency" value="24ms" />
               <HealthRow icon={Shield} label="Security" value="100%" />
               <HealthRow icon={Zap} label="Frequency" value="0.2s" />
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

function HealthRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-slate-50 border border-slate-100 rounded-lg flex items-center justify-center text-slate-400">
          <Icon size={12} strokeWidth={3} />
        </div>
        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-black text-slate-900">{value}</span>
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] animate-pulse" />
      </div>
    </div>
  );
}

function PremiumTooltip({ active, payload, label, dark = false }) {
  if (active && payload && payload.length) {
    return (
      <div className={`${dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'} p-2 rounded-lg shadow-xl border text-[10px] font-black`}>
        <p className={`uppercase tracking-widest mb-2 ${dark ? 'text-slate-400' : 'text-slate-400'}`}>{label || 'Total'}</p>
        <div className="space-y-1.5">
          {payload.map((e, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: e.color }} />
                <span className={dark ? 'text-slate-400' : 'text-slate-500'}>{e.name}</span>
              </div>
              <span className={dark ? 'text-white' : 'text-slate-900'}>
                {e.name === 'revenue' ? `$${e.value.toLocaleString()}` : e.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
