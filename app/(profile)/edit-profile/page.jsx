"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, User, Mail, Phone, Loader2, Save, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- SMALL MORE MODAL ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px]" />
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="bg-white rounded-2xl p-6 w-full max-w-[280px] relative z-10 shadow-xl border border-slate-100 text-center">
          <Sparkles className="w-6 h-6 text-indigo-600 mx-auto mb-3" />
          <h2 className="text-sm font-black text-slate-900 mb-1 uppercase tracking-tight">Update Profile?</h2>
          <p className="text-[11px] text-slate-500 mb-6 font-medium">Apply these changes to your account identity.</p>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 py-2 text-xs font-bold text-slate-400 bg-slate-50 rounded-lg">Cancel</button>
            <button onClick={onConfirm} disabled={isSubmitting} className="flex-1 py-2 text-xs font-bold text-white bg-indigo-600 rounded-lg shadow-md shadow-indigo-100">
              {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : "Confirm"}
            </button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

export default function EditProfilePage() {
  const router = useRouter();
  const { user, loading, fetchUser, updateUser } = useUserStore();

  const [formData, setFormData] = useState({ name: '', phone_number: '', image: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => { fetchUser(); }, [fetchUser]);

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name ?? '', phone_number: user.phone_number ?? '', image: null });
      setImagePreview(null); 
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files?.[0]) {
      const file = files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleConfirmUpdate = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    const data = new FormData();
    data.append('name', formData.name);
    if (formData.phone_number) data.append('phone_number', formData.phone_number); 
    if (formData.image) data.append('image', formData.image);

    try {
      await updateUser(data);
      toast.success('Profile updated');
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to update');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) return <div className="flex justify-center items-center min-h-[300px]"><Loader2 className="animate-spin h-6 w-6 text-indigo-600" /></div>;

  return (
    <>
      <ConfirmationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmUpdate} isSubmitting={isSubmitting} />
      
      <div className="p-5 sm:p-8 max-w-3xl">
        <header className="mb-6">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Edit Profile</h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tight mt-0.5">Adjust your account identity</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="space-y-6">
          
          {/* AVATAR SECTION - SMALLER */}
          <div className="flex items-center gap-5 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 border-2 border-white shadow-md flex items-center justify-center relative">
                {imagePreview || user.profile_image_url ? (
                  <Image src={imagePreview || user.profile_image_url} alt="P" fill className="object-cover" />
                ) : (
                  <span className="text-2xl font-black text-indigo-600">{user.name?.[0].toUpperCase()}</span>
                )}
              </div>
              <label htmlFor="image-upload" className="absolute -bottom-1 -right-1 flex items-center justify-center w-7 h-7 bg-slate-900 text-white rounded-lg shadow-lg cursor-pointer hover:bg-indigo-600 transition-all active:scale-90">
                <Camera size={14} />
                <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>
            
            <div className="space-y-1">
              <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Avatar Module</h4>
              <p className="text-[10px] text-slate-400 font-bold uppercase leading-tight">Recommended: 400px JPG/PNG</p>
              {imagePreview && <span className="text-[9px] font-black text-emerald-500 uppercase">New Image Detected</span>}
            </div>
          </div>

          {/* FIELDS - COMPACT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email (Locked)</label>
              <div className="relative opacity-50">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email" value={user.email} disabled
                  className="w-full py-2.5 pl-10 pr-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+000 000 000"
                  className="w-full py-2.5 pl-10 pr-4 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-slate-50">
            <Link href="/profile" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600">Cancel</Link>
            <button
              type="submit"
              className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-slate-100 hover:bg-indigo-600 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save size={14} /> Update Info
            </button>
          </div>
        </form>
      </div>
    </>
  );
}