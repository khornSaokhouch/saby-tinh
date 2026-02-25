'use client';

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/90 backdrop-blur-sm">
      
      {/* Animation Container */}
      <div className="w-64 h-64 relative">
        <DotLottieReact
          src="/animetion/loading.json" // 👈 REPLACE WITH YOUR FILE PATH
          loop
          autoplay
          className="w-full h-full"
        />
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center gap-2 mt-[-20px]">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight">
          Saby-Tinh
        </h3>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-bounce" />
        </div>
      </div>

    </div>
  );
}