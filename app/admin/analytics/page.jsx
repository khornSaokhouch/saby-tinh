'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, MoreHorizontal, Filter,
  Loader2, AlertCircle, TrendingUp, Zap, PieChart as PieIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';
import useAnalyticsStore from '@/stores/useAnalyticsStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AnalyticsPage() {
  const { language } = useLanguageStore();
  const { analyticsData, loading, error, fetchAnalytics } = useAnalyticsStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchAnalytics();
  }, []);

  if (!isMounted) return null;

  if (loading && !analyticsData) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Analyzing Data...', language)}</span>
      </div>
    );
  }

  const data = analyticsData || {};
  const totals = data.totals || {};
  const revenueChart = data.revenue_chart || [];
  const categoryData = data.category_data || [];
  const topProducts = data.top_products || [];

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Intelligence Engine', language)}</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Market', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">{t('Analytics', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Detailed performance breakdown for your global enterprise.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
            <Calendar size={13} className="text-indigo-600" />
            {t('Last 30 Days', language)}
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-black transition-all shadow-lg shadow-slate-200 active:scale-95">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- KPI GRID (Dashboard StatCard Style) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('Total Revenue', language)} 
          value={totals.revenue?.value || '$0'} 
          trend={totals.revenue?.trend} 
          isPositive={totals.revenue?.isPositive} 
          icon={DollarSign} 
          color="indigo"
          language={language}
        />
        <StatCard 
          title={t('Conversion', language)} 
          value={totals.orders?.value || '0'} 
          trend={totals.orders?.trend} 
          isPositive={totals.orders?.isPositive} 
          icon={Zap} 
          color="rose"
          language={language}
        />
        <StatCard 
          title={t('New Users', language)} 
          value={totals.customers?.value || '0'} 
          trend={totals.customers?.trend} 
          isPositive={totals.customers?.isPositive} 
          icon={Users} 
          color="emerald"
          language={language}
        />
        <StatCard 
          title={t('Total Sold', language)} 
          value={totals.products_sold?.value || '0'} 
          trend={totals.products_sold?.trend} 
          isPositive={totals.products_sold?.isPositive} 
          icon={ShoppingBag} 
          color="blue"
          language={language}
        />
      </div>

      {/* --- MAIN CHARTS (Dashboard Layout Style) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Revenue Velocity (Large) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Fiscal Velocity', language)}</h3>
              <p className="text-md font-black text-slate-900">{t('Revenue Growth', language)}</p>
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-300">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueChart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
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
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (Small) */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="mb-4">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Distribution', language)}</h3>
            <p className="text-md font-black text-slate-900">{t('Sales By Category', language)}</p>
          </div>
          
          <div className="flex-1 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%" cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-black text-slate-900 tracking-tighter">{t('Share', language)}</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{t('Market', language)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLE (Dashboard Registry Style) --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Performance Tracking', language)}</h3>
            <p className="text-md font-black text-slate-900">{t('Top Performing Products', language)}</p>
          </div>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">{t('Full Report', language)}</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Product Info', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Units Sold', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Total Net', language)}</th>
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Momentum', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {topProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-5 py-3">
                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{product.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] font-bold text-slate-500">{product.sales}</td>
                  <td className="px-4 py-3 text-right text-[11px] font-black text-slate-900">{product.revenue}</td>
                  <td className={`px-5 py-3 text-right text-[10px] font-black uppercase tracking-tighter ${product.trend?.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {product.trend}
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

// --- SUB COMPONENTS (Reusing Dashboard Design Patterns) ---

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

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border border-slate-800 text-[10px] font-black">
        <p className="uppercase tracking-widest text-slate-400 mb-1">{label || (payload[0]?.language === 'kh' ? 'តម្លៃ' : 'Value')}</p>
        <p className="text-indigo-400">
          {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}