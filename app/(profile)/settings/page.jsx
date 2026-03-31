"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings, Bell, Globe, Moon, Sun, Eye, ChevronRight, Check, Loader2
} from 'lucide-react';
import toast from 'react-hot-toast';

const languages = ["English", "Khmer", "Thai", "Chinese", "Japanese"];
const timezones = ["Asia/Phnom_Penh", "Asia/Bangkok", "Asia/Tokyo", "UTC"];

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    orders: true, promotions: false, security: true, messages: true,
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState("English");
  const [timezone, setTimezone] = useState("Asia/Phnom_Penh");
  const [privacy, setPrivacy] = useState({
    profileVisible: true, activityVisible: false, dataCollection: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(r => setTimeout(r, 900));
    setIsSaving(false);
    toast.success('Settings saved');
  };

  const Toggle = ({ value, onChange }) => (
    <button onClick={onChange} className={`relative w-11 h-6 rounded-full transition-all duration-300 ${value ? 'bg-indigo-500' : 'bg-slate-200'}`}>
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${value ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );

  const SectionHeader = ({ icon: Icon, label }) => (
    <div className="px-4 py-3 border-b border-slate-50">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
        <Icon className="w-3 h-3" /> {label}
      </p>
    </div>
  );

  const Row = ({ label, sub = null, children }) => (
    <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-xs font-bold text-slate-900">{label}</p>
        {sub && <p className="text-[10px] text-slate-400 font-medium mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-6 font-sans text-slate-900">

      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Preferences</h1>
            <p className="text-xs text-slate-500 font-medium">Customize your experience and notifications</p>
          </div>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-indigo-600" /> Notifications
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alerts</span>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { key: 'orders', label: 'Order Updates', sub: 'Shipping, delivery, and status changes' },
            { key: 'promotions', label: 'Promotions & Offers', sub: 'Deals, discounts, and new arrivals' },
            { key: 'security', label: 'Security Alerts', sub: 'Login attempts and account changes' },
            { key: 'messages', label: 'Messages', sub: 'Replies and new conversations' },
          ].map(item => (
            <Row key={item.key} label={item.label} sub={item.sub}>
              <Toggle value={notifications[item.key]} onChange={() => setNotifications(p => ({ ...p, [item.key]: !p[item.key] }))} />
            </Row>
          ))}
        </div>
      </section>

      {/* LANGUAGE & REGION */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Globe className="w-4 h-4 text-indigo-600" /> Language & Region
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Globalization</span>
        </div>
        <div className="divide-y divide-slate-50">
          <Row label="System Language" sub="Interface display language">
            <select value={language} onChange={e => setLanguage(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-400 transition-all">
              {languages.map(l => <option key={l}>{l}</option>)}
            </select>
          </Row>
          <Row label="Local Timezone" sub="Used for dates and delivery times">
            <select value={timezone} onChange={e => setTimezone(e.target.value)}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 outline-none focus:border-indigo-400 transition-all">
              {timezones.map(t => <option key={t}>{t}</option>)}
            </select>
          </Row>
        </div>
      </section>

      {/* THEME */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Sun className="w-4 h-4 text-indigo-600" /> Appearance
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Theme</span>
        </div>
        <div className="p-4 grid grid-cols-3 gap-2">
          {(['light', 'dark', 'system']).map(t => (
            <button key={t} onClick={() => setTheme(t)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${theme === t ? 'border-indigo-200 bg-indigo-50/50 shadow-sm' : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'}`}>
              {t === 'light' && <Sun className={`w-4 h-4 ${theme === t ? 'text-indigo-600' : 'text-slate-400'}`} />}
              {t === 'dark' && <Moon className={`w-4 h-4 ${theme === t ? 'text-indigo-600' : 'text-slate-400'}`} />}
              {t === 'system' && <Settings className={`w-4 h-4 ${theme === t ? 'text-indigo-600' : 'text-slate-400'}`} />}
              <span className={`text-[10px] font-bold uppercase tracking-wide capitalize ${theme === t ? 'text-indigo-600' : 'text-slate-500'}`}>{t}</span>
              <div className={`w-1.5 h-1.5 rounded-full transition-all ${theme === t ? 'bg-indigo-500' : 'bg-transparent'}`} />
            </button>
          ))}
        </div>
      </section>

      {/* PRIVACY */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-600" /> Privacy Controls
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Safety</span>
        </div>
        <div className="divide-y divide-slate-50">
          {[
            { key: 'profileVisible', label: 'Public Profile', sub: 'Others can view your profile' },
            { key: 'activityVisible', label: 'Activity Visibility', sub: 'Show your online status' },
            { key: 'dataCollection', label: 'Analytics & Improvement', sub: 'Help us improve with usage data' },
          ].map(item => (
            <Row key={item.key} label={item.label} sub={item.sub}>
              <Toggle value={privacy[item.key]} onChange={() => setPrivacy(p => ({ ...p, [item.key]: !p[item.key] }))} />
            </Row>
          ))}
        </div>
      </section>

      {/* SAVE */}
      <div className="flex justify-end pt-2">
        <button onClick={handleSave} disabled={isSaving}
          className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-indigo-600 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-slate-100">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          Apply Changes
        </button>
      </div>

    </motion.div>
  );
}