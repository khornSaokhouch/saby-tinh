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
        <div className="bg-white rounded-[32px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10 w-full flex flex-col items-center mt-5">
          <div className="relative mb-6">
            <Loader2 className="animate-spin w-8 h-8 text-indigo-600 relative z-10" />
          </div>

          <h2 className="text-slate-900 font-black text-lg mb-2 tracking-tight">
            Verifying Identity
          </h2>
          <p className="text-slate-500 text-[12px] font-bold leading-relaxed px-4 text-center">
            Securing your connection to the Saby-Tinh ecosystem.
          </p>

          <div className="mt-6 pt-4 border-t border-slate-50 w-full flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4 text-emerald-500" />
             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Encrypted Session</span>
          </div>
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