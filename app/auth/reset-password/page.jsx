'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/stores/authStore';

function ResetPasswordContent() {
  const router = useRouter();
  const { resetPassword } = useAuthStore();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // If no token/email is present in URL, user shouldn't be here
  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or expired password reset link.');
    }
  }, [token, email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match.');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      await resetPassword({
        email,
        token,
        password,
        password_confirmation: passwordConfirmation
      });
      
      setSuccess(true);
      setTimeout(() => {
        router.push('/auth/login');
      }, 2500);
      
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
            <div className="mt-5">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mx-auto mb-4 shadow-sm">
                <Lock size={24} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Create new password</h2>
              <p className="text-[12px] text-slate-400 font-bold mt-1.5 max-w-[260px] mx-auto leading-relaxed">
                Your new password must be different from previously used passwords.
              </p>
            </div>
          </div>

          {/* ── Success State ── */}
          <AnimatePresence mode="wait">
            {success ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-4"
              >
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 mx-auto shadow-sm">
                  <CheckCircle2 size={28} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-900">Password reset complete!</p>
                  <p className="text-[11px] font-bold text-slate-400 mt-1">
                    Redirecting you to login...
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div key="form">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Password */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        disabled={!token || !email}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                      <input
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="••••••••"
                        required
                        minLength={6}
                        disabled={!token || !email}
                        className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Error Indicator */}
                  <AnimatePresence mode="wait">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                        className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl"
                      >
                        <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                        <p className="text-[11px] font-bold text-rose-600 leading-snug">{error}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading || !token || !email}
                    className="w-full h-11 mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading
                      ? <Loader2 className="animate-spin" size={16} />
                      : <>Reset Password <ArrowRight size={14} strokeWidth={3} /></>}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center font-sans font-bold text-[11px] text-slate-400 uppercase tracking-[0.2em]">
        loading Saby-Tinh...
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}