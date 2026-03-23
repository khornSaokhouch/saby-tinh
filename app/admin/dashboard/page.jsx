'use client';

import { useState, useEffect } from 'react';
import { 
  DollarSign, ShoppingBag, Users, Package, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  TrendingUp, Download, CheckCircle2, 
  Search, Filter, RefreshCw, Truck, XCircle,
  Zap, ArrowRight, Clock, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import useDashboardStore from '@/stores/useDashboardStore';

export default function AdminDashboard() {
  const { language } = useLanguageStore();
  const [isMounted, setIsMounted] = useState(false);
  const { dashboardData, loading, fetchDashboardData } = useDashboardStore();

  useEffect(() => {
    setIsMounted(true);
    fetchDashboardData();
  }, []);

  const { totals, revenue_chart, recent_orders, alerts } = dashboardData;

  return (
    <div className="space-y-5 pb-6 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Live System Status', language)}</span>
          </div>
          
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            {t('Good morning,', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500">{t('Administrator', language)}</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            {t('Here\'s what\'s happening with your platform network today.', language)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => fetchDashboardData()}
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 hover:border-indigo-300 transition-all shadow-sm active:scale-95 uppercase tracking-widest"
          >
            <RefreshCw size={13} className={`${loading ? 'animate-spin text-indigo-600' : 'text-slate-400'}`} strokeWidth={3} />
            {t('Sync', language)}
          </button>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md active:scale-95">
            <Download size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- STATS GRID (Reduced Height/Padding) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={t('Gross Revenue', language)} 
          value={totals?.revenue?.value || "$0.00"} 
          trend={totals?.revenue?.trend || "0%"} 
          isPositive={totals?.revenue?.isPositive ?? true} 
          icon={DollarSign} 
          color="indigo"
          language={language}
        />
        <StatCard 
          title={t('Total Orders', language)} 
          value={totals?.orders?.value || "0"} 
          trend={totals?.orders?.trend || "0%"} 
          isPositive={totals?.orders?.isPositive ?? true} 
          icon={ShoppingBag} 
          color="rose"
          language={language}
        />
        <StatCard 
          title={t('Customer Growth', language)} 
          value={totals?.customers?.value || "0"} 
          trend={totals?.customers?.trend || "0%"} 
          isPositive={totals?.customers?.isPositive ?? true} 
          icon={Users} 
          color="emerald"
          language={language}
        />
        <StatCard 
          title={t('Inventory Sold', language)} 
          value={totals?.products_sold?.value || "0"} 
          trend={totals?.products_sold?.trend || "0%"} 
          isPositive={totals?.products_sold?.isPositive ?? false} 
          icon={Package} 
          color="blue"
          language={language}
        />
      </div>

      {/* --- MAIN CONTENT (Reduced Chart Height) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* REVENUE CHART */}
        <div className="lg:col-span-2 bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Performance', language)}</h3>
              <p className="text-md font-black text-slate-900">{t('Revenue Overview', language)}</p>
            </div>
            <div className="flex bg-slate-50 p-1 rounded-md">
              <button className="px-2 py-1 text-[9px] font-black rounded bg-white shadow-sm text-indigo-600 uppercase">{t('Monthly', language)}</button>
              <button className="px-2 py-1 text-[9px] font-black rounded text-slate-400 uppercase">{t('Weekly', language)}</button>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenue_chart} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
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

        {/* ALERTS */}
        <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm flex flex-col h-[300px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Notifications', language)}</h3>
            {alerts?.length > 0 && (
              <span className="bg-rose-500 text-white text-[8px] font-black px-2 py-0.5 rounded-full animate-pulse">{alerts.length} {t('NEW', language)}</span>
            )}
          </div>

          <div className="space-y-2 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {alerts?.map((alert, idx) => (
              <AlertItem key={idx} title={alert.title} desc={alert.desc} time={alert.time} type={alert.type} />
            ))}
          </div>
        </div>
      </div>

      {/* --- TABLE (With Payment Status) --- */}
      <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Registry', language)}</h3>
            <p className="text-md font-black text-slate-900">{t('Recent Transactions', language)}</p>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input 
              type="text" 
              placeholder={t('Quick search...', language)} 
              className="pl-9 pr-4 py-1.5 bg-slate-50 border border-transparent rounded-lg text-[11px] font-bold text-slate-700 w-48 outline-none focus:bg-white focus:border-indigo-100 transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('ID', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Customer', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Product', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Date', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Amount', language)}</th>
                <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">{t('Payment Status', language)}</th>
                <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">{t('Order Status', language)}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recent_orders?.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                  <td className="px-5 py-3 text-[11px] font-black text-indigo-600">{order.id}</td>
                  <td className="px-4 py-3 text-[11px] font-bold text-slate-700">{order.customer}</td>
                  <td className="px-4 py-3 text-[10px] font-medium text-slate-500 truncate max-w-[150px]">{order.product}</td>
                  <td className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase">{order.date}</td>
                  <td className="px-4 py-3 text-[11px] font-black text-slate-900">{order.amount}</td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.payment_status} language={language} />
                  </td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={order.status} language={language} />
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

// --- SUB COMPONENTS (Compact) ---

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

function AlertItem({ title, desc, time, type }) {
  const icons = {
    warning: "text-orange-600 bg-orange-50",
    error: "text-rose-600 bg-rose-50",
    success: "text-emerald-600 bg-emerald-50",
    info: "text-blue-600 bg-blue-50",
  };
  return (
    <div className="flex gap-3 p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer">
      <div className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${icons[type]}`}>
        <AlertCircle size={14} strokeWidth={2.5} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h4 className="text-[11px] font-black text-slate-800 truncate uppercase">{title}</h4>
          <span className="text-[8px] font-black text-slate-400">{time}</span>
        </div>
        <p className="text-[10px] text-slate-500 truncate">{desc}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status, language }) {
  const config = {
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Processing: "bg-indigo-50 text-indigo-600 border-indigo-100",
    Shipped: "bg-blue-50 text-blue-600 border-blue-100",
    Delivered: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Cancelled: "bg-slate-100 text-slate-400 border-slate-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[8px] font-black uppercase tracking-widest ${config[status] || config.Cancelled}`}>
      {t(status, language)}
    </span>
  );
}

function PaymentBadge({ status, language }) {
  const styles = {
    Success: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Paid: "text-emerald-600 bg-emerald-50 border-emerald-100",
    Pending: "text-orange-600 bg-orange-50 border-orange-100",
    Failed: "text-rose-600 bg-rose-50 border-rose-100",
    Unpaid: "text-rose-600 bg-rose-50 border-rose-100",
  };
  return (
    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${styles[status] || "bg-slate-50"}`}>
      {t(status, language)}
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