'use client';

import { useState, useEffect } from 'react';
import { 
  ShieldCheck, Smartphone, Key, History, AlertTriangle, 
  LogOut, Globe, Laptop, CheckCircle2, ChevronRight, Loader2
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useSecurityStore } from '@/stores/securityStore';

export default function SecurityPage() {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  
  const { loginHistory, loadingHistory, fetchLoginHistory, logoutAllDevices, terminateSession, terminateMultipleSessions } = useSecurityStore();

  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]);

  const handleLogoutAll = async () => {
    if (confirm('Are you sure you want to log out from all other devices?')) {
      await logoutAllDevices();
      setSelectedIds([]);
    }
  };

  const handleTerminateSession = async (id) => {
    if (confirm('Terminate this session?')) {
      await terminateSession(id);
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleLogoutSelected = async () => {
    if (confirm(`Terminate ${selectedIds.length} selected sessions?`)) {
      await terminateMultipleSessions(selectedIds);
      setSelectedIds([]);
    }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    const terminatableSessions = loginHistory.filter(s => s.status !== 'current').map(s => s.id);
    if (selectedIds.length === terminatableSessions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(terminatableSessions);
    }
  };

  return (
    <div className="space-y-5 pb-8 font-sans max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="text-left">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">System Controls</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
            Security <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-rose-400">Center</span>
          </h1>
          <p className="text-slate-500 text-[12px] font-medium mt-1">
            Manage your account security and access protocols.
          </p>
        </div>
      </div>

      {/* --- HEALTH & OVERVIEW --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Security Score */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="relative w-12 h-12 flex items-center justify-center z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="24" cy="24" r="20" stroke="#f1f5f9" strokeWidth="4" fill="none" />
              <circle cx="24" cy="24" r="20" stroke="#10b981" strokeWidth="4" fill="none" strokeDasharray="125.6" strokeDashoffset="18" strokeLinecap="round" />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-900">85%</span>
          </div>
          <div className="z-10">
            <h3 className="text-[13px] font-black text-slate-800 tracking-tight leading-none">Security Health</h3>
            <p className="text-[9px] font-bold text-slate-400 mt-1 leading-tight uppercase tracking-widest">Your account is secure.<br/>2 recommendations.</p>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
        </div>

        {/* 2FA Status */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
          <div className="flex items-center gap-3 z-10">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${is2FAEnabled ? 'bg-emerald-500 shadow-emerald-100 text-white' : 'bg-rose-500 shadow-rose-100 text-white'}`}>
              <Smartphone size={14} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Two-Factor Auth</p>
              <h3 className="text-[13px] font-black text-slate-900 tracking-tighter leading-none">
                {is2FAEnabled ? 'Active' : 'Disabled'}
              </h3>
            </div>
          </div>
          <div className="mt-4 z-10">
             <button 
               onClick={() => setIs2FAEnabled(!is2FAEnabled)}
               className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 uppercase tracking-widest flex items-center gap-1 group/btn"
             >
               Manage Config <ChevronRight size={10} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
             </button>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out" />
        </div>

        {/* Password Age */}
        <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm flex flex-col justify-center relative overflow-hidden group hover:shadow-md transition-all">
           <div className="flex items-center gap-3 z-10">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-100 text-white transition-transform group-hover:scale-110">
              <Key size={14} strokeWidth={3} />
            </div>
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Password</p>
              <h3 className="text-[13px] font-black text-slate-900 tracking-tighter leading-none">24 days old</h3>
            </div>
          </div>
          <div className="mt-4 z-10">
             <button className="text-[9px] font-black text-slate-500 hover:text-slate-900 border border-slate-100 px-3 py-1.5 rounded-lg transition-all hover:bg-slate-50 uppercase tracking-widest shadow-sm bg-white">
               Update Password
             </button>
          </div>
          <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
        </div>
      </div>

      {/* --- MAIN SETTINGS GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* LOGIN HISTORY */}
        <div className="lg:col-span-2 bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <History size={12} className="text-indigo-500" strokeWidth={2.5} />
              Recent Login Activity
            </h3>
            <div className="flex gap-2">
              {selectedIds.length > 0 && (
                <button 
                  onClick={handleLogoutSelected}
                  disabled={loadingHistory}
                  className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 px-3 py-1 rounded-lg transition-all uppercase tracking-widest shadow-sm hover:bg-rose-100"
                >
                  Log out selected ({selectedIds.length})
                </button>
              )}
              <button 
                onClick={handleLogoutAll}
                disabled={loadingHistory}
                className="text-[9px] font-black text-slate-500 hover:text-rose-600 hover:bg-rose-50 px-3 py-1 rounded-lg transition-all border border-slate-100 uppercase tracking-widest shadow-sm bg-white disabled:opacity-50"
              >
                Log out all devices
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50">
                <tr>
                  <th className="px-4 py-3 w-10">
                    <input 
                      type="checkbox" 
                      className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                      checked={loginHistory.length > 0 && selectedIds.length === loginHistory.filter(s => s.status !== 'current').length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Device</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">IP Address</th>
                  <th className="px-6 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loadingHistory ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest">
                       <Loader2 className="animate-spin w-4 h-4 text-indigo-500 mx-auto" />
                    </td>
                  </tr>
                ) : loginHistory.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">No activity found</td>
                  </tr>
                ) : loginHistory.map((session) => (
                  <tr key={session.id} className={`hover:bg-slate-50/30 transition-colors group ${selectedIds.includes(session.id) ? 'bg-indigo-50/30' : ''}`}>
                    <td className="px-4 py-3.5">
                      {session.status !== 'current' && (
                        <input 
                          type="checkbox" 
                          className="rounded border-slate-200 text-indigo-600 focus:ring-indigo-500"
                          checked={selectedIds.includes(session.id)}
                          onChange={() => toggleSelect(session.id)}
                        />
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-3">
                        {session.device.includes('iPhone') ? <Smartphone size={13} className="text-slate-400" strokeWidth={3} /> : <Laptop size={13} className="text-slate-400" strokeWidth={3} />}
                        <span className="text-[12px] font-bold text-slate-700 group-hover:text-indigo-600 transition-colors">{session.device}</span>
                        {session.status === 'current' && (
                          <span className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 text-[8px] font-black rounded-lg uppercase tracking-widest shadow-sm">Current</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[11px] font-bold text-slate-500">
                      <div className="flex items-center gap-2">
                        <Globe size={11} className="text-slate-300" strokeWidth={3} /> {session.location}
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-[11px] font-mono font-bold text-slate-400">{session.ip}</td>
                    <td className="px-6 py-3.5 text-right">
                      {session.status !== 'current' ? (
                        <button 
                          onClick={() => handleTerminateSession(session.id)}
                          className="text-[9px] font-black text-slate-400 hover:text-rose-600 uppercase tracking-widest px-2 py-1 hover:bg-rose-50 rounded-lg transition-all"
                        >
                          Terminate
                        </button>
                      ) : (
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter mr-2">{session.time}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* API KEYS & DANGER */}
        <div className="space-y-4">
          
          {/* API Access */}
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
            <h3 className="text-[9px] font-black text-slate-400 mb-4 uppercase tracking-widest">API Access Keys</h3>
            <div className="space-y-3 z-10 relative">
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center group/key">
                <div>
                   <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest mb-0.5">Production Key</p>
                   <p className="text-[10px] font-mono text-slate-500 font-bold">pk_live_...93xS</p>
                </div>
                <button className="text-[9px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest px-2 py-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-indigo-100">Copy</button>
              </div>
              <button className="w-full py-2 border border-dashed border-slate-200 rounded-xl text-[9px] font-black text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 transition-all uppercase tracking-widest">
                + Generate Key
              </button>
            </div>
            <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
          </div>

          {/* Sensitive Actions */}
          <div className="bg-white p-5 rounded-[20px] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all">
             <h3 className="text-[9px] font-black text-slate-400 mb-1 uppercase tracking-widest">Sensitive Actions</h3>
             <p className="text-[9px] font-bold text-slate-400 mb-4 uppercase tracking-wider leading-tight">Actions usually require re-authentication</p>
             
             <div className="space-y-2 z-10 relative">
               <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group/act border border-slate-100 shadow-sm">
                 <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">Export User Data</span>
                 <ChevronRight size={12} className="text-slate-400 group-hover/act:text-slate-600 transition-transform group-hover/act:translate-x-1" strokeWidth={3} />
               </button>
               <button className="w-full flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-rose-50 transition-colors group/act border border-rose-100 shadow-sm">
                 <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Delete Account</span>
                 <AlertTriangle size={13} className="text-rose-400 group-hover/act:text-rose-600 group-hover/act:scale-110 transition-all" strokeWidth={2.5} />
               </button>
             </div>
             <div className="absolute -right-5 -bottom-5 w-20 h-20 bg-slate-50/50 rounded-full group-hover:scale-150 transition-all duration-700 ease-out opacity-50" />
          </div>

        </div>
      </div>
    </div>
  );
}
