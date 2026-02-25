'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { 
  Crown, 
  ShieldCheck, 
  Activity, 
  Globe, 
  ArrowUpRight, 
  Settings, 
  LogOut, 
  Mail, 
  Phone, 
  Building2, 
  CreditCard, 
  TrendingUp, 
  Users, 
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';

// Animation variants
const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVar = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } }
};

export default function AdminProfilePage() {
  const { user, loading, error, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Recent';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // --- LOADING STATE ---
  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-8 animate-pulse">
        <div className="h-64 bg-slate-900/10 rounded-3xl w-full" />
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
          Unable to retrieve profile data. Please verify your connection.
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
      className="max-w-6xl mx-auto space-y-6 pb-10 font-sans"
    >
      
      {/* --- 1. EXECUTIVE HEADER --- */}
      <motion.div variants={itemVar} className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        {/* Abstract Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            
            {/* Avatar */}
            <div className="w-28 h-28 rounded-[32px] bg-slate-800 border-4 border-slate-800 flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden shrink-0">
               {user.profile?.image_profile ? (
                <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="uppercase">{user.name?.charAt(0)}</span>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black tracking-tighter leading-none">{user.name}</h1>
                <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-900/20">
                  {user.role || 'Owner'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] font-black uppercase tracking-widest">
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5"><Mail size={12} className="text-indigo-400" /> {user.email}</span>
                <span className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full border border-white/5"><Building2 size={12} className="text-indigo-400" /> ID: #{user.id}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/owner/settings" className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-indigo-900/50 transition-all flex items-center gap-2 active:scale-95">
              <Settings size={16} strokeWidth={2.5} /> Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* --- 2. MAIN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Business Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Executive Stats */}
          <motion.div variants={itemVar} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard 
              label="Account Role" 
              value={user.role || 'Admin'} 
              icon={Crown} 
              color="amber" 
              trend="Full Access"
            />
            <StatCard 
              label="System Status" 
              value="Online" 
              icon={Activity} 
              color="emerald" 
              trend="Operational"
            />
            <StatCard 
              label="Member Since" 
              value={formatDate(user.created_at)} 
              icon={Calendar} 
              color="blue" 
              trend="Verified"
            />
          </motion.div>

          {/* Contact & Location Info */}
          <motion.div variants={itemVar} className="bg-white border border-slate-100 rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-10 border-b border-slate-50 pb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl"><User size={20} strokeWidth={2.5} /></div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Personal Details</h3>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailItem label="Full Name" value={user.name} icon={User} />
              <DetailItem label="Phone Number" value={user.phone_number || "Not Set"} icon={Phone} />
              <DetailItem label="Primary Email" value={user.email} icon={Mail} />
              <DetailItem label="Location" value={user.profile?.location || "Remote"} icon={MapPin} />
              
              <div className="md:col-span-2 mt-4">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2 ml-1">
                   <Building2 className="w-3.5 h-3.5 text-indigo-400" /> Biography & Brief
                 </p>
                 <p className="text-sm font-medium text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-[24px] border border-slate-100">
                   {user.profile?.bio || "No biography information detected in system archives."}
                 </p>
              </div>
            </div>
          </motion.div>

          {/* Subscription / Plan Info */}
          <motion.div variants={itemVar} className="bg-indigo-600 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl shadow-indigo-100 group">
            <div className="absolute right-0 top-0 opacity-10 translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700">
              <CreditCard size={220} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-lg bg-white/20 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em]">
                  Owner Access
                </span>
              </div>
              <h3 className="text-3xl font-black mb-2 tracking-tighter">Full Account</h3>
              <p className="text-indigo-100 text-sm font-bold max-w-md mb-8 leading-relaxed opacity-80">
                You have full access to all system features, store management, and direct support.
              </p>
              
              <div className="flex flex-wrap items-center gap-4">
                <button className="px-8 py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl active:scale-95">
                  Manage Financials
                </button>
                <button className="px-8 py-4 bg-transparent border border-white/30 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
                  View Statements
                </button>
              </div>
            </div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Controls & Security */}
        <motion.div variants={itemVar} className="space-y-6">
          
          {/* Quick Actions Menu */}
          <div className="bg-white border border-slate-100 rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] h-full flex flex-col">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6 px-2">
              Quick Actions
            </h4>
            
            <nav className="space-y-2 flex-1">
              <SidebarLink icon={Users} label="Manage Team" href="/admin/users" />
              <SidebarLink icon={TrendingUp} label="Financial Reports" href="/admin/analytics" />
              <SidebarLink icon={ShieldCheck} label="Security" href="/admin/security" badge="Safe" />
              <SidebarLink icon={Globe} label="System Settings" href="/admin/settings" />
            </nav>

            <div className="mt-10 pt-8 border-t border-slate-50 space-y-6">
               <div className="p-6 bg-slate-50 rounded-[28px] border border-slate-100">
                  <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-widest mb-2">High Access</h5>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                    You have master access. Any changes you make will be applied system-wide.
                  </p>
               </div>

               <button className="w-full flex items-center justify-center gap-2 py-4 text-white bg-rose-500 hover:bg-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-rose-100 active:scale-95">
                 <LogOut size={16} strokeWidth={2.5} /> Sign Out
               </button>
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, trend }) {
  const styles = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    blue: "bg-blue-50 text-blue-600"
  };

  return (
    <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-xl transition-all duration-500 group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-4 rounded-2xl ${styles[color]}`}>
          <Icon size={22} strokeWidth={2.5} />
        </div>
        <ArrowUpRight className="text-slate-300 group-hover:text-indigo-600 transition-colors" size={16} strokeWidth={3} />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tighter mt-1 capitalize">{value}</h3>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">{trend}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="group space-y-2">
      <div className="flex items-center gap-2 ml-1">
        <Icon className="w-3.5 h-3.5 text-slate-400" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="w-full h-14 px-8 bg-slate-50 border border-slate-100 rounded-[22px] flex items-center">
        <span className="text-sm font-bold text-slate-700">{value}</span>
      </div>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, href, badge }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-4 rounded-2xl text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition-all group"
    >
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-indigo-100 transition-all">
          <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
        </div>
        <span className="font-black text-[11px] uppercase tracking-widest">{label}</span>
      </div>
      {badge ? (
        <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
          {badge}
        </span>
      ) : (
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />
      )}
    </Link>
  );
}