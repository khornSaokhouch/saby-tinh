'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link'; // Use Link for fast client-side navigation
import { 
  Store, TrendingUp, Activity, PieChart, Send, ChevronRight
} from 'lucide-react';

/* --- ANIMATION VARIANTS --- */
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const invoiceList = [
  { id: "INV-042", date: "Feb 12", amount: 1240, status: "Paid", color: "text-emerald-600 bg-emerald-50" },
  { id: "INV-041", date: "Feb 11", amount: 890, status: "Pending", color: "text-amber-600 bg-amber-50" },
  { id: "INV-040", date: "Feb 10", amount: 2100, status: "Paid", color: "text-emerald-600 bg-emerald-50" },
  { id: "INV-039", date: "Feb 09", amount: 450, status: "Overdue", color: "text-rose-600 bg-rose-50" },
];

export default function InvoicesLedger() {
  const [range, setRange] = useState(7);

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans">
      <motion.div variants={container} initial="hidden" animate="show" className="max-w-6xl mx-auto px-6 py-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-[0.2em]">
              <Store size={14} /> Performance Hub
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-1">
              Main Flagship <span className="text-slate-300 font-light">Ledger</span>
            </h1>
          </div>
          <div className="flex bg-slate-200/50 p-1.5 rounded-2xl">
            {[7, 15, 30].map((r) => (
              <button key={r} onClick={() => setRange(r)} className={`px-6 py-2 text-xs font-black rounded-xl transition-all ${range === r ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{r} DAYS</button>
            ))}
          </div>
        </div>

        {/* BENTO STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatMiniCard label="Total Revenue" value="$4,680.00" icon={TrendingUp} trend="+18%" color="indigo" />
          <StatMiniCard label="Invoice Volume" value="14" icon={Activity} trend="Active" color="emerald" />
          <StatMiniCard label="Avg. Order Value" value="$342.00" icon={PieChart} trend="+4.2%" color="amber" />
        </div>

        {/* LIST AS LINKS */}
        <div className="space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest px-6">Recent Transactions</h3>
          <div className="grid grid-cols-1 gap-3">
            {invoiceList.map((inv) => (
              <Link key={inv.id} href={`/admin/invoices/details`}>
                <motion.div
                  variants={item}
                  className="group p-6 bg-white rounded-[2rem] border-2 border-transparent hover:border-indigo-600 hover:shadow-xl transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Send size={20} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inv.id}</span>
                      <p className="font-black text-slate-900">{inv.date}, 2026</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right min-w-[100px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</p>
                      <p className="text-xl font-black text-slate-900 tracking-tighter">${inv.amount.toFixed(2)}</p>
                    </div>
                    <div className="p-2 bg-slate-50 rounded-full text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function StatMiniCard({ label, value, icon: Icon, trend, color }) {
  const colors = { indigo: "bg-indigo-600", emerald: "bg-emerald-500", amber: "bg-amber-500" };
  return (
    <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 flex gap-5 items-center">
      <div className={`w-14 h-14 rounded-2xl ${colors[color]} text-white flex items-center justify-center shadow-lg`}><Icon size={24} /></div>
      <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p><div className="flex items-center gap-2"><span className="text-2xl font-black text-slate-900 tracking-tight">{value}</span><span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{trend}</span></div></div>
    </div>
  );
}