"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/stores/userStore";
import { useAuthStore } from "@/app/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ShoppingBag, Bookmark, Map, ShieldCheck, LogOut, Loader2, MessageSquare, Edit3, Settings, ChevronRight, Key
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- Compact Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-2xl p-6 w-full max-w-xs relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center mb-4 mx-auto">
            <LogOut className="w-5 h-5 text-slate-900" />
          </div>
          <h2 className="text-base font-bold text-slate-900 mb-1">{title}</h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed font-medium">{children}</p>
          <div className="grid grid-cols-2 gap-2">
            <button onClick={onClose} className="py-2.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">
              Stay
            </button>
            <button onClick={onConfirm} disabled={isConfirming} className="py-2.5 text-xs font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-1.5">
              {isConfirming ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Sign Out"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function UserSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading, fetchUser } = useUserStore();
  const { logout } = useAuthStore();

  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  const confirmLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      toast.success("See you soon!");
      router.push("/");
    } catch (error) { toast.error("Logout failed"); }
    finally { setIsLoggingOut(false); setIsLogoutModalOpen(false); }
  };

  const navLinks = [
    { name: "My Profile", href: "/profile", icon: User },
    { name: "Messages", href: "/chat", icon: MessageSquare },
    { name: "Edit Details", href: "/edit-profile", icon: Edit3 },
    { name: "Purchase History", href: "/orders", icon: ShoppingBag },
    { name: "Saved Items", href: "/favorites", icon: Bookmark },
    { name: "My Addresses", href: "/addresses", icon: Map },
    { name: "Security", href: "/security", icon: ShieldCheck },
    { name: "Reset Password", href: "/reset-password", icon: Key },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (loading) return (
    <div className="bg-white rounded-xl p-4 border border-slate-100 animate-pulse space-y-3">
      <div className="h-11 bg-slate-50 rounded-xl w-full" />
      <div className="space-y-1.5">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-9 bg-slate-50 rounded-lg w-full" />)}
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Ready to leave?"
        isConfirming={isLoggingOut}
      >
        We'll save your settings for your next visit.
      </ConfirmationModal>

      <div className="flex flex-col gap-3 font-sans max-w-[280px]">
        {/* --- User Card --- */}
        <div className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100 group">
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
               {user.profile_image_url ? (
                  <Image src={user.profile_image_url} alt="Profile" fill className="object-cover" />
               ) : (
                  <span className="text-sm font-bold text-indigo-600 uppercase">{user.name?.[0]}</span>
               )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold text-slate-900 truncate">Hello, {user.name?.split(' ')[0]}</h2>
              <p className="text-xs font-medium text-slate-400">Account Settings</p>
            </div>
            <Link href="/edit-profile" className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              <Settings size={15} />
            </Link>
          </div>
        </div>

        {/* --- Desktop Navigation --- */}
        <div className="hidden lg:block bg-white rounded-xl p-1.5 border border-slate-100 shadow-sm">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                    active:scale-[0.98] group
                    ${isActive 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <link.icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
                    <span>{link.name}</span>
                  </div>
                  {isActive && <ChevronRight size={12} className="opacity-60" />}
                </Link>
              );
            })}
          </nav>

          <div className="mt-2 pt-2 border-t border-slate-100 space-y-0.5">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sign out
            </button>
          </div>
        </div>

        {/* --- Mobile Navigation --- */}
        <div className="lg:hidden">
          <div className="flex gap-1.5 overflow-x-auto pb-2 no-scrollbar px-0.5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                    ${isActive 
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" 
                      : "bg-white text-slate-500 border-slate-200"
                    }
                  `}
                >
                  <link.icon className="w-3.5 h-3.5" />
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-white text-rose-500 border border-rose-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}