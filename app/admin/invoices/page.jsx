'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, UserPlus, ArrowUpRight , Mail, 
  Phone, MapPin, ShieldCheck, Star, ArrowRight,
  TrendingUp, Clock
} from 'lucide-react';
import Link from 'next/link';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 }
  }
};

const item = {
  hidden: { y: 15, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const customers = [
  { id: 1, name: "Sarah Jenkins", email: "sarah.j@design.io", ltv: "$12,400", status: "VIP", spent: 85, color: "bg-amber-100 text-amber-600" },
  { id: 2, name: "Marcus Aurelius", email: "m.aurelius@rome.it", ltv: "$8,200", status: "Active", spent: 62, color: "bg-indigo-100 text-indigo-600" },
  { id: 3, name: "Elena Rodriguez", email: "elena.rod@tech.com", ltv: "$3,150", status: "New", spent: 15, color: "bg-emerald-100 text-emerald-600" },
  { id: 4, name: "Julian Thorne", email: "j.thorne@agency.net", ltv: "$950", status: "At Risk", spent: 40, color: "bg-rose-100 text-rose-600" },
];

export default function CRMPage() {
  const [search, setSearch] = useState('');

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="p-4 md:p-10 space-y-10 bg-[#fbfbfc] min-h-screen font-sans"
    >
      {/* --- HEADER & SEARCH --- */}
      <motion.div variants={item} className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight italic uppercase">
            Relationship <span className="text-indigo-600 font-sans not-italic">Manager</span>
          </h1>
          <p className="text-slate-500 font-medium mt-1">Nurture and track your global customer base.</p>
        </div>

        <div className="flex items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search customers..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-[1.2rem] shadow-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none text-sm font-semibold"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="p-3 bg-white border border-slate-100 rounded-[1.2rem] shadow-sm hover:bg-slate-50 transition-colors">
            <Filter size={20} className="text-slate-600" />
          </button>
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-[1.2rem] font-bold text-sm shadow-xl hover:bg-indigo-600 transition-all">
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </motion.div>

      {/* --- KEY SEGMENTS (BENTO STATS) --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SegmentCard title="Retention Rate" value="94.2%" trend="+2.4%" icon={ShieldCheck} color="indigo" />
        <SegmentCard title="Average LTV" value="$4,820" trend="+12.1%" icon={TrendingUp} color="emerald" />
        <SegmentCard title="Churn Probability" value="2.1%" trend="-0.5%" icon={Clock} color="rose" />
      </div>

      {/* --- CUSTOMER GRID --- */}
<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
  <AnimatePresence>
    {customers.map((user) => (
      <motion.div
        key={user.id}
        variants={item}
        whileHover={{ y: -5 }}
        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col md:flex-row gap-8 relative overflow-hidden group"
      >
        {/* User Identity */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-4">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-3xl font-black shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900">{user.name}</h3>
            <div className={`mt-1 px-3 py-1 rounded-full inline-block text-[10px] font-black uppercase tracking-widest ${user.color}`}>
              {user.status}
            </div>
          </div>
        </div>

        {/* Data & Actions */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* LINKED BOX: Clicking this value takes you to invoices */}
            <Link 
              href={'/admin/invoices/stores'} 
              className="p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group/stat"
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lifetime Value</p>
                <ArrowUpRight size={12} className="text-slate-300 group-hover/stat:text-indigo-500 transition-colors" />
              </div>
              <p className="text-lg font-black text-slate-900">{user.ltv}</p>
            </Link>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Engage Score</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-black text-slate-900">{user.spent}%</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${user.spent}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-indigo-500 h-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-indigo-600 transition-colors shadow-lg">
                <Mail size={16} />
              </button>
              <button className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                <Phone size={16} />
              </button>
            </div>
            
            {/* MAIN LINK: Detailed Invoices Link */}
            <Link 
              href={'/admin/invoices/stores'} 
              className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-400 transition-colors"
            >
              View Invoices <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Decorative Corner Icon */}
        <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
          <Star size={120} />
        </div>
      </motion.div>
    ))}
  </AnimatePresence>
</div>
    </motion.div>
  );
}

function SegmentCard({ title, value, trend, icon: Icon, color }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
  };

  return (
    <motion.div 
      variants={item}
      whileHover={{ scale: 1.02 }}
      className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between"
    >
      <div className="flex justify-between items-start">
        <div className={`p-4 rounded-2xl ${colors[color]} border`}>
          <Icon size={24} />
        </div>
        <span className={`text-xs font-black uppercase tracking-widest ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend}
        </span>
      </div>
      <div className="mt-6">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
        <p className="text-3xl font-black text-slate-900 tracking-tighter mt-1">{value}</p>
      </div>
    </motion.div>
  );
}