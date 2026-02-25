'use client';
import { useEffect, useState, useRef } from 'react';
import { Bell, Search, Menu, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useUserStore } from '@/stores/userStore';
import { useAuthStore } from '@/stores/authStore';
import { useSellerStore } from '@/stores/useSellerStore';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function AdminNavbar({ onMenuClick, title = "Dashboard" }) {
  const { user, fetchProfile } = useUserStore();
  const { logout } = useAuthStore();
  const { pendingCount, fetchPendingCount } = useSellerStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

// 1️⃣ Fetch user on mount
useEffect(() => {
  fetchProfile();
}, [fetchProfile]);

// 2️⃣ Fetch pending count after user is loaded and is admin
useEffect(() => {
  if (!user || user.role !== 'admin') return;

  // Fetch immediately
  fetchPendingCount();

  // Then set up auto-refresh every 30 seconds (30000 ms)
  const interval = setInterval(() => {
    fetchPendingCount();
  }, 30000);

  // Clean up interval on unmount
  return () => clearInterval(interval);

}, [user, fetchPendingCount]);


  return (
    <header className="sticky top-0 z-40 flex h-20 w-full items-center bg-white/80 backdrop-blur-md border-b border-slate-200 px-6 lg:px-10 font-sans">
      <button 
        onClick={onMenuClick}
        className="mr-4 text-slate-500 lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors"
      >
        <Menu size={22} />
      </button>

      <div className="flex flex-1 items-center justify-between">
        {/* Page Title */}
        <div className="flex flex-col">
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">{title}</h2>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-500">Live</span>
          </div>
        </div>

        {/* Desktop Search */}
        <div className="hidden md:flex relative w-72">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-slate-50 border-none rounded-2xl py-2.5 pl-11 pr-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-blue-500/10 focus:bg-white transition-all placeholder:text-slate-400"
          />
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          <button className="relative p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group">
            <Bell size={20} />
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-rose-500 text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm animate-bounce group-hover:scale-110 transition-transform">
                {pendingCount > 9 ? '9+' : pendingCount}
              </span>
            )}
          </button>
          
          <div className="h-8 w-[1px] bg-slate-200 mx-2" />
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center gap-3 p-1 pr-4 rounded-2xl transition-all border border-transparent hover:border-slate-200 ${isDropdownOpen ? 'bg-slate-50 border-slate-200' : 'hover:bg-slate-50'}`}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-600 border border-white shadow-sm overflow-hidden">
                {user?.profile?.image_profile ? (
                  <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} strokeWidth={2.5} />
                )}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none">
                <span className="text-sm font-bold text-slate-900">{user?.name || 'Loading...'}</span>
                <span className="text-xs font-medium text-blue-600 mt-1">{user?.role || 'User'}</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="absolute right-0 mt-3 w-60 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-slate-100 p-2 z-[100] overflow-hidden"
                >
                  <div className="px-3 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-semibold text-slate-400">Account</p>
                    <p className="text-sm font-bold text-slate-900 truncate mt-0.5">{user?.email}</p>
                  </div>

                  <DropdownItem 
                    href="/admin/account" 
                    icon={User} 
                    label="Profile" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <DropdownItem 
                    href="/admin/settings" 
                    icon={Settings} 
                    label="Settings" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-rose-100 flex items-center justify-center transition-colors">
                      <LogOut size={16} />
                    </div>
                    <span className="text-sm font-semibold">Sign Out</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}

function DropdownItem({ href, icon: Icon, label, onClick }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all group"
    >
      <div className="w-8 h-8 rounded-lg bg-slate-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
        <Icon size={16} />
      </div>
      <span className="text-sm font-semibold">{label}</span>
    </Link>
  );
}
