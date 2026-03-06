'use client';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { ShieldCheck, Loader2, ArrowRight, AlertCircle, RefreshCcw, ChevronLeft, Lock, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VerifyOtpPage() {
  const router = useRouter();
  const { verifyOtp, resendOtp, loading, error: storeError, user, otpUsername } = useAuthStore();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    if (!otpUsername && !user?.email) {
      router.push('/auth/login');
    }
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
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pasteData)) return;
    const newOtp = [...otp];
    pasteData.split('').forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    const lastIndex = Math.min(pasteData.length, 5);
    inputRefs[lastIndex].current.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs[index - 1].current.focus();
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (loading) return;
    setLocalError(null);
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setLocalError('Enter 6-digit code.');
      return;
    }
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
      setLocalError(err.message || 'Verification failed.');
    }
  };

  useEffect(() => {
    if (otp.every(digit => digit !== '') && otp.join('').length === 6) {
      handleSubmit();
    }
  }, [otp]);

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLocalError(null);
    try {
      await resendOtp();
      setResendCooldown(60);
    } catch (err) {
      setLocalError(err.message || 'Failed to resend.');
    }
  };

  const errorMessage = localError || storeError;

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] flex items-center justify-center p-4 md:p-8 font-sans antialiased">
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl grid lg:grid-cols-2 bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100"
      >
        
        {/* LEFT PANEL: BRANDING/AESTHETIC */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden">
          {/* Decorative background circle */}
          <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-12">
              <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
                <Lock size={18} />
              </div>
              <span className="font-bold text-xl tracking-tight">Saby-tinh</span>
            </div>

            <h2 className="text-4xl font-bold text-white leading-tight mb-6">
              Protecting your <br />
              <span className="text-indigo-400">digital assets.</span>
            </h2>
            
            <ul className="space-y-4">
              {[
                "Multi-factor authentication enabled",
                "End-to-end encrypted sessions",
                "Real-time fraud monitoring"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-400 text-sm">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative z-10">
            <p className="text-slate-500 text-xs font-medium uppercase tracking-widest">
              Trusted by 2,400+ engineers
            </p>
          </div>
        </div>

        {/* RIGHT PANEL: VERIFICATION FORM */}
        <div className="p-8 md:p-16 flex flex-col justify-center items-center">
          <div className="w-full max-w-[340px]">
            {/* Back Button */}
            <Link href="/auth/login" className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors mb-10 group uppercase tracking-wider">
              <ChevronLeft size={14} className="group-hover:-translate-x-0.5 transition-transform"/>
              Back
            </Link>

            <div className="mb-10">
              <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                <ShieldCheck size={28} strokeWidth={2} />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Verify Identity</h1>
              <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                Code sent to <span className="font-semibold text-slate-900">{otpUsername || user?.email}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* SLIM OTP INPUTS */}
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-11 h-14 rounded-xl border text-center text-xl font-bold transition-all outline-none ${
                      digit 
                      ? "border-indigo-500 bg-indigo-50/30 text-indigo-600 shadow-sm shadow-indigo-100" 
                      : "border-slate-200 bg-slate-50 focus:border-indigo-400 focus:bg-white"
                    }`}
                    autoFocus={index === 0}
                  />
                ))}
              </div>

              {/* ERROR ALERT */}
              <AnimatePresence mode="wait">
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-rose-500 bg-rose-50/50 p-3 rounded-lg border border-rose-100"
                  >
                    <AlertCircle size={14} />
                    <p className="text-[12px] font-bold uppercase tracking-tight">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 hover:bg-black disabled:bg-slate-200 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                {loading ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <>
                    <span>Confirm Security Code</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* RESEND SECTION */}
            <div className="mt-10 pt-8 border-t border-slate-100 text-center">
              <p className="text-xs text-slate-400 font-medium mb-4">Didn't receive a code?</p>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className={`text-[12px] font-bold uppercase tracking-[0.1em] transition-colors flex items-center gap-2 mx-auto ${
                  resendCooldown > 0 ? 'text-slate-300' : 'text-indigo-600 hover:text-indigo-700'
                }`}
              >
                <RefreshCcw size={12} className={loading ? "animate-spin" : ""} />
                {resendCooldown > 0 ? `Retry in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    </div>
  );
}