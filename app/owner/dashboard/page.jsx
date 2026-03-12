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
import { useShopOrderStore } from '@/stores/useShopOrderStore';
import { useProductStore } from '@/stores/useProductStore';
import { useStore } from '@/stores/useStore';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function OwnerDashboardPage() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { orders, loading: ordersLoading, fetchOrders } = useShopOrderStore();
  const { products, loading: productsLoading, fetchProducts } = useProductStore();
  const { stores, fetchStores } = useStore();
  const { user, fetchProfile } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    fetchProfile();
    fetchOrders();
    fetchProducts();
    fetchStores();
  }, [fetchProfile, fetchOrders, fetchProducts, fetchStores]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([fetchOrders(), fetchProducts(), fetchStores()]);
    setIsRefreshing(false);
  };

  // Compute stats from real data
  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((acc, o) => acc + parseFloat(o.order_total || 0), 0);
    const activeOrders = orders.filter(o => {
      const s = (o.order_status?.status || '').toLowerCase();
      return s.includes('pending') || s.includes('processing');
    }).length;
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.status).length;
    const paidOrders = orders.filter(o => {
      const s = (o.payment_status?.status || '').toLowerCase();
      return s.includes('success');
    }).length;

    return { totalRevenue, activeOrders, totalProducts, activeProducts, paidOrders, totalOrders: orders.length };
  }, [orders, products]);

  const chartData = useMemo(() => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const buckets = Array(12).fill(0);
    orders.forEach(o => {
      const d = new Date(o.order_date || o.created_at);
      if (!isNaN(d)) buckets[d.getMonth()] += parseFloat(o.order_total || 0);
    });
    return buckets.map((v, i) => ({ name: months[i], value: v }));
  }, [orders]);

  const myStore = useMemo(() => {
    if (!user) return null;
    return stores.find(s => String(s.user_id) === String(user.id)) || stores[0] || null;
  }, [stores, user]);

  const recentOrders = useMemo(() => orders.slice(0, 8), [orders]);
  const loading = ordersLoading || productsLoading;

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
            {myStore ? myStore.name : 'Welcome back, '} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">Owner</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Here's a summary of your shop performance today.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} 
          trend="Real-time" 
          isPositive={true} 
          icon={DollarSign} 
          color="indigo"
        />
        <StatCard 
          title="Recent Orders" 
          value={stats.totalOrders} 
          trend={`${stats.activeOrders} Pending`} 
          isPositive={stats.activeOrders > 0} 
          icon={ShoppingCart} 
          color="rose"
        />
        <StatCard 
          title="Catalog Items" 
          value={stats.totalProducts} 
          trend={`${stats.activeProducts} Active`} 
          isPositive={true} 
          icon={Package} 
          color="emerald"
        />
        <StatCard 
          title="Settled Invoices" 
          value={stats.paidOrders} 
          trend="Success" 
          isPositive={true} 
          icon={CheckCircle2} 
          color="blue"
        />
      </div>

      {/* --- REVENUE CHART --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Growth</h3>
              <p className="text-md font-black text-slate-900">Revenue Distribution</p>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            {isMounted && (
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
            )}
          </div>
        </div>

        {/* STORE MINI INFO */}
        <div className="bg-slate-900 p-5 rounded-[20px] flex flex-col justify-between text-white relative overflow-hidden h-[300px]">
          <div className="relative z-10">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Identity</h3>
            {myStore ? (
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
                  {myStore.store_image ? <img src={myStore.store_image} className="w-full h-full object-cover" /> : <Store size={20} className="text-slate-500" />}
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight">{myStore.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">Unique store verified platform</p>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-400">Loading store data...</p>
            )}
          </div>
          
          <Link 
            href="/owner/stores" 
            className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-black uppercase tracking-widest text-center transition-all z-10"
          >
            Manage Profiles
          </Link>
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
        </div>
      </div>

      {/* --- ORDERS TABLE --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Transactions</h3>
            <p className="text-md font-black text-slate-900">Most Recent Orders</p>
          </div>
          <Link href="/owner/orders" className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">View All</Link>
        </div>

        <div className="overflow-x-auto">
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
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-3 text-[11px] font-black text-indigo-600">#ORD-{order.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-[11px] font-bold text-slate-700">{order.user?.name || order.user?.username || 'Guest'}</span>
                      <span className="text-[9px] font-medium text-slate-400">ID: #{order.user_id}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[11px] font-black text-slate-900">${parseFloat(order.order_total || 0).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.payment_status?.status} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={order.order_status?.status} />
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
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Shipped: "bg-blue-50 text-blue-600 border-blue-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${config[status] || config.Cancelled}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    Success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Pending: "text-orange-600 bg-orange-50 border-orange-100",
    Failed: "text-rose-600 bg-rose-50 border-rose-100",
    Unpaid: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${styles[status] || "bg-slate-50"}`}>
      {status || 'Pending'}
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
