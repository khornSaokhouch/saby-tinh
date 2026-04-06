'use client';

import { useState, useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import { useLanguageStore } from '@/stores/useLanguageStore';
import { t } from '@/util/translations';
import { 
  Lock, ShieldCheck, Eye, EyeOff, 
  ArrowLeft, Key, CheckCircle, ArrowRight, Loader2, KeyRound,
  Settings, RefreshCw, Heart, Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

const strengthLevels = [
  { label: 'Weak', color: 'bg-rose-400', width: '25%' },
  { label: 'Fair', color: 'bg-amber-400', width: '50%' },
  { label: 'Good', color: 'bg-blue-400', width: '75%' },
  { label: 'Strong', color: 'bg-emerald-500', width: '100%' },
];

function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score - 1, 3);
}

export default function AdminResetPasswordPage() {
  const { language } = useLanguageStore();
  const { verifyPassword, updatePassword } = useAuthStore();
  const { user, fetchProfile } = useUserStore();
  
  const [step, setStep] = useState('verify');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) fetchProfile();
  }, [user, fetchProfile]);

  const strength = getStrength(newPassword);
  const strengthInfo = strengthLevels[Math.max(0, strength)];
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!currentPassword) return;
    setIsLoading(true);
    try {
      await verifyPassword(currentPassword);
      setStep('reset');
      toast.success(t('Identity verified.', language));
    } catch (err) {
      toast.error(err.message || t('Incorrect current password', language));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) { toast.error(t("Passwords don't match", language)); return; }
    if (newPassword.length < 6) { toast.error(t("Password too short", language)); return; }
    
    setIsLoading(true);
    try {
      await updatePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      });
      setStep('done');
      toast.success(t('Updated successfully', language));
    } catch (err) {
      toast.error(err.message || t("Update failed", language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 pb-12 font-sans animate-in fade-in duration-500 pt-2">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-[18px] bg-slate-900 flex items-center justify-center text-lg font-bold text-white shadow-lg overflow-hidden border-2 border-white ring-1 ring-slate-100 shrink-0">
            {user?.profile?.image_profile ? (
              <img src={user.profile.image_profile} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span>{user?.name?.charAt(0)}</span>
            )}
          </div>
          
          <div className="text-left">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Security update', language)}</span>
            </div>
            <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
              {t('Account security for', language)} <span className="text-indigo-600 capitalize">{user?.name || '...'}</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link 
            href="/admin/account"
            className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 hover:border-slate-300 transition-all shadow-sm"
          >
            <ArrowLeft size={12} /> {t('Go back', language)}
          </Link>
          <Link 
            href="/admin/settings"
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 shadow-md active:scale-95 transition-all"
          >
            <Settings size={12} strokeWidth={2.5} />
          </Link>
        </div>
      </div>

      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN: Main Flow */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* Progress Indicator */}
          <div className="bg-white border border-slate-100 rounded-[18px] p-3 px-5 shadow-sm flex items-center gap-4 justify-between">
            <div className="flex items-center gap-3 flex-1 max-w-sm">
                {['verify', 'reset', 'done'].map((s, i) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-[9px] font-bold transition-all border
                      ${step === s ? 'bg-slate-900 text-white border-slate-900'
                        : ((['verify', 'reset', 'done'].indexOf(step) > i) ? 'bg-emerald-50 text-emerald-500 border-emerald-100' : 'bg-white text-slate-300 border-slate-100')}`}>
                      {(['verify', 'reset', 'done'].indexOf(step) > i) ? <CheckCircle size={12} /> : i + 1}
                    </div>
                    {i < 2 && <div className={`flex-1 h-px transition-all ${(['verify', 'reset', 'done'].indexOf(step) > i) ? 'bg-emerald-200' : 'bg-slate-100'}`} />}
                  </div>
                ))}
            </div>
            <span className="text-[10px] font-bold text-slate-400 tracking-wide bg-slate-50 px-2.5 py-1 rounded-lg">
                {step === 'verify' ? t('Identity check', language) : step === 'reset' ? t('New password', language) : t('Update complete', language)}
            </span>
          </div>

          {/* Form Area */}
          <div className="bg-white border border-slate-100 rounded-[20px] shadow-sm overflow-hidden min-h-[340px] flex flex-col">
            <AnimatePresence mode="wait">
                {step === 'verify' && (
                <motion.div key="verify" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="p-6 sm:p-10 flex flex-col h-full">
                    <div className="mb-8">
                        <h3 className="text-[9px] font-bold text-slate-400 tracking-wide mb-1">{t('Step 1 of 2', language)}</h3>
                        <p className="text-base font-bold text-slate-900 tracking-tight">{t('Verify current password', language)}</p>
                        <p className="text-[10px] text-slate-400 mt-2 italic">{t('Confirm it is you to continue with the update.', language)}</p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6 max-w-sm">
                        <PasswordField 
                            label={t('Enter current password', language)}
                            name="current_password"
                            value={currentPassword}
                            onChange={e => setCurrentPassword(e.target.value)}
                            icon={Lock}
                            required
                        />
                        <button 
                            type="submit"
                            disabled={isLoading || !currentPassword}
                            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-indigo-600 active:scale-95 transition-all disabled:opacity-50 shadow-lg shadow-slate-100"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={14} /> : <>{t('Verify identity', language)} <ArrowRight size={14} /></>}
                        </button>
                    </form>
                </motion.div>
                )}

                {step === 'reset' && (
                <motion.div key="reset" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="p-6 sm:p-10 flex flex-col h-full">
                     <div className="mb-8">
                        <h3 className="text-[9px] font-bold text-slate-400 tracking-wide mb-1">{t('Step 2 of 2', language)}</h3>
                        <p className="text-base font-bold text-slate-900 tracking-tight">{t('Create new password', language)}</p>
                        <p className="text-[10px] text-slate-400 mt-2">{t('Please enter a strong password to secure your account.', language)}</p>
                    </div>

                    <form onSubmit={handleReset} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-2xl">
                             <PasswordField 
                                label={t('New password', language)}
                                name="password"
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                icon={Key}
                                required
                            />
                            <PasswordField 
                                label={t('Confirm password', language)}
                                name="password_confirmation"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                icon={ShieldCheck}
                                required
                            />
                        </div>

                        {/* Compact Strength Meter */}
                        {newPassword.length > 0 && (
                        <div className="max-w-sm space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <div className="flex justify-between items-center px-0.5">
                                <p className="text-[9px] font-bold text-slate-400 tracking-wide">{t('Password strength', language)}</p>
                                <p className={`text-[9px] font-bold capitalize ${strengthInfo.color.replace('bg-', 'text-')}`}>
                                    {t(strengthInfo.label, language)}
                                </p>
                            </div>
                            <div className="h-1 bg-slate-200/50 rounded-full overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: strengthInfo.width }} className={`h-full rounded-full ${strengthInfo.color}`} />
                            </div>
                        </div>
                        )}

                        <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                            <button 
                                type="submit"
                                disabled={isLoading || !passwordsMatch || newPassword.length < 6}
                                className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white rounded-xl text-[10px] font-bold flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 shadow-lg"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={14} /> : <>{t('Update password', language)} <CheckCircle size={14} /></>}
                            </button>
                            <button type="button" onClick={() => setStep('verify')} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 transition-colors">
                                {t('Back to verification', language)}
                            </button>
                        </div>
                    </form>
                </motion.div>
                )}

                {step === 'done' && (
                <motion.div key="done" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="p-10 text-center flex flex-col items-center justify-center h-full min-h-[340px]">
                    <div className="w-14 h-14 bg-emerald-50 rounded-[20px] flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
                        <ShieldCheck className="w-7 h-7 text-emerald-500" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mb-1">{t('Password updated', language)}</h2>
                    <p className="text-[10px] text-slate-400 mb-8 max-w-[240px] tracking-wide leading-loose font-bold">
                        {t('Your credentials have been successfully updated.', language)}
                    </p>
                    <Link href="/admin/account" className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-bold hover:bg-slate-800 transition-all shadow-xl active:scale-95">
                        {t('Go to profile', language)} <ArrowRight size={14} />
                    </Link>
                </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: Info */}
        <div className="lg:col-span-4 space-y-4">
            
            {/* Security Highlights */}
            <div className="bg-white border border-slate-100 rounded-[20px] p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <ShieldCheck size={14} className="text-indigo-600" />
                    <h4 className="text-[10px] font-bold text-slate-400 tracking-wide">{t('Account security', language)}</h4>
                </div>
                
                <div className="space-y-2">
                    <InfoRow icon={RefreshCw} label={t('Regular updates', language)} status={t('Active', language)} color="emerald" />
                    <InfoRow icon={Lock} label={t('Encrypted data', language)} status={t('Enabled', language)} color="blue" />
                    <InfoRow icon={Activity} label={t('Identity logs', language)} status="24/7" color="indigo" />
                </div>
            </div>

            {/* Protection Card */}
            <div className="bg-slate-900 p-6 rounded-[24px] shadow-2xl text-white relative overflow-hidden h-full min-h-[220px] flex flex-col justify-between group">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-white/10 rounded-lg backdrop-blur-md">
                            <KeyRound size={14} className="text-white" />
                        </div>
                        <span className="text-[9px] font-bold text-indigo-400 tracking-wide">{t('Security shield', language)}</span>
                    </div>
                    <p className="text-[10px] text-slate-300 leading-relaxed font-bold tracking-wide opacity-90 max-w-[180px]">
                        {t('Maintain a strong unique password to protect your account access.', language)}
                    </p>
                </div>
                
                <div className="relative z-10 pt-4 border-t border-white/5">
                     <p className="text-[9px] text-slate-500 font-medium">
                        {t('Last updated: just now', language)}
                     </p>
                </div>
                
                <Heart className="absolute -right-4 -bottom-4 opacity-[0.05] text-white" size={100} />
            </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS ---

function PasswordField({ label, name, value, onChange, icon: Icon, required }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="space-y-1.5 group">
      <div className="flex items-center gap-2 opacity-50 px-1 font-sans">
        <Icon size={10} className="text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <span className="text-[9px] font-bold text-slate-400 tracking-wide">{label}</span>
      </div>
      <div className="relative">
        <input 
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="w-full px-4 py-2 bg-slate-50 border-2 border-transparent rounded-xl text-[12px] font-semibold text-slate-900 outline-none focus:bg-white focus:border-indigo-100 transition-all shadow-inner"
        />
        <button 
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-600 transition-colors p-1"
        >
          {visible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, status, color }) {
    const colors = {
        emerald: "bg-emerald-500",
        blue: "bg-blue-600",
        indigo: "bg-indigo-600"
    };
    return (
        <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100/50 group hover:border-indigo-100 transition-all">
            <div className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-md bg-white flex items-center justify-center shadow-sm border border-slate-100">
                    <Icon size={10} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-slate-600 tracking-tight">{label}</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-100 shadow-sm">
                <div className={`w-1 h-1 rounded-full ${colors[color]} animate-pulse`} />
                <span className={`text-[8px] font-black tracking-tight ${color === 'emerald' ? 'text-emerald-500' : 'text-slate-500'}`}>{status}</span>
            </div>
        </div>
    );
}