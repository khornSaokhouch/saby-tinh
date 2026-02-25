'use client';

import { useState } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, MoreHorizontal, Filter
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, PieChart, Pie
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

const categoryData = [
  { name: 'Electronics', value: 400, color: '#4f46e5' }, // Indigo
  { name: 'Fashion', value: 300, color: '#ec4899' },    // Pink
  { name: 'Home', value: 300, color: '#10b981' },       // Emerald
  { name: 'Beauty', value: 200, color: '#8b5cf6' },     // Violet
];

const topProducts = [
  { id: 1, name: "Wireless Headphones", sales: 120, revenue: "$12,400", trend: "+12%" },
  { id: 2, name: "Smart Watch Gen 5", sales: 85, revenue: "$8,250", trend: "+5%" },
  { id: 3, name: "Ergonomic Chair", sales: 45, revenue: "$6,100", trend: "-2%" },
  { id: 4, name: "Mechanical Keyboard", sales: 30, revenue: "$4,200", trend: "+8%" },
];

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 7 Days');

  return (
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics Overview</h1>
          <p className="text-sm text-slate-500 font-medium">Monitor your store's performance metrics.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:border-indigo-300 transition-all shadow-sm">
              <Calendar size={14} className="text-indigo-600" />
              {dateRange}
            </button>
          </div>
          <button className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-all shadow-md">
            <Download size={14} />
          </button>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Revenue" 
          value="$48,290" 
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
          title="New Customers" 
          value="320" 
          trend="-2.1%" 
          isPositive={false} 
          icon={Users} 
          color="rose"
        />
        <StatCard 
          title="Active Now" 
          value="45" 
          trend="+8.4%" 
          isPositive={true} 
          icon={Activity} 
          color="emerald"
        />
      </div>

      {/* --- MAIN CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
        
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-bold text-slate-800">Revenue Trend</h3>
              <p className="text-xs text-slate-500 font-medium">Daily revenue performance</p>
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={16} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4f46e5" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-800">Sales by Category</h3>
            <p className="text-xs text-slate-500 font-medium">Distribution across departments</p>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-slate-900">1.2k</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Items</span>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {categoryData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-600">{item.name}</span>
                </div>
                <span className="font-bold text-slate-900">{((item.value / 1200) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Top Products Table */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Top Performing Products</h3>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b border-slate-100">
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Product</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Sales</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Revenue</th>
                  <th className="pb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topProducts.map((product) => (
                  <tr key={product.id} className="group hover:bg-slate-50/50">
                    <td className="py-3 font-semibold text-slate-700">{product.name}</td>
                    <td className="py-3 text-right text-slate-600 font-medium">{product.sales}</td>
                    <td className="py-3 text-right font-bold text-slate-900">{product.revenue}</td>
                    <td className={`py-3 text-right font-bold text-xs ${product.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {product.trend}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Marketing/Traffic (Placeholder for another chart type) */}
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Unlock Premium Insights</h3>
              <p className="text-indigo-100 text-xs mb-6 max-w-xs font-medium leading-relaxed">
                Upgrade to the Pro Plan to view advanced customer demographics, cohort analysis, and predictive AI modeling.
              </p>
              <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-xl hover:bg-indigo-50 transition-colors">
                Upgrade to Pro
              </button>
            </div>
            
            {/* Decorational Elements */}
            <div className="absolute right-0 bottom-0 opacity-10">
              <Activity size={200} />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
  const colorMap = {
    indigo: 'bg-indigo-50 text-indigo-600',
    blue: 'bg-blue-50 text-blue-600',
    rose: 'bg-rose-50 text-rose-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  };

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-start justify-between"
    >
      <div>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{value}</h3>
        <div className={`flex items-center gap-1 mt-2 text-xs font-bold ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{trend}</span>
          <span className="text-slate-400 font-medium ml-1">vs last week</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${colorMap[color]}`}>
        <Icon size={20} />
      </div>
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs shadow-xl border border-slate-700">
        <p className="font-bold mb-1">{label}</p>
        <p className="text-indigo-300 font-mono">
          {`Value: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
}