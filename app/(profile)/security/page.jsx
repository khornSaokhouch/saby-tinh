"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Lock, Smartphone, Monitor, Trash2, ChevronRight,
  AlertTriangle, CheckCircle, LogOut, Loader2, Eye, EyeOff, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useSecurityStore } from '@/app/stores/securityStore';
import { useEffect } from 'react';

// --- Confirm Modal ---
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, description, confirmLabel = "Confirm", danger = false, isLoading }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" />
        <motion.div initial={{ scale: 0.97, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.97, opacity: 0 }}
          className="bg-white rounded-xl p-5 w-full max-w-[280px] relative z-10 shadow-xl border border-slate-100 text-center">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-3 ${danger ? 'bg-rose-50' : 'bg-slate-50'}`}>
            {danger ? <AlertTriangle className="w-4 h-4 text-rose-500" /> : <Shield className="w-4 h-4 text-indigo-600" />}
          </div>
          <h2 className="text-sm font-black text-slate-900 mb-1">{title}</h2>
          <p className="text-[10px] text-slate-500 font-medium mb-4 leading-relaxed">{description}</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-lg hover:bg-slate-100 transition-all">Cancel</button>
            <button onClick={onConfirm} disabled={isLoading}
              className={`flex-1 py-2 text-xs font-bold text-white rounded-lg flex items-center justify-center gap-1.5 transition-all ${danger ? 'bg-rose-500 hover:bg-rose-600' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);



export default function SecurityPage() {
  const { loginHistory: sessions, fetchLoginHistory, terminateSession, logoutAllDevices } = useSecurityStore();
  const [twoFA, setTwoFA] = useState(false);
  const [modal, setModal] = useState(null); // 'revoke-session' | 'revoke-all' | 'delete-account' | '2fa'
  const [selectedSession, setSelectedSession] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLoginHistory();
  }, [fetchLoginHistory]);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (modal === '2fa') {
        setTwoFA(v => !v);
        toast.success(twoFA ? '2FA disabled' : '2FA enabled');
      }
      else if (modal === 'revoke-session') {
        const ok = await terminateSession(selectedSession);
        if (ok) toast.success('Session revoked');
      }
      else if (modal === 'revoke-all') {
        const ok = await logoutAllDevices();
        if (ok) toast.success('All sessions signed out');
      }
      else if (modal === 'delete-account') {
        toast.error('Account deletion requested');
      }
    } catch (err) {
      toast.error(err.message || "Action failed");
    } finally {
      setIsLoading(false);
      setModal(null);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 pb-6 font-sans text-slate-900">

      {/* HEADER */}
      <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900">Privacy & Security</h1>
            <p className="text-xs text-slate-500 font-medium">Manage your account protection and data</p>
          </div>
        </div>
      </div>

      {/* PASSWORD SECTION */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-indigo-600" /> Password Security
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Credentials</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Account Password</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Recommended to change every 90 days</p>
          </div>
          <Link href="/reset-password"
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 active:scale-[0.98]">
            Update <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* 2FA SECTION */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-indigo-600" /> Two-Factor Authentication
          </h3>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enhanced</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">2FA Protection</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              {twoFA
                ? <><CheckCircle className="w-3 h-3 text-emerald-500" /><p className="text-[10px] text-emerald-600 font-bold">Currently Active</p></>
                : <><AlertTriangle className="w-3 h-3 text-amber-400" /><p className="text-[10px] text-amber-500 font-bold">Highly Recommended</p></>}
            </div>
          </div>
          <button onClick={() => setModal('2fa')}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${twoFA ? 'bg-emerald-500' : 'bg-slate-200'}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${twoFA ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>
      </section>

      {/* SESSIONS SECTION */}
      <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-indigo-600" /> Active Sessions
          </h3>
          <button onClick={() => setModal('revoke-all')} className="text-[10px] font-black text-rose-400 uppercase tracking-widest hover:text-rose-600 transition-all">
            Revoke All
          </button>
        </div>
        <div className="divide-y divide-slate-50">
          {sessions.map(s => (
            <div key={s.id} className="px-4 py-4 flex items-center justify-between gap-3 group hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${s.current ? 'bg-indigo-50 border-indigo-100 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'}`}>
                  <Monitor className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    {s.device}
                    {s.current && <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-1.5 py-0.5 rounded-full uppercase tracking-tighter">Current</span>}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium">{s.location} · {s.time}</p>
                </div>
              </div>
              {!s.current && (
                <button onClick={() => { setSelectedSession(s.id); setModal('revoke-session'); }}
                  className="p-1.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* DANGER ZONE */}
      <section className="bg-white rounded-xl border border-rose-100 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-rose-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-rose-500 flex items-center gap-1.5">
            <Trash2 className="w-4 h-4" /> Danger Zone
          </h3>
          <span className="text-[10px] font-black text-rose-300 uppercase tracking-widest">Permanent</span>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-700">Delete Account</p>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">This action cannot be undone</p>
          </div>
          <button onClick={() => setModal('delete-account')}
            className="px-4 py-2 bg-rose-50 text-rose-500 border border-rose-100 rounded-lg text-xs font-bold hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98]">
            Delete Account
          </button>
        </div>
      </section>

      {/* MODALS */}
      <ConfirmModal
        isOpen={modal === '2fa'} onClose={() => setModal(null)} onConfirm={handleAction}
        title={twoFA ? "Disable Two-Factor?" : "Enable Two-Factor?"}
        description={twoFA ? "Your account will be less secure without this additional verification step." : "Add an extra layer of protection by requiring a code from your phone."}
        confirmLabel={twoFA ? "Disable 2FA" : "Enable 2FA"} danger={twoFA} isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={modal === 'revoke-session'} onClose={() => setModal(null)} onConfirm={handleAction}
        title="Revoke this session?" description="This device will be immediately signed out of your account." confirmLabel="Revoke Access" danger isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={modal === 'revoke-all'} onClose={() => setModal(null)} onConfirm={handleAction}
        title="Sign out of all devices?" description="This will sign you out of every device except the one you are currently using." confirmLabel="Revoke All" danger isLoading={isLoading}
      />
      <ConfirmModal
        isOpen={modal === 'delete-account'} onClose={() => setModal(null)} onConfirm={handleAction}
        title="Permanently delete account?" description="All your data, orders, and settings will be erased forever. This cannot be undone." confirmLabel="Delete Forever" danger isLoading={isLoading}
      />

    </motion.div>
  );
}