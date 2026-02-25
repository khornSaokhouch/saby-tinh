'use client';

import { useState } from 'react';
import { 
  ShieldCheck, Smartphone, Key, History, AlertTriangle, 
  LogOut, Globe, Laptop, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

const loginHistory = [
  { id: 1, device: 'MacBook Pro', location: 'San Francisco, US', ip: '192.168.1.1', time: 'Active now', status: 'current' },
  { id: 2, device: 'iPhone 13', location: 'San Francisco, US', ip: '192.168.1.4', time: '2 hours ago', status: 'valid' },
  { id: 3, device: 'Windows PC', location: 'London, UK', ip: '10.0.0.42', time: '1 day ago', status: 'valid' },
  { id: 4, device: 'Chrome (Linux)', location: 'Berlin, DE', ip: '172.16.0.1', time: '3 days ago', status: 'valid' },
];

export default function SecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);

  return (
    <div className="space-y-6 pb-10 font-sans">
      
      {/* --- HEADER --- */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Security Center</h1>
        <p className="text-xs font-medium text-slate-500 mt-1">Manage your account security and access protocols.</p>
      </div>

      {/* --- HEALTH & OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Security Score */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="28" stroke="#e2e8f0" strokeWidth="6" fill="none" />
              <circle cx="32" cy="32" r="28" stroke="#10b981" strokeWidth="6" fill="none" strokeDasharray="175.9" strokeDashoffset="35" strokeLinecap="round" />
            </svg>
            <span className="absolute text-sm font-bold text-slate-900">85%</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Security Health</h3>
            <p className="text-[10px] font-medium text-slate-500 mt-1 leading-tight">Your account is secure. 2 recommendations available.</p>
          </div>
        </div>

        {/* 2FA Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-3 z-10">
            <div className={`p-2 rounded-lg ${is2FAEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <Smartphone size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Two-Factor Auth</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                {is2FAEnabled ? 'Enabled & Active' : 'Currently Disabled'}
              </p>
            </div>
          </div>
          <div className="mt-3 z-10">
             <button 
               onClick={() => setIs2FAEnabled(!is2FAEnabled)}
               className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
             >
               Manage Configuration &rarr;
             </button>
          </div>
        </div>

        {/* Password Age */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
           <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Key size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">Password</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Last changed 24 days ago</p>
            </div>
          </div>
          <div className="mt-3">
             <button className="text-xs font-bold text-slate-600 hover:text-slate-900 border border-slate-200 px-3 py-1.5 rounded-lg transition-all hover:bg-slate-50">
               Update Password
             </button>
          </div>
        </div>
      </div>

      {/* --- MAIN SETTINGS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LOGIN HISTORY */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <History size={16} className="text-slate-400" />
              Recent Login Activity
            </h3>
            <button className="text-[10px] font-bold text-rose-600 hover:bg-rose-50 px-2 py-1 rounded-lg transition-colors">
              Log out all devices
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Device</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">IP Address</th>
                  <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loginHistory.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        {session.device.includes('iPhone') ? <Smartphone size={16} className="text-slate-400" /> : <Laptop size={16} className="text-slate-400" />}
                        <span className="text-xs font-bold text-slate-700">{session.device}</span>
                        {session.status === 'current' && (
                          <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded uppercase tracking-wide">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-medium text-slate-500 flex items-center gap-2">
                      <Globe size={12} /> {session.location}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-mono text-slate-500">{session.ip}</td>
                    <td className="px-5 py-3.5 text-right text-xs font-bold text-slate-900">{session.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API KEYS & DANGER */}
        <div className="space-y-4">
          
          {/* API Access */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-3">API Access Keys</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg flex justify-between items-center group">
                <div>
                   <p className="text-xs font-bold text-slate-700">Production Key</p>
                   <p className="text-[10px] font-mono text-slate-400 mt-0.5">pk_live_...93xS</p>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600">Copy</button>
              </div>
              <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 transition-all">
                + Generate New Key
              </button>
            </div>
          </div>

          {/* Sensitive Actions */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-800 mb-1">Sensitive Actions</h3>
             <p className="text-[10px] text-slate-500 mb-4">actions usually require re-authentication.</p>
             
             <div className="space-y-2">
               <button className="w-full flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors group">
                 <span className="text-xs font-bold text-slate-700">Export User Data</span>
                 <ChevronRight size={14} className="text-slate-400 group-hover:text-slate-600" />
               </button>
               <button className="w-full flex items-center justify-between p-3 rounded-lg bg-rose-50 hover:bg-rose-100 transition-colors group border border-rose-100">
                 <span className="text-xs font-bold text-rose-700">Delete Account</span>
                 <AlertTriangle size={14} className="text-rose-400 group-hover:text-rose-600" />
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}