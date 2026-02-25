"use client";

import { motion } from "framer-motion";
import { Store, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useAuthStore } from "@/stores/authStore"; // ⬅️ adjust if needed

const BecomeSellerButton = () => {
  const router = useRouter();
  const { token, user } = useAuthStore();
  const isLoggedIn = !!token;
  const isStaff = user?.role === "admin" || user?.role === "owner";

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push("/auth/login");
    } else {
      router.push("/become-to-seller");
    }
  };

  if (isStaff) return null;

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4, type: "spring" }}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-center gap-2"
    >
      {/* 🐻 Bear Animation */}
      <div className="w-[75px] h-[75px] -mb-3 z-10 pointer-events-none">
        <DotLottieReact
          src="/animetion/Bear.lottie"
          loop
          autoplay
          className="w-full h-full"
        />
      </div>

      {/* 🔹 Button */}
      <motion.div
        onClick={handleClick}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        className="group flex items-center gap-2 bg-white p-1.5 pr-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white cursor-pointer relative overflow-hidden ring-1 ring-slate-100"
      >
        {/* Icon Circle */}
        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center shrink-0 shadow-sm group-hover:bg-indigo-600 transition-colors relative z-10">
          <Store className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
        </div>

        {/* Text */}
        <div className="flex flex-col leading-none relative z-10">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide group-hover:text-indigo-500 transition-colors">
            Start Selling
          </span>
          <span className="text-[12px] font-black text-slate-900 flex items-center gap-1">
            Join Now
            <ArrowRight
              className="w-3 h-3 text-slate-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all"
              strokeWidth={3}
            />
          </span>
        </div>

        {/* Shine */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
      </motion.div>
    </motion.div>
  );
};

export default BecomeSellerButton;