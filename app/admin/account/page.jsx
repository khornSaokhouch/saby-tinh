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
        <RefreshCw className="animate-spin text-indigo-600" size={32} />
        <div className="space-y-1">
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Checking Credentials', language)}</h2>
          <p className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t('Opening your profile...', language)}</p>
        </div>
      </div>
    );
  }

  // --- ERROR STATE ---
  if (error || !user) {
    return (
      <div className="max-w-md mx-auto mt-20 font-sans p-6">
        <div className="bg-white p-10 rounded-[24px] border border-slate-100 text-center shadow-sm">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="text-rose-500" size={32} />
          </div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter mb-2">{t('Login Required', language)}</h2>
          <p className="text-slate-400 text-xs font-medium mb-8">{t("We couldn't load your profile details right now.", language)}</p>
          <button onClick={() => window.location.reload()} className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-indigo-600 transition-all">
            <RefreshCw size={14} /> {t('Try Again', language)}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-5 pb-12 font-sans animate-in fade-in duration-500">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-[20px] bg-slate-900 flex items-center justify-center text-2xl font-black text-white shadow-lg overflow-hidden border-2 border-white ring-1 ring-slate-100 shrink-0">
            {user.profile?.image_profile ? (
              <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="uppercase">{user.name?.charAt(0)}</span>
            )}
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Administrator Account', language)}</span>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">
              {t('Welcome back,', language)} <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-rose-500 uppercase">{user.name}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin/settings"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:border-indigo-300 transition-all shadow-sm"
          >
            <Settings size={13} /> {t('Edit Settings', language)}
          </Link>
          <button className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-md active:scale-95 transition-all">
            <LogOut size={14} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* --- MAIN BENTO GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* LEFT COLUMN: Summary & Details */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Quick Stats */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label={t('My Permissions', language)} value={t('Full Access', language)} icon={Lock} color="indigo" sub={t('Administrator level', language)} language={language} />
            <StatCard label={t('Account Status', language)} value={t('Verified', language)} icon={ShieldCheck} color="emerald" sub={t('Safe and secure', language)} language={language} />
            <StatCard label={t('Recent Actions', language)} value={t('count Logs', language).replace('count', 24)} icon={FileText} color="blue" sub={t('View activity history', language)} language={language} />
          </div>

          {/* Personal Information Panel */}
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
              <div>
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('Contact Details', language)}</h3>
                <p className="text-lg font-black text-slate-900 tracking-tight leading-none mt-1">{t('Personal Information', language)}</p>
              </div>
              <button className="p-2 bg-slate-50 hover:bg-white hover:border-indigo-100 border border-transparent rounded-lg transition-all group">
                <Edit3 size={14} className="text-slate-400 group-hover:text-indigo-600" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailItem label={t('Full Name', language)} value={user.name} icon={User} language={language} />
              <DetailItem label={t('Email Address', language)} value={user.email} icon={Mail} language={language} />
              <DetailItem label={t('Phone Number', language)} value={user.phone_number || t("No phone added", language)} icon={Phone} language={language} />
              <DetailItem label={t('Primary Office', language)} value={t("Main Dashboard Hub", language)} icon={Globe} language={language} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Shortcuts */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm flex flex-col h-full">
            <div className="mb-6">
              <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t('Tools', language)}</h4>
              <p className="text-md font-black text-slate-900 tracking-tighter uppercase">{t('Quick Links', language)}</p>
            </div>
            
            <nav className="space-y-1.5">
              <ShortcutLink icon={ShieldCheck} label={t('Security Center', language)} href="/admin/security" language={language} />
              <ShortcutLink icon={Users} label={t('Manage Team', language)} href="/admin/users" badge={t('count New', language).replace('count', 2)} language={language} />
              <ShortcutLink icon={Key} label={t('API Access', language)} href="/admin/api" language={language} />
              <ShortcutLink icon={Activity} label={t('System Health', language)} href="/admin/system" language={language} />
            </nav>

            <div className="mt-auto pt-6">
               <div className="bg-slate-900 p-5 rounded-2xl shadow-xl text-white relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                       <Heart className="w-3 h-3 text-rose-400 fill-rose-400" />
                       <span className="text-[8px] font-black uppercase tracking-widest text-rose-400">{t('Pro Protection', language)}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-black uppercase tracking-widest opacity-80">
                      {t('Your account is protected by industry standard encryption.', language)}
                    </p>
                  </div>
                  <Activity className="absolute -right-4 -bottom-4 opacity-[0.05] text-white" size={80} />
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS (Compact & Professional) ---

function StatCard({ label, value, icon: Icon, color, sub, language }) {
  const themes = {
    indigo: "bg-indigo-600 shadow-indigo-100",
    emerald: "bg-emerald-500 shadow-emerald-100",
    blue: "bg-blue-600 shadow-blue-100",
  };
  return (
    <div className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm group transition-all hover:shadow-md">
      <div className={`w-8 h-8 rounded-xl ${themes[color]} flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon size={14} strokeWidth={3} />
      </div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
      <h3 className="text-xl font-black text-slate-900 tracking-tighter leading-none">{value}</h3>
      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 opacity-60">{sub}</p>
    </div>
  );
}

function DetailItem({ label, value, icon: Icon, language }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2 px-1">
        <Icon size={10} className="text-slate-300" />
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
      <div className="px-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-[11px] font-black text-slate-800 uppercase tracking-tight shadow-inner">
        {value}
      </div>
    </div>
  );
}

function ShortcutLink({ icon: Icon, label, href, badge, language }) {
  return (
    <Link 
      href={href}
      className="flex items-center justify-between px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100/50 group"
    >
      <div className="flex items-center gap-3">
        <Icon size={13} className="text-slate-400 group-hover:text-indigo-500" strokeWidth={2.5} />
        <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      {badge ? (
        <span className="bg-indigo-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase">{badge}</span>
      ) : (
        <ArrowUpRight size={10} className="opacity-0 group-hover:opacity-100 transition-all" />
      )}
    </Link>
  );
}