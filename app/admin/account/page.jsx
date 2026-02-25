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
        {/* Background Banner */}
        <div className="absolute inset-0 bg-white border border-slate-200 rounded-3xl shadow-sm" />
        
        <div className="relative p-8 sm:p-10 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
          <div className="flex items-start md:items-end gap-6">
            
            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl bg-slate-900 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-slate-200 overflow-hidden">
              {user.profile?.image_profile ? (
                <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0) || <User />
              )}
            </div>
            
            <div className="mb-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  {user.name}
                </h1>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={12} />
                  Super Admin
                </span>
              </div>

              <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
                <Mail className="w-4 h-4" /> {user.email}
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-3">
            <Link 
              href="/admin/settings"
              className="px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm transition-all flex items-center gap-2 text-slate-700 shadow-sm"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>

            <button className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100 rounded-xl transition-all">
              <LogOut className="w-5 h-5" />
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
          <motion.div variants={itemVar} className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <User className="w-5 h-5 text-slate-400" />
                Administrator Details
              </h3>
              <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                <Edit3 size={12} /> Edit
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
              <DetailItem label="Full Name" value={user.name} icon={User} />
              <DetailItem label="Email Address" value={user.email} icon={Mail} />
              <DetailItem label="Work Phone" value={user.phone_number || "+1 (555) 000-0000"} icon={Phone} />
              <DetailItem label="Primary Location" value="Headquarters - NY" icon={Globe} />
            </div>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Admin Shortcuts */}
        <motion.div variants={itemVar} className="space-y-6">
          
          {/* Management Menu */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm h-full flex flex-col">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">
              Management Console
            </h4>
            
            <nav className="space-y-1 flex-1">
              <SidebarLink icon={ShieldCheck} label="Security & Login" href="/admin/security" />
              <SidebarLink icon={Users} label="Manage Staff" href="/admin/users" badge="2 Pending" />
              <SidebarLink icon={Key} label="API Keys" href="/admin/api" />
              <SidebarLink icon={FileText} label="Activity Logs" href="/admin/logs" />
              <SidebarLink icon={Activity} label="System Health" href="/admin/system" />
            </nav>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl shadow-lg text-white">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 mt-0.5" />
                    <div>
                      <h5 className="text-sm font-bold text-white">Secure Session</h5>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Your session is encrypted (256-bit). IP logged for audit.
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
      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm transition-all duration-300 hover:shadow-md hover:border-slate-300 relative overflow-hidden h-full">
        <div className="flex justify-between items-start mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accentColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{title}</p>
          <h3 className="text-xl font-bold text-slate-900">{value}</h3>
          <p className="text-[10px] font-medium text-slate-500">{subText}</p>
        </div>
      </div>
    </Link>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide flex items-center gap-2">
          <Icon className="w-3.5 h-3.5" /> {label}
        </p>
      </div>
      <p className="text-sm font-bold text-slate-800 border-b border-transparent group-hover:border-slate-100 transition-all pb-1 inline-block">
        {value}
      </p>
    </div>
  );
}

function SidebarLink({ icon: Icon, label, href, badge }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between p-3 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-all group"
    >
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        <span className="font-bold text-sm">{label}</span>
      </div>
      {badge ? (
        <span className="bg-indigo-50 text-indigo-600 border border-indigo-100 text-[9px] font-bold px-2 py-0.5 rounded-md">
          {badge}
        </span>
      ) : (
        <ArrowUpRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </Link>
  );
}