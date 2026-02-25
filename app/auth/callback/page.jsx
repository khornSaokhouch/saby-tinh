'use client';

import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Loader2, ShieldCheck, Cpu, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithToken } = useAuthStore();

  useEffect(() => {
    async function handleAuth() {
      const token = searchParams.get('token');
      const error = searchParams.get('error');

      if (error) {
        router.push('/auth/login?error=Authentication Failed');
        return;
      }

      if (token) {
        try {
          const user = await loginWithToken(token);
          if (user?.role === 'admin') {
            router.push(`/admin/dashboard`);
          } else if (user?.role === 'owner') {
            router.push(`/owner/dashboard`);
          } else {
            router.push(`/`);
          }
        } catch {
          router.push('/auth/login?error=auth_failed');
        }
      } else {
        router.push('/auth/login?error=no_token');
      }
    }

    handleAuth();
  }, [searchParams, loginWithToken, router]);

  return (
    <div className="h-screen w-full bg-[#fcfdfe] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center max-w-sm w-full text-center relative z-10 font-sans"
      >
        {/* BRAND - SABY-TINH */}
        <div className="mb-10 flex flex-col items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-100 animate-pulse">
            <Sparkles size={28} className="text-white" fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <span className="text-3xl font-black text-slate-900 tracking-tighter uppercase">
              Saby-Tinh
            </span>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em] mt-1">
              System Initialization
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-[40px] shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-slate-100 p-10 w-full flex flex-col items-center">
          <div className="relative mb-6">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-600 relative z-10" />
            <div className="absolute inset-0 h-12 w-12 bg-indigo-100 rounded-full blur-xl opacity-50 animate-pulse" />
          </div>

          <h2 className="text-slate-900 font-bold text-base mb-2">
            Verifying Identity
          </h2>
          <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">
            Securing your connection to the <br/> Saby-Tinh ecosystem.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-50 w-full flex items-center justify-center gap-3">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Session</span>
          </div>
        </div>

        {/* Footer Spec */}
        <div className="mt-12 flex items-center gap-2 opacity-40">
          <Cpu className="w-3 h-3 text-slate-400" />
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.4em]">Protocol v4.0.2</span>
        </div>
      </motion.div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="h-screen w-full bg-[#fcfdfe] flex items-center justify-center font-sans font-bold text-[11px] text-slate-400 uppercase tracking-[0.2em]">
        loading Saby-Tinh...
      </div>
    }>
      <AuthCallbackPage />
    </Suspense>
  );
}