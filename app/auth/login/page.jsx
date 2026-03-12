'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoginPage() {
  const router = useRouter();
  const { login, loading, error: storeError } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    try {
      const res = await login(email, password);
      const user = res?.user || res?.data?.user || res;
      const token = res?.token || res?.data?.token || res?.data?.access_token;
      if (!user || !token) throw new Error('Authentication failed.');
      useAuthStore.setState({ user, token });
      try {
        await useAuthStore.getState().sendOtp(email);
        router.push('/auth/verify-otp');
      } catch (otpErr) {
        setLocalError(otpErr.message || 'Failed to send verification code.');
      }
    } catch (err) {
      setLocalError(err?.message || 'Invalid email or password.');
    }
  };

  const errorMessage = localError || storeError;

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-15%] right-[-10%] w-[600px] h-[600px] bg-indigo-100/60 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-rose-100/50 rounded-full blur-[140px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-[420px]"
      >
        <div className="bg-white rounded-[32px] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.08)] border border-slate-100 p-8 md:p-10">

          {/* ── Header ── */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4">
              <Link href="/" className="block">
                <span className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                  Saby-Tinh
                </span>
                <p className="text-[9px] font-black text-rose-500 uppercase tracking-[0.25em] mt-0.5">
                  Management Console
                </p>
              </Link>
            </div>
            <div className="w-full h-px bg-slate-100 my-2" />
            <div className="mt-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-[12px] text-slate-400 font-bold mt-1">Sign in to access your dashboard</p>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5 ml-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[9px] font-black text-indigo-500 hover:text-rose-500 transition-colors uppercase tracking-widest">
                  Forgot-password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full h-11 pl-10 pr-12 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[11px] font-bold text-rose-600 leading-snug">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={16} />
              ) : (
                <>Sign In <ArrowRight size={14} strokeWidth={3} className="transition-transform group-hover:translate-x-1" /></>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[9px] font-black uppercase tracking-widest text-slate-300">
                or continue with
              </span>
            </div>
          </div>

          {/* Google */}
          <button
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`}
            className="w-full h-11 bg-white border border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2.5 transition-all active:scale-[0.98]"
          >
            <svg className="w-4 h-4" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-[10px] font-bold text-slate-400 tracking-wide">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-indigo-600 font-black hover:text-rose-500 transition-colors">
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
