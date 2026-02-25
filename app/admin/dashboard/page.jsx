'use client';

import { 
  DollarSign, ShoppingBag, Users, Package, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal, 
  Calendar, Download, AlertCircle, CheckCircle2, 
  Clock, Search, Filter 
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, BarChart, Bar, Cell 
} from 'recharts';

// --- MOCK DATA ---
const revenueData = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const recentOrders = [
  { id: 'ORD-001', customer: 'Alex Moran', product: 'Nike Air Force', amount: '$120.00', status: 'Completed', date: '2 mins ago' },
  { id: 'ORD-002', customer: 'Sarah Connor', product: 'Adidas Ultraboost', amount: '$180.00', status: 'Pending', date: '15 mins ago' },
  { id: 'ORD-003', customer: 'James Bond', product: 'Puma T-Shirt', amount: '$45.00', status: 'Processing', date: '1 hour ago' },
  { id: 'ORD-004', customer: 'Ellen Ripley', product: 'Reebok Classics', amount: '$95.00', status: 'Cancelled', date: '3 hours ago' },
  { id: 'ORD-005', customer: 'John Wick', product: 'Tactical Vest', amount: '$450.00', status: 'Completed', date: '5 hours ago' },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 pb-8 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs font-medium text-slate-500 mt-1">Welcome back, Admin. Here is today's report.</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-300 transition-all shadow-sm">
            <Calendar size={14} className="text-indigo-600" />
            <span>Last 7 Days</span>
          </button>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* --- STATS GRID (Bento Row 1) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="$48,290.50" 
          trend="+12.5%" 
          isPositive={true} 
          icon={DollarSign} 
          color="indigo"
        />
        <StatCard 
          title="Total Orders" 
          value="1,245" 
          trend="+4.2%" 
          isPositive={true} 
          icon={ShoppingBag} 
          color="blue"
        />
        <StatCard 
          title="Total Customers" 
          value="3,820" 
          trend="+8.1%" 
          isPositive={true} 
          icon={Users} 
          color="emerald"
        />
        <StatCard 
          title="Products Sold" 
          value="842" 
          trend="-2.4%" 
          isPositive={false} 
          icon={Package} 
          color="rose"
        />
      </div>

      {/* --- MAIN CONTENT (Bento Row 2) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        
        {/* REVENUE CHART (Wide) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Revenue Analytics</h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Income vs Previous Period</p>
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="flex-1 w-full min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
          </div>
        </div>

        {/* ALERTS & STOCK (Narrow) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col h-[320px]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">System Alerts</h3>
            <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-full">3 New</span>
          </div>

          <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1">
            <AlertItem 
              title="Low Stock Warning" 
              desc="Nike Air Max 97 is below 5 units." 
              time="10m ago" 
              type="warning" 
            />
            <AlertItem 
              title="High Return Rate" 
              desc="Product ID #442 has >10% returns." 
              time="2h ago" 
              type="error" 
            />
            <AlertItem 
              title="New Review" 
              desc="5-star review on Adidas Runner." 
              time="4h ago" 
              type="success" 
            />
             <AlertItem 
              title="Payment Gateway" 
              desc="Connection restored successfully." 
              time="6h ago" 
              type="info" 
            />
          </div>
          
          <button className="mt-auto w-full py-2 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-all">
            View All Notifications
          </button>
        </div>
      </div>

      {/* --- BOTTOM ROW (Bento Row 3) --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Recent Orders</h3>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide">Latest transaction data</p>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-48"
              />
            </div>
            <button className="p-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-50">
              <Filter size={14} />
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
                <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-5 py-3 text-xs font-bold text-indigo-600">{order.id}</td>
                  <td className="px-5 py-3 text-xs font-medium text-slate-700">{order.customer}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{order.product}</td>
                  <td className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wide">{order.date}</td>
                  <td className="px-5 py-3 text-xs font-bold text-slate-900">{order.amount}</td>
                  <td className="px-5 py-3 text-right">
                    <StatusBadge status={order.status} />
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

// --- SUB COMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-600",
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all group">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2.5 rounded-lg ${colorStyles[color]} transition-transform group-hover:scale-110`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-md ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {trend}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-xl font-bold text-slate-900 mt-0.5">{value}</h3>
      </div>
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
  const styles = {
    Completed: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Pending: "bg-orange-50 text-orange-600 border-orange-100",
    Processing: "bg-blue-50 text-blue-600 border-blue-100",
    Cancelled: "bg-slate-100 text-slate-500 border-slate-200",
  };

  return (
    <span className={`inline-block px-2.5 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider ${styles[status]}`}>
      {status}
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