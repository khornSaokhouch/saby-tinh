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

export default function AnalyticsPage() {
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
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Analyzing Data...</span>
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
      
      {/* --- HEADER (Dashboard Style) --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Intelligence Engine</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Market <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Analytics</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Detailed performance breakdown for your store.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest shadow-sm">
            <Calendar size={13} className="text-indigo-600" />
            Last 30 Days
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- KPI GRID (Dashboard StatCard Style) --- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={totals.revenue?.value || '$0'} 
          trend={totals.revenue?.trend} 
          isPositive={totals.revenue?.isPositive} 
          icon={DollarSign} 
          color="indigo"
        />
        <StatCard 
          title="Conversion" 
          value={totals.orders?.value || '0'} 
          trend={totals.orders?.trend} 
          isPositive={totals.orders?.isPositive} 
          icon={Zap} 
          color="rose"
        />
        <StatCard 
          title="New Users" 
          value={totals.customers?.value || '0'} 
          trend={totals.customers?.trend} 
          isPositive={totals.customers?.isPositive} 
          icon={Users} 
          color="emerald"
        />
        <StatCard 
          title="Total Sold" 
          value={totals.products_sold?.value || '0'} 
          trend={totals.products_sold?.trend} 
          isPositive={totals.products_sold?.isPositive} 
          icon={ShoppingBag} 
          color="blue"
        />
      </div>

      {/* --- MAIN CHARTS (Dashboard Layout Style) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Revenue Velocity (Large) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Fiscal Velocity</h3>
              <p className="text-md font-black text-slate-900">Revenue Growth</p>
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
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Distribution</h3>
            <p className="text-md font-black text-slate-900">Sales By Category</p>
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
              <span className="text-xl font-black text-slate-900 tracking-tighter">Share</span>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Market</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- TABLE (Dashboard Registry Style) --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Performance Tracking</h3>
            <p className="text-md font-black text-slate-900">Top Performing Products</p>
          </div>
          <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">Full Report</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Info</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Units Sold</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Total Net</th>
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Momentum</th>
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

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
  const themes = {
    indigo: "bg-indigo-600",
    rose: "bg-rose-500",
    emerald: "bg-emerald-500",
    blue: "bg-blue-600",
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm group relative overflow-hidden transition-all hover:shadow-md">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2 rounded-xl ${themes[color]} text-white shadow-lg`}>
          <Icon size={16} strokeWidth={2.5} />
        </div>
        <div className={`text-[9px] font-black px-1.5 py-0.5 rounded border ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] mb-0.5">{title}</p>
        <h3 className="text-xl font-black text-slate-900 tracking-tighter">{value}</h3>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border border-slate-800 text-[10px] font-black">
        <p className="uppercase tracking-widest text-slate-400 mb-1">{label || 'Value'}</p>
        <p className="text-indigo-400">
          {typeof payload[0].value === 'number' ? payload[0].value.toLocaleString() : payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}