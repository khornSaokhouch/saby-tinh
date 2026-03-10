'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, Package, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  TrendingUp , Download, AlertCircle, CheckCircle2, 
  Clock, Search, Filter, RefreshCw, Truck, XCircle
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

import useDashboardStore from '@/stores/useDashboardStore';

export default function AdminDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const { dashboardData, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const { totals, revenue_chart, recent_orders, alerts } = dashboardData;

  return (
    <div className="space-y-6 pb-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Dashboard Control</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">Dashboard Overview</h1>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-xl text-[11px] font-black text-slate-600 hover:border-indigo-300 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={15} className={`text-indigo-600 ${loading ? 'animate-spin' : ''}`} strokeWidth={2.5} />
            <span>Sync</span>
          </button>
          <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Download size={15} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* --- STATS GRID (Bento Row 1) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value={totals?.revenue?.value || "$0.00"} 
          trend={totals?.revenue?.trend || "0%"} 
          isPositive={totals?.revenue?.isPositive ?? true} 
          icon={DollarSign} 
          color="indigo"
        />
        <StatCard 
          title="Total Orders" 
          value={totals?.orders?.value || "0"} 
          trend={totals?.orders?.trend || "0%"} 
          isPositive={totals?.orders?.isPositive ?? true} 
          icon={ShoppingBag} 
          color="blue"
        />
        <StatCard 
          title="Total Customers" 
          value={totals?.customers?.value || "0"} 
          trend={totals?.customers?.trend || "0%"} 
          isPositive={totals?.customers?.isPositive ?? true} 
          icon={Users} 
          color="emerald"
        />
        <StatCard 
          title="Products Sold" 
          value={totals?.products_sold?.value || "0"} 
          trend={totals?.products_sold?.trend || "0%"} 
          isPositive={totals?.products_sold?.isPositive ?? false} 
          icon={Package} 
          color="rose"
        />
      </div>

      {/* --- MAIN CONTENT (Bento Row 2) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        
        {/* REVENUE CHART (Wide) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><TrendingUp size={16}/></div>
              <div>
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Revenue Analytics</h3>
                <p className="text-[10px] text-slate-400 mt-0.5 font-bold">Income vs Previous Period</p>
              </div>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue_chart} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#64748b', fontWeight: 600 }} 
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* ALERTS & SYSTEM (Narrow) */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col h-[320px]">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">System Alerts</h3>
            {alerts?.length > 0 && (
              <span className="bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">{alerts.length} New</span>
            )}
          </div>

          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
            {alerts && alerts.length > 0 ? (
              alerts.map((alert, idx) => (
                <AlertItem 
                  key={idx}
                  title={alert.title} 
                  desc={alert.desc} 
                  time={alert.time} 
                  type={alert.type} 
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-40 py-10">
                <CheckCircle2 size={32} />
                <p className="text-[10px] font-bold mt-2 uppercase">No alerts active</p>
              </div>
            )}
          </div>
          
          <button className="mt-auto w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
            View All Notifications
          </button>
        </div>
      </div>

      {/* --- BOTTOM ROW (Bento Row 3) --- */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Recent Orders</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">Latest transaction data</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-48 outline-none placeholder:text-slate-400"
              />
            </div>
            <button className="p-2 border border-slate-100 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-50 transition-all">
              <Filter size={15} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Order ID</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Payment</th>
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Order Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent_orders && recent_orders.length > 0 ? (
                recent_orders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-5 py-3 text-xs font-bold text-indigo-600">{order.id}</td>
                    <td className="px-5 py-3 text-xs font-medium text-slate-700">{order.customer}</td>
                    <td className="px-5 py-3 text-xs text-slate-500 line-clamp-1">{order.product}</td>
                    <td className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{order.date}</td>
                    <td className="px-5 py-3 text-xs font-bold text-slate-900">{order.amount}</td>
                    <td className="px-5 py-3">
                      <PaymentBadge status={order.payment_status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <StatusBadge status={order.status} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
                    No recent orders located
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

// --- SUB COMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600 border-indigo-100/50",
    blue: "bg-blue-50 text-blue-600 border-blue-100/50",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100/50",
    rose: "bg-rose-50 text-rose-600 border-rose-100/50",
  };

  return (
    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-xl border ${colorStyles[color]} transition-transform group-hover:scale-110`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-lg ${isPositive ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'} border`}>
          {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
          {trend}
        </div>
      </div>
      <div className="relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.18em] mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      </div>
      <div className="absolute -right-6 -bottom-6 w-16 h-16 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </div>
  );
}

function AlertItem({ title, desc, time, type }) {
  const iconMap = {
    warning: { icon: AlertCircle, color: "text-orange-500 bg-orange-50" },
    error: { icon: AlertCircle, color: "text-rose-500 bg-rose-50" },
    success: { icon: CheckCircle2, color: "text-emerald-500 bg-emerald-50" },
    info: { icon: Clock, color: "text-blue-500 bg-blue-50" },
  };
  
  const { icon: Icon, color } = iconMap[type];

  return (
    <div className="flex gap-3 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${color}`}>
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <h4 className="text-xs font-bold text-slate-800 truncate">{title}</h4>
          <span className="text-[9px] font-bold text-slate-400 uppercase">{time}</span>
        </div>
        <p className="text-[10px] font-medium text-slate-500 truncate mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const config = {
    Pending: { icon: Clock, style: "bg-orange-50 text-orange-600 border-orange-100" },
    Processing: { icon: Clock, style: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    Shipped: { icon: Truck, style: "bg-blue-50 text-blue-600 border-blue-100" },
    Delivered: { icon: CheckCircle2, style: "bg-emerald-50 text-emerald-600 border-emerald-100" },
    Cancelled: { icon: XCircle, style: "bg-slate-100 text-slate-500 border-slate-200" },
  };

  const { icon: Icon, style } = config[status] || config.Cancelled;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[9px] font-black uppercase tracking-widest ${style}`}>
      <Icon size={10} strokeWidth={2.5} />
      {status}
    </span>
  );
}

function PaymentBadge({ status }) {
  const styles = {
    // Database values mapping
    Success: { label: "Paid", style: "text-emerald-600 bg-emerald-50" },
    Pending: { label: "Unpaid", style: "text-orange-600 bg-orange-50" },
    Failed: { label: "Failed", style: "text-rose-600 bg-rose-50" },
    refunded: { label: "Refunded", style: "text-slate-500 bg-slate-100 line-through" },
    partially_paid: { label: "Partial", style: "text-amber-600 bg-amber-50" },
    
    // Fallback/Existing UI values
    Paid: { label: "Paid", style: "text-emerald-600 bg-emerald-50" },
    Unpaid: { label: "Unpaid", style: "text-rose-600 bg-rose-50" },
  };
  
  const config = styles[status] || { label: status, style: "text-slate-500 bg-slate-50" };
  
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${config.style}`}>
      {config.label}
    </span>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 text-white p-2.5 rounded-lg text-xs shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-indigo-300 font-mono">
          Revenue: ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
}