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
  Users, Calendar, User, MapPin, Check,
  RefreshCw, Heart, Edit3
} from 'lucide-react';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function OwnerProfilePage() {
  const { language } = useLanguageStore();
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
    : (user?.profile?.location || t('Remote', language));
    
  const formatDate = (d) => d
    ? new Date(d).toLocaleDateString(language === 'km' ? 'km-KH' : 'en-US', { month: 'short', year: 'numeric' })
    : t('Recent', language);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center gap-4 text-center font-sans">
        <RefreshCw className="animate-spin text-indigo-600" size={28} />
        <div className="space-y-1">
          <h2 className="text-[10px] font-bold text-slate-400 tracking-wide">{t('Checking status', language)}</h2>
          <p className="text-[11px] font-bold text-slate-900">{t('Opening your profile...', language)}</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="max-w-md mx-auto mt-20 font-sans p-6 text-center">
        <div className="bg-white p-10 rounded-[20px] border border-slate-100 shadow-sm">
          <div className="w-14 h-14 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{t('Access restricted', language)}</h2>
          <p className="text-slate-400 text-[11px] font-medium mb-8">{t("Unable to retrieve profile data right now.", language)}</p>
          <button onClick={() => window.location.reload()} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
            <RefreshCw size={12} /> {t('Try again', language)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-12 font-sans animate-in fade-in duration-500 pt-2">
      
      {/* --- HEADER (Unified Style) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-slate-900 flex items-center justify-center text-lg font-bold text-white shadow-lg overflow-hidden border-2 border-white ring-1 ring-slate-100 shrink-0">
            {user.profile?.image_profile ? (
              <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{user.name?.charAt(0)}</span>
            )}
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Owner account', language)}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              {t('Welcome back,', language)} <span className="text-indigo-600 capitalize">{user.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/owner/settings"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-indigo-300 transition-all shadow-sm"
          >
            <Settings size={12} /> {t('Settings', language)}
          </Link>
          <button 
            onClick={() => setConfirmLogout(true)}
            className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-md active:scale-95 transition-all"
          >
            <LogOut size={12} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* --- MAIN BENTO GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Summary & Details */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Quick Stats */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <StatCard label={t('Account role', language)} value={user.role || 'Owner'} icon={Crown} color="amber" sub={t('Full access', language)} />
            <StatCard label={t('System status', language)} value={t('Active', language)} icon={Activity} color="emerald" sub={t('Operational', language)} />
            <StatCard label={t('Registration', language)} value={formatDate(user.created_at)} icon={Calendar} color="blue" sub={t('Verified account', language)} />
          </div>

          {/* Personal Information Panel */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50">
              <div>
                <h3 className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Contact info', language)}</h3>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-0.5">{t('Personal details', language)}</p>
              </div>
              <Link href="/owner/settings" className="p-1.5 bg-slate-50 hover:bg-white hover:border-indigo-100 border border-transparent rounded-lg transition-all group">
                <Edit3 size={12} className="text-slate-400 group-hover:text-indigo-600" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailItem label={t('Full name', language)} value={user.name} icon={User} />
              <DetailItem label={t('Email address', language)} value={user.email} icon={Mail} />
              <DetailItem label={t('Phone number', language)} value={user.phone_number || t("Not provided", language)} icon={Phone} />
              <DetailItem label={t('Location', language)} value={locationDisplay} icon={MapPin} />
              
              <div className="md:col-span-2 space-y-1.5">
                  <div className="flex items-center gap-2 opacity-50 px-1">
                    <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('About me', language)}</span>
                  </div>
                  <div className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <p className="text-[12px] font-semibold text-slate-600 leading-relaxed">
                      {user.profile?.bio || t('No biography set.', language)}
                    </p>
                  </div>
              </div>
            </div>
          </div>

          {/* Promotion/Plan Banner (Compact & Premium) */}
          <div className="bg-indigo-600 rounded-[20px] p-6 text-white relative overflow-hidden shadow-lg shadow-indigo-100 group">
            <div className="absolute right-0 top-0 opacity-[0.05] translate-x-6 -translate-y-4 group-hover:scale-110 transition-transform duration-700">
              <CreditCard size={140} />
            </div>
            <div className="relative z-10">
              <span className="inline-flex px-2 py-0.5 rounded-lg bg-white/20 border border-white/20 text-white text-[8px] font-bold tracking-wide mb-3">
                {t('Owner privilege', language)}
              </span>
              <h3 className="text-xl font-bold tracking-tight mb-1">{t('Account status: active', language)}</h3>
              <p className="text-indigo-100 text-[11px] font-medium max-w-sm mb-5 leading-relaxed opacity-80">
                {t('You have full access to all store management modules, system-wide analytics, and direct support channels.', language)}
              </p>
              <div className="flex flex-wrap gap-2">
                <button className="px-4 py-1.5 bg-white text-indigo-600 rounded-lg text-[10px] font-bold tracking-wide hover:bg-indigo-50 transition-all shadow-md active:scale-95">
                  {t('Manage finances', language)}
                </button>
                <button className="px-4 py-1.5 bg-transparent border border-white/30 text-white rounded-lg text-[10px] font-bold tracking-wide hover:bg-white/10 transition-all active:scale-95">
                  {t('View reports', language)}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shortcuts & Status */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm flex flex-col h-full">
            <div className="mb-5 px-1">
              <h4 className="text-[9px] font-bold text-slate-400 tracking-wide mb-0.5">{t('Management', language)}</h4>
              <p className="text-sm font-bold text-slate-900 tracking-tight">{t('Quick navigation', language)}</p>
            </div>
            
            <div className="space-y-1">
              <ShortcutLink icon={Users} label={t('Manage team', language)} href="/admin/users" />
              <ShortcutLink icon={TrendingUp} label={t('Financial reports', language)} href="/admin/analytics" />
              <ShortcutLink icon={ShieldCheck} label={t('Security settings', language)} href="/owner/account/reset-password" badge={t('Safe', language)} />
              <ShortcutLink icon={Globe} label={t('System settings', language)} href="/owner/settings" />
            </div>

            <div className="mt-8 pt-4 border-t border-slate-50">
               <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                  <div className="space-y-1">
                     <p className="text-[10px] font-bold text-slate-800 tracking-tight">{t('High level access', language)}</p>
                     <p className="text-[9px] text-slate-400 font-medium leading-relaxed">
                        {t('Global status changes will apply immediately to your cluster.', language)}
                     </p>
                  </div>
               </div>
            </div>

            <div className="mt-auto pt-6">
               <div className="bg-slate-900 p-4 rounded-xl shadow-xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                       <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                       <span className="text-[9px] font-bold text-white/80 tracking-wide">{t('Account integrity', language)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      {t('Protected by end-to-end encryption protocols.', language)}
                    </p>
                  </div>
                  <Activity className="absolute -right-4 -bottom-4 opacity-[0.05] text-white" size={60} />
               </div>
            </div>
          </div>
        </div>

      </div>

      <LogoutConfirmModal 
        isOpen={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={async () => { setIsLoggingOut(true); await logout(); }}
        isLoggingOut={isLoggingOut}
      />
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, sub }) {
  const themes = {
    amber: "bg-amber-500 shadow-amber-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
  };
  return (
    <div className="bg-white p-4 rounded-[18px] border border-slate-100 shadow-sm transition-all hover:shadow-md group">
      <div className="flex justify-between items-start mb-3">
          <div className={`w-7 h-7 rounded-xl ${themes[color]} flex items-center justify-center text-white shadow-lg`}>
            <Icon size={12} strokeWidth={2.5} />
          </div>
          <ArrowUpRight className="text-slate-100 group-hover:text-indigo-400 transition-colors" size={12} />
      </div>
      <p className="text-[9px] font-bold text-slate-400 tracking-wide mb-0.5">{label}</p>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none capitalize">{value}</h3>
      <p className="text-[9px] font-medium text-slate-400 mt-1.5">{sub}</p>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1.5 px-0.5">
      <div className="flex items-center gap-2 opacity-50 px-0.5">
        <Icon size={10} className="text-slate-400" />
        <span className="text-[9px] font-bold text-slate-400 tracking-wide">{label}</span>
      </div>
      <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-semibold text-slate-800 shadow-sm truncate">
        {value}
      </div>
    </div>
  );
}

function ShortcutLink({ icon: Icon, label, href, badge }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between px-2.5 py-2.5 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
          <Icon size={12} className="text-slate-400 group-hover:text-indigo-500" strokeWidth={2} />
        </div>
        <span className="font-bold text-[11px] tracking-tight">{label}</span>
      </div>
      {badge ? (
        <span className="bg-emerald-50 text-emerald-600 text-[8px] font-bold px-1.5 py-0.5 rounded-md border border-emerald-100">{badge}</span>
      ) : (
        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all text-slate-300" />
      )}
    </Link>
  );
}