'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/stores/userStore';
import Link from 'next/link';
import { 
  ShieldCheck, Activity, Lock, Edit3, User, 
  Mail, Phone, Globe, ArrowUpRight, Settings, 
  LogOut, Key, FileText, Users, RefreshCw, Heart
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';

export default function AdminProfilePage() {
  const { language } = useLanguageStore();
  const { user, loading, error, fetchProfile } = useUserStore();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // --- LOADING STATE ---
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

  // --- ERROR STATE ---
  if (error || !user) {
    return (
      <div className="max-w-md mx-auto mt-20 font-sans p-6">
        <div className="bg-white p-10 rounded-[20px] border border-slate-100 text-center shadow-sm">
          <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-rose-500" size={28} />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-2">{t('Login required', language)}</h2>
          <p className="text-slate-400 text-[11px] font-medium mb-8">{t("We couldn't load your profile details right now.", language)}</p>
          <button onClick={() => window.location.reload()} className="w-full py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
            <RefreshCw size={12} /> {t('Try again', language)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-12 font-sans animate-in fade-in duration-500 pt-2">
      
      {/* --- HEADER --- */}
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
              <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Administrator account', language)}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              {t('Welcome back,', language)} <span className="text-indigo-600 capitalize">{user.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin/settings"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-indigo-300 transition-all shadow-sm"
          >
            <Settings size={12} /> {t('Settings', language)}
          </Link>
          <button className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-md active:scale-95 transition-all">
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
            <StatCard label={t('Permissions', language)} value={t('Full access', language)} icon={Lock} color="indigo" sub={t('Administrator', language)} />
            <StatCard label={t('Security', language)} value={t('Verified', language)} icon={ShieldCheck} color="emerald" sub={t('Protected', language)} />
            <StatCard label={t('History', language)} value={t('count logs', language).replace('count', 24)} icon={FileText} color="blue" sub={t('Recent activities', language)} />
          </div>

          {/* Personal Information Panel */}
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-50">
              <div>
                <h3 className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Contact info', language)}</h3>
                <p className="text-base font-bold text-slate-900 tracking-tight mt-0.5">{t('Personal details', language)}</p>
              </div>
              <button className="p-1.5 bg-slate-50 hover:bg-white hover:border-indigo-100 border border-transparent rounded-lg transition-all group">
                <Edit3 size={12} className="text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <DetailItem label={t('Full name', language)} value={user.name} icon={User} />
              <DetailItem label={t('Email address', language)} value={user.email} icon={Mail} />
              <DetailItem label={t('Phone number', language)} value={user.phone_number || t("Not provided", language)} icon={Phone} />
              <DetailItem label={t('Main office', language)} value={t("Admin dashboard", language)} icon={Globe} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shortcuts */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm flex flex-col h-full">
            <div className="mb-5 px-1">
              <h4 className="text-[9px] font-bold text-slate-400 tracking-wide mb-0.5">{t('Management', language)}</h4>
              <p className="text-sm font-bold text-slate-900 tracking-tight">{t('Quick navigation', language)}</p>
            </div>
            
            <div className="space-y-1">
              <ShortcutLink icon={ShieldCheck} label={t('Security center', language)} href="/admin/security" />
              <ShortcutLink icon={Users} label={t('Manage team', language)} href="/admin/users" badge={t('count new', language).replace('count', 2)} />
              <ShortcutLink icon={Key} label={t('API access', language)} href="/admin/api" />
              <ShortcutLink icon={Activity} label={t('System health', language)} href="/admin/system" />
            </div>

            <div className="mt-auto pt-6">
               <div className="bg-slate-900 p-4 rounded-xl shadow-xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1.5">
                       <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                       <span className="text-[9px] font-bold text-white/80 tracking-wide">{t('Security active', language)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                      {t('Your account is secured with standard encryption.', language)}
                    </p>
                  </div>
                  <Activity className="absolute -right-4 -bottom-4 opacity-[0.05] text-white" size={60} />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ label, value, icon: Icon, color, sub }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
  };
  return (
    <div className="bg-white p-4 rounded-[18px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
      <div className={`w-7 h-7 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-2.5 shadow-lg`}>
        <Icon size={12} strokeWidth={2.5} />
      </div>
      <p className="text-[9px] font-bold text-slate-400 tracking-wide mb-0.5">{label}</p>
      <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-none">{value}</h3>
      <p className="text-[9px] font-medium text-slate-400 mt-1.5">{sub}</p>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon }) {
  return (
    <div className="space-y-1 px-0.5">
      <div className="flex items-center gap-2 opacity-50 px-0.5">
        <Icon size={10} className="text-slate-400" />
        <span className="text-[9px] font-bold text-slate-400 tracking-wide">{label}</span>
      </div>
      <div className="px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-semibold text-slate-800 shadow-sm">
        {value}
      </div>
    </div>
  );
}

function ShortcutLink({ icon: Icon, label, href, badge }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between px-2.5 py-2 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-indigo-600 transition-all group"
    >
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-indigo-50 flex items-center justify-center transition-colors">
          <Icon size={12} className="text-slate-400 group-hover:text-indigo-500" strokeWidth={2} />
        </div>
        <span className="font-bold text-[12px] tracking-tight">{label}</span>
      </div>
      {badge ? (
        <span className="bg-indigo-600 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-md">{badge}</span>
      ) : (
        <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all text-slate-300" />
      )}
    </Link>
  );
}