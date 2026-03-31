"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, CheckCircle, Loader2, KeyRound, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useAuthStore } from '@/app/stores/authStore';
import toast from 'react-hot-toast';



const strengthLevels = [
  { label: 'Weak', color: 'bg-rose-400', width: 'w-1/4' },
  { label: 'Fair', color: 'bg-amber-400', width: 'w-2/4' },
  { label: 'Good', color: 'bg-blue-400', width: 'w-3/4' },
  { label: 'Strong', color: 'bg-emerald-500', width: 'w-full' },
];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score - 1;
}

const PasswordInput = ({ label, value, onChange, placeholder = "••••••••" }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <div className="relative group">
        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
        <input
          type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} required
          className="w-full py-2 pl-9 pr-9 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
        />
        <button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState('verify');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const strength = getStrength(newPassword);
  const strengthInfo = strengthLevels[Math.max(0, strength)];
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!currentPassword) return;
    setIsLoading(true);
    try {
      await useAuthStore.getState().verifyPassword(currentPassword);
      setStep('reset');
    } catch (err) {
      toast.error(err.message || 'Incorrect current password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) { toast.error("Passwords don't match"); return; }
    if (strength < 1) { toast.error("Password is too weak"); return; }
    setIsLoading(true);
    try {
      await useAuthStore.getState().updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setStep('done');
      toast.success('Security credentials revised successfully');
    } catch (err) {
      toast.error(err.message || "Credential update failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-6 font-sans text-slate-900">

      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Reset Password</h1>
            <p className="text-xs text-slate-500 font-medium">Secure your account with a new password</p>
          </div>
        </div>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center gap-2 px-1 py-1">
        {['verify', 'reset', 'done'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center text-[10px] font-bold transition-all border
              ${step === s ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-100'
                : ((['verify', 'reset', 'done'].indexOf(step) > i) ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-slate-50 text-slate-400 border-slate-100')}`}>
              {(['verify', 'reset', 'done'].indexOf(step) > i) ? <CheckCircle className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-widest hidden sm:block
              ${step === s ? 'text-indigo-600' : 'text-slate-300'}`}>
              {s === 'verify' ? 'Confirm' : s === 'reset' ? 'Security' : 'Done'}
            </span>
            {i < 2 && <div className={`flex-1 h-px transition-all ${(['verify', 'reset', 'done'].indexOf(step) > i) ? 'bg-emerald-200' : 'bg-slate-100'}`} />}
          </div>
        ))}
      </div>

      {/* STEP 1 — VERIFY CURRENT PASSWORD */}
      <AnimatePresence mode="wait">
        {step === 'verify' && (
          <motion.div key="verify" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <form onSubmit={handleVerify} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" /> Identity Verification
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <p className="text-xs text-slate-500 font-medium leading-relaxed italic">To continue, please confirm your current credentials to ensure this request is authorized.</p>
                <PasswordInput label="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
                <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-4">
                  <Link href="/security" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</Link>
                  <button type="submit" disabled={isLoading || !currentPassword}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 disabled:opacity-40 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-slate-100">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Verify</span><ArrowRight className="w-4 h-4 text-white" /></>}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 2 — SET NEW PASSWORD */}
        {step === 'reset' && (
          <motion.div key="reset" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}>
            <form onSubmit={handleReset} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Lock className="w-4 h-4 text-indigo-600" /> Secure New Password
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <PasswordInput label="Choose New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />

                {/* Strength Meter */}
                {newPassword.length > 0 && (
                  <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-100/50">
                    <div className="flex justify-between items-center px-0.5">
                     <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Strength Indicator</p>
                     <p className={`text-[9px] font-bold uppercase tracking-widest ${strengthInfo.color.replace('bg-', 'text-')}`}>
                        {strengthInfo.label}
                      </p>
                    </div>
                    <div className="h-1.5 bg-slate-200/50 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: strengthInfo.width.replace('w-', '') }} className={`h-full rounded-full transition-all duration-500 ${strengthInfo.color}`} style={{ width: strengthInfo.width === 'w-1/4' ? '25%' : strengthInfo.width === 'w-2/4' ? '50%' : strengthInfo.width === 'w-3/4' ? '75%' : '100%' }} />
                    </div>
                  </div>
                )}

                <PasswordInput label="Confirm New Credentials" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />

                {/* Match indicator */}
                {confirmPassword.length > 0 && (
                  <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 px-1 ${passwordsMatch ? 'text-emerald-500' : 'text-rose-400'}`}>
                    {passwordsMatch ? <CheckCircle size={14} className="fill-emerald-50" /> : <X size={14} />}
                    {passwordsMatch ? 'Passwords are synchronized' : 'Credentials do not match'}
                  </p>
                )}

                {/* Tips */}
                <div className="bg-slate-50/50 rounded-xl p-3 space-y-1.5 border border-slate-100/50">
                  <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-1">Security Guidelines</p>
                  {[
                    { label: 'At least 8 characters', met: newPassword.length >= 8 },
                    { label: 'One uppercase letter', met: /[A-Z]/.test(newPassword) },
                    { label: 'One numeric digit', met: /[0-9]/.test(newPassword) },
                    { label: 'One special symbol', met: /[^A-Za-z0-9]/.test(newPassword) }
                  ].map(tip => (
                    <p key={tip.label} className={`text-[10px] font-medium flex items-center gap-2 ${tip.met ? 'text-slate-600' : 'text-slate-400'}`}>
                      <CheckCircle className={`w-3 h-3 ${tip.met ? 'text-emerald-500' : 'text-slate-300'}`} /> {tip.label}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-50 mt-4">
                  <button type="button" onClick={() => setStep('verify')} className="text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-slate-500">Back</button>
                  <button type="submit" disabled={isLoading || !passwordsMatch || strength < 1}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-40 active:scale-95 transition-all flex items-center gap-2 shadow-lg shadow-slate-100">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><span>Update Now</span><ShieldCheck className="w-4 h-4" /></>}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>
        )}

        {/* STEP 3 — DONE */}
        {step === 'done' && (
          <motion.div key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-10 text-center relative overflow-hidden">
               {/* Decorative background element */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-emerald-500 to-indigo-500" />
              
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-100">
                <ShieldCheck className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-base font-bold text-slate-900 mb-2 font-sans tracking-tight">Security Credentials Updated!</h2>
              <p className="text-xs text-slate-500 font-medium mb-8 leading-relaxed max-w-[240px] mx-auto">Your account is now protected with your new password. We've updated your security profile across all devices.</p>
              
              <Link href="/security"
                className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 active:scale-95">
                Go to Security Center <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}