'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Activity, 
  Lock, 
  Edit3, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  ArrowUpRight, 
  Settings, 
  LogOut,
  Key,
  FileText,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

export default function AdminProfilePage() {
  const { user, loading, error, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-pulse">
        <div className="h-48 bg-slate-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl w-full" />
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Access Restricted</h2>
        <p className="text-slate-500 mb-6 max-w-md">
          Unable to retrieve administrator profile data. Please verify your connection.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVar}
      initial="hidden"
      animate="show"
      className="max-w-6xl mx-auto p-4 sm:p-8 space-y-6 font-sans"
    >
      {/* --- HEADER SECTION --- */}
      <motion.div variants={itemVar} className="relative group">
        <div className="absolute inset-0 bg-white border border-slate-100 rounded-[24px] shadow-sm" />
        
        <div className="relative p-7 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex items-start md:items-end gap-6">
            
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-slate-200 overflow-hidden border-4 border-white group-hover:rotate-3 transition-transform">
              {user.profile?.image_profile ? (
                <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0) || <User />
              )}
            </div>
            
            <div className="mb-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 italic uppercase">
                  {user.name}
                </h1>
                <span className="px-2 py-0.5 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-700 text-[9px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck size={10} strokeWidth={3} />
                  Master Admin
                </span>
              </div>

              <p className="text-slate-400 font-black flex items-center gap-2 text-[10px] uppercase tracking-widest">
                <Mail className="w-3.5 h-3.5" /> {user.email}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Link 
              href="/admin/settings"
              className="px-4 py-2.5 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black transition-all flex items-center gap-2 text-slate-700 shadow-sm uppercase tracking-widest"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure</span>
            </Link>

            <button className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 rounded-xl transition-all shadow-sm">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* --- MAIN GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Stats & Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Admin Stats Row */}
          <motion.div variants={itemVar} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <DashboardCard 
              title="Access Level" 
              value="Level 5" 
              icon={Lock} 
              href="/admin/roles"
              accentColor="bg-slate-100 text-slate-700"
              subText="Full Permissions"
            />
            <DashboardCard 
              title="System Status" 
              value="Online" 
              icon={Activity} 
              href="/admin/system"
              accentColor="bg-emerald-50 text-emerald-600"
              subText="All services active"
            />
            <DashboardCard 
              title="Audit Logs" 
              value="24 New" 
              icon={FileText} 
              href="/admin/logs"
              accentColor="bg-blue-50 text-blue-600"
              subText="Since last login"
            />
          </motion.div>

          {/* Profile Information Panel */}
          <motion.div variants={itemVar} className="bg-white border border-slate-100 rounded-[24px] p-7 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-600" />
                Identity Data
              </h3>
              <button className="text-[9px] font-black text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-widest italic group">
                <Edit3 size={10} className="group-hover:rotate-12 transition-transform" /> Modify
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-7 gap-x-10">
              <DetailItem label="Full Designation" value={user.name} icon={User} />
              <DetailItem label="Registry Email" value={user.email} icon={Mail} />
              <DetailItem label="Secure Contact" value={user.phone_number || "+1 (555) 000-0000"} icon={Phone} />
              <DetailItem label="Primary Node" value="HQ Mainframe" icon={Globe} />
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Admin Shortcuts */}
        <motion.div variants={itemVar} className="space-y-6">
          
          {/* Management Menu */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm h-full flex flex-col">
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 px-1">
              Admin Ops Center
            </h4>
            
            <nav className="space-y-1.5 flex-1">
              <SidebarLink icon={ShieldCheck} label="Firewall & Auth" href="/admin/security" />
              <SidebarLink icon={Users} label="Personnel" href="/admin/users" badge="2 Pending" />
              <SidebarLink icon={Key} label="Access Tokens" href="/admin/api" />
              <SidebarLink icon={FileText} label="System Trace" href="/admin/logs" />
              <SidebarLink icon={Activity} label="Kernel Health" href="/admin/system" />
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-50">
               <div className="bg-slate-900 p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full translate-x-10 -translate-y-10 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                  <div className="flex items-start gap-3 relative z-10">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <h5 className="text-[11px] font-black text-white uppercase tracking-wider">Secure Zone</h5>
                      <p className="text-[9px] text-slate-400 mt-1 leading-relaxed font-black uppercase tracking-widest opacity-70">
                        Symmetric 256-bit AES protection active.
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENTS ---

function DashboardCard({ title, value, icon: Icon, href, accentColor, subText }) {
  return (
    <Link href={href} className="block group">
      <div className="bg-white border border-slate-100 p-5 rounded-[24px] shadow-sm transition-all duration-500 hover:shadow-md hover:border-indigo-100/50 relative overflow-hidden h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 border-white shadow-sm ring-1 ring-slate-100/50 ${accentColor}`}>
            <Icon className="w-4 h-4" strokeWidth={3} />
          </div>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{title}</p>
          <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">{value}</h3>
          <p className="text-[9px] font-black text-slate-400/60 uppercase tracking-widest">{subText}</p>
        </div>
      </div>
    </Link>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.15em] flex items-center gap-1.5 opacity-70">
          <Icon className="w-3 h-3 text-indigo-500" strokeWidth={3} /> {label}
        </p>
      </div>
      <p className="text-[13px] font-black text-slate-800 tracking-tight border-b-2 border-slate-50 group-hover:border-indigo-100 transition-all pb-1 inline-block uppercase italic">
        {value}
      </p>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, href, badge }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-3 rounded-xl text-slate-500 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all group border border-transparent hover:border-indigo-100/30"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
        <span className="font-black text-[11px] uppercase tracking-widest leading-none">{label}</span>
      </div>
      {badge ? (
        <span className="bg-rose-50 text-rose-600 border border-rose-100/50 text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">
          {badge}
        </span>
      ) : (
        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </Link>
  );
}