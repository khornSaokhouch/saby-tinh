'use client';

import React from 'react';
import { 
  Package, ShoppingCart, Users, BarChart3, 
  TrendingUp, ArrowUpRight, ArrowDownRight, 
  MoreHorizontal, Plus, ShieldCheck, Calendar
} from 'lucide-react';
import { motion } from 'framer-motion';

// --- DATA MOCKUPS ---
const stats = [
    { label: "Total Revenue", value: "$45,285.00", trend: "+12.5%", positive: true, icon: BarChart3 },
    { label: "Active Orders", value: "156", trend: "+8.2%", positive: true, icon: ShoppingCart },
    { label: "Total Products", value: "48", trend: "0%", positive: true, icon: Package },
    { label: "Satisfaction", value: "98.2%", trend: "-0.4%", positive: false, icon: Users },
];

const recentOrders = [
    { id: "#ORD-7721", customer: "TechCorp Int.", date: "Oct 12", status: "Paid", amount: "$1,200.00" },
    { id: "#ORD-7722", customer: "Saby-Link Co.", date: "Oct 12", status: "Pending", amount: "$850.00" },
    { id: "#ORD-7723", customer: "Nexus Nodes", date: "Oct 11", status: "Paid", amount: "$2,400.00" },
    { id: "#ORD-7724", customer: "Global Infra", date: "Oct 11", status: "Shipped", amount: "$4,100.00" },
];

export default function DashboardOnlyPage() {
    return (
        <main className="min-h-screen bg-slate-50 py-10 px-6">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* --- TOP HEADER AREA --- */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Owner Control Center</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Saby-Tinh Dashboard</h1>
                        <p className="text-sm font-medium text-slate-500 mt-1 flex items-center gap-2">
                            <Calendar size={14} /> Monitoring period: Oct 1 - Oct 31, 2025
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
                            Generate Report
                        </button>
                        <button className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95">
                            <Plus size={14} /> Add New Listing
                        </button>
                    </div>
                </div>

                {/* --- QUICK STATS GRID --- */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: i * 0.1 }}
                            className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm group hover:border-indigo-300 transition-colors"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                    <stat.icon size={18} />
                                </div>
                                <div className={`flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full ${stat.positive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                    {stat.trend}
                                </div>
                            </div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-xl font-black text-slate-900 mt-0.5">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* --- CHART & STATUS SECTION --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* PERFORMANCE CHART AREA */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg"><TrendingUp size={16}/></div>
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Revenue Forecast</h3>
                            </div>
                            <div className="flex gap-2">
                                {['Day', 'Week', 'Month'].map(t => (
                                    <button key={t} className={`text-[9px] font-black uppercase px-3 py-1 rounded-lg ${t === 'Month' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                        
                        {/* Mock Chart Visual */}
                        <div className="h-44 w-full bg-slate-50 rounded-2xl flex items-end justify-between px-6 pb-4">
                            {[30, 50, 40, 70, 55, 90, 45, 60, 80, 50, 75, 40].map((h, i) => (
                                <div key={i} className="w-5 bg-indigo-500/20 rounded-t-md hover:bg-indigo-600 transition-all cursor-pointer relative group" style={{ height: `${h}%` }}>
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[8px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap">
                                        Sales: {h * 4}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ACCOUNT STATUS CARD */}
                    <div className="lg:col-span-4 bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden flex flex-col justify-between shadow-xl">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <ShieldCheck size={18} className="text-indigo-400" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security & Tier</span>
                            </div>
                            <h4 className="text-xl font-black mb-2 leading-tight">Pro Enterprise<br/>Verified Merchant</h4>
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed mt-4">
                                All systems operational. Your catalog is currently reaching 120+ regions globally.
                            </p>
                        </div>
                        <button className="mt-8 w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-50 transition-all">
                            Manage Subscription
                        </button>
                        {/* Decorative Glow */}
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600/30 rounded-full blur-[60px]" />
                    </div>

                    {/* --- RECENT ORDERS TABLE --- */}
                    <div className="lg:col-span-12 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Recent Procurement Activity</h3>
                            <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">Download Logs</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="px-6 py-4">Ref ID</th>
                                        <th className="px-6 py-4">Client Entity</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Volume</th>
                                        <th className="px-6 py-4 text-right">Ops</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOrders.map((order, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4 text-xs font-black text-indigo-600">{order.id}</td>
                                            <td className="px-6 py-4 text-xs font-bold text-slate-900">{order.customer}</td>
                                            <td className="px-6 py-4 text-xs font-medium text-slate-500">{order.date}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                                                    order.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                                                    order.status === 'Shipped' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                                                }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs font-black text-slate-900">{order.amount}</td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 hover:bg-slate-200 rounded-lg text-slate-400 transition-all opacity-0 group-hover:opacity-100">
                                                    <MoreHorizontal size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}