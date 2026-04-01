'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Package, ShoppingCart, BarChart3, 
  TrendingUp, ArrowUpRight, 
  MoreHorizontal, Plus, ShieldCheck, RefreshCw,
  Store, DollarSign, CheckCircle2, Clock, Truck,
  XCircle, Loader2, Box, ChevronRight, Image as ImageIcon,
  Search, Filter, Download, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import { useStore } from '@/stores/useStore';
import { useReportByStore } from '@/stores/useReportByStore';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OwnerDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { dashboardData, loading: dashboardLoading, fetchDashboardData } = useReportByStore();
  const { stores, fetchStores } = useStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const activeStore = stores?.[0]; // Assuming owner has one store

  useEffect(() => {
    setIsMounted(true);
    fetchStores();
  }, [fetchStores]);

  useEffect(() => {
    if (activeStore?.id) {
        fetchDashboardData(activeStore.id);
    }
  }, [activeStore?.id, fetchDashboardData]);

  const handleRefresh = async () => {
    if (activeStore?.id) {
        setIsRefreshing(true);
        await fetchDashboardData(activeStore.id);
        setIsRefreshing(false);
    }
  };

  const loading = dashboardLoading;
  const pulse = dashboardData?.pulse || { 
    all_time_revenue: 0, 
    today_revenue: 0, 
    yesterday_revenue: 0,
    week_revenue: 0, 
    pending_orders: 0, 
    low_stock: 0 
  };
  const trend = dashboardData?.trend || [];
  const recentOrders = dashboardData?.recent_orders || [];
  const recentPayouts = dashboardData?.recent_payouts || [];

  const chartData = useMemo(() => {
    return trend.map(t => ({ 
        name: new Date(t.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }), 
        value: t.revenue 
    }));
  }, [trend]);

  return (
    <div className="space-y-5 pb-6 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Store Management Center</span>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {activeStore ? activeStore.name : 'Welcome back, '} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Owner</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Here's a summary of your shop performance today.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pulse.low_stock > 0 && (
            <Link href="/owner/products?filter=low-stock" className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-lg text-[9px] font-black text-rose-600 uppercase tracking-widest animate-bounce shadow-sm">
                <AlertCircle size={12} />
                <span>{pulse.low_stock} Low Stock Item(s)</span>
            </Link>
          )}

          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:border-indigo-300 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={13} className={`${isRefreshing ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} strokeWidth={3} />
            Sync
          </button>
          <Link 
            href="/owner/products/create"
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95"
          >
            <Plus size={14} strokeWidth={3} />
          </Link>
        </div>
      </div>

      {/* --- STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Sales" 
          value={`$${pulse.all_time_revenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend={`$${pulse.today_revenue} Today`} 
          isPositive={pulse.today_revenue > 0} 
          icon={DollarSign} 
          color="indigo"
        />
        <StatCard 
          title="Recent Orders" 
          value={recentOrders.length} 
          trend={`${pulse.pending_orders} Pending`} 
          isPositive={pulse.pending_orders > 0} 
          icon={ShoppingCart} 
          color="rose"
        />
        <StatCard 
          title="Weekly Volume" 
          value={`$${pulse.week_revenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`} 
          trend={`Last 7 Days`} 
          isPositive={true} 
          icon={TrendingUp} 
          color="emerald"
        />
        <StatCard 
          title="Yesterday" 
          value={`$${pulse.yesterday_revenue.toLocaleString()}`} 
          trend="Settled" 
          isPositive={pulse.yesterday_revenue > 0} 
          icon={CheckCircle2} 
          color="blue"
        />
      </div>

      {/* --- REVENUE CHART & RECENT ACTIVITY --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[350px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Performance Pulse</h3>
              <p className="text-md font-black text-slate-900">30-Day Revenue Trend</p>
            </div>
            <Link href="/owner/analytics" className="text-[9px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View Advanced Analytics</Link>
          </div>
          
          <div className="w-full h-[280px] mt-auto">
            {isMounted && !loading && dashboardData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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
                    interval={4}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 9, fill: '#94a3b8', fontWeight: 800 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
                <div className="w-full h-full bg-slate-50 rounded-xl animate-pulse flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin text-slate-300" />
                </div>
            )}
          </div>
        </div>

        {/* RECENT SETTLEMENTS */}
        <div className="bg-slate-900 p-5 rounded-[20px] flex flex-col text-white relative overflow-hidden h-[350px]">
          <div className="relative z-10 flex-1">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Latest Settlements</h3>
            
            <div className="space-y-3">
              {recentPayouts.length > 0 ? recentPayouts.map((p, i) => (
                <Link key={p.id} href={`/owner/payouts/details?id=${p.id}`} className="block group">
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                            <CheckCircle2 size={14} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black leading-none">${parseFloat(p.amount).toLocaleString()}</p>
                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              )) : (
                <div className="py-10 text-center opacity-40">
                  <Clock size={20} className="mx-auto mb-2" />
                  <p className="text-[9px] font-black uppercase">No recent payouts</p>
                </div>
              )}
            </div>
          </div>
          
          <Link 
            href="/owner/payouts" 
            className="w-full py-2 bg-white text-slate-900 hover:bg-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all z-10"
          >
            Ledger View
          </Link>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-4 border-b border-slate-50">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Real-time Flow</h3>
            <p className="text-md font-black text-slate-900">Recent Transactions</p>
          </div>
          <Link href="/owner/orders" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline flex items-center gap-1">
            Browse All <ArrowUpRight size={12} strokeWidth={3}/>
          </Link>
        </div>

        <div className="overflow-x-auto min-h-[300px]">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</th>
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                        <td colSpan="5" className="px-5 py-3">
                            <div className="h-6 bg-slate-50 rounded animate-pulse w-full" />
                        </td>
                    </tr>
                  ))
              ) : recentOrders.length > 0 ? recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors group cursor-pointer" onClick={() => router.push(`/owner/orders/details-order?id=${order.id}`)}>
                  <td className="px-5 py-3 text-[11px] font-black text-indigo-600 group-hover:underline">#ORD-{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{order.user?.name || order.user?.username || 'Guest'}</span>
                      <span className="text-[9px] font-medium text-slate-400 uppercase tracking-tighter">Verified Account</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-black text-slate-900 tabular-nums">${parseFloat(order.order_total || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.payment_status?.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={order.order_status?.status} />
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan="5" className="px-5 py-10 text-center text-slate-300 font-bold uppercase text-[10px]">No active orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
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

function StatusBadge({ status }) {
  const config = {
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Confirmed: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Cancelled: { icon: XCircle, style: "bg-slate-100 text-slate-400 border-slate-200" },
  };

  const { icon: Icon, style } = config[status] || config.Cancelled;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={10} strokeWidth={3} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const isPaid = status === 'Paid' || status === 'Success';
  const style = isPaid 
    ? "text-emerald-600 bg-emerald-50 border-emerald-100" 
    : "text-rose-600 bg-rose-50 border-rose-100";

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${style}`}>
      {isPaid ? 'Paid' : 'Unpaid'}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-xl border border-slate-800 text-[10px] font-black">
        <p className="uppercase tracking-widest text-slate-400 mb-1">{label}</p>
        <p>${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}
