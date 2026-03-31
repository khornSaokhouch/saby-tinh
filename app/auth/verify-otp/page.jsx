'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { ShieldCheck, Loader2, ArrowRight, AlertCircle, RefreshCcw, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, resendOtp, loading, error: storeError, user, otpUsername } = useAuthStore();

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!otpUsername && !user?.email) router.push('/auth/login');
  }, [otpUsername, user, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);
    if (value && index < 5) inputRefs[index + 1].current.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(paste)) return;
    const newOtp = [...otp];
    paste.split('').forEach((char, i) => { if (i < 6) newOtp[i] = char; });
    setOtp(newOtp);
    inputRefs[Math.min(paste.length, 5)].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) inputRefs[index - 1].current.focus();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLocalError(null);
    const otpString = otp.join('');
    if (otpString.length !== 6) { setLocalError('Please enter the complete 6-digit code.'); return; }
    try {
      await verifyOtp(otpString);
      const currentUser = useAuthStore.getState().user;
      if (currentUser) {
        switch (currentUser.role) {
          case 'admin': router.push('/admin/dashboard'); break;
          case 'owner': router.push('/owner/dashboard'); break;
          default: router.push('/');
        }
      } else {
        router.push('/auth/login');
      }
    } catch (err) {
      setLocalError(err.message || 'Verification failed. Please try again.');
    }
  };

  useEffect(() => {
    if (otp.every(d => d !== '') && otp.join('').length === 6) handleSubmit();
  }, [otp]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLocalError(null);
    try {
      await resendOtp();
      setResendCooldown(60);
    } catch (err) {
      setLocalError(err.message || 'Failed to resend code.');
    }
  };

  const errorMessage = localError || storeError;
  const maskedEmail = (otpUsername || user?.email || '');

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
            {/* Icon + title */}
            <div className="mt-5">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 mb-4 mx-auto shadow-sm">
                <ShieldCheck size={24} strokeWidth={2} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Verify your identity</h2>
              <p className="text-[12px] text-slate-400 font-bold mt-1.5 leading-relaxed max-w-[260px] mx-auto">
                Enter the 6-digit code sent to{' '}
                <span className="text-slate-700 font-black">{maskedEmail}</span>
              </p>
            </div>
          </div>

          {/* ── OTP Inputs ── */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex justify-between gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={inputRefs[index]}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  autoFocus={index === 0}
                  className={`w-12 h-14 rounded-xl border-2 text-center text-xl font-black transition-all outline-none ${
                    digit
                      ? 'border-indigo-400 bg-white text-indigo-600 focus:ring-4 focus:ring-indigo-500/5'
                      : 'border-slate-100 bg-slate-50 text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5'
                  }`}
                />
              ))}
            </div>

            {/* Error */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2.5 p-3 bg-rose-50 border border-rose-100 rounded-xl"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[11px] font-bold text-rose-600 leading-snug">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>Confirm Code <ArrowRight size={14} strokeWidth={3} /></>}
            </button>
          </form>

          {/* Removed security features box to match simplified minimal UI block of other pages */}

          {/* Resend + back */}
          <div className="mt-5 flex items-center justify-between">
            <Link href="/auth/login" className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
              ← Back to Login
            </Link>
            <button
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition-colors ${
                resendCooldown > 0 ? 'text-slate-300' : 'text-indigo-600 hover:text-indigo-700'
              }`}
            >
              <RefreshCcw size={11} className={loading ? 'animate-spin' : ''} />
              {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend Code'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}