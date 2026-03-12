'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Loader2, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error: storeError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    try {
      await register({ name, email, phone_number: phoneNumber, password, confirm_password: confirmPassword });
      router.push('/auth/login');
    } catch (err) {
      setLocalError(err.message || 'Registration failed.');
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
        className="w-full max-w-[440px]"
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
                  Join the Console
                </p>
              </Link>
            </div>
            <div className="w-full h-px bg-slate-100 my-2" />
            <div className="mt-4">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">Create your account</h2>
              <p className="text-[12px] text-slate-400 font-bold mt-1">Fill in your details to get started</p>
            </div>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="space-y-3">

            {/* Full Name */}
            <div>
              <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
                <input
                  type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name" required
                  className="w-full h-11 pl-10 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-[13px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@mail.com" required
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+855..." required
                    className="w-full h-11 pl-9 pr-3 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>
            </div>

            {/* Password & Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full h-11 pl-9 pr-8 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors">
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={14} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" required
                    className="w-full h-11 pl-9 pr-8 bg-slate-50 border border-slate-100 rounded-xl text-[12px] font-bold text-slate-900 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all placeholder:text-slate-300"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500 transition-colors">
                    {showConfirmPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
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
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-1"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <>Create Account <ArrowRight size={14} strokeWidth={3} /></>}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 text-center text-[10px] font-bold text-slate-400 tracking-wide">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-indigo-600 font-black hover:text-rose-500 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}