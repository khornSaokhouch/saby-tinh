"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Store, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuthStore } from "@/stores/authStore"; // ⬅️ adjust if needed

const BecomeSellerButton = () => {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const isLoggedIn = !!token;
  const isStaff = user?.role === "admin" || user?.role === "owner";

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    } else {
      router.push("/become-to-seller");
    }
  };

  if (!isMounted) return null;
  // if (isStaff) return null; // Disabled for testing - ensure the user can see it!

  return (
    <div
      style={{ 
        position: 'fixed', 
        bottom: '75px', 
        right: '15px', 
        zIndex: 999999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px'
      }}
      className="md:!bottom-6 md:!right-6 group"
    >
      
      {/* 🐻 Bear Animation */}
      <div className="w-[50px] h-[50px] md:w-[75px] md:h-[75px] -mb-2 z-10 pointer-events-none transition-all">
        <DotLottieReact
          src="/animetion/Bear.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      </div>

      {/* 🔹 Button */}
      <motion.div
        id="become-seller-button"
        onClick={handleClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-1.5 md:gap-2 bg-white p-1 pr-3 md:p-1.5 md:pr-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white cursor-pointer relative overflow-hidden ring-1 ring-slate-100 transition-all"
      >
        {/* Icon Circle */}
        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-600 transition-colors relative z-10">
          <Store className="w-3 h-3 md:w-3.5 md:h-3.5 text-white transition-all" strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none relative z-10 w-full transition-all">
          <span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-500 transition-colors">
            Start Selling
          </span>
          <span className="text-[10px] md:text-[12px] font-black text-slate-900 flex items-center gap-1 transition-all">
            Join Now
            <ArrowRight
              className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all shrink-0"
              strokeWidth={3}
            />
          </span>
        </div>

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </motion.div>
    </div>
  );
};

export default BecomeSellerButton;