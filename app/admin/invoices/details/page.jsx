'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Printer, Download, Mail, ChevronLeft, 
  MoreHorizontal, Phone, Globe, MapPin,
  ExternalLink, CreditCard
} from 'lucide-react';

const INVOICE_DATA = {
  studio: "Fauget Studio",
  invoiceNo: "INV-2025-001",
  date: "May 23, 2030",
  dueDate: "May 27, 2030",
  billedTo: "Dani Martinez",
  bankInfo: {
    name: "Larana Bank",
    account: "000-123-4567",
    holder: "Fauget Studio"
  },
  items: [
    { desc: "Branding Consultant", price: 8000, qty: 1 },
    { desc: "Logo & Branding Design", price: 3000, qty: 1 },
    { desc: "Marketing Campaign", price: 12000, qty: 1 },
    { desc: "Social Media Design", price: 2000, qty: 1 },
    { desc: "Social Media Ads", price: 5000, qty: 1 },
    { desc: "Web Development", price: 4000, qty: 1 },
  ],
  total: 34000
};

export default function StudioLedgerUI() {
  const d = INVOICE_DATA;

  return (
    <div className="min-h-screen  py-12 px-4 font-sans text-slate-900">
      {/* 1. TOP TOOLBAR - Floating actions for the user */}
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <button className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold text-sm uppercase tracking-wider">
          <ChevronLeft size={20} /> Back to Dashboard
        </button>
        
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl shadow-sm border border-slate-200">
          <ToolbarButton icon={Printer} label="Print" />
          <ToolbarButton icon={Download} label="Download" />
          <ToolbarButton icon={Mail} label="Send" />
          <div className="w-px h-6 bg-slate-200 mx-1" />
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-100">
            Pay $34,000
          </button>
        </div>
      </div>

      {/* 2. THE MAIN INVOICE DOCUMENT */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto bg-white shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem] overflow-hidden relative border border-slate-100"
      >
        
        {/* Decorative Header Art */}
        <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none">
          <svg viewBox="0 0 200 200" className="w-full h-full opacity-10 text-indigo-500">
            <circle cx="180" cy="20" r="100" fill="currentColor" />
            <circle cx="150" cy="50" r="80" stroke="currentColor" fill="none" strokeWidth="2" strokeDasharray="10 10" />
          </svg>
        </div>

        <div className="p-10 md:p-16">
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white italic font-black text-2xl shadow-lg shadow-indigo-100">
              F
            </div>
            <span className="text-xl font-black tracking-tight text-slate-800">{d.studio}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h1 className="text-7xl font-black text-indigo-600 tracking-tighter mb-4">INVOICE</h1>
              <div className="flex items-center gap-4 text-slate-400 font-bold text-sm">
                <span>Invoice no: {d.invoiceNo}</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full" />
                <span>{d.date}</span>
              </div>
            </div>
            
            <div className="md:text-right space-y-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Billed To</p>
                <p className="text-2xl font-bold text-slate-800">{d.billedTo}</p>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Due Date</p>
                <p className="text-2xl font-bold text-slate-800">{d.dueDate}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-end">
            <div className="space-y-4">
              <h3 className="font-black text-sm uppercase tracking-widest text-slate-800 border-b-2 border-indigo-600 inline-block pb-1">Payment Method</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-500">Bank Name: <span className="text-slate-800">{d.bankInfo.name}</span></p>
                <p className="text-sm font-bold text-slate-500">Account Number: <span className="text-slate-800">{d.bankInfo.account}</span></p>
                <p className="text-sm font-bold text-slate-500">Account Holder: <span className="text-slate-800">{d.bankInfo.holder}</span></p>
              </div>
            </div>
            
            <div className="bg-indigo-600 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-50">
              <p className="text-xs font-black uppercase tracking-widest opacity-80 mb-2">Total Amount Due</p>
              <p className="text-5xl font-black italic tracking-tighter">${d.total.toLocaleString()}</p>
            </div>
          </div>

          {/* ITEM TABLE */}
          <div className="mb-16">
            <div className="bg-indigo-600 rounded-t-2xl grid grid-cols-12 px-6 py-4 text-white text-[10px] font-black uppercase tracking-[0.2em]">
              <div className="col-span-1">No</div>
              <div className="col-span-6">Item Description</div>
              <div className="col-span-2 text-right">Price</div>
              <div className="col-span-1 text-center">Qty</div>
              <div className="col-span-2 text-right">Amount</div>
            </div>
            <div className="divide-y divide-slate-100 border-x border-b border-slate-100 rounded-b-2xl overflow-hidden">
              {d.items.map((item, i) => (
                <div key={i} className={`grid grid-cols-12 px-6 py-5 text-sm font-bold ${i % 2 !== 0 ? 'bg-slate-50/50' : 'bg-white'}`}>
                  <div className="col-span-1 text-slate-300">0{i+1}</div>
                  <div className="col-span-6 text-slate-800">{item.desc}</div>
                  <div className="col-span-2 text-right text-slate-500">${item.price.toLocaleString()}</div>
                  <div className="col-span-1 text-center text-slate-500">{item.qty}</div>
                  <div className="col-span-2 text-right text-slate-800">${(item.price * item.qty).toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info Section */}
        <div className="bg-indigo-600 p-10 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
            <p className="text-sm font-bold max-w-[280px] leading-relaxed opacity-90">
              If you have any questions about this invoice, feel free to contact us at :
            </p>
            <div className="flex flex-col md:flex-row gap-8 md:gap-12">
              <ContactBlock icon={Phone} text="+123 456 7890" sub="reallygreatsite.com" />
              <ContactBlock icon={Mail} text="mail@reallygreatsite.com" sub="123 Anywhere st, Any city" />
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="bg-slate-900 py-6 px-10 text-center">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">
             Thank you for trusting us to support your brand's digital growth.
           </p>
        </div>
      </motion.main>
    </div>
  );
}

function ToolbarButton({ icon: Icon, label }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-600">
      <Icon size={18} />
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
}

function ContactBlock({ icon: Icon, text, sub }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
        <Icon size={18} />
      </div>
      <div>
        <p className="text-sm font-black">{text}</p>
        <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}