'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore';
import Image from 'next/image';
import Link from 'next/link';
import { Camera, User, Mail, Phone, Loader2, Save, X, AlertCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// --- Warm & Friendly ConfirmationModal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, isSubmitting }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 10 }} 
          animate={{ scale: 1, opacity: 1, y: 0 }} 
          exit={{ scale: 0.95, opacity: 0, y: 10 }}
          className="bg-white rounded-[32px] p-8 w-full max-w-sm relative z-10 shadow-2xl border border-slate-100 text-center"
        >
          <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center mb-6 mx-auto">
            <Sparkles className="w-8 h-8 text-indigo-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Update your info?</h2>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed font-medium">
            We&apos;ll update your profile details so everything is current for your next visit.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={onClose} 
              className="py-3 text-sm font-bold text-slate-500 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Not yet
            </button>
            <button 
              onClick={onConfirm} 
              disabled={isSubmitting} 
              className="py-3 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
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
    const loadingToast = toast.loading('Saving your profile...');

    const data = new FormData();
    data.append('name', formData.name);
    if (formData.phone_number) data.append('phone_number', formData.phone_number); 
    if (formData.image) data.append('image', formData.image);

    try {
      await updateUser(data);
      toast.success('Looking good! Profile updated.', { id: loadingToast });
      if (imagePreview) URL.revokeObjectURL(imagePreview); 
      setImagePreview(null);
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Something went wrong. Please try again.', { id: loadingToast });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px]">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  const userInitial = user.name ? user.name[0].toUpperCase() : "U";

  return (
    <>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        isSubmitting={isSubmitting}
      />
      
      <div className="p-6 sm:p-10 max-w-4xl">
        <header className="mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Edit Profile</h1>
            <p className="text-slate-500 font-medium">Update your personal details and how you appear to others.</p>
        </header>

        <form onSubmit={(e) => { e.preventDefault(); setIsModalOpen(true); }} className="space-y-8">
          
          {/* Avatar Upload Section */}
          <div className="flex flex-col sm:flex-row items-center gap-8 p-8 bg-white rounded-[32px] border border-slate-200 shadow-sm">
            <div className="relative">
              <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden bg-indigo-50 border-4 border-white shadow-xl flex items-center justify-center relative">
                {imagePreview || user.profile_image_url ? (
                  <Image
                    src={imagePreview || user.profile_image_url}
                    alt="Your profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-4xl font-bold text-indigo-600">{userInitial}</span>
                )}
              </div>
              
              <label
                htmlFor="image-upload"
                className="absolute -bottom-2 -right-2 flex items-center justify-center w-11 h-11 bg-white text-indigo-600 rounded-2xl shadow-lg border border-slate-100 cursor-pointer hover:bg-indigo-600 hover:text-white transition-all active:scale-90"
                title="Change Photo"
              >
                <Camera className="w-5 h-5" />
                <input id="image-upload" type="file" name="image" accept="image/*" onChange={handleChange} className="hidden" />
              </label>
            </div>
            
            <div className="text-center sm:text-left space-y-2">
              <h4 className="font-bold text-slate-900">Profile Photo</h4>
              <p className="text-sm text-slate-500 font-medium">
                Upload a clear photo of yourself.<br/>Recommended size: 400x400px.
              </p>
              {imagePreview && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                  <span className="text-[11px] font-bold">Looking good! Ready to save.</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full py-3.5 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full py-3.5 pl-12 pr-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-500 cursor-not-allowed"
                />
              </div>
              <p className="text-[10px] font-medium text-slate-400 ml-1">Contact support to change your email.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-indigo-600 transition-colors" />
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+1 (234) 567-8901"
                  className="w-full py-3.5 pl-12 pr-4 bg-white border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-6 pt-6 border-t border-slate-100">
            <Link
              href="/profile"
              className="text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-10 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all flex items-center gap-2"
            >
              <Save size={18} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}