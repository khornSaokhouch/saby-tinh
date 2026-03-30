"use client";

import { useEffect } from 'react';
import { useUserStore } from '@/app/stores/userStore';
import Link from 'next/link';
import { 
  Loader2, Package, Heart, Shield, Edit2, User, Mail, LayoutDashboard, AlertCircle, ChevronRight, CheckCircle, Phone
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

export default function MyProfilePage() {
  const { user, loading, error, fetchProfile } = useUserStore();
  const { favorites } = useFavorites();

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  if (loading) return (
    <div className="bg-white rounded-xl p-6 border border-slate-100 animate-pulse min-h-[160px] flex flex-col justify-center items-center gap-3">
      <Loader2 className="animate-spin h-5 w-5 text-indigo-600" />
      <p className="text-xs font-medium text-slate-400">Syncing your profile details...</p>
    </div>
  );

  if (error || !user) return (
    <div className="flex flex-col justify-center items-center p-6 text-center bg-white rounded-xl border border-slate-100 shadow-sm">
      <AlertCircle className="w-8 h-8 text-rose-500 mb-2" />
      <h2 className="text-sm font-bold text-slate-900">Connection Error</h2>
      <p className="text-xs text-slate-500 mb-4">We couldn't load your profile data.</p>
      <button onClick={() => window.location.reload()} className="px-5 py-2 bg-slate-900 text-white rounded-lg font-bold text-xs active:scale-[0.98]">Retry</button>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="space-y-4 font-sans pb-6"
    >
      
      {/* --- 1. HEADER --- */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
             {user.profile_image_url ? (
                <img src={user.profile_image_url} alt="Profile" className="w-full h-full object-cover" />
             ) : (
                <User className="w-5 h-5 text-indigo-600" />
             )}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h1 className="text-base font-bold text-slate-900 truncate">
                Welcome back, {user.name?.split(' ')[0]}!
              </h1>
              <CheckCircle size={14} className="text-emerald-500 fill-emerald-50 shrink-0" />
            </div>
            <p className="text-xs text-slate-500 font-medium truncate flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-slate-400" /> {user.email}
            </p>
          </div>
        </div>
        
        <Link
          href="/edit-profile"
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all font-bold text-xs shadow-sm active:scale-[0.98]"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit Profile
        </Link>
      </div>

      {/* --- 2. STATS CARDS --- */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard icon={Package} label="Total Orders" value={user.shop_orders_count || '0'} color="indigo" href="/orders" />
        <StatCard icon={Heart} label="Saved Items" value={favorites?.length || 0} color="rose" href="/favorites" />
        <StatCard icon={Shield} label="Security" value="Strong" color="emerald" href="/security" />
      </div>

      {/* --- 3. INFORMATION GRID --- */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
             <LayoutDashboard className="w-4 h-4 text-indigo-600" /> Account Information
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">General</span>
        </div>
        
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
          <InfoItem icon={User} label="Full Identity Name" value={user.name} />
          <InfoItem icon={Phone} label="Registered Mobile" value={user.phone_number || "Not provided"} />
          <InfoItem icon={Mail} label="Primary Email Address" value={user.email} />
          <InfoItem icon={Package} label="Delivery Logistics" value="Manage Shipping Addresses" isLink href="/addresses" />
        </div>
        
        <div className="bg-slate-50/80 px-4 py-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-400">
          <p>Member since {new Date(user.created_at).getFullYear()}</p>
          <div className="flex items-center gap-1.5 text-emerald-600">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            Account Status: Active
          </div>
        </div>
      </section>

    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color, href }) {
  const colors = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };

  return (
    <Link href={href} className="group block active:scale-[0.98] transition-all">
      <div className="p-4 rounded-xl bg-white border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 flex flex-col gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${colors[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex items-end justify-between">
          <div>
            <h4 className="text-xl font-bold text-slate-900 leading-none mb-0.5">{value}</h4>
            <p className="text-xs text-slate-500 font-medium">{label}</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ icon: Icon, label, value, isLink, href }) {
  const content = (
    <div className={`flex items-start gap-3 p-3 rounded-lg border border-transparent transition-all ${isLink ? 'hover:bg-slate-50 hover:border-slate-100 cursor-pointer group' : ''}`}>
      <div className="mt-0.5 bg-slate-50 p-1.5 rounded-md group-hover:bg-white transition-colors">
         <Icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        <p className={`text-sm font-semibold truncate ${isLink ? "text-indigo-600 underline underline-offset-4 decoration-indigo-100" : "text-slate-900"}`}>
          {value}
        </p>
      </div>
    </div>
  );
  return isLink ? <Link href={href}>{content}</Link> : content;
}