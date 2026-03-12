'use client';

import { useEffect, useState } from 'react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useAddressStore } from '@/stores/useAddressStore';
import { motion } from 'framer-motion';
import Link from 'next/link';
import LogoutConfirmModal from '@/app/components/owner/LogoutConfirmModal';
import { 
  Crown, ShieldCheck, Activity, Globe,
  ArrowUpRight, Settings, LogOut, Mail, 
  Phone, Building2, CreditCard, TrendingUp, 
  Users, Calendar, User, MapPin, Check
} from 'lucide-react';

const containerVar = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } }
};
const itemVar = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 60, damping: 18 } }
};

export default function AdminProfilePage() {
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout } = useAuthStore();
  const { user, loading, error, fetchProfile } = useUserStore();
  const { userAddresses, fetchUserAddresses } = useAddressStore();

  useEffect(() => {
    fetchProfile();
    fetchUserAddresses();
  }, [fetchProfile, fetchUserAddresses]);

  // Derive a human-readable location from the first stored address
  const primaryAddress = userAddresses?.[0];
  const locationDisplay = primaryAddress
    ? [primaryAddress.province, primaryAddress.country?.name || primaryAddress.country_name]
        .filter(Boolean).join(', ')
    : (user?.profile?.location || 'Remote');
  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'Recent';

  if (loading) return (
    <div className="max-w-5xl mx-auto p-4 space-y-4 animate-pulse">
      <div className="h-36 bg-slate-900/10 rounded-[22px]" />
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-slate-100 rounded-[18px]" />)}
      </div>
      <div className="h-48 bg-slate-100 rounded-[18px]" />
    </div>
  );

  if (error || !user) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mb-3">
        <ShieldCheck className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-black text-slate-900 mb-1 tracking-tight">Access Restricted</h2>
      <p className="text-[12px] text-slate-400 font-bold mb-4 max-w-xs">Unable to retrieve profile data. Please verify your connection.</p>
      <button onClick={() => window.location.reload()} className="px-5 py-2 bg-slate-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95">
        Retry
      </button>
    </div>
  );

  return (
    <motion.div variants={containerVar} initial="hidden" animate="show"
      className="max-w-5xl mx-auto space-y-4 pb-8 font-sans">

      {/* ── HERO HEADER ── */}
      <motion.div variants={itemVar}
        className="relative overflow-hidden rounded-[22px] bg-slate-900 text-white shadow-xl">
        {/* bg glows */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

        <div className="relative p-5 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Left: avatar + name */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[16px] bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xl font-black text-white shadow-lg overflow-hidden shrink-0">
              {user.profile?.image_profile
                ? <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
                : <span className="uppercase">{user.name?.charAt(0)}</span>}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-black tracking-tighter leading-none">{user.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/80 text-white text-[8px] font-black uppercase tracking-widest">
                  {user.role || 'Owner'}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <Mail size={9} className="text-indigo-400" /> {user.email}
                </span>
                <span className="flex items-center gap-1 text-slate-400 text-[10px] font-bold bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                  <Building2 size={9} className="text-indigo-400" /> ID #{user.id}
                </span>
              </div>
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            <Link href="/owner/settings"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all flex items-center gap-1.5 active:scale-95">
              <Settings size={12} strokeWidth={3} /> Edit Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* ── STAT CARDS ── */}
      <motion.div variants={itemVar} className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Account Role"   value={user.role || 'Owner'}          icon={Crown}    color="amber"   trend="Full Access"   />
        <StatCard label="System Status"  value="Online"                         icon={Activity} color="emerald" trend="Operational"   />
        <StatCard label="Member Since"   value={formatDate(user.created_at)}    icon={Calendar} color="blue"    trend="Verified"      />
      </motion.div>

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* LEFT: Personal Details + Plan */}
        <div className="lg:col-span-2 space-y-4">

          {/* Personal Details */}
          <motion.div variants={itemVar} className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-50">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg"><User size={14} strokeWidth={2.5} /></div>
              <h3 className="text-[11px] font-black text-slate-700 uppercase tracking-widest">Personal Details</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <DetailItem label="Full Name"      value={user.name}                             icon={User}      />
              <DetailItem label="Phone"          value={user.phone_number || 'Not set'}        icon={Phone}     />
              <DetailItem label="Email"          value={user.email}                            icon={Mail}      />
              <DetailItem label="Location"       value={locationDisplay}                       icon={MapPin}    />
              <div className="md:col-span-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 ml-1">
                  <Building2 className="w-3 h-3 text-indigo-400" /> Bio
                </p>
                <div className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="text-[12px] font-medium text-slate-600 leading-relaxed">
                    {user.profile?.bio || 'No biography set.'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Plan Banner */}
          <motion.div variants={itemVar}
            className="bg-indigo-600 rounded-[20px] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-100/60 group">
            <div className="absolute right-0 top-0 opacity-[0.07] translate-x-6 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <CreditCard size={160} />
            </div>
            <div className="relative z-10">
              <span className="inline-flex px-2.5 py-0.5 rounded-lg bg-white/20 border border-white/20 text-white text-[9px] font-black uppercase tracking-widest mb-3">
                Owner Access
              </span>
              <h3 className="text-2xl font-black tracking-tighter mb-1">Full Account</h3>
              <p className="text-indigo-200/80 text-[12px] font-bold max-w-xs mb-5 leading-relaxed">
                Full access to all system features, store management, and direct support.
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-2 bg-white text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                  Manage Financials
                </button>
                <button className="px-4 py-2 bg-transparent border border-white/30 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">
                  View Statements
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT: Quick Actions + Sign Out */}
        <motion.div variants={itemVar} className="space-y-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-4 shadow-sm flex flex-col gap-3">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Quick Actions</p>
            <nav className="space-y-0.5">
              <ActionLink icon={Users}        label="Manage Team"        href="/admin/users"     />
              <ActionLink icon={TrendingUp}   label="Financial Reports"  href="/admin/analytics" />
              <ActionLink icon={ShieldCheck}  label="Security"           href="/admin/security"  badge="Safe" />
              <ActionLink icon={Globe}        label="System Settings"    href="/owner/settings"  />
            </nav>

            <div className="px-3 py-2.5 bg-slate-50 rounded-[14px] border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">High Access</span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">
                Changes you make will apply system-wide.
              </p>
            </div>

            <button
              onClick={() => setConfirmLogout(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm shadow-rose-100"
            >
              <LogOut size={13} strokeWidth={3} /> Sign Out
            </button>
          </div>

          <LogoutConfirmModal
            isOpen={confirmLogout}
            onClose={() => setConfirmLogout(false)}
            onConfirm={async () => { setIsLoggingOut(true); await logout(); }}
            isLoggingOut={isLoggingOut}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// ── SUB-COMPONENTS ──

function StatCard({ label, value, icon: Icon, color, trend }) {
  const styles = {
    amber:   'bg-amber-50 text-amber-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    blue:    'bg-blue-50 text-blue-600',
  };
  return (
    <div className="bg-white p-4 rounded-[18px] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-3">
        <div className={`p-2 rounded-[10px] ${styles[color]}`}>
          <Icon size={13} strokeWidth={3} />
        </div>
        <ArrowUpRight className="text-slate-200 group-hover:text-indigo-500 transition-colors" size={12} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <h3 className="text-[15px] font-black text-slate-900 tracking-tight capitalize leading-none mt-0.5">{value}</h3>
      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mt-1">{trend}</p>
      <div className="absolute -right-2 -bottom-2 w-14 h-14 bg-slate-50 rounded-full group-hover:scale-150 transition-all duration-700 opacity-50" />
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 ml-1">
        <Icon className="w-3 h-3 text-slate-400" strokeWidth={3} />
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <div className="w-full h-9 px-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center">
        <span className="text-[12px] font-bold text-slate-700 truncate">{value}</span>
      </div>
    </div>
  );
}

function ActionLink({ icon: Icon, label, href, badge }) {
  return (
    <Link href={href}
      className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-600 hover:bg-indigo-50/60 hover:text-indigo-600 transition-all group">
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-lg bg-slate-50 group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-indigo-100 transition-all">
          <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-colors" strokeWidth={2.5} />
        </div>
        <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      {badge
        ? <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md">{badge}</span>
        : <ArrowUpRight className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={3} />}
    </Link>
  );
}