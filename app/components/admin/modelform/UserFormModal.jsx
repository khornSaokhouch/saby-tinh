'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, Loader2, User, Mail, Phone, Lock, FileText, Shield } from 'lucide-react';
import Image from 'next/image';

export default function UserFormModal({ isOpen, onClose, onSubmit, initialData = null, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    role: 'user',
    bio: '',
    image_profile: null,
  });
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone_number: initialData.phone_number || '',
        password: '', // Password not filled for edit
        role: initialData.role || 'user',
        bio: initialData.profile?.bio || '',
        image_profile: null,
      });
      setPreviewUrl(initialData.profile?.image_profile || initialData.profile_image_url || null);
    } else {
      setFormData({
        name: '',
        email: '',
        phone_number: '',
        password: '',
        role: 'user',
        bio: '',
        image_profile: null,
      });
      setPreviewUrl(null);
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image_profile: file }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white rounded-[20px] shadow-2xl w-full max-w-xl relative z-10 overflow-hidden border border-slate-100"
          >
            <div className="p-6 font-sans max-h-[90vh] overflow-y-auto custom-scrollbar">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600 border border-indigo-100">
                  <User size={20} strokeWidth={2.5} />
                </div>
                <button type="button" onClick={onClose} className="p-1 hover:bg-slate-50 rounded-lg transition-colors text-slate-400">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-1 mb-6">
                <h3 className="text-lg font-black text-slate-900 tracking-tight uppercase">
                  {initialData ? 'Update User' : 'New User'}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 leading-relaxed">
                  {initialData ? 'Update account details' : 'Register a new user account'}
                </p>
              </div>

              {/* Form */}
              <form id="userForm" onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div className="flex justify-center mb-8">
                  <div className="relative group cursor-pointer">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 group-hover:border-indigo-100 transition-all bg-slate-50 relative">
                      {previewUrl ? (
                         <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User size={40} />
                        </div>
                      )}
                      
                      <label className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 flex items-center justify-center transition-all cursor-pointer">
                        <Upload className="text-white opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all" size={24} />
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                          className="hidden" 
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="email" 
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="tel" 
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">System Role</label>
                    <div className="relative">
                      <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <select 
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                      >
                        <option value="user">User Account</option>
                        <option value="admin">Admin</option>
                        <option value="owner">Owner</option>
                      </select>
                    </div>
                  </div>

                  {/* Password (Only for new or change) */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                     <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {initialData ? 'Change Password (Optional)' : 'Password'}
                     </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="password" 
                        name="password"
                        required={!initialData} 
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bio / Notes</label>
                    <div className="relative">
                      <FileText className="absolute left-4 top-4 text-slate-400" size={16} />
                      <textarea 
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={3}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none"
                        placeholder="Add user notes..."
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 pt-4 sticky bottom-0 bg-white pb-2 mt-4">
                  <button
                    onClick={onClose}
                    type="button"
                    className="flex-1 py-2 text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-md shadow-indigo-100 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin text-white" /> : <Shield size={14} strokeWidth={3} />}
                    {initialData ? 'Sync Changes' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
