'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/app/stores/userStore';
import Link from 'next/link';
import { 
  Loader2, Package, Heart, Shield, Edit2, User, Mail, Phone, MapPin, ChevronRight, CheckCircle, LayoutDashboard, AlertCircle
} from 'lucide-react';
import { useFavorites } from '@/hooks/useFavorites';
import { motion } from 'framer-motion';

export default function MyProfilePage() {
  const { user, loading, error, fetchProfile } = useUserStore();
  const { favorites } = useFavorites();

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] gap-4">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
        <p className="text-sm font-medium text-slate-500">Loading your profile...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[500px] p-6 text-center">
        <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 text-sm max-w-xs mb-8">
          We couldn&apos;t load your profile details right now. Please check your connection.
        </p>
        <button 
           onClick={() => window.location.reload()}
           className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-all active:scale-95 shadow-lg shadow-slate-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-6 sm:p-10 space-y-10"
    >
      
      {/* --- 1. WELCOME HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-[11px] font-bold rounded-full border border-emerald-100 flex items-center gap-1">
              <CheckCircle size={12} />
              Account Verified
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Welcome back, {user.name?.split(' ')[0]}!
          </h1>
          <p className="text-slate-500 font-medium flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4 text-slate-400" /> {user.email}
          </p>
        </div>
        
        <Link
          href="/edit-profile"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all font-bold text-sm shadow-sm active:scale-95"
        >
          <Edit2 className="w-4 h-4 text-slate-400" />
          Edit Profile
        </Link>
      </div>

      {/* --- 2. ACCOUNT SUMMARY (STATS) --- */}
      <section>
        <div className="flex items-center gap-2 mb-6">
          <LayoutDashboard className="w-4 h-4 text-indigo-600" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">At a Glance</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatCard 
            icon={Package} 
            label="My Orders" 
            value={user.shop_orders_count || '0'} 
            color="indigo" 
            href="/orders"
          />
          <StatCard 
            icon={Heart} 
            label="Saved Items" 
            value={favorites?.length || 0} 
            color="rose" 
            href="/favorites"
          />
          <StatCard 
            icon={Shield} 
            label="Security" 
            value="Strong" 
            color="emerald" 
            href="/security"
          />
        </div>
      </section>

      {/* --- 3. PERSONAL INFORMATION --- */}
      <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 sm:p-10">
          <h3 className="text-lg font-bold text-slate-900 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
               <User className="w-5 h-5" />
            </div>
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
            <InfoItem label="Full Name" value={user.name} />
            <InfoItem label="Email Address" value={user.email} />
            <InfoItem label="Phone Number" value={user.phone_number || "Not provided"} />
            <InfoItem 
              label="Primary Address" 
              value="Manage your delivery locations" 
              isLink 
              href="/addresses" 
            />
          </div>
        </div>
        
        <div className="bg-slate-50 px-8 py-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <p>Member since {new Date(user.created_at).getFullYear()}</p>
          <p>Last login: Today</p>
        </div>
      </section>

    </motion.div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ icon: Icon, label, value, color, href }) {
  const colorStyles = {
    indigo: "text-indigo-600 bg-indigo-50 border-indigo-100",
    rose: "text-rose-600 bg-rose-50 border-rose-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100"
  };

  return (
    <Link href={href} className="group">
      <div className="h-full bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all group-hover:shadow-md group-hover:border-indigo-200 group-active:scale-[0.98]">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border ${colorStyles[color]}`}>
          <Icon size={24} />
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <div className="flex items-center justify-between">
          <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}

function InfoItem({ label, value, isLink, href }) {
  const content = (
    <div className="space-y-1">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
      <p className={`text-base font-semibold ${isLink ? "text-indigo-600 hover:text-indigo-700 underline underline-offset-4 decoration-indigo-200" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  );

  return isLink ? <Link href={href} className="block">{content}</Link> : content;
}