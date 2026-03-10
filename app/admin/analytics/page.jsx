'use client';

import { useState, useEffect } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Market Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none uppercase">Analytics Overview</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-100 rounded-xl text-[11px] font-black text-slate-600 hover:border-indigo-300 transition-all shadow-sm uppercase tracking-widest">
              <Calendar size={14} className="text-indigo-600" strokeWidth={2.5} />
              {dateRange}
            </button>
          </div>
          <button className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-black transition-all shadow-md">
            <Download size={14} strokeWidth={2.5} />
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
        <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-8 relative z-10">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Revenue Trend</p>
              <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Fiscal Performance</h3>
            </div>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={18} />
            </button>
          </div>
          <div className="h-[300px] w-full">
            {isMounted && (
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
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden group">
          <div className="mb-8 relative z-10">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Sales by Category</p>
            <h3 className="text-lg font-black text-slate-900 tracking-tight leading-none">Distribution</h3>
          </div>
          <div className="flex-1 min-h-[200px] relative">
            {isMounted && (
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
            )}
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
        <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Top Performance</h3>
            <button className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest">View All</button>
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
        <div className="bg-slate-900 p-7 rounded-[24px] shadow-xl text-white relative overflow-hidden group">
            <div className="relative z-10">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 mb-4 animate-pulse" />
              <h3 className="text-lg font-black mb-2 tracking-tight uppercase">Premium Insights</h3>
              <p className="text-slate-400 text-[11px] mb-8 max-w-xs font-bold leading-relaxed uppercase tracking-widest">
                Unlock advanced cohort analysis and predictive modeling with our Pro tier.
              </p>
              <button className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all">
                Upgrade Engine
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
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100/50',
    blue: 'bg-blue-50 text-blue-600 border-blue-100/50',
    rose: 'bg-rose-50 text-rose-600 border-rose-100/50',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100/50',
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition-all duration-500"
    >
      <div className="flex justify-between items-start relative z-10">
        <div className={`p-2.5 rounded-xl border-2 border-white shadow-sm ${themes[color]}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
          {isPositive ? <ArrowUpRight size={10} strokeWidth={3} /> : <ArrowDownRight size={10} strokeWidth={3} />}
          <span>{trend}</span>
        </div>
      </div>
      
      <div className="mt-8 relative z-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{title}</p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
          <span className="text-[9px] font-bold text-slate-400 italic">vs prev.</span>
        </div>
      </div>
      
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
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