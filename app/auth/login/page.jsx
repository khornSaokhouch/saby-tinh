'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { Mail, Lock, Loader2, Sparkles, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';
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
      const token = res?.token || res?.data?.token;
      if (!user || !token) throw new Error('Authentication failed.');
      
      // Store user/token temporarily
      useAuthStore.setState({ user, token });

      // Trigger OTP sending
      await useAuthStore.getState().sendOtp(email);

      router.push('/auth/verify-otp');
    } catch (err) {
      setLocalError(err?.response?.data?.message || 'Invalid email or password.');
    }
  };

  const errorMessage = localError || storeError;

  return (
    <div className="h-screen w-full bg-[#FBFBFE] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* --- PREMIUM BACKGROUND ELEMENTS --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-rose-100/50 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
         className="w-full max-w-[440px]"
      >
        {/* --- MAIN INTERFACE CARD --- */}
        <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/80 p-8 md:p-10 relative overflow-hidden">
          
          {/* Top Logo Bar */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform duration-300">
                <Sparkles size={22} className="text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  Saby-Tinh
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management Console</span>
              </div>
            </Link>
          </div>

          {/* Welcome Text Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome back!</h2>
            <p className="text-slate-500 text-sm mt-1">Please login to access your terminal.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative group">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 pt-4 px-4 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                  required
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black">
                  Email Address
                </label>
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors" size={18} />
              </div>

              {/* Password Input */}
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 pt-4 px-4 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                  required
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-300 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link href="/auth/forgot-password" size="sm" className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors tracking-wide uppercase">
                Reset Password?
              </Link>
            </div>

            {/* Error Area */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-rose-50 border-l-4 border-rose-500 py-3 px-4 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[11px] font-bold text-rose-700 uppercase leading-tight">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Primary Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:shadow-indigo-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Login 
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="relative my-10">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-100"></span></div>
            <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
              <span className="bg-white px-4">Instant Access</span>
            </div>
          </div>

          {/* Social Action */}
          <button
            onClick={() => window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/google/redirect`}
            className="w-full h-14 bg-white border-2 border-slate-100 hover:border-indigo-100 hover:bg-slate-50 text-slate-600 text-[11px] font-black uppercase tracking-widest rounded-2xl flex items-center justify-center gap-3 transition-all"
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
              <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
              <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
              <path fill="#1976D2" d="M43.611,20.083L43.611,20.083L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
            </svg>
            Continue with Google
          </button>

          {/* Footer Link */}
          <p className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            New here?{' '}
            <Link href="/auth/register" className="text-indigo-600 hover:text-rose-500 transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}