'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3, TrendingUp, ShoppingCart, Package,
  DollarSign, CheckCircle2, Clock, XCircle, Truck,
  RefreshCw, ArrowUpRight, ArrowDownRight, Star,
  Layers, Calendar, ChevronDown, Image as ImageIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useReportByStore } from '@/stores/useReportByStore';
import { useStore } from '@/stores/useStore';

// --- HELPERS ---
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function MetricCard({ label, value, sub, icon: Icon, color, loading, trend }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    amber: "bg-amber-500 shadow-amber-100",
    rose: "bg-rose-500 shadow-rose-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    slate: "bg-slate-700 shadow-slate-100",
  };

  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm transition-all hover:shadow-md group relative overflow-hidden">
        <div className={`w-8 h-8 rounded-xl ${themes[color] || themes.indigo} text-white shadow-lg flex items-center justify-center transition-transform group-hover:scale-110 mb-3 relative z-10`}>
            <Icon size={14} strokeWidth={3} />
        </div>
        <div className="relative z-10">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
            {loading ? (
                <div className="h-6 w-16 bg-slate-50 rounded animate-pulse" />
            ) : (
                <div className="flex items-baseline gap-2">
                    <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
                    {sub && <span className="text-[9px] font-bold text-slate-300">{sub}</span>}
                </div>
            )}
        </div>
        {trend !== undefined && !loading && (
            <div className={`absolute top-4 right-4 flex items-center gap-0.5 text-[8px] font-black px-1.5 py-0.5 rounded-md ${trend >= 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                {trend >= 0 ? <ArrowUpRight size={8} strokeWidth={3} /> : <ArrowDownRight size={8} strokeWidth={3} />}
                {Math.abs(trend)}%
            </div>
        )}
        <div className="absolute -right-2 -bottom-2 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

// Horizontal bar chart
function HBarChart({ data, max }) {
  return (
    <div className="space-y-2.5">
      {data.map((item, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="text-[9px] font-black text-slate-400 w-16 truncate shrink-0 text-right uppercase tracking-tighter">{item.label}</span>
          <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${max > 0 ? (item.value / max) * 100 : 0}%` }}
              transition={{ duration: 0.7, delay: i * 0.05 }}
              className={`h-full rounded-full ${item.color || 'bg-indigo-500'}`}
            />
          </div>
          <span className="text-[9px] font-black text-slate-900 w-10 shrink-0 tabular-nums">{item.display ?? item.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function OwnerAnalyticsPage() {
  const { analytics, loading: analyticsLoading, fetchAnalytics } = useReportByStore();
  const { stores, fetchStores } = useStore();

  const [period, setPeriod] = useState('This Year');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeStore = stores?.[0]; // Assuming owner has one store

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    if (activeStore?.id) {
      const rangeMap = {
        'Last 7 Days': '7days',
        'Last 30 Days': '30days',
        'This Month': 'thisMonth',
        'This Year': 'thisYear'
      };
      fetchAnalytics(activeStore.id, rangeMap[period] || 'thisYear');
    }
  }, [activeStore?.id, period, fetchAnalytics]);

  const handleRefresh = async () => {
    if (activeStore?.id) {
        setIsRefreshing(true);
        const rangeMap = {
            'Last 7 Days': '7days',
            'Last 30 Days': '30days',
            'This Month': 'thisMonth',
            'This Year': 'thisYear'
        };
        await fetchAnalytics(activeStore.id, rangeMap[period] || 'thisYear');
        setIsRefreshing(false);
    }
  };

  const loading = analyticsLoading;

  // --- Core KPIs ---
  const kpis = useMemo(() => {
    if (!analytics?.kpis) return { revenue: 0, count: 0, avg: 0, paid: 0, pending: 0 };
    return { 
        revenue: analytics.kpis.revenue, 
        count: analytics.kpis.orders, 
        avg: analytics.kpis.avg, 
        paid: analytics.kpis.paid, 
        pending: analytics.kpis.pending 
    };
  }, [analytics]);

  // --- Monthly Revenue Chart ---
  const monthlyRevenue = useMemo(() => analytics?.monthly_revenue || Array(12).fill(0), [analytics]);
  const maxMonthRev = Math.max(...monthlyRevenue, 1);

  // --- Monthly Order Count ---
  const monthlyOrders = useMemo(() => analytics?.monthly_orders || Array(12).fill(0), [analytics]);
  const maxMonthOrd = Math.max(...monthlyOrders, 1);

  // --- Order Status Breakdown ---
  const statusBreakdown = useMemo(() => {
    const data = analytics?.status_breakdown || [];
    const colors = { Pending: 'bg-amber-400', Processing: 'bg-indigo-400', Shipped: 'bg-blue-400', Delivered: 'bg-emerald-400', Cancelled: 'bg-slate-300' };
    return data.map(item => ({ ...item, color: colors[item.label] || 'bg-slate-200' }));
  }, [analytics]);

  const maxStatus = Math.max(...statusBreakdown.map(s => s.value), 1);

  // --- Payment Breakdown ---
  const paymentBreakdown = useMemo(() => {
    const data = analytics?.payment_breakdown || [];
    const colors = { Paid: 'bg-emerald-400', Pending: 'bg-amber-400', Failed: 'bg-rose-400', Refunded: 'bg-slate-300' };
    return data.map(item => ({ ...item, color: colors[item.label] || 'bg-slate-200' }));
  }, [analytics]);

  const maxPayment = Math.max(...paymentBreakdown.map(p => p.value), 1);

  // --- Top Products ---
  const topProducts = useMemo(() => analytics?.top_products || [], [analytics]);
  const maxProductRev = Math.max(...topProducts.map(p => p.revenue), 1);

  // --- Category Breakdown ---
  const categoryBreakdown = useMemo(() => {
    const data = analytics?.category_breakdown || [];
    const palette = ['bg-indigo-500','bg-rose-500','bg-amber-500','bg-emerald-500','bg-blue-500'];
    return data.map((item, i) => ({ ...item, color: palette[i % palette.length] }));
  }, [analytics]);

  const maxCat = Math.max(...categoryBreakdown.map(c => c.value), 1);

  const today = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">

      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Store <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-rose-500">Analytics</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">Insights for {today}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 bg-white border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} strokeWidth={3} />
          </button>
          
          <div className="relative group">
            <select
              value={period}
              onChange={e => setPeriod(e.target.value)}
              className="appearance-none bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest pl-4 pr-8 py-2 rounded-lg outline-none cursor-pointer shadow-md hover:bg-slate-800 transition-all"
            >
              {['Last 7 Days', 'Last 30 Days', 'This Month', 'This Year'].map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* --- KPI CARDS --- */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard label="Revenue" value={`$${kpis.revenue.toLocaleString(undefined, {maximumFractionDigits:0})}`} icon={DollarSign} color="indigo" loading={loading} />
        <MetricCard label="Orders" value={kpis.count} icon={ShoppingCart} color="amber" loading={loading} />
        <MetricCard label="Average" value={`$${kpis.avg.toFixed(0)}`} icon={TrendingUp} color="emerald" loading={loading} />
        <MetricCard label="Paid" value={kpis.paid} icon={CheckCircle2} color="slate" loading={loading} />
        <MetricCard label="Pending" value={kpis.pending} icon={Clock} color="rose" loading={loading} />
      </div>

      {/* --- CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Revenue Performance */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><DollarSign size={14} strokeWidth={3}/></div>
                    <div className="text-left">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Monthly Revenue</h3>
                        <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Cycle distribution</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">${kpis.revenue.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
                </div>
            </div>
            {loading ? (
                <div className="h-28 bg-slate-50 rounded-xl animate-pulse" />
            ) : (
                <div className="h-28 flex items-end gap-1 px-1">
                    {monthlyRevenue.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                            <div className="relative w-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max((v / maxMonthRev) * 100, v > 0 ? 5 : 2)}px` }}
                                    transition={{ duration: 0.6, delay: i * 0.03 }}
                                    className="w-full bg-indigo-100 group-hover:bg-indigo-500 transition-all rounded-t-md"
                                />
                            </div>
                            <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">{MONTHS[i][0]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* Order Frequency */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5 flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><ShoppingCart size={14} strokeWidth={3}/></div>
                    <div className="text-left">
                        <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Order Velocity</h3>
                        <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Volume per cycle</p>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-xl font-black text-slate-900 tracking-tighter">{kpis.count}</span>
                </div>
            </div>
            {loading ? (
                <div className="h-28 bg-slate-50 rounded-xl animate-pulse" />
            ) : (
                <div className="h-28 flex items-end gap-1 px-1">
                    {monthlyOrders.map((v, i) => (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                            <div className="relative w-full">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${Math.max((v / maxMonthOrd) * 100, v > 0 ? 5 : 2)}px` }}
                                    transition={{ duration: 0.6, delay: i * 0.03 }}
                                    className="w-full bg-amber-100 group-hover:bg-amber-400 transition-all rounded-t-md"
                                />
                            </div>
                            <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">{MONTHS[i][0]}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* --- MULTI-METRIC ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Status Heatmap */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center"><BarChart3 size={12} strokeWidth={3}/></div>
                <div className="text-left">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Order Status</h3>
                    <p className="text-[8px] font-black text-slate-300 mt-1 uppercase tracking-tighter">Fulfillment breakdown</p>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">{[...Array(4)].map((_,i) => <div key={i} className="h-3 bg-slate-50 rounded animate-pulse" />)}</div>
            ) : statusBreakdown.length > 0 ? (
                <HBarChart data={statusBreakdown} max={maxStatus} />
            ) : (
                <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4">No data available</p>
            )}
        </div>

        {/* Payment Health */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={12} strokeWidth={3}/></div>
                <div className="text-left">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Financials</h3>
                    <p className="text-[8px] font-black text-slate-300 mt-1 uppercase tracking-tighter">Payment success rate</p>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">{[...Array(3)].map((_,i) => <div key={i} className="h-3 bg-slate-50 rounded animate-pulse" />)}</div>
            ) : paymentBreakdown.length > 0 ? (
                <HBarChart data={paymentBreakdown} max={maxPayment} />
            ) : (
                <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4">No data available</p>
            )}
        </div>

        {/* Category Focus */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2.5 mb-6">
                <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center"><Layers size={12} strokeWidth={3}/></div>
                <div className="text-left">
                    <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Stock Density</h3>
                    <p className="text-[8px] font-black text-slate-300 mt-1 uppercase tracking-tighter">Volume by category</p>
                </div>
            </div>
            {loading ? (
                <div className="space-y-2">{[...Array(4)].map((_,i) => <div key={i} className="h-3 bg-slate-50 rounded animate-pulse" />)}</div>
            ) : categoryBreakdown.length > 0 ? (
                <HBarChart data={categoryBreakdown} max={maxCat} />
            ) : (
                <p className="text-[10px] text-slate-300 font-black uppercase text-center py-4">No data available</p>
            )}
        </div>
      </div>

      {/* --- TOP PERFORMANCE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-50 bg-slate-50/20 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center"><Star size={14} strokeWidth={3}/></div>
          <div className="text-left">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Top Performance</h3>
            <p className="text-[9px] font-bold text-slate-300 mt-1 uppercase">Best sellers by revenue share</p>
          </div>
        </div>
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Product identity</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Efficiency</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Revenue</th>
                <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Market share</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i}><td colSpan={4} className="px-6 py-4"><div className="h-10 bg-slate-50 rounded-xl animate-pulse" /></td></tr>
                ))
              ) : topProducts.length > 0 ? topProducts.map(({ id, name, category, image, revenue, units }, i) => {
                const pct = Math.round((revenue / maxProductRev) * 100);
                return (
                  <motion.tr
                    key={id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group hover:bg-slate-50/30 transition-colors"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl overflow-hidden bg-white border border-slate-100 shadow-sm flex items-center justify-center shrink-0">
                          {image ? <img src={image} alt={name} className="w-full h-full object-cover" /> : <ImageIcon size={14} className="text-slate-200" />}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-[11px] font-black text-slate-900 truncate tracking-tight uppercase leading-tight">{name}</p>
                          <p className="text-[9px] font-black text-indigo-400 uppercase tracking-tighter">{category || 'GENERIC'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                        <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-700">{units} UNITS</span>
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Fulfillment</span>
                        </div>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <span className="text-[12px] font-black text-slate-900 tracking-tight">${revenue.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1.5 bg-slate-50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, delay: i * 0.05 }}
                            className="h-full bg-orange-400 rounded-full"
                          />
                        </div>
                        <span className="text-[9px] font-black text-slate-400 w-8 tabular-nums">{pct}%</span>
                      </div>
                    </td>
                  </motion.tr>
                );
              }) : (
                <tr>
                  <td colSpan={4} className="py-16 text-center">
                    <p className="text-[10px] text-slate-300 font-black uppercase">Insufficient data patterns</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}