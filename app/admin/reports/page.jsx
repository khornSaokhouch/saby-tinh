'use client';

import { useState, useEffect } from 'react';
import { 
  ArrowUpRight, ArrowDownRight, DollarSign, ShoppingBag, 
  Users, Activity, Calendar, Download, MoreHorizontal, Zap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell
} from 'recharts';

// --- ANIMATION CONFIG ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 260, damping: 20 } 
  }
};

// --- DATA ---
const revenueData = [
  { name: 'Mon', value: 4000 }, { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 }, { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 }, { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const categoryData = [
  { name: 'Electronics', value: 400, color: '#6366f1' },
  { name: 'Fashion', value: 300, color: '#ec4899' },
  { name: 'Home', value: 300, color: '#10b981' },
  { name: 'Beauty', value: 200, color: '#8b5cf6' },
];

const topProducts = [
  { id: 1, name: "Wireless Headphones", sales: 120, revenue: "$12,400", trend: "+12%" },
  { id: 2, name: "Smart Watch Gen 5", sales: 85, revenue: "$8,250", trend: "+5%" },
  { id: 3, name: "Ergonomic Chair", sales: 45, revenue: "$6,100", trend: "-2%" },
  { id: 4, name: "Mechanical Keyboard", sales: 30, revenue: "$4,200", trend: "+8%" },
];

export default function ReportsPage() {
  const [dateRange] = useState('Last 7 Days');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-7 space-y-7 bg-[#fcfcfd]/50 min-h-screen font-sans"
    >
      
      {/* --- SECTION: HEADER --- */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight italic">REPORTS</h1>
          <p className="text-slate-400 font-bold text-[11px] uppercase tracking-widest mt-0.5">Real-time store metrics & predictive analytics</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-700 shadow-sm hover:bg-slate-50 transition-all uppercase tracking-widest">
            <Calendar size={12} className="text-indigo-600" strokeWidth={3} />
            {dateRange}
          </button>
          <button className="p-2 bg-slate-900 text-white rounded-xl shadow-lg hover:bg-indigo-600 transition-all">
            <Download size={16} />
          </button>
        </div>
      </motion.div>

      {/* --- SECTION: KPI CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Revenue" value="$48,290" trend="+12.5%" isPositive icon={DollarSign} color="indigo" />
        <StatCard title="Orders" value="1,245" trend="+4.2%" isPositive icon={ShoppingBag} color="blue" />
        <StatCard title="Customers" value="320" trend="-2.1%" isPositive={false} icon={Users} color="rose" />
        <StatCard title="Active" value="45" trend="+8.4%" isPositive icon={Activity} color="emerald" />
      </div>

      {/* --- SECTION: CHARTS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Area Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Financial Velocity</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Revenue Flow (7D)</p>
            </div>
            <button className="text-slate-300 hover:text-slate-600 transition-colors"><MoreHorizontal size={20} /></button>
          </div>
          <div className="h-[350px] w-full">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 700 }} />
                  <Tooltip content={<ChartTooltip />} />
                  <Area type="natural" dataKey="value" stroke="#6366f1" strokeWidth={4} fill="url(#chartGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Pie Chart Card */}
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex flex-col relative overflow-hidden">
          <div className="mb-8">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Market Split</h3>
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5">Category Distribution</p>
          </div>
          <div className="flex-1 relative min-h-[250px]">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={75} outerRadius={95} paddingAngle={8} dataKey="value" cornerRadius={10}>
                    {categoryData.map((entry, index) => <Cell key={index} fill={entry.color} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">1,245</span>
              <span className="text-[10px] text-slate-400 font-black uppercase">Units</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2">
            {categoryData.map((item) => (
              <div key={item.name} className="flex flex-col p-3 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase mb-1">{item.name}</span>
                <span className="font-black text-slate-900 text-sm">{((item.value/1200)*100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* --- SECTION: TABLE & PROMO --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Table Card */}
        <motion.div variants={itemVariants} className="bg-white p-7 rounded-[24px] border border-slate-100 shadow-sm overflow-hidden">
          <h3 className="text-base font-black text-slate-900 mb-6 tracking-tight">High Velocity Products</h3>
          <div className="space-y-4">
            {topProducts.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-2xl border border-transparent hover:border-slate-100 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs group-hover:bg-indigo-600 transition-colors">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{p.name}</p>
                    <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">{p.sales} Sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-slate-900">{p.revenue}</p>
                  <p className={`text-[10px] font-black ${p.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{p.trend} Trend</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* PROMO CARD (Bento Style) */}
        <motion.div 
          variants={itemVariants}
          whileHover={{ y: -5 }}
          className="bg-indigo-600 p-8 rounded-[24px] text-white relative overflow-hidden flex flex-col justify-between group shadow-xl shadow-indigo-100"
        >
          <div className="relative z-10">
            <div className="w-14 h-14 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center mb-8 border border-white/20">
              <Zap size={28} className="fill-white" />
            </div>
            <h3 className="text-4xl font-black leading-none mb-4 tracking-tighter">AI-POWERED<br/>INSIGHTS</h3>
            <p className="text-indigo-100 text-sm font-medium max-w-xs leading-relaxed opacity-80">
              Unlock the neural engine to forecast demand and detect market trends automatically.
            </p>
          </div>
          <button className="relative z-10 w-fit mt-10 bg-white text-indigo-600 px-8 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform active:scale-95">
            Upgrade to Pro
          </button>
          {/* Abstract BG Graphics */}
          <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-indigo-400 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity" />
          <div className="absolute bottom-[-10%] left-[-10%] w-56 h-56 bg-white/10 rounded-full blur-[60px]" />
        </motion.div>

      </div>
    </motion.div>
  );
}

// --- SHARED COMPONENTS ---

function StatCard({ title, value, trend, isPositive, icon: Icon, color }) {
  const themes = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    rose: 'bg-rose-50 text-rose-600 border-rose-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  };

  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm flex items-start justify-between relative group overflow-hidden"
    >
      <div className="relative z-10 w-full">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{title}</p>
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
          <div className={`p-2 rounded-xl border shadow-inner transition-all duration-500 group-hover:rotate-12 ${themes[color]}`}>
            <Icon size={18} strokeWidth={2.5} />
          </div>
        </div>
        <div className={`flex items-center gap-1.5 mt-4 px-2 py-0.5 rounded-lg w-fit ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} text-[9px] font-black uppercase tracking-widest`}>
          {isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
          <span>{trend}</span>
        </div>
      </div>
      <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
    </motion.div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl border border-white/10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-indigo-400 font-bold text-xl">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
}