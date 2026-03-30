"use client";

import React from "react";
import { 
  Key, 
  Smartphone, 
  History, 
  AlertTriangle,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-5 sm:p-7 space-y-6" // Reduced from p-10 and space-y-10
    >
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Privacy & Security</h1>
        <p className="text-sm text-slate-500 font-medium">Manage your password and keep your account protected.</p>
      </header>

      <div className="grid gap-4"> {/* Tighter gap */}
        
        {/* Password Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Key size={20} /> {/* Smaller icon box and icon */}
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Change Password</h3>
                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">Unique passwords help keep your account secure.</p>
              </div>
            </div>
            <button className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all whitespace-nowrap">
              Update Password
            </button>
          </div>
        </section>

        {/* 2FA Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Two-Factor Auth</h3>
                <p className="text-sm text-slate-500 mt-0.5">Add an extra layer of security using your phone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Off</span>
               <button className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                Enable
               </button>
            </div>
          </div>
        </section>

        {/* Login Activity */}
        <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History size={18} className="text-slate-400" />
              <h3 className="font-bold text-slate-900 text-sm">Recent Login Activity</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Log out all</button>
          </div>
          <div className="divide-y divide-slate-100">
            <ActivityItem device="Chrome on MacOS" location="Phnom Penh, KH" time="Active Now" current />
            <ActivityItem device="Safari on iPhone" location="Siem Reap, KH" time="2 days ago" />
          </div>
        </section>
      </div>

      <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 flex items-start gap-3">
        <AlertTriangle className="text-amber-600 shrink-0" size={18} />
        <p className="text-xs font-medium text-amber-800 leading-relaxed">
          If you notice any suspicious activity, please change your password immediately and contact support.
        </p>
      </div>
    </motion.div>
  );
}

function ActivityItem({ device, location, time, current }) {
  return (
    <div className="p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
          <Smartphone size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{device}</p>
          <p className="text-xs text-slate-500">{location} • {time}</p>
        </div>
      </div>
      {current ? (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Active</span>
      ) : (
        <ChevronRight size={14} className="text-slate-300" />
      )}
    </div>
  );
}