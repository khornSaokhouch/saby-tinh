"use client";

import React from "react";
import { 
  ShieldCheck, 
  Key, 
  Smartphone, 
  History, 
  ChevronRight, 
  Lock, 
  AlertTriangle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function SecurityPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 sm:p-10 space-y-10"
    >
      <header>
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Privacy & Security</h1>
        <p className="text-slate-500 font-medium">Manage your password and keep your account protected.</p>
      </header>

      <div className="grid gap-6">
        {/* Password Section */}
        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                <Key size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Change Password</h3>
                <p className="text-sm text-slate-500 mt-1">It&apos;s a good idea to use a unique password that you don&apos;t use elsewhere.</p>
              </div>
            </div>
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-50 transition-all">
              Update Password
            </button>
          </div>
        </section>

        {/* 2FA Section */}
        <section className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm group hover:border-indigo-200 transition-all">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Two-Factor Authentication</h3>
                <p className="text-sm text-slate-500 mt-1">Add an extra layer of security to your account by requiring a code from your phone.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Currently Off</span>
               <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                Enable
               </button>
            </div>
          </div>
        </section>

        {/* Login Activity */}
        <section className="bg-white rounded-[32px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <History size={20} className="text-slate-400" />
              <h3 className="font-bold text-slate-900">Recent Login Activity</h3>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:underline">Log out all devices</button>
          </div>
          <div className="divide-y divide-slate-100">
            <ActivityItem device="Chrome on MacOS" location="Phnom Penh, KH" time="Active Now" current />
            <ActivityItem device="Safari on iPhone" location="Siem Reap, KH" time="2 days ago" />
          </div>
        </section>
      </div>

      <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
        <AlertTriangle className="text-amber-600 shrink-0" size={20} />
        <p className="text-xs font-medium text-amber-800 leading-relaxed">
          If you notice any suspicious activity, please change your password immediately and contact our support team.
        </p>
      </div>
    </motion.div>
  );
}

function ActivityItem({ device, location, time, current }) {
  return (
    <div className="p-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
          <Smartphone size={18} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{device}</p>
          <p className="text-xs text-slate-500">{location} • {time}</p>
        </div>
      </div>
      {current && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase">Current Session</span>
      )}
    </div>
  );
}