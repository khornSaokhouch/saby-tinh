"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/app/stores/userStore";
import { useAuthStore } from "@/app/stores/authStore";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Package, Heart, MapPin, Shield, LogOut, AlertCircle, Loader2, MessageCircle, Pencil, Settings
} from "lucide-react";
import { toast } from "react-hot-toast";

// --- FRIENDLY MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, children, isConfirming }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100"
        >
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-6">
            <LogOut className="w-6 h-6 text-slate-900" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{title}</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">{children}</p>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={onClose} className="py-3 text-sm font-bold text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all">
              Stay
            </button>
            <button onClick={onConfirm} disabled={isConfirming} className="py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2">
              {isConfirming ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Out"}
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
    { name: "Messages", href: "/chat", icon: MessageCircle },
    { name: "Edit Details", href: "/edit-profile", icon: Pencil },
    { name: "Purchase History", href: "/orders", icon: Package },
    { name: "Saved Items", href: "/favorites", icon: Heart },
    { name: "My Addresses", href: "/addresses", icon: MapPin },
    { name: "Privacy & Security", href: "/security", icon: Shield },
  ];

  if (loading) return (
    <div className="bg-white rounded-[32px] p-6 border border-slate-100 animate-pulse">
      <div className="h-16 bg-slate-50 rounded-2xl mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-10 bg-slate-50 rounded-xl" />)}
      </div>
    </div>
  );

  if (!user) return null;

  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Ready to leave?"
        isConfirming={isLoggingOut}
      >
        We&apos;ll save your cart and settings for the next time you visit.
      </ConfirmationModal>

      <div className="flex flex-col gap-4">
        {/* --- USER CARD --- */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm relative overflow-hidden group">
          <div className="relative z-10 flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
               {user.profile_image_url ? (
                  <Image src={user.profile_image_url} alt="Profile" fill className="object-cover" />
               ) : (
                  <span className="text-lg font-bold text-indigo-600">{userInitial}</span>
               )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-bold text-slate-900 truncate">Hello, {user.name?.split(' ')[0] || "there"}!</h2>
              <p className="text-xs font-medium text-slate-400">Manage your account</p>
            </div>
            <Link href="/edit-profile" className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
              <Settings size={18} className="text-slate-400" />
            </Link>
          </div>
        </div>

        {/* --- DESKTOP NAVIGATION --- */}
        <div className="hidden lg:block bg-white rounded-[32px] p-3 border border-slate-100 shadow-sm">
          <nav className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200
                    active:scale-[0.98] group
                    ${isActive 
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100" 
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                    }
                  `}
                >
                  <link.icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600"}`} />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-3 pt-3 border-t border-slate-50">
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex w-full items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-rose-500 hover:bg-rose-50 transition-all active:scale-[0.98]"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* --- MOBILE NAVIGATION --- */}
        <div className="lg:hidden">
          <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`
                    flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border
                    ${isActive 
                      ? "bg-indigo-600 text-white border-indigo-600" 
                      : "bg-white text-slate-600 border-slate-200"
                    }
                  `}
                >
                  <link.icon className="w-4 h-4" />
                  {link.name}
                </Link>
              );
            })}
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold whitespace-nowrap bg-white text-rose-500 border border-rose-100"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}