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
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Security Center</h1>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1">Manage your account security and access protocols</p>
      </div>

      {/* --- HEALTH & OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Security Score */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="relative w-14 h-14 flex items-center justify-center z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="#f1f5f9" strokeWidth="5" fill="none" />
              <circle cx="28" cy="28" r="24" stroke="#10b981" strokeWidth="5" fill="none" strokeDasharray="150.8" strokeDashoffset="22" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[11px] font-black text-slate-900">85%</span>
          </div>
          <div className="z-10">
            <h3 className="text-sm font-black text-slate-800">Security Health</h3>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-tight uppercase tracking-wider">Your account is secure. 2 recommendations available.</p>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
        </div>

        {/* 2FA Status */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="flex items-center gap-3 z-10">
            <div className={`p-2.5 rounded-xl border-2 border-white shadow-sm ${is2FAEnabled ? 'bg-emerald-50 text-emerald-600 border-emerald-100/50' : 'bg-rose-50 text-rose-600 border-rose-100/50'}`}>
              <Smartphone size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Two-Factor Auth</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">
                {is2FAEnabled ? 'Enabled & Active' : 'Currently Disabled'}
              </p>
            </div>
          </div>
          <div className="mt-4 z-10">
             <button 
               onClick={() => setIs2FAEnabled(!is2FAEnabled)}
               className="text-[10px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 group/btn"
             >
               Manage Configuration <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
             </button>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
        </div>

        {/* Password Age */}
        <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group">
           <div className="flex items-center gap-3 z-10">
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border-2 border-white shadow-sm border-blue-100/50">
              <Key size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800">Password</h3>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] mt-0.5">Last changed 24 days ago</p>
            </div>
          </div>
          <div className="mt-4 z-10">
             <button className="text-[10px] font-black text-slate-500 hover:text-slate-900 border border-slate-100 px-3 py-1.5 rounded-xl transition-all hover:bg-slate-50 uppercase tracking-widest shadow-sm bg-white">
               Update Password
             </button>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
        </div>
      </div>

      {/* --- MAIN SETTINGS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LOGIN HISTORY */}
        <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <History size={14} className="text-indigo-600" strokeWidth={2.5} />
              Recent Login Activity
            </h3>
            <button className="text-[9px] font-black text-rose-600 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition-all border border-rose-100/50 uppercase tracking-widest">
              Log out all devices
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Device</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-4 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loginHistory.map((session) => (
                  <tr key={session.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {session.device.includes('iPhone') ? <Smartphone size={14} className="text-slate-400" /> : <Laptop size={14} className="text-slate-400" />}
                        <span className="text-[12px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{session.device}</span>
                        {session.status === 'current' && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100/50 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Globe size={12} className="text-slate-300" /> {session.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[11px] font-mono font-bold text-slate-400">{session.ip}</td>
                    <td className="px-6 py-4 text-right text-[11px] font-black text-slate-900 uppercase tracking-tighter">{session.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API KEYS & DANGER */}
        <div className="space-y-4">
          
          {/* API Access */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
            <h3 className="text-[11px] font-black text-slate-800 mb-4 uppercase tracking-widest">API Access Keys</h3>
            <div className="space-y-3 z-10 relative">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group/key">
                <div>
                   <p className="text-[10px] font-black text-slate-700 uppercase tracking-wider">Production Key</p>
                   <p className="text-[10px] font-mono text-slate-400 font-bold mt-0.5">pk_live_...93xS</p>
                </div>
                <button className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest">Copy</button>
              </div>
              <button className="w-full py-2.5 border border-dashed border-slate-200 rounded-xl text-[10px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all uppercase tracking-widest">
                + Generate Key
              </button>
            </div>
            <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
          </div>

          {/* Sensitive Actions */}
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm relative overflow-hidden group">
             <h3 className="text-[11px] font-black text-slate-800 mb-1 uppercase tracking-widest">Sensitive Actions</h3>
             <p className="text-[9px] font-bold text-slate-400 mb-4 uppercase tracking-wider leading-tight">Actions usually require re-authentication</p>
             
             <div className="space-y-2 z-10 relative">
               <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group/act border border-slate-100/50">
                 <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Export User Data</span>
                 <ChevronRight size={12} className="text-slate-400 group-hover/act:text-slate-600 transition-transform group-hover/act:translate-x-1" strokeWidth={3} />
               </button>
               <button className="w-full flex items-center justify-between p-3 rounded-xl bg-rose-50/50 hover:bg-rose-50 transition-colors group/act border border-rose-100/50">
                 <span className="text-[11px] font-black text-rose-700 uppercase tracking-widest">Delete Account</span>
                 <AlertTriangle size={14} className="text-rose-400 group-hover/act:text-rose-600 group-hover/act:scale-110 transition-all" strokeWidth={2.5} />
               </button>
             </div>
             <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
          </div>

        </div>
      </div>
    </div>
  );
}