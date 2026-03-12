'use client';
import { Suspense } from 'react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Inner component that uses useSearchParams ──
function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      // TODO: wire up to your actual reset-password API endpoint
      // await request('/reset-password', 'POST', { token, password, password_confirmation: confirmPassword });
      await new Promise((r) => setTimeout(r, 1000));
      setSuccess(true);
      setTimeout(() => router.push('/auth/login'), 2500);
    } catch (err) {
      setError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
        <div className="mt-5">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm">
            <Lock size={24} strokeWidth={2} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Set new password</h2>
          <p className="text-[12px] text-slate-400 font-bold mt-1.5 max-w-[260px] mx-auto leading-relaxed">
            Choose a strong password to secure your account.
          </p>
        </div>
      </div>

      {/* ── Success / Form ── */}
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
              <p className="text-[13px] font-black text-slate-900">Password updated!</p>
              <p className="text-[11px] font-bold text-slate-400 mt-1">Redirecting you to sign in...</p>
            </div>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 mt-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-100"
            >
              Go to Sign In <ArrowRight size={13} strokeWidth={3} />
            </Link>
          </motion.div>
        ) : (
          <motion.div key="form">
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* New Password */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    className={`w-full h-11 pl-10 pr-12 bg-slate-50 border rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300 ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-rose-300 focus:border-rose-400'
                        : 'border-slate-100 focus:border-indigo-400'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors"
                  >
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1">Passwords don't match</p>
                )}
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="flex items-center gap-2 px-1">
                  <div className="flex gap-1 flex-1">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${
                        password.length >= (i + 1) * 3
                          ? password.length >= 12 ? 'bg-emerald-500' : password.length >= 8 ? 'bg-amber-400' : 'bg-rose-400'
                          : 'bg-slate-100'
                      }`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    {password.length < 6 ? 'Weak' : password.length < 8 ? 'Fair' : password.length < 12 ? 'Good' : 'Strong'}
                  </span>
                </div>
              )}

              {/* Error */}
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

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading
                  ? <Loader2 className="animate-spin" size={16} />
                  : <>Reset Password <ArrowRight size={14} strokeWidth={3} /></>}
              </button>
            </form>

            <p className="mt-6 text-center text-[10px] font-bold text-slate-400 tracking-wide">
              Remember it?{' '}
              <Link href="/auth/login" className="text-indigo-600 font-black hover:text-rose-500 transition-colors">
                Back to Sign In
              </Link>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Page component wraps the form in Suspense ──
export default function ResetPasswordPage() {
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
        <Suspense fallback={
          <div className="bg-white rounded-[32px] border border-slate-100 p-8 flex items-center justify-center min-h-[300px]">
            <Loader2 className="animate-spin text-indigo-400" size={24} />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </div>
  );
}