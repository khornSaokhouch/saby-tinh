'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import Link from 'next/link';
import { User, Mail, Lock, Phone, Loader2, Eye, EyeOff, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loading, error: storeError } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [localError, setLocalError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    try {
      await register({ name, email, phone_number: phoneNumber, password, confirm_password: confirmPassword });
      router.push('/auth/login');
    } catch (err) {
      setLocalError(err.message || 'Registration failed');
    }
  };

  const errorMessage = localError || storeError;

  return (
    <div className="h-screen w-full bg-[#FBFBFE] flex items-center justify-center p-6 font-sans overflow-hidden relative">
      
      {/* Background Blobs - Identical to Login */}
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
        <div className="bg-white/70 backdrop-blur-2xl rounded-[40px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white/80 p-8 md:p-10 relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-10">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-600 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Sparkles size={22} className="text-white" fill="currentColor" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none uppercase">
                  Saby-Tinh
                </h1>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Join the console</span>
              </div>
            </Link>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm mt-1">Enter your details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              
              {/* Full Name */}
              <div className="relative group">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder=" "
                  className="peer w-full h-14 pt-4 px-4 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm text-slate-900 focus:bg-white focus:border-indigo-600 transition-all outline-none"
                  required
                />
                <label className="absolute left-4 top-4 text-slate-400 text-sm pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[10px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[10px] peer-[:not(:placeholder-shown)]:font-black">
                  Full Name
                </label>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer w-full h-14 pt-4 px-4 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    required
                  />
                  <label className="absolute left-4 top-4 text-slate-400 text-[11px] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black">
                    Email
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder=" "
                    className="peer w-full h-14 pt-4 px-4 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    required
                  />
                  <label className="absolute left-4 top-4 text-slate-400 text-[11px] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black">
                    Phone
                  </label>
                </div>
              </div>

              {/* Password & Confirm Grid with Toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full h-14 pt-4 pl-4 pr-10 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    required
                  />
                  <label className="absolute left-4 top-4 text-slate-400 text-[11px] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black">
                    Password
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                <div className="relative group">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder=" "
                    className="peer w-full h-14 pt-4 pl-4 pr-10 bg-slate-100/40 border-b-2 border-transparent rounded-2xl text-sm focus:bg-white focus:border-indigo-600 transition-all outline-none"
                    required
                  />
                  <label className="absolute left-4 top-4 text-slate-400 text-[11px] pointer-events-none transition-all peer-focus:top-1.5 peer-focus:text-[9px] peer-focus:font-black peer-focus:text-indigo-600 peer-focus:uppercase peer-[:not(:placeholder-shown)]:top-1.5 peer-[:not(:placeholder-shown)]:text-[9px] peer-[:not(:placeholder-shown)]:font-black">
                    Confirm
                  </label>
                  <button 
                    type="button" 
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-rose-50 border-l-4 border-rose-500 py-3 px-4 rounded-xl flex items-center gap-3"
                >
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <p className="text-[10px] font-bold text-rose-700 uppercase leading-tight">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  Register Now
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" strokeWidth={3} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Already a member?{' '}
            <Link href="/auth/login" className="text-indigo-600 hover:text-rose-500 transition-colors font-black">
              login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}